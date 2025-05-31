import {CalendarProperties} from "../../Interface";

// todo: add provider specific properties (Outlook Categories, Apple Calendar Color, Google Calendar Color)
// todo: add attendees
// todo: add time transparency
// todo: add recurrence
export const description: CalendarProperties = [
	{
		displayName: 'Select Calendar or Set URL Name or ID',
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
		description: 'Calendar to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Title',
		name: 'event_title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
	},
	{
		displayName: 'All Day Event',
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
	},
	{
		displayName: 'Event Start At',
		name: 'event_start_date',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'Specific date and time in RFC3339 format in UTC'
	},
	{
		displayName: 'Event Ends At',
		name: 'event_end_date',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'Specific date and time in RFC3339 format in UTC',
	},
	{
		displayName: 'Description',
		name: 'event_description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
	},
	{
		displayName: 'Location',
		name: 'event_location',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'Location of the event',
	},
	{
		displayName: 'URL',
		name: 'event_url',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'URL associated with the event',
	},
	{
		displayName: 'Status',
		name: 'event_status',
		type: 'options',
		options: [
			{
				name: 'Confirmed',
				value: 'CONFIRMED',
			},
			{
				name: 'Cancelled',
				value: 'CANCELLED',
			},
			{
				name: 'Tentative',
				value: 'TENTATIVE',
			},
		],
		default: 'CONFIRMED',
		displayOptions: {
			show: {
				operation: ['createEvent'],
			},
		},
		description: 'Event status',
	},
	{
		displayName: 'Alarms',
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
				displayName: 'Alarm',
				name: 'alarm',
				values: [
					{
						displayName: 'Trigger',
						name: 'trigger',
						type: 'options',
						options: [
							{
								name: 'Minutes Before',
								value: 'minutes_before',
							},
							{
								name: 'Hours Before',
								value: 'hours_before',
							},
							{
								name: 'Days Before',
								value: 'days_before',
							},
							{
								name: 'Minutes After',
								value: 'minutes_after',
							},
							{
								name: 'Hours After',
								value: 'hours_after',
							},
							{
								name: 'Days After',
								value: 'days_after',
							},
						],
						default: 'minutes_before',
					},
					{
						displayName: 'Time Unit',
						name: 'time_unit',
						type: 'number',
						default: 15,
						description: 'Number of time units before/after the event',
					},
				],
			},
		],
		description: 'Event reminders',
	},
]
