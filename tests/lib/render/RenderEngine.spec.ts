import {describe, expect, test} from 'vitest'
import RenderEngine from '@/lib/render/RenderEngine';
import Tile from '@/lib/map/Tile';

import { renderStateOne, renderStateTwo } from '@/constants/canvas';
import { defaultCoords } from '@/constants/board';
import { field, forest, ground } from '@/constants/sprites';

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


describe('getSprite', () => {

	const tile = new Tile(defaultCoords, 0);
	const terrainSprites = new Set([forest, ground, field]);

	const spite = RenderEngine.getSprite(tile, terrainSprites)


});