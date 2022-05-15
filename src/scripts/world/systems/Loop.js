import { Clock } from 'three';

/**
 * @typedef {Function} TickAction
 * @param {number} delta
 */

/**
 * @typedef {Object} updatable
 * @property {TickAction} tick
 */

/** @type {import('three').Clock} */
const clock = new Clock();

class Loop {

	/**
	 *
	 * @param {import('three').PerspectiveCamera} camera
	 * @param {import('three').Scene} scene
	 * @param {import('three').WebGLRenderer} renderer
	 */
	constructor( camera, scene, renderer ) {

		/** @type {import('three').PerspectiveCamera} */
		this.camera = camera;
		/** @type {import('three').Scene} */
		this.scene = scene;
		/** @type {import('three').WebGLRenderer} */
		this.renderer = renderer;
		/** @type {Array<Updatable>} */
		this.updatables = [];
		/** @type {Array<import('@tweenjs/tween.js').Tween>} */
		this.tweens = [];

	}

	start() {

		this.renderer.setAnimationLoop( () => {

			// Update updatables
			this.tick();

			// render a frame
			this.renderer.render( this.scene, this.camera );

		} );

	}

	stop() {

		this.renderer.setAnimationLoop( null );

	}

	tick() {

		const delta = clock.getDelta();

		for ( const obj of this.tweens ) {

			obj.update();

		}

		for ( const obj of this.updatables ) {

			obj.tick( delta );

		}

	}

}

export { Loop };
