import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from 'three';

function createCube() {

	// create a geometry
	const geometry = new BoxBufferGeometry( 2, 2, 2 );

	// create a default (white) basic material
	const material = new MeshBasicMaterial();

	// create a Mesh containing the geometry and material
	const cube = new Mesh( geometry, material );

	cube.tick = ( /** @type {number} */ delta ) => {

		// increase the cube's rotation each frame
		const rotationsPerSecond = ( Math.PI / 6 );
		cube.rotation.z += rotationsPerSecond * delta;
		cube.rotation.x += rotationsPerSecond * delta;
		cube.rotation.y += rotationsPerSecond * delta;

	};

	return cube;

}

export { createCube };
