import { Dropdown as Dropdown } from 'bootstrap';

import { Sector } from './Sector.js';
import { EventEmitter } from '../systems/EventEmitter.js';

// Helpers for icon set creation

const iconConstants = {};
iconConstants.phi = ( 1 + Math.sqrt( 5 ) ) / 2;
iconConstants.svgHeight = 12;
iconConstants.starRadius = iconConstants.svgHeight / 2;
iconConstants.planetRadius = ( iconConstants.starRadius / iconConstants.phi );
iconConstants.svgWidth = iconConstants.starRadius * 2 + ( iconConstants.planetRadius + iconConstants.planetRadius * iconConstants.phi ) * 8;
iconConstants.starRadius = ( iconConstants.svgHeight / 2 );
iconConstants.starCenter = [
	iconConstants.starRadius,
	iconConstants.starRadius
];
iconConstants.firstPlanetOffset = ( iconConstants.starRadius * 2 + iconConstants.planetRadius * iconConstants.phi );
iconConstants.planetStep = ( iconConstants.planetRadius + iconConstants.planetRadius * iconConstants.phi );
iconConstants.starColors = new Map( [
	[ 'a', '#55ff55' ],
	[ 'b', '#55ffff' ],
	[ 'f', '#ffffff' ],
	[ 'g', '#ffff55' ],
	[ 'k', '#ffa255' ],
	[ 'm', '#aa0000' ],
	[ 'o', '#5555ff' ]
] );
iconConstants.planetColors = new Map( [
	[ 'frozen', '#ffffff' ],
	[ 'gas-giant', '#aa00aa' ],
	[ 'molten', '#aa0000' ],
	[ 'liquid', '#0000aa' ],
	[ 'rock', '#aa5500' ]
] );

class StarSelector {

	/**
   *
   * @param {string} querySelector
   */
	constructor( querySelector ) {

		this.emitter = new EventEmitter();

		this._sector = new Sector();

		/** @type {Star} */
		this.selectedStar = this._sector.stars[ 0 ];

		/** @type {Planet} */
		this._selectedPlanet = this.selectedStar.planets[ 0 ];

		const scope = this;

		// Collect references to the controlled DOM elements

		this.container = document.querySelector( querySelector );
		this.selectStarElem = this.container.querySelector( '#starSystemDropDownButton' );
		this.selectStarMenuElem = this.container.querySelector( '#starSystemDropDownMenu' );
		this.selectPlanetElem = this.container.querySelector( '#planetDropDownButton' );
		this.selectPlanetMenuElem = this.container.querySelector( '#planetDropDownMenu' );
		const starLinks = this.selectStarMenuElem.querySelectorAll( 'a.dropdown-item' );
		/** @type {Map<number, Element>} */
		this._starLinks = new Map(
			[ ...starLinks ].map( ( link ) => [ parseInt( link.dataset.systemKey ), link ] )
		);
		const planetLinks = this.selectPlanetMenuElem.querySelectorAll( 'a.dropdown-item' );
		this._planetLinks = new Map(
			[ ...planetLinks ].map( ( link ) => [ parseInt( link.dataset.orbitPosition ), link ] )
		);
		this._planetListener = this.selectPlanetListener.bind( this );

		starLinks.forEach( ( link ) => {

			link.addEventListener( 'click', ( e ) => {

				const systemKey = parseInt( e.currentTarget.dataset.systemKey );
				// remove the 'active' class from the link for the old selected star
				const oldSelected = scope._starLinks.get( scope.selectedStar.systemKey );
				oldSelected.className = oldSelected.className.split( /\s+/ ).filter( ( c ) => c !== 'active' ).join( ' ' );
				// change the selected star
				scope.selectedStar = scope._sector.stars.find( ( s ) => s.systemKey === systemKey );
				// add it to the link for the new selected star
				const newSelected = scope._starLinks.get( scope.selectedStar.systemKey );
				const classes = newSelected.className.split( /\s+/ );
				if ( classes.indexOf( 'active' ) < 0 ) {

					classes.push( 'active' );

				}

				newSelected.className = classes.join( ' ' );
				// clone the children of the selected link to the drop down button
				const df = new DocumentFragment();
				[ ...newSelected.children ].forEach( ( node ) => {

					df.append( node.cloneNode( true ) );

				} );
				scope.selectStarElem.innerHTML = "";
				scope.selectStarElem.append( df );

				scope.hydrateSelectPlanets( scope.selectedStar );

				e.preventDefault();

			} );

		} );

		this._planetLinks.forEach( ( link, orbitPosition ) => {

			link.addEventListener( 'click', this._planetListener );

		} );

	}

	selectPlanetListener( event ) {

		const systemKey = parseInt( event.currentTarget.dataset.systemKey );
		const orbitPosition = parseInt( event.currentTarget.dataset.orbitPosition );
		// remove the 'active' class from the link for the old selected planet
		const oldSelected = this._planetLinks.get( this.selectedPlanet.orbitPosition );
		oldSelected.className = oldSelected.className.split( /\s+/ ).filter( ( c ) => c !== 'active' ).join( ' ' );
		// change the selected planet
		this.selectedPlanet = this.selectedStar.planets.find( ( p ) => p.orbitPosition === orbitPosition );
		// add it to the link for the new selected star
		const newSelected = this._planetLinks.get( this.selectedPlanet.orbitPosition );
		const classes = newSelected.className.split( /\s+/ );
		if ( classes.indexOf( 'active' ) < 0 ) {

			classes.push( 'active' );

		}

		newSelected.className = classes.join( ' ' );
		// clone the children of the selected link to the drop down button
		const df = new DocumentFragment();
		[ ...newSelected.children ].forEach( ( node ) => {

			df.append( node.cloneNode( true ) );

		} );
		this.selectPlanetElem.innerHTML = '';
		this.selectPlanetElem.append( df );

		event.preventDefault();

	}


	/**
	 *
	 * @param {import('./Sector.js').Star} system
	 */
	hydrateSelectPlanets( system ) {

		const df = new DocumentFragment();
		/** @type {HTMLDivElement} */
		let selectedItemContent;
		/** @type {Map<number, HTMLAnchorElement>} */
		const newPlanetLinks = new Map();
		const planetsContent = system.planets.map( ( p, i ) => {

			const listItem = document.createElement( 'li' );
			const anchor = document.createElement( 'a' );
			const anchorClasses = [ 'dropdown-item' ];
			if ( i === 0 ) {

				anchorClasses.push( 'active' );

			}

			anchor.className = anchorClasses.join( ' ' );
			anchor.href = '#';
			anchor.setAttribute( 'data-system-key', p.systemKey );
			anchor.setAttribute( 'data-orbit-position', p.orbitPosition );
			listItem.append( anchor );

			const innerDiv = document.createElement( 'div' );
			anchor.append( innerDiv );
			const icons = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
			icons.setAttribute( 'width', iconConstants.svgWidth );
			icons.setAttribute( 'height', iconConstants.svgHeight );
			innerDiv.append( icons );

			const star = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
			star.setAttribute( 'cx', iconConstants.starCenter[ 0 ] );
			star.setAttribute( 'cy', iconConstants.starCenter[ 1 ] );
			star.setAttribute( 'r', iconConstants.starRadius );
			star.setAttribute( 'fill', 'rgba( 0, 0, 0, 0 )' );
			star.setAttribute( 'stroke', iconConstants.starColors.get( system.class.toLowerCase() ) );
			star.setAttribute( 'strokewidth', '2' );
			star.setAttribute( 'stroke-dasharray', '2,2' );
			icons.append( star );

			for ( let j = 1; j <= 8; j ++ ) {

				const systemPlanet = system.planets.find( ( fp ) => fp.orbitPosition === j );
				const planetCircle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
				planetCircle.setAttribute( 'cx', iconConstants.firstPlanetOffset + ( j - 1 ) * iconConstants.planetStep );
				planetCircle.setAttribute( 'cy', iconConstants.starCenter[ 1 ] );
				planetCircle.setAttribute( 'r', iconConstants.planetRadius );
				const currentPlanet = ( systemPlanet?.orbitPosition === p.orbitPosition );
				const planetColor
					= iconConstants.planetColors.get( systemPlanet?.surface.toLowerCase().replace( /\s+/, '-' ) )
					?? 'rgba( 0, 0, 0, 0.05 )';
				planetCircle.setAttribute( 'fill', currentPlanet ? planetColor : 'rgba( 0, 0, 0, 0 )' );
				planetCircle.setAttribute( 'stroke', systemPlanet ? planetColor : 'rgba( 255, 255, 255, 0.05 )' );
				planetCircle.setAttribute( 'strokewidth', currentPlanet ? 2 : 0 );
				planetCircle.setAttribute( 'stroke-dasharray', currentPlanet ? '2,2' : '0' );
				icons.append( planetCircle );

			}

			const orbitDiv = document.createElement( 'div' );
			orbitDiv.className = 'planet-orbit-position';
			orbitDiv.innerText = p.orbitPosition;
			innerDiv.append( orbitDiv );

			const surfaceDiv = document.createElement( 'div' );
			surfaceDiv.className = 'planet-surface';
			surfaceDiv.innerText = p.surface;
			innerDiv.append( surfaceDiv );

			if ( i === 0 ) {

				selectedItemContent = innerDiv.cloneNode( true );

			}

			newPlanetLinks.set( p.orbitPosition, anchor );

			return listItem;

		} );

		df.append( ...planetsContent );

		this._planetLinks.forEach( ( link, orbitPosition ) => link.removeEventListener( 'click', this._planetListener ) );
		this.selectPlanetMenuElem.innerHTML = '';
		this.selectPlanetMenuElem.append( df );
		this._planetLinks = newPlanetLinks;
		newPlanetLinks.forEach( ( link, orbitPosition ) => link.addEventListener( 'click', this._planetListener ) );

		this.selectPlanetElem.innerHTML = '';
		this.selectPlanetElem.append( selectedItemContent );

		this.selectedPlanet = system.planets[ 0 ];

	}

	/** @type {Planet} */
	get selectedPlanet() {

		return this._selectedPlanet;

	}

	/** @type {Planet} */
	set selectedPlanet( value ) {

		if ( this._selectedPlanet?.systemKey !== value.systemKey || this._selectedPlanet?.orbitPosition !== value.orbitPosition ) {

			this._selectedPlanet = value;
			// handler format:
			// starSelector.emitter.on( 'selectedPlanetChanged', ( /** @type {import('./components/Sector.js').Planet} */ planet ) => {
			this.emitter.emit( 'selectedPlanetChanged', value );

		}

	}

}

export { StarSelector };
