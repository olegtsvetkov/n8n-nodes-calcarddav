import {EventProperties} from "../../Interface";

export const description: EventProperties = [
	{
		displayName: 'Event URL',
		name: 'event_url',
		type: 'string',
		default: '',
		required: true,
		description: 'Can be found in _handle.url field of the event fetched by fetchEvents or fetchEventByUrl operation',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['deleteEvent'],
			},
		},
	},
	{
		displayName: 'Event Etag',
		name: 'event_etag',
		type: 'string',
		default: '',
		required: true,
		description: 'Can be found in _handle.etag field of the event fetched by fetchEvents or fetchEventByUrl operation',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['deleteEvent'],
			},
		},
	},
]
