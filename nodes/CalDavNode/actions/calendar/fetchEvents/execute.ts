import {IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {createClient} from "../../../../../transport/davClient";
import {DAVCalendar} from "tsdav";
import { FormatDatetime } from "../../../methods";
import { createEventExecutionData } from "../methods";
import { convertIcsEvent } from "ts-ics";

export async function fetchObjects(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const client = await createClient(this, 'caldav');
	const calendarObjectUrl = this.getNodeParameter('calendar', index);
	const startDateLeftString = this.getNodeParameter('start_date_left', index) as string;
	const startDateRightString = this.getNodeParameter('start_date_right', index) as string;
	const options = this.getNodeParameter('options', index) as {
		expand_recurring?: boolean;
		showRawIcs?: boolean;
		useMultiGet?: boolean;
		urlFilter?: string;
	};

	// parse string to date in utc
	const leftDate = new Date(FormatDatetime(startDateLeftString));
	const rightDate = new Date(FormatDatetime(startDateRightString));

	// Retrieve calendars
	const calendars: DAVCalendar[] = await client.fetchCalendars();
	const calendar = calendars.find(obj => {
		return obj.url === calendarObjectUrl;
	});

	// Retrieve calendar objects
	const response = await client.fetchCalendarObjects({
		calendar: calendar,
		timeRange: {
			start: leftDate.toISOString(),
			end: rightDate.toISOString()
		},
		useMultiGet: options.useMultiGet ?? true,
		expand: options.expand_recurring ?? true,
		urlFilter: (url: string) => {
			// If no filter is specified, return all
			if (!options.urlFilter || options.urlFilter.trim() === '') {
				return true;
			}
			
			// Use regexp filter if provided
			const regex = new RegExp(options.urlFilter ?? /\.ics/);
			return regex.test(url);
		}
	});

	const returnData: INodeExecutionData[] = [];

	// Parse to events
	for (const calendarObject of response) {
		const parsed = convertIcsEvent(undefined, calendarObject.data as string);
		returnData.push(createEventExecutionData(calendarObject, parsed, options.showRawIcs ?? false));
	}

	return returnData;
}
