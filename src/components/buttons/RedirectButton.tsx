'use client'

import type { Duration } from "@/types";

export type CustomComponentProps = {
	duration: Duration,
	redirectToken: string|undefined
}

/**
 * This Client component is wrapped with a server action.
 * 	the redirect token is fetched and passed down to this component through props
 */
export default function RedirectButton(props: CustomComponentProps){

	const { duration, redirectToken } = props;

	function handleRedirect(){
		if(!redirectToken) return;
	    window.location.href = `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/?redirectToken=${encodeURIComponent(redirectToken)}`;
	    return;
	}

	return (
		<div className='flex flex-col w-full justify-center items-center'>
          <h2 className='flex font-bold  text-black'>{duration}</h2>
          <button 
          	className='flex bg-green-800 rounded-lg p-1 mt-2'
     		disabled={!redirectToken}
     		onClick={()=> handleRedirect()}
          >
        	select
          </button>
        </div>
	);
}