'use server'

import type { Duration } from "@/types";
import RedirectButton from "./RedirectButton";

export type CustomComponentProps = {
	duration: Duration
}

/**
 *  ``` Server Action ```
 * This component contains logic for fetching redirect token to external checkout page 
 * 	
 * This wraps a client component containing functionality to execute redirect on-click
 */
export default async function FetchRedirectToken(props: CustomComponentProps){

	const { duration } = props;

	/// todo::: this needs to be restructured, 	
	/// currently on-load, 3 requests are made instead of only a single request
	let redirectToken;
	await fetch(`${process.env.CHECKOUT_URL!}?businessId=get_business_id&offerIds[]=get_offer_ids`, {
		method: 'GET', // Specify the HTTP method
		headers: {
			'Content-Type': 'application/json', // Example of a custom header
			// Add any other custom headers as needed
			'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
		},
	}).then(response => {
		console.log('Response:', response);
		if(response.status !== 200) throw new Error('invalid response')
		if(!response) throw new Error('no response')

		// Parse response as JSON
		return response.json();
	})
	.then((data) => {
		// Access the parsed JSON data
		// if(!data) throw new Error('no response data')
		console.error('Data:', data);
		redirectToken = data as string|undefined;
	})
	.catch(error => {
		console.error('Error:', error);
	});

	console.log('redirect token', redirectToken);

	return <RedirectButton duration={duration} redirectToken={redirectToken} />;
}