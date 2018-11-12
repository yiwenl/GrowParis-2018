// SceneApp.js

// http://jsfiddle.net/PerroAZUL/zdaY8/1/

import alfrid, { Scene, GL, WebglNumber } from 'alfrid';
import Assets from './Assets';
import Settings from './Settings';
import Config from './Config';

import ARVideoRenderer from './ARVideoRenderer';
import ARUtils, { ARDisplay } from './ARUtils';

import ViewBg from './ViewBg';
import ViewRing from './ViewRing';
import ViewPixels from './ViewPixels';
import ViewRender from './ViewRender';
import ViewGetColor from './ViewGetColor';

import generateParticles from './generateParticles';

class SceneApp extends Scene {
	constructor() {
		Settings.init();

		super();
		this.orbitalControl.radius.setTo(0.5);
		

		this._mHit     = mat4.create();
		this._mCenter  = mat4.create();

		if(ARUtils.hasARDisplay) {
			this._frameData = new VRFrameData();
			mat4.translate(this._mHit, this._mHit, vec3.fromValues(999, 999, 999));
			this.cameraAR = new alfrid.CameraPerspective();
			this.camera = this.cameraAR;
		} 

		this._hasClicked = false;
		this._isUpdating = true;
		this.step = 0;

		GL.canvas.addEventListener('touchstart', (e)=>this._onClick(e));

		window.addEventListener('keydown', (e) => {
			console.log(e.keyCode);
			if(e.keyCode === 32 || e.keyCode === 39) {
				this.step++;
			} else if(e.keyCode === 37) {
				this.step--;
				if(this.step<0) this.step = 1;
			} 
		});
	}


	_initTextures() {
		this._fboBg = new alfrid.FrameBuffer(GL.width, GL.height);

		const num = 256;
		this._fboPos = new alfrid.FrameBuffer(num, num, {
			type:GL.FLOAT,
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST
		});

		this._fboColor = new alfrid.FrameBuffer(num, num, {
			type:GL.FLOAT,
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST
		});

		this.texturePos = generateParticles();

		
	}


	_initViews() {
		this._vRing = new ViewRing();
		this._bCopy = new alfrid.BatchCopy();
		this._vPixels = new ViewPixels();
		this._vRender = new ViewRender();
		this._vColor = new ViewGetColor();

		if(this.ARDisplay) {
			this._vBg = new ARVideoRenderer(this.ARDisplay, GL.gl);	
		} else {
			this._vBg = new ViewBg();	
		}

		//	saving position
		this._fboPos.bind();
		GL.clear(0, 0, 0, 0);
		this._bCopy.draw(this.texturePos);
		this._fboPos.unbind();
	}


	_onClick(e) {
		if(this._hasClicked) {
			return;
		}

		const hit = ARUtils.hitTest();
		if(hit) {
			mat4.identity(this._mHit, this._mHit);
			mat4.translate(this._mHit, this._mHit, hit.hitPosition);
			this._hasClicked = true;
		}
	}


	updateColor() {
		this._fboColor.bind();
		GL.clear(0, 0, 0, 0);
		this._vColor.render(this._fboPos.getTexture(), this._fboBg.getTexture());
		this._fboColor.unbind();
	}


	render() {
		if(this.step < 4) {
			this.updateColor();
		}
		GL.clear(0, 0, 0, 0);		

		ARUtils.updateCamera(this.cameraAR);
		GL.setMatrices(this.camera);

		this._fboBg.bind();
		GL.clear(0, 0, 0, 0);
		this._vBg.render();
		this._fboBg.unbind();


		GL.disable(GL.DEPTH_TEST);
		this._bCopy.draw(this._fboBg.getTexture());
		GL.enable(GL.DEPTH_TEST);

		const hit = ARUtils.hitTest();

		if(hit) {
			const {modelMatrix} = hit;
			mat4.copy(this._mCenter, modelMatrix);
			this._vRing.open();
		} else {
			this._vRing.close();
		}


		if (!this._hasClicked && this.ARDisplay) {
			GL.rotate(this._mCenter);
			this._vRing.render();	
		}

		GL.rotate(this._mHit);
		// this._vPixels.render();

		if(this.step === 0) {

		} else {
			this._vRender.render(this._fboPos.getTexture(), this._fboColor.getTexture(), this.step);	
		} 
		

		GL.disable(GL.DEPTH_TEST);
		GL.viewport(0, 0, 256, 256);
		// this._bCopy.draw(this.texturePos);		
		// this._bCopy.draw(this._fboColor.getTexture());		
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
		this.camera.setAspectRatio(GL.aspectRatio);
	}


	get ARDisplay() {
		return ARUtils.ARDisplay;
	}

}


export default SceneApp;