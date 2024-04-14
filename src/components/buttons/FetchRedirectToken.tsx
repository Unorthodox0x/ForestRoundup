'use server'

import type { Duration } from "@/types";
import { oneDay, oneWeek, unlimited } from "@/constants/durations";

export type CustomComponentProps = {
	duration: Duration
}

/**
 *  ``` Server Action ```
 * This component contains logic for fetching redirect token to external checkout page 
 * 	
 * This wraps a client component containing functionality to execute redirect on-click
 */
type ResponseData = {
	redirectToken:string
}

export default async function fetchRedirectToken(props: CustomComponentProps){

	const { duration } = props;

	/// todo::: this needs to be restructured, 	
	/// currently on-load, 3 requests are made instead of only a single request
	const offerId =()=>{
		const ids= [{
			duration: oneWeek,
			offerId: process.env.ONE_WEEK_OFFER
		},{
			duration:oneDay,
			offerId: process.env.ONE_DAY_OFFER
		},{
			duration: unlimited,
			offerId:process.env.UNLIMITED_OFFER
		}]
		return ids.find((id) => id.duration === duration);
	}

	const url = `${process.env.REDIRECT_TOKEN_ENDPOINT}?businessId=${process.env.BUSINESS_ID}&offerIds[]=${offerId()?.offerId}`;
	return await fetch(url, {
		method: 'GET', // Specify the HTTP method
		headers: {
			'Content-Type': 'application/json', // Example of a custom header
			// Add any other custom headers as needed
			'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
		},
	})
	.then((response) => {
		if(!response ||response.status !== 200) throw new Error('invalid response')
			try{
				// Parse response as JSON
				return response.json(); /// getting invalid json err here...
			}
			catch(err){
				console.error(err);
				throw new Error('invalid response')
			}
	})
	.then((data:ResponseData) => {
		// Access the parsed JSON data
		// console.log('Data:', data);
		if(!data.redirectToken) throw new Error('no response data')
		return data.redirectToken;
	})
	.catch(error => {
		console.error('Error:', error);
	});
}