'use client'

import type { Duration } from "@/types";
import fetchRedirectToken from "@/components/buttons/FetchRedirectToken";
export type CustomComponentProps = {
	duration: Duration,
}

/**
 * This Client component is wrapped with a server action.
 * 	the redirect token is fetched and passed down to this component through props
 */
export default function RedirectButton(props: CustomComponentProps){

	const { duration } = props;
	async function handleRedirect(){
		await fetchRedirectToken({ duration })
		.then((redirectToken)=>{
			if(!redirectToken) throw new Error('token not fetched')
	    	window.location.href = `${process.env.NEXT_PUBLIC_CHECKOUT_URL}?redirectToken=${encodeURIComponent(redirectToken)}`;
		}).catch((error)=> {
			console.error(error)
		});
	}
	return (
		<div className='flex flex-col w-full justify-center items-center'>
			<h2 className='flex font-bold  text-black'>{duration}</h2>
			<button 
	          	className='flex bg-green-800 rounded-lg p-1 mt-2'
	     		onClick={()=> {
	     			handleRedirect().catch(err=> console.error(err))
	     		}}
     		>
        	select
          </button>
        </div>
	);
}