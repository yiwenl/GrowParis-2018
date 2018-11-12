// ViewRoom.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import Config from './Config';
import vs from 'shaders/room.vert';
import fs from 'shaders/room.frag';

class ViewRoom extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('room');
		window.GL = GL;
		console.log(GL.cullFace);
	}


	render() {
		GL.cullFace(GL.FRONT);
		this.shader.bind();
		this.shader.uniform("uScale", "float", Config.roomScale);
		GL.draw(this.mesh);
		GL.cullFace(GL.BACK);
	}


}

export default ViewRoom;