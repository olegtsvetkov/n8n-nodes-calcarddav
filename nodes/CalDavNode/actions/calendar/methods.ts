import { IcsCalendar, IcsDateObject } from "ts-ics";
import { DAVCalendarObject } from "tsdav";
import { INodeExecutionData } from "n8n-workflow";
import { parseIcsCalendar } from "@ts-ics/schema-zod";

export interface CalendarEventHandle {
	calendarUrl: string;
	etag: string;
}

export interface CalendarParseResult {
	success: boolean;
	calendar?: IcsCalendar;
	error?: string;
}

export function transformEventDates(event: Record<string, any>): Record<string, any> {
	const transformedEvent = { ...event };

	Object.keys(transformedEvent).forEach(key => {
		const value = transformedEvent[key];
		if (value && typeof value === 'object' && 'type' in value && (value.type === 'DATE-TIME' || value.type === 'DATE')) {
			transformedEvent[key] = (value as IcsDateObject).date;
		}
	});

	return transformedEvent;
}

export function createEventExecutionData(
	calendarObject: DAVCalendarObject,
	event: Record<string, any>
): INodeExecutionData {
	const transformedEvent = transformEventDates(event);

	return {
		json: {
			...transformedEvent,
			_handle: {
				calendarUrl: calendarObject.url,
				etag: calendarObject.etag as string
			}
		}
	};
}

export function parseCalendarObject(calendarObject: DAVCalendarObject): CalendarParseResult {
	if (!calendarObject.data) {
		return {
			success: false,
			error: `Calendar object data is empty for URL: ${calendarObject.url}`
		};
	}

	try {
		const icsData: string = calendarObject.data as string;
		return {
			success: true,
			calendar: parseIcsCalendar(icsData)
		};
	} catch (error) {
		return {
			success: false,
			error: `Failed to parse calendar data: ${error instanceof Error ? error.message : String(error)}`
		};
	}
} 