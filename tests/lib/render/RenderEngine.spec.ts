import {describe, expect, test} from 'vitest'
import RenderEngine from '@/lib/render/RenderEngine';

import { renderStateOne, renderStateTwo } from '@/constants/canvas';

/// determines which background state to render, first or second
describe('getRenderState', () => {
	
	const staggerFrames = 10;
	for(let f = 0; f <= 40; f++){
		test('returns terrain state', () => { 
			if(f===0 || f === 20 || f === 40){
				console.log('renderStateTwo - f',f)
				expect(RenderEngine.getRenderState(f, staggerFrames)).toEqual(renderStateTwo)	
			} else if(f === 10 || f === 30){
				console.log('renderStateOne - f',f)
			expect(RenderEngine.getRenderState(f, staggerFrames)).toEqual(renderStateOne)
			}else{
				console.log('undefined - f',f)
				expect(RenderEngine.getRenderState(f, staggerFrames)).toEqual(undefined)				
			}
		});
	}
})