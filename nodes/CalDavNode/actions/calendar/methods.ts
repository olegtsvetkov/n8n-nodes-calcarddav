import { convertIcsCalendar, IcsCalendar, IcsDateObject } from "ts-ics";
import { DAVCalendarObject } from "tsdav";
import { INodeExecutionData } from "n8n-workflow";

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

	function transformDatesRecursively(obj: any): any {
		if (obj && typeof obj === 'object') {
			// Handle arrays
			if (Array.isArray(obj)) {
				return obj.map(item => transformDatesRecursively(item));
			}
			
			// Handle objects
			const result = { ...obj };
			Object.keys(result).forEach(key => {
				const value = result[key];
				
				// Check if this is a date object with type field
				if (value && typeof value === 'object' && 'type' in value && (value.type === 'DATE-TIME' || value.type === 'DATE')) {
					result[key] = new Date((value as IcsDateObject).date).toISOString();
				} else {
					// Recursively transform nested objects and arrays
					result[key] = transformDatesRecursively(value);
				}
			});
			return result;
		}
		
		// Return primitive values as-is
		return obj;
	}

	return transformDatesRecursively(transformedEvent);
}

export function createEventExecutionData(
	calendarObject: DAVCalendarObject,
	event: Record<string, any>,
	showRawIcs: boolean = false
): INodeExecutionData {
	const transformedEvent = transformEventDates(event);

	const jsonData: Record<string, any> = {
		...transformedEvent,
		_handle: {
			url: calendarObject.url,
			etag: calendarObject.etag as string
		}
	};

	if (showRawIcs) {
		jsonData._ics = calendarObject.data as string;
	}

	return {
		json: jsonData
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
			calendar: convertIcsCalendar(undefined, icsData)
		};
	} catch (error) {
		return {
			success: false,
			error: `Failed to parse calendar data: ${error instanceof Error ? error.message : String(error)}`
		};
	}
} 