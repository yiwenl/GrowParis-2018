// generateParticles.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';

var random = function(min, max) { return min + Math.random() * (max - min);	}

const generateParticles = () => {
	const { numParticles:num } = Config;
	const data = [];
	let r = 0.5;

	for(let i=0; i<num; i++) {
		for(let j=0; j<num; j++) {
			data.push(random(-r, r), random(-r, r), random(-r, r), 1);
		}
	}

	const t = new alfrid.GLTexture(data, {
		type:GL.FLOAT, 
		minFilter:GL.NEAREST,
		minFilter:GL.NEAREST
	}, num, num);

	return t;
}


export default generateParticles;