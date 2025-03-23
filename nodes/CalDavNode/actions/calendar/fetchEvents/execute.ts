import {IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {createClient} from "../../../../../transport/davClient";
import {DAVCalendar, DAVCalendarObject} from "tsdav";
import { FormatDatetime } from "../../../methods";
import { parseIcsCalendar } from "@ts-ics/schema-zod";
import { IcsCalendar } from "ts-ics";

export async function fetchObjects(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const client = await createClient(this, 'caldav');
	const calendarObjectUrl = this.getNodeParameter('calendar', index);
	const startDateLeftString = this.getNodeParameter('start_date_left', index) as string;
	const startDateRightString = this.getNodeParameter('start_date_right', index) as string;

	// parse string to date in utc
	const leftDate = new Date(FormatDatetime(startDateLeftString));
	const rightDate = new Date(FormatDatetime(startDateRightString));

	// Retrieve calendars
	const calendars: DAVCalendar[] = await client.fetchCalendars();
	const calendar = calendars.find(obj => {
		return obj.url === calendarObjectUrl;
	});

	// Retrieve calendar objects
	const response: DAVCalendarObject[] = await client.fetchCalendarObjects({
		calendar: calendar,
		timeRange: {
			start: leftDate.toISOString(),
			end: rightDate.toISOString()
		}
	});

	// Parse to events
	const events = response.map(r => {
		const icsData = r.data as string;
		const calendarParsed: IcsCalendar = parseIcsCalendar(icsData);

		return {
			url: r.url,
			etag: r.etag as string,
			event: calendarParsed.events
		};
	});

	return this.helpers.returnJsonArray({
		events: events,
	});
}
