import {IExecuteFunctions, INodeExecutionData, NodeOperationError} from "n8n-workflow";
import {createClient} from "../../../../../transport/davClient";

export async function deleteEvent(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const eventUrl = this.getNodeParameter('event_url', index) as string;
	const eventEtag = this.getNodeParameter('event_etag', index) as string;
	const options = this.getNodeParameter('options', index, {}) as {
		includeResponse?: boolean;
	};

	const client = await createClient(this, 'caldav');

	// Perform event deletion on remote server
	const result = await client.deleteCalendarObject({
		calendarObject: {
			url: eventUrl,
			etag: eventEtag,
		},
	});

	if (!result.ok) {
		throw new NodeOperationError(
			this.getNode(),
			`Unable to delete event "${eventUrl}", remote server returned error "${result.statusText}"`,
		);
	}

	// Prepare the response based on the includeResponse option
	const response = {
		ok: true,
		...(options.includeResponse ? { result } : {}),
	};

	return this.helpers.returnJsonArray(response);
}
