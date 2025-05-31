import {EventProperties} from "../../Interface";

export const description: EventProperties = [
	{
		displayName: 'Event URL or ID',
		name: 'event_url',
		type: 'string',
		default: '',
		required: true,
		description: 'The unique identifier of the event you want to delete. You can find this in the "_handle.url" field when you fetch an event. This is required to identify which specific event should be deleted.',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['deleteEvent'],
			},
		},
	},
	{
		displayName: 'Event Version Tag (ETag)',
		name: 'event_etag',
		type: 'string',
		default: '',
		required: true,
		description: 'A version identifier for the event that helps prevent conflicts when multiple users try to modify the same event. You can find this in the "_handle.etag" field when you fetch an event. This ensures that you\'re deleting the correct version of the event and prevents accidental deletion of events that have been modified by someone else.',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['deleteEvent'],
			},
		},
	},
]
