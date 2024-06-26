import { appendResponseHeader, H3Event } from 'h3';

export const fetchWithCookie = async (event: H3Event, url: string) => {
	/* Get the response from the server endpoint */

	const res = await $fetch.raw(url, {
		credentials: 'include',
		headers: useRequestHeaders(['cookie']),
		method: 'POST',
	});

	/* Get the cookies from the response */
	const cookies = (res.headers.get('set-cookie') || '').split(',');

	/* Modify cookies to include httpOnly and secure attributes */
	const modifiedCookies = cookies.map(cookie => {
		// Parse the cookie string
		const [cookieNameValue] = cookie.split(';');
		// const cookieName = cookieNameValue.split('=')[0];

		// Add httpOnly and secure attributes if not present
		// const hasHttpOnly = attributes.some(
		//   (attr) => attr.trim().toLowerCase() === 'httponly'
		// )
		// const hasSecure = attributes.some(
		//   (attr) => attr.trim().toLowerCase() === 'secure'
		// )

		const updatedAttributes = [];
		updatedAttributes.push('HttpOnly');
		updatedAttributes.push('Secure');
		updatedAttributes.push('Path=/');

		// Reconstruct the modified cookie string
		const modifiedCookie = `${cookieNameValue}; ${updatedAttributes.join('; ')}`;

		return modifiedCookie;
	});

	/* Attach each modified cookie to our incoming Request */
	for (const modifiedCookie of modifiedCookies) {
		appendResponseHeader(event, 'set-cookie', modifiedCookie);
	}
	/* Return the data of the response */

	return res._data;
};
