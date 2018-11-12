// ViewRing.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/ring.frag';

class ViewRing extends alfrid.View {
	
	constructor() {
		super(null, fs);
		this.offset = new alfrid.EaseNumber(-0.1, 0.1);
	}


	open() {
		this.offset.value = 1;
	}


	close() {
		this.offset.value = -0.1;
	}


	_init() {
		const s = 0.1;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uOffset", "float", this.offset.value);
		GL.draw(this.mesh);
	}


}

export default ViewRing;