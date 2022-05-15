/** @type {Array<string>} */
export const romanNumerals = [ '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII' ];

const compounds = new Map( [
	[ "Methane", '<span title="Methane">CH<sub>4</sub></span>' ],
	[ "Sodium Compounds", '<span title="Sodium compounds">Na<sup>-1,+1</sup></span>' ],
	[ "Chromium", '<span title="Chromium"><sub>24</sub>Cr</span>' ],
	[ "None", "<span>None</span>" ],
	[ "Promethium", '<span title="Promethium"><sub>61</sub>Pm</span>' ],
	[ "Copper", '<span title="Copper"><sub>29</sub>Cu</span>' ],
	[ "Molybdenum", '<span title="Molybdenum"><sub>42</sub>Mo</span>' ],
	[ "Tungsten", '<span title="Tungsten"><sub>74</sub>W</span>' ],
	[ "Ammonia Compounds", '<span title="Ammonia compounds">&ndash;NH<sub>2</sub></span>' ],
	[ "Antimony", '<span title="Anitmony"><sub>51</sub>Sb</span>' ],
	[ "Gold", '<span title="Gold"><sub>79</sub>Au</span>' ],
	[ "Magnesium Mercury", '<span title="Magnesium Mercury">HgMg<sub>2</sub></span>' ],
	[ "Plutonium", '<span title="Plutonium"><sub>94</sub>Pu</span>' ],
	[ "Chlorine", '<span title="Chlorine"><sub>17</sub>Cl</span>' ],
	[ "Carbon Monoxide", '<span title="Carbon Monoxide">CO</span' ],
	[ "Silver", '<span title="Silver"><sub>47</sub>Ag</span>' ],
	[ "Water", '<span title="Water">H<sub>2</sub>O</span>' ],
	[ "Platinum", '<span title="Platinum"><sub>78</sub>Pt</span>' ],
	[ "Tin", '<span title="Tin"><sub>50</sub>Sn</span>' ],
	[ "Mercury", '<span title="Mercury"><sub>80</sub>Hg</span>' ],
	[ "Silicon Compounds", '<span title="Silicon compounds">S<sup>-4..+4</sup></span>' ],
	[ "Titanium", '<span title="Titanium"><sub>22</sub>Ti</span>' ],
	[ "Rodnium", '<span title="Rodnium"><sub>unk</sub>Rd</span>' ],
	[ "Magnesium", '<span title="Magnesium"><sub>12</sub>Mg</span>' ],
	[ "Nitrogen", '<span title="Nitrogen"><sub>7</sub>N</span>' ],
	[ "Argon", '<span title="Argon"><sub>18</sub>Ar</span>' ],
	[ "Zinc", '<span title="Zinc"><sub>30</sub>Zn</span>' ],
	[ "Nickel", '<span title="Nickel"><sub>28</sub>Ni</span>' ],
	[ "Hydrogen Cyanide", '<span title="Hydrogen Cyanide">HCN</span>' ],
	[ "Ethanol", '<span title="Ethanol">C<sub>2</sub>H<sub>6</sub>O</span>' ],
	[ "Lead", '<span title="Lead"><sub>82</sub>Pb</span>' ],
	[ "Tungsten Iron", '<span title="Tungsten Iron">W+Fe</span>' ],
	[ "Oxygen", '<span title="Oxygen"><sub>8</sub>O</span>' ],
	[ "Iron", '<span title="Iron"><sub>26</sub>Fe</span>' ],
	[ "Fluorine", '<span title="Fluorine"><sub>9</sub>F</span>' ],
	[ "Ammonia", '<span title="Ammonia">NH<sub>3</sub></span>' ],
	[ "Aluminum", '<span title="Aluminum"><sub>13</sub>Al</span>' ],
	[ "Zinc Tungsten", '<span title="Zinc Tungsten">Zn+W<sub>4</sub></span>' ],
	[ "Carbon Dioxide", '<span title="Carbon Dioxide">CO<sub>2</sub></span>' ],
	[ "Endurium", '<span title="Endurium"><sub>unk</sub>En</span>' ],
	[ "Chlorine Compounds", '<span title="Chlorine compounds">Cl<sup>-1,+1..+7</sup></span>' ],
	[ "Metal Compounds", '<span title="Metal compounds">Metals</span>' ],
	[ "Fluorine Compounds", '<span title="Fluorine compounds">F<sup>-1,0</sup></span>' ],
	[ "Hydrogen", '<span title="Hydrogen"><sub>1</sub>H</span>' ],
	[ "Helium", '<span title="Helium"><sub>2</sub>He</span>' ],
	[ "Sulfur Compounds", '<span title="Sulfur compounds">S<sup>-2..+6</sup></span>' ],
	[ "Cobalt", '<span title="Cobalt"><sub>27</sub>Co</span>' ],
	[ "Methanol", '<span title="Methanol">CH<sub>3</sub>OH</span>' ],
] );

/**
 *
 * @param {Array<string>} list
 * @return {string}
 */
export function elementListToHtml( list ) {

	return list
		.map( ( x ) => {

			console.assert( compounds.has( x ) );
			return compounds.get( x );

		} )
		.join( ', ' );

}
