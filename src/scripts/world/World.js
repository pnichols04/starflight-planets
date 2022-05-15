import { createCamera } from './components/camera.js';
import { createEightySixSphere } from './components/eightySixSphere.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Loop } from './systems/Loop.js';
import { Resizer } from './systems/Resizer.js';
import { removeLoadingOverlay } from '../components/loadingOverlay.js';

/** @type {import('three').PerspectiveCamera} */
let camera;

/** @type {import('three').WebGLRenderer} */
let renderer;

/** @type {import('three').Scene} */
let scene;

/** @type {import('./systems/Loop.js').Loop} */
let loop;

/** @type {import('three').Mesh} */
let eightySixSphere;

/** @type {import('@tweenjs/tween.js').Tween} */
let loadingOverlayRemover;

class World {

	/**
   * @param {HTMLElement} container
	 * @param {HTMLElement} controlsTarget
   * @param {boolean} asFirst Whether to insert the renderer at the start of the container's child collection, rather than the end.  Default false.
   */
	constructor( container, controlsTarget, asFirst = false ) {

		camera = createCamera();
		scene = createScene();
		renderer = createRenderer();
		container.insertAdjacentElement(
			asFirst ? 'afterbegin' : 'beforeend',
			renderer.domElement
		);

		controlsTarget = controlsTarget || renderer.domElement;
		const controls = createControls( camera, controlsTarget );

		const resizer = new Resizer( container, controlsTarget, camera, renderer );

		loop = new Loop( camera, scene, renderer );

		// prepare for removing loading overlay
		loadingOverlayRemover = removeLoadingOverlay( '#loadingOverlay' );
		loop.tweens.push( loadingOverlayRemover );


	}

	/**
	 *
	 * @param {import('../components/Sector.js').Planet} planet
	 */
	showPlanet( planet ) {

		// remove old eightySixSphere
		if ( eightySixSphere ) {

			scene.remove( eightySixSphere );
			loop.updatables.filter( ( x ) => x != eightySixSphere );
			eightySixSphere.dispose();

		}

		//add new sphere
		eightySixSphere = createEightySixSphere( planet );
		scene.add( eightySixSphere );
		loop.updatables.push( eightySixSphere );

	}

	render() {

		renderer.render( scene, camera );

	}

	start() {

		loop.start();
		loadingOverlayRemover.start();

	}

	stop() {

		loop.stop();

	}

}

export { World };
