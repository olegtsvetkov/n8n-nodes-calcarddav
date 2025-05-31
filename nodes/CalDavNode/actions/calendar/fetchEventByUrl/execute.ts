import {IExecuteFunctions, INodeExecutionData, NodeOperationError} from "n8n-workflow";
import {createClient} from "../../../../../transport/davClient";
import {DAVCalendar} from "tsdav";
import { createEventExecutionData, parseCalendarObject } from "../methods";

export async function fetchObject(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const client = await createClient(this, 'caldav');
	const calendarObjectUrl = this.getNodeParameter('calendar', index);
	const needleEventUrl = this.getNodeParameter('url', index) as string;
	const showRawIcs = this.getNodeParameter('showRawIcs', index) as boolean;

	// Retrieve calendars
	const calendars: DAVCalendar[] = await client.fetchCalendars();
	const calendar = calendars.find(obj => {
		return obj.url === calendarObjectUrl;
	});

	// Retrieve calendar objects
	const response = await client.fetchCalendarObjects({
		calendar: calendar,
		objectUrls: [needleEventUrl],
	});

	if (response.length !== 1) {
		throw new NodeOperationError(
			this.getNode(),
			`Unable to fetch event in calendar "${calendar!.displayName}" by "${needleEventUrl}" url`,
		);
	}

	const calendarObject = response[0];
	const parseResult = parseCalendarObject(calendarObject);

	if (!parseResult.success) {
		throw new NodeOperationError(
			this.getNode(),
			parseResult.error || 'Failed to parse calendar data'
		);
	}

	if (!parseResult.calendar?.events?.[0]) {
		throw new NodeOperationError(
			this.getNode(),
			`Event not found in calendar "${calendar!.displayName}" by "${needleEventUrl}" url`,
		);
	}

	return [createEventExecutionData(calendarObject, parseResult.calendar.events[0], showRawIcs)];
}
