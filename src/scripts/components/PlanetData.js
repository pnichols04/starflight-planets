import { romanNumerals, elementListToHtml } from '../systems/PlanetDataHelpers.js';

class PlanetData {

	static transformers = {
		'atmosphere': ( /** @type {import('./Sector.js').Planet} */ p ) => elementListToHtml( p.atmosphere ),
		'biodensity': ( /** @type {import('./Sector.js').Planet} */ p ) => `${Math.round( p.mineralDensity * 100 )}&nbsp;%`,
		'gravity': ( /** @type {import('./Sector.js').Planet} */ p ) => `${p.gravity}&nbsp;<em>g</em>`,
		'hydrosphere': ( /** @type {import('./Sector.js').Planet} */ p ) => elementListToHtml( p.hydrosphere ),
		'lithosphere': ( /** @type {import('./Sector.js').Planet} */ p ) => elementListToHtml( p.lithosphere ),
		'mass': ( /** @type {import('./Sector.js').Planet} */ p ) => `${p.mass}&nbsp;T`,
		'mineralDensity': ( /** @type {import('./Sector.js').Planet} */ p ) => `${Math.round( p.mineralDensity * 100 ) }&nbsp;%`,
		'name': ( /** @type {import('./Sector.js').Planet} */ p ) => `${p.starClass}${p.systemX}${p.systemY}-${romanNumerals[ p.orbitSequence ]}`,
		'temperature': ( /** @type {import(.Sector.js).Planet} */ p ) => p.temperature.join( ' to ' ),
	};


	constructor( querySelector ) {

		this._container = document.querySelector( querySelector );

	}

	/**
   * @param {import('./Sector.js').Planet} planet;
   */
	update( planet ) {

		this._container.querySelectorAll( '.planet-data-field[data-field-name]' ).forEach( element => {

			const fieldName = element.dataset.fieldName;
			if ( fieldName in planet || fieldName in PlanetData.transformers ) {

				const transformer = PlanetData.transformers[ fieldName ];
				element.innerHTML = transformer ? transformer( planet ) : planet[ fieldName ];

			}

		} );

	}

}

export { PlanetData };
