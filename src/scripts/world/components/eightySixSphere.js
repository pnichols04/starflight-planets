import { SphereGeometry, Group, Mesh, MeshBasicMaterial, TextureLoader, NearestFilter } from 'three';
import * as TWEEN from '@tweenjs/tween.js';

const gridUrl = new URL( '../../../images/equirectangular_grid.png', import.meta.url );

// const wireMaterial = new MeshBasicMaterial( { color: 0x448cd1, wireframe: true, transparent: true, } );
/** @type {import('three').MeshBasicMaterial} */
let holdoutMaterial;

/**
 *
 * @param {import('../../components/Sector').Planet} planet
 * @returns
 */
function createEightySixSphere( planet ) {

	const loader = new TextureLoader();

	if ( ! holdoutMaterial ) {

		holdoutMaterial = new MeshBasicMaterial( { color: 0x000102 } );
		loader.load( gridUrl.toString(), ( texture ) => {

			holdoutMaterial.map = texture;
			holdoutMaterial.color.setHex( 0xffffff );
			holdoutMaterial.needsUpdate = true;

		} );

	}

	const group = new Group();

	// create the sphere geometry
	const geometry = new SphereGeometry( planet.radius, 48, 24 ).toNonIndexed();

	// create a mesh for the holdout sphere
	holdoutMaterial.opacity = 1.0;
	const holdoutSphere = new Mesh(
		geometry,
		holdoutMaterial
	);
	group.add( holdoutSphere );

	// create a material and mesh for the textured sphere
	const texturedMaterial = new MeshBasicMaterial( {
		opacity: 0.0,
		transparent: true,
	} );
	const texturedOpacity = { value: 0.0 };
	const tween = new TWEEN.Tween( texturedOpacity )
		.to( { value: 1.0 }, 1000 )
		.easing( TWEEN.Easing.Quadratic.In )
		.onUpdate( () => {

			const inverse = 1.0 - texturedOpacity.value;
			// wireMaterial.opacity = inverse;
			holdoutMaterial.opacity = inverse;
			texturedMaterial.opacity = texturedOpacity.value;

		} )
		.onComplete( () => {

			holdoutSphere.visible = false;
			// wireSphere.visible = false;

		} );
	loader.load( `assets/images/maps/48/${planet.imageIndex}.png`, ( texture ) => {

		texture.magFilter = NearestFilter;
		texturedMaterial.map = texture;
		texturedMaterial.needsUpdate = true;
		tween.start();

	} );
	const texturedSphere = new Mesh( geometry, texturedMaterial );
	// texturedSphere.visible = false;
	group.add( texturedSphere );

	group.tick = ( /** @type {number} */ delta ) => {

		// blend between the spheres
		tween.update();

		// increase the cube's rotation each frame
		const rotationsPerSecond = ( Math.PI / 12 );
		group.rotation.y += rotationsPerSecond * delta;

	};

	group.dispose = () => {

		texturedSphere.geometry.dispose();
		if ( texturedSphere.material.map?.isTexture ) {

			texturedSphere.material.map.dispose();

		}

		texturedSphere.material.dispose();

	};

	return group;

}

export { createEightySixSphere };
