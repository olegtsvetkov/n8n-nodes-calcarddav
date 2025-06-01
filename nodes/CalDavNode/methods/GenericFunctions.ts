export function FormatDatetime(isoString: string): string {
	if (isoString.includes('Z')) {
		return isoString.replace(new RegExp('.000Z$'), 'Z');
	} else {
		return isoString + 'Z';
	}
}