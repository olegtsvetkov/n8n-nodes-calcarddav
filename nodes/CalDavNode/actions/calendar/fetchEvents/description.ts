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
				operation: ['fetchEvents']
			}
		},
		description: 'Calendar to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Event Starts On or After',
		name: 'start_date_left',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['fetchEvents'],
			},
		},
		description: 'Specific date and time in RFC3339 format in UTC',
	},
	{
		displayName: 'Event Starts Before',
		name: 'start_date_right',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['fetchEvents'],
			},
		},
		description: 'Specific date and time in RFC3339 format in UTC',
	}
]
