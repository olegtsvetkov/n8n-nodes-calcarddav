import {IExecuteFunctions, INodeExecutionData, NodeOperationError} from "n8n-workflow";
import {createClient} from "../../../../../transport/davClient";
import {DAVCalendar} from "tsdav";
import { 
	type IcsEvent, 
	type IcsCalendar, 
	generateIcsCalendar,
	IcsAlarm,
	IcsDuration
} from "ts-ics";
import { v4 as uuidv4 } from 'uuid';
import { FormatDatetime } from "../../../methods";

type EventStatus = 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';

export async function createEvent(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const eventTitle = this.getNodeParameter('event_title', index) as string;
	const eventDescription = this.getNodeParameter('event_description', index) as string;
	const eventIsAllDay = this.getNodeParameter('event_is_all_day', index) as string;
	const eventLocation = this.getNodeParameter('event_location', index) as string;
	const eventUrl = this.getNodeParameter('event_url', index) as string;
	const eventStatus = this.getNodeParameter('event_status', index) as EventStatus;
	const eventAlarms = this.getNodeParameter('event_alarms', index) as {
		alarm?: Array<{
			trigger: 'minutes_before' | 'hours_before' | 'days_before' | 'minutes_after' | 'hours_after' | 'days_after';
			time_unit: number;
		}>;
	};
	const eventAttendees = this.getNodeParameter('event_attendees', index) as {
		attendee: Array<{
			email: string;
			name?: string;
			rsvp?: boolean;
		}>;
	};

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

	// Prepare base event object
	const baseEvent: Partial<IcsEvent> = {
		uid: uuidv4(),
		summary: eventTitle,
		description: eventDescription,
		status: eventStatus || 'CONFIRMED',
		stamp: {
			date: new Date(),
		},
		location: eventLocation,
		url: eventUrl,
	};

	// Add attendees if provided
	if (eventAttendees?.attendee?.length) {
		baseEvent.attendees = eventAttendees.attendee.map(attendee => ({
			email: attendee.email,
			name: attendee.name,
			rsvp: attendee.rsvp,
		}));
	}

	// Add alarms if provided
	if (eventAlarms?.alarm?.length) {
		baseEvent.alarms = eventAlarms.alarm.map(alarm => {
			const [unit, direction] = alarm.trigger.split('_') as [string, 'before' | 'after'];
			
			const trigger = direction === 'before' ? -alarm.time_unit : alarm.time_unit;

			const duration: IcsDuration = {};

			if (unit === 'minutes') {
				duration.minutes = trigger;
			} else if (unit === 'hours') {
				duration.hours = trigger;
			} else if (unit === 'days') {
				duration.days = trigger;
			}

			return {
				action: 'DISPLAY',
				trigger: {
					type: 'relative',
					value: duration,
				},
				description: eventTitle,
			} as IcsAlarm;
		});
	}

	let event: IcsEvent;

	if (eventIsAllDay === 'yes') {
		const aDayInMs = 24 * 60 * 60 * 1000;
		const daysDiff = Math.abs(Math.ceil((startDate.getTime() - endDate.getTime()) / aDayInMs));

		event = {
			...baseEvent,
			start: {
				date: startDate,
				type: "DATE"
			},
			duration: {
				days: daysDiff + 1,
			},
		} as IcsEvent;
	} else {
		event = {
			...baseEvent,
			start: {
				date: startDate,
			},
			end: {
				date: endDate,
			},
		} as IcsEvent;
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
