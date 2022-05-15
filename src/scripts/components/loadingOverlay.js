import * as TWEEN from '@tweenjs/tween.js';

/**
 *
 * @param {string} querySelector
 * @return {TWEEN.Tween}
 */
function removeLoadingOverlay( querySelector ) {

	const overlay = document.querySelector( querySelector );
	const opacity = { value: 1.0 };
	const tween = new TWEEN.Tween( opacity ) // Create a new tween that modifies 'coords'.
		.to( { value: 0.0 }, 1000 ) // Move to (300, 200) in 1 second.
		.easing( TWEEN.Easing.Quadratic.In ) // Use an easing function to make the animation smooth.
		.onUpdate( () => {

			overlay.style.opacity = opacity.value;

		} )
		.onComplete( () => {

			overlay.remove();

		} );

	return tween;

}

export { removeLoadingOverlay };
