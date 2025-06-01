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
				operation: ['fetchEventByUrl']
			}
		},
		description: 'Select a calendar from your connected account or specify a calendar URL/ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>. This determines which calendar contains the event you want to fetch.',
	},
	{
		displayName: 'Event URL or ID',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['fetchEventByUrl'],
			},
		},
		description: 'The unique URL identifier of the event you want to retrieve. This is typically provided by the calendar system when an event is created or can be obtained from event details in your calendar application.',
	},
	{
		displayName: 'Additional Options',
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
				displayName: 'Include Raw Calendar Data',
				name: 'showRawIcs',
				type: 'boolean',
				default: false,
				description: 'Include the raw iCalendar (ICS) data in the output. This contains all the technical details of the event in the standard calendar format. Useful for debugging or when you need to access advanced event properties not shown in the standard output.',
			},
		],
	},
]
