import {IExecuteFunctions, INodeExecutionData, NodeOperationError} from "n8n-workflow";
import {createClient} from "../../../../../transport/davClient";
import {DAVCalendar, DAVCalendarObject} from "tsdav";
import { IcsCalendar } from "ts-ics";
import { parseIcsCalendar } from "@ts-ics/schema-zod";

export async function fetchObject(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const client = await createClient(this, 'caldav');
	const calendarObjectUrl = this.getNodeParameter('calendar', index);
	const needleEventUrl = this.getNodeParameter('url', index) as string;

	// Retrieve calendars
	const calendars: DAVCalendar[] = await client.fetchCalendars();
	const calendar = calendars.find(obj => {
		return obj.url === calendarObjectUrl;
	});

	// Retrieve calendar objects
	const response: DAVCalendarObject[] = await client.fetchCalendarObjects({
		calendar: calendar,
		objectUrls: [needleEventUrl],
	});

	// Parse to events
	const events = response.map(r => {
		const icsData: string = r.data as string;

		const calendarParsed: IcsCalendar = parseIcsCalendar(icsData);

		return {
			url: r.url,
			etag: r.etag,
			data: icsData,
			event: calendarParsed.events?.[0] ?? null
		};
	});

	if (events.length !== 1) {
		throw new NodeOperationError(
			this.getNode(),
			`Unable to fetch event in calendar "${calendar!.displayName}" by "${needleEventUrl}" url`,
		);
	}

	return this.helpers.returnJsonArray(events[0]);
}
