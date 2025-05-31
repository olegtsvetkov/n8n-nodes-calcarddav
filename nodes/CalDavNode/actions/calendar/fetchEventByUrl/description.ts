import {CalendarProperties} from "../../Interface";

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
				operation: ['fetchEventByUrl']
			}
		},
		description: 'Calendar to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Event URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['fetchEventByUrl'],
			},
		},
		description: 'URL of the event to fetch',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['fetchEventByUrl'],
			},
		},
		options: [
			{
				displayName: 'Show Raw ICS Data',
				name: 'showRawIcs',
				type: 'boolean',
				default: false,
				description: 'Whether to include raw ICS data in the output',
			},
		],
	},
]
