import {CalendarProperties} from "../../Interface";

export const description: CalendarProperties = [
	{
		displayName: 'Calendar Selection',
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
		description: 'Select a calendar from your connected account or specify a calendar URL/ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>. This determines which calendar\'s events will be retrieved.',
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
				description: 'When enabled, recurring events (like weekly meetings) will be expanded into individual instances within the specified time range. When disabled, only the recurring event definition will be returned.',
			},
			{
				displayName: 'Include Raw Calendar Data',
				name: 'showRawIcs',
				type: 'boolean',
				default: false,
				description: 'Include the raw iCalendar (ICS) data in the output. This contains all the technical details of the event in the standard calendar format. Useful for debugging or advanced calendar integrations.',
			},
		],
	},
]
