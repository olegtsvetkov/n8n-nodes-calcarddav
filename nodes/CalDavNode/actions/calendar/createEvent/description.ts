import {CalendarProperties} from "../../Interface";

// todo: add provider specific properties (Outlook Categories, Apple Calendar Color, Google Calendar Color)
// todo: add attendees
// todo: add time transparency
// todo: add recurrence
export const description: CalendarProperties = [
	{
		displayName: 'Calendar Name, URL or ID',
		name: 'calendar',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'fetchCalendars'
		},
		options: [],
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['calendar'],
				operation: ['createEvent']
			}
		},
		description: 'Select a calendar from your connected account or specify a calendar URL/ID. This determines where the event will be created. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Event Title',
		name: 'event_title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'The main title or name of the calendar event. This will be displayed prominently in calendar views.',
	},
	{
		displayName: 'Is This an All-Day Event?',
		name: 'event_is_all_day',
		type: 'options',
		options: [
			{
				name: 'No',
				value: 'no',
			},
			{
				name: 'Yes',
				value: 'yes',
			},
		],
		default: 'no',
		required: true,
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'Set to "Yes" if the event spans the entire day(s) without specific start/end times. When enabled, the event will be displayed as a full-day event in calendar views.',
	},
	{
		displayName: 'Event Start Date & Time',
		name: 'event_start_date',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'The date and time when the event begins. Must be in RFC3339 format (e.g., "2024-03-20T15:00:00Z"). All times are stored in UTC.',
	},
	{
		displayName: 'Event End Date & Time',
		name: 'event_end_date',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'The date and time when the event concludes. Must be in RFC3339 format (e.g., "2024-03-20T16:00:00Z"). All times are stored in UTC. Must be after the start time.',
	},
	{
		displayName: 'Event Reminders & Notifications',
		name: 'event_alarms',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		options: [
			{
				displayName: 'Reminder Settings',
				name: 'alarm',
				values: [
					{
						displayName: 'When to Trigger Reminder',
						name: 'trigger',
						type: 'options',
						options: [
							{
								name: 'Days After',
								value: 'days_after',
							},
							{
								name: 'Days Before',
								value: 'days_before',
							},
							{
								name: 'Hours After',
								value: 'hours_after',
							},
							{
								name: 'Hours Before',
								value: 'hours_before',
							},
							{
								name: 'Minutes After',
								value: 'minutes_after',
							},
							{
								name: 'Minutes Before',
								value: 'minutes_before',
							},
						],
						default: 'minutes_before',
						description: 'When the reminder should be triggered relative to the event time',
					},
					{
						displayName: 'Number of Time Units',
						name: 'time_unit',
						type: 'number',
						default: 15,
						description: 'The number of time units (minutes/hours/days) before or after the event when the reminder should be triggered',
					},
				],
			},
		],
		description: 'Configure one or more reminders for the event. These will trigger notifications at specified times before or after the event.',
	},
	{
		displayName: 'Additional Event Parameters',
		name: 'additionalParameters',
		type: 'collection',
		placeholder: 'Add Parameter',
		default: {},
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'event_description',
				type: 'string',
				default: '',
				description: 'Detailed information about the event. Can include agenda, meeting notes, or any additional context that attendees should know.',
			},
			{
				displayName: 'Location',
				name: 'event_location',
				type: 'string',
				default: '',
				description: 'The physical or virtual location where the event takes place. Can be an address, room number, or virtual meeting link (e.g., Zoom URL).',
			},
			{
				displayName: 'Status',
				name: 'event_status',
				type: 'options',
				options: [
					{
						name: 'Cancelled',
						value: 'CANCELLED',
					},
					{
						name: 'Confirmed',
						value: 'CONFIRMED',
					},
					{
						name: 'Tentative',
						value: 'TENTATIVE',
					},
				],
				default: 'CONFIRMED',
				description: 'The current state of the event. "Confirmed" means the event is definitely happening, "Tentative" indicates it might change, and "Cancelled" means it will not take place.',
			},
			{
				displayName: 'Website URL',
				name: 'event_url',
				type: 'string',
				default: '',
				description: 'A web link associated with the event. This could be a meeting platform link, event website, or any relevant online resource.',
			},
		],
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		options: [
			{
				displayName: 'Include Raw Calendar Data',
				name: 'showRawIcs',
				type: 'boolean',
				default: false,
				description: 'Whether to include the raw iCalendar (ICS) data in the output. This contains the complete calendar data in the standard iCalendar format.',
			},
			{
				displayName: 'Include Server Response',
				name: 'includeResponse',
				type: 'boolean',
				default: false,
				description: 'Whether to include the complete server response in the output. This can be useful for debugging or when you need to verify the creation status.',
			},
		],
	},
]
