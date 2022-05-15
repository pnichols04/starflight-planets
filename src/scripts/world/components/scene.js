import { Color, Scene } from 'three';

function createScene() {

	const scene = new Scene();

	scene.background = new Color().setHex( 0x010107 );

	return scene;

}

export { createScene };
