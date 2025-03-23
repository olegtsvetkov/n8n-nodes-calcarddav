import {IExecuteFunctions, INodeExecutionData, NodeOperationError} from "n8n-workflow";
import {createClient} from "../../../../../transport/davClient";
import {DAVCalendar} from "tsdav";
import { type IcsEvent, type IcsCalendar, generateIcsCalendar } from "ts-ics";
import { v4 as uuidv4 } from 'uuid';
import { FormatDatetime } from "../../../methods";

export async function createEvent(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const eventTitle = this.getNodeParameter('event_title', index) as string;
	const eventDescription = this.getNodeParameter('event_description', index) as string;
	const eventIsAllDay = this.getNodeParameter('event_is_all_day', index) as string;

	const client = await createClient(this, 'caldav');
	const calendarObjectUrl = this.getNodeParameter('calendar', index);

	// Retrieve calendars
	const calendars: DAVCalendar[] = await client.fetchCalendars();
	const calendar = calendars.find(obj => {
		return obj.url === calendarObjectUrl;
	});

	// Prepare iCal data
	const eventStartDate = this.getNodeParameter('event_start_date', index) as string;
	const eventEndDate = this.getNodeParameter('event_end_date', index) as string;

	let startDate = new Date(FormatDatetime(eventStartDate));
	let endDate = new Date(FormatDatetime(eventEndDate));

	var event: IcsEvent

	if (eventIsAllDay === 'yes') {
		const aDayInMs = 24 * 60 * 60 * 1000;
		const daysDiff = Math.abs(Math.ceil((startDate.getTime() - endDate.getTime()) / aDayInMs));

		event = {
			uid: uuidv4(),
			summary: eventTitle,
			description: eventDescription,
			status: 'CONFIRMED',
			stamp: {
				date: new Date,
			},
			start: {
				date: startDate,
				type: "DATE"
			},
			duration: {
				days: daysDiff + 1,
			},
		};
	} else {
		event = {
			uid: uuidv4(),
			summary: eventTitle,
			description: eventDescription,
			status: 'CONFIRMED',
			stamp: {
				date: new Date,
			},
			start: {
				date: startDate,
			},
			end: {
				date: endDate,
			},
		}
	}

	const icsCalendar: IcsCalendar = {
		version: "2.0",
		prodId: "n8n-nodes-calcarddav",
		events: [event],
	}

	const iCalString = generateIcsCalendar(icsCalendar);

	// Perform event creation on remote server
	const result = await client.createCalendarObject({
		calendar: calendar,
		filename: event.uid + ".ics",
		iCalString: iCalString,
	});

	if (!result.ok) {
		throw new NodeOperationError(
			this.getNode(),
			`Unable to create event in calendar "${calendar!.displayName}", remote server returned error "${result.statusText}"`,
		);
	}

	return this.helpers.returnJsonArray({
		ok: true,
		result: result,
	});
}
