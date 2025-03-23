import {FunctionsBase} from "n8n-workflow";
import {createDAVClient, getBasicAuthHeaders} from "tsdav";

export type DavAccountType = 'carddav' | 'caldav'

export async function createClient(options: FunctionsBase, accountType: DavAccountType = 'carddav'): Promise<any> {
	const creds = await options.getCredentials('genericDavCredentialsApi')
	return createDAVClient({
		serverUrl: creds.serverUrl as string,
		credentials: {
			username: creds.username as string,
			password: creds.password as string,
		},
		authMethod: 'Custom',
		defaultAccountType: accountType,
		authFunction: async (credentials) => {
			// tsdav don't work properly with iCloud
			// details: https://github.com/natelindev/tsdav/issues/238
      return {
        ...getBasicAuthHeaders(credentials),
        "accept-language": "en-US, en;q=0.9",
      };
    },
	});
}
