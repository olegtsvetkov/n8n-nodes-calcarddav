import {CalendarProperties} from "../../Interface";

export const description: CalendarProperties = [
	{
		displayName: 'Calendar Name or ID',
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
				operation: ['fetchEvents']
			}
		},
		description: 'Select a calendar from your connected account or specify a calendar URL/ID. This determines which calendar\'s events will be retrieved. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Search Events From (Start Date)',
		name: 'start_date_left',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['fetchEvents'],
			},
		},
		description: 'The start of the time range to search for events. Must be in RFC3339 format (e.g., "2024-03-20T00:00:00Z"). All times are stored in UTC. Events starting at or after this time will be included.',
	},
	{
		displayName: 'Search Events Until (End Date)',
		name: 'start_date_right',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['fetchEvents'],
			},
		},
		description: 'The end of the time range to search for events. Must be in RFC3339 format (e.g., "2024-03-27T23:59:59Z"). All times are stored in UTC. Only events starting before this time will be included.',
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['fetchEvents'],
			},
		},
		options: [
			{
				displayName: 'Show Individual Recurring Events',
				name: 'expand_recurring',
				type: 'boolean',
				default: true,
				description: 'Whether to expand recurring events (like weekly meetings) into individual instances within the specified time range. When disabled, only the recurring event definition will be returned.',
			},
			{
				displayName: 'Include Raw Calendar Data',
				name: 'showRawIcs',
				type: 'boolean',
				default: false,
				description: 'Whether to include the raw iCalendar (ICS) data in the output. This contains all the technical details of the event in the standard calendar format. Useful for debugging or advanced calendar integrations.',
			},
			{
				displayName: 'Use Multi-Get',
				name: 'useMultiGet',
				type: 'boolean',
				default: true,
				description: 'Whether to use calendarMultiGet as underlying function to fetch calendar objects. If set to false, it will use calendarQuery to fetch instead. Helps for backward compatibility with some providers.',
			},
		],
	},
]
