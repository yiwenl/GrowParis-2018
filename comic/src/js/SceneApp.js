// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import Settings from './Settings';
import Config from './Config';

import vsOutline from 'shaders/outline.vert';
import fsOutline from 'shaders/outline.frag';

import fsSimpleDiffuse from 'shaders/diffuse.frag';

import ViewOutline from './ViewOutline';

class SceneApp extends Scene {
	constructor() {
		Settings.init();

		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 7;
		this.orbitalControl.radius.limit(5, 10);
		this.orbitalControl.rx.limit(-.05, 1.0);

		this.step = 0;
		window.addEventListener('keydown', (e)=> {
			console.log(e.keyCode);
			if(e.keyCode === 32 || e.keyCode === 39) {
				this.step++;
			} else if(e.keyCode === 37) {
				this.step--;
				if(this.step<0) this.step = 1;
			} 
		});
	}

	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._vOutline = new ViewOutline();


		this.shader = new alfrid.GLShader(null, alfrid.ShaderLibs.simpleColorFrag);
		this.shader.bind();
		this.shader.uniform("color", "vec3", [1, 1, 1]);
		this.shader.uniform("opacity", "float", 1);
		this.shaderDiffuse = new alfrid.GLShader(null, fsSimpleDiffuse);

		this.shaderOutline = new alfrid.GLShader(vsOutline, alfrid.ShaderLibs.simpleColorFrag);
		this.shaderOutline.bind();
		this.shaderOutline.uniform('color', 'vec3', [0, 0, 0]);
		this.shaderOutline.uniform('opacity', 'float', 1);
		this.shaderOutline.uniform("uOutlineWidth", "float", Config.outlineWidth);
		this.shaderOutline.uniform("uOutlineNoise", "float", Config.outlineNoise);
		this.shaderOutline.uniform("uOutlineNoiseStrength", "float", Config.outlineNoiseStrength);

		this.meshFrames = Assets.get('frames');
		this.mesh = Assets.get('scene');
		this.meshBoxes = Assets.get('boxes');
	}


	render() {
		GL.clear(1, 1, 1, 1);
		this.shaderOutline.bind();
		this.shaderOutline.uniform("uTime", "float", alfrid.Scheduler.deltaTime);


		if(this.step === 0) {
			this.shader.bind();
			
			GL.gl.cullFace(GL.gl.FRONT);
			GL.draw(this.meshBoxes);
			GL.gl.cullFace(GL.gl.BACK);
			GL.draw(this.mesh);

			this.shaderOutline.bind();
			GL.draw(this.meshFrames);

			GL.gl.cullFace(GL.gl.FRONT);
			GL.draw(this.mesh);
			GL.gl.cullFace(GL.gl.BACK);
			
		} else if(this.step === 1) {
			this.shaderDiffuse.bind();
			GL.draw(this.mesh);
		} else if(this.step === 2) {
			this.shaderDiffuse.bind();
			GL.draw(this.mesh);
			GL.gl.cullFace(GL.gl.FRONT);
			GL.draw(this.meshBoxes);
			GL.gl.cullFace(GL.gl.BACK);
		} else if(this.step === 3) {
			this.shaderDiffuse.bind();
			GL.draw(this.mesh);
			GL.disable(GL.CULL_FACE);
			GL.draw(this.meshBoxes);
			GL.enable(GL.CULL_FACE);

		} else if(this.step === 4) {
			this.shaderDiffuse.bind();
			GL.draw(this.mesh);
			GL.disable(GL.CULL_FACE);
			this.shader.bind();
			GL.draw(this.meshBoxes);
			GL.enable(GL.CULL_FACE);
		} else if(this.step === 5) {
			this.shader.bind();
			GL.gl.cullFace(GL.gl.FRONT);
			GL.draw(this.meshBoxes);
			GL.gl.cullFace(GL.gl.BACK);
			this.shaderDiffuse.bind();
			GL.draw(this.mesh);

			this.shaderOutline.bind();
			GL.draw(this.meshFrames);
		} else if(this.step === 6) {
			this.shader.bind();
			
			GL.gl.cullFace(GL.gl.FRONT);
			GL.draw(this.meshBoxes);
			GL.gl.cullFace(GL.gl.BACK);
			GL.draw(this.mesh);

			this.shaderOutline.bind();
			GL.draw(this.meshFrames);

			GL.gl.cullFace(GL.gl.FRONT);
			GL.draw(this.mesh);
			GL.gl.cullFace(GL.gl.BACK);
		} else if(this.step === 7) {
			this._vOutline.renderDiffuse();
		} else if(this.step === 8) {
			this._vOutline.renderDiffuse(true);
		} else if(this.step === 9) {
			this._vOutline.renderDiffuse(true, 5);
		} else if(this.step === 10) {
			this._vOutline.render();
		} else if(this.step === 11) {
			this._vOutline.render(true);
		} else {
			this.shader.bind();
			
			GL.gl.cullFace(GL.gl.FRONT);
			GL.draw(this.meshBoxes);
			GL.gl.cullFace(GL.gl.BACK);
			GL.draw(this.mesh);

			this.shaderOutline.bind();
			GL.draw(this.meshFrames);

			GL.gl.cullFace(GL.gl.FRONT);
			GL.draw(this.mesh);
			GL.gl.cullFace(GL.gl.BACK);
		}
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;