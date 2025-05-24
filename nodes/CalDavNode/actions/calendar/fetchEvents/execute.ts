import {IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {createClient} from "../../../../../transport/davClient";
import {DAVCalendar, DAVCalendarObject} from "tsdav";
import { FormatDatetime } from "../../../methods";
import { parseIcsCalendar } from "@ts-ics/schema-zod";
import { IcsCalendar, IcsDateObject } from "ts-ics";

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

	// Create array for all events
	const returnData: INodeExecutionData[] = [];

	// Parse to events
	for (const r of response) {
		const icsData = r.data as string;
		const calendarParsed: IcsCalendar = parseIcsCalendar(icsData);

		if (!calendarParsed.events) {
			continue;
		}

		// Transform dates in events to IcsDateObject
		const transformedEvents = calendarParsed.events.map(event => {
			const transformedEvent = { ...event } as Record<string, any>;
			
			// Transform all fields with dates to IcsDateObject
			Object.keys(transformedEvent).forEach(key => {
				const value = transformedEvent[key];
				if (value && typeof value === 'object' && 'type' in value && (value.type === 'DATE-TIME' || value.type === 'DATE')) {
					transformedEvent[key] = (value as IcsDateObject).date;
				}
			});

			return {
				json: {
					...transformedEvent,
					_handle: {
						calendarUrl: r.url,
						etag: r.etag as string
					}
				}
			};
		});

		returnData.push(...transformedEvents);
	}

	return this.helpers.returnJsonArray(returnData);
}
