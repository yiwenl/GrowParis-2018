let _instance;

class ARUtils {

	constructor() {

	}

	getARDisplay() {
		const promise = new Promise((resolve, reject) => {
			if (!navigator.getVRDisplays) {
				resolve(null);
				return;
			}

			navigator.getVRDisplays().then(displays => {
				if (!displays && displays.length === 0) {
					resolve(null);
					return;
				}

				for (let display of displays) {
					if (this.isARDisplay(display)) {
						this._display   = display;
						this._frameData = new VRFrameData();
						resolve(display);
						return;
					}
				}
				resolve(null);
			});
		});

		return promise;
	}

	updateCamera(mCamera) {
		if(!this._display) { return; }

		this._display.getFrameData(this._frameData);

		const dir = 'left';
		const projection = this._frameData[`${dir}ProjectionMatrix`];
		const matrix = this._frameData[`${dir}ViewMatrix`];	

		mat4.copy(mCamera.matrix, matrix);
		mat4.copy(mCamera.projection, projection);

		const { pose } = this._frameData;
		vec3.copy(mCamera.position, pose.position);
	}


	hitTest(x=0.5, y=0.5) {
		if(!this._display) { return null; }

		const hit = this._display.hitTest(0.5, 0.5);
		if(hit && hit.length > 0) {
			const {modelMatrix} = hit[0];
			return {
				modelMatrix,
				hitPosition:vec3.fromValues(modelMatrix[12], modelMatrix[13], modelMatrix[14])
			}
		} else {
			return null;
		}

	}

	isTango(display) {
		return display && display.displayName.toLowerCase().includes('tango');
	}

	isARKit(display) {
		return display && display.displayName.toLowerCase().includes('arkit');
	}

	isARDisplay(display) {
		return this.isARKit(display) || this.isTango(display);
	}

	get ARDisplay() {
		return this._display;
	}

	get hasARDisplay() {
		return !!this._display;
	}
}



if(!_instance) {
	_instance = new ARUtils();
}

export default _instance;
export const getARDisplay = _instance.getARDisplay;
export const isTango = _instance.isTango;
export const isARKit = _instance.isARKit;
export const isARDisplay = _instance.isARDisplay;
export const ARDisplay = _instance.ARDisplay;