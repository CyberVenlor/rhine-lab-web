export type ElementCategory =
	| 'alkali metal'
	| 'alkaline earth metal'
	| 'transition metal'
	| 'post-transition metal'
	| 'metalloid'
	| 'polyatomic nonmetal'
	| 'diatomic nonmetal'
	| 'halogen'
	| 'noble gas'
	| 'lanthanide'
	| 'actinide'
	| 'unknown';

type RawElement = {
	number: number;
	symbol: string;
	name: string;
	atomicMass: string;
	group: number | null;
	period: number;
	block: 's' | 'p' | 'd' | 'f';
	category: ElementCategory;
};

const rawElements: RawElement[] = [
	{ number: 1, symbol: 'H', name: 'Hydrogen', atomicMass: '1.008', group: 1, period: 1, block: 's', category: 'diatomic nonmetal' },
	{ number: 2, symbol: 'He', name: 'Helium', atomicMass: '4.0026', group: 18, period: 1, block: 's', category: 'noble gas' },
	{ number: 3, symbol: 'Li', name: 'Lithium', atomicMass: '6.94', group: 1, period: 2, block: 's', category: 'alkali metal' },
	{ number: 4, symbol: 'Be', name: 'Beryllium', atomicMass: '9.0122', group: 2, period: 2, block: 's', category: 'alkaline earth metal' },
	{ number: 5, symbol: 'B', name: 'Boron', atomicMass: '10.81', group: 13, period: 2, block: 'p', category: 'metalloid' },
	{ number: 6, symbol: 'C', name: 'Carbon', atomicMass: '12.011', group: 14, period: 2, block: 'p', category: 'polyatomic nonmetal' },
	{ number: 7, symbol: 'N', name: 'Nitrogen', atomicMass: '14.007', group: 15, period: 2, block: 'p', category: 'diatomic nonmetal' },
	{ number: 8, symbol: 'O', name: 'Oxygen', atomicMass: '15.999', group: 16, period: 2, block: 'p', category: 'diatomic nonmetal' },
	{ number: 9, symbol: 'F', name: 'Fluorine', atomicMass: '18.998', group: 17, period: 2, block: 'p', category: 'halogen' },
	{ number: 10, symbol: 'Ne', name: 'Neon', atomicMass: '20.180', group: 18, period: 2, block: 'p', category: 'noble gas' },
	{ number: 11, symbol: 'Na', name: 'Sodium', atomicMass: '22.990', group: 1, period: 3, block: 's', category: 'alkali metal' },
	{ number: 12, symbol: 'Mg', name: 'Magnesium', atomicMass: '24.305', group: 2, period: 3, block: 's', category: 'alkaline earth metal' },
	{ number: 13, symbol: 'Al', name: 'Aluminium', atomicMass: '26.982', group: 13, period: 3, block: 'p', category: 'post-transition metal' },
	{ number: 14, symbol: 'Si', name: 'Silicon', atomicMass: '28.085', group: 14, period: 3, block: 'p', category: 'metalloid' },
	{ number: 15, symbol: 'P', name: 'Phosphorus', atomicMass: '30.974', group: 15, period: 3, block: 'p', category: 'polyatomic nonmetal' },
	{ number: 16, symbol: 'S', name: 'Sulfur', atomicMass: '32.06', group: 16, period: 3, block: 'p', category: 'polyatomic nonmetal' },
	{ number: 17, symbol: 'Cl', name: 'Chlorine', atomicMass: '35.45', group: 17, period: 3, block: 'p', category: 'halogen' },
	{ number: 18, symbol: 'Ar', name: 'Argon', atomicMass: '39.948', group: 18, period: 3, block: 'p', category: 'noble gas' },
	{ number: 19, symbol: 'K', name: 'Potassium', atomicMass: '39.098', group: 1, period: 4, block: 's', category: 'alkali metal' },
	{ number: 20, symbol: 'Ca', name: 'Calcium', atomicMass: '40.078', group: 2, period: 4, block: 's', category: 'alkaline earth metal' },
	{ number: 21, symbol: 'Sc', name: 'Scandium', atomicMass: '44.956', group: 3, period: 4, block: 'd', category: 'transition metal' },
	{ number: 22, symbol: 'Ti', name: 'Titanium', atomicMass: '47.867', group: 4, period: 4, block: 'd', category: 'transition metal' },
	{ number: 23, symbol: 'V', name: 'Vanadium', atomicMass: '50.942', group: 5, period: 4, block: 'd', category: 'transition metal' },
	{ number: 24, symbol: 'Cr', name: 'Chromium', atomicMass: '51.996', group: 6, period: 4, block: 'd', category: 'transition metal' },
	{ number: 25, symbol: 'Mn', name: 'Manganese', atomicMass: '54.938', group: 7, period: 4, block: 'd', category: 'transition metal' },
	{ number: 26, symbol: 'Fe', name: 'Iron', atomicMass: '55.845', group: 8, period: 4, block: 'd', category: 'transition metal' },
	{ number: 27, symbol: 'Co', name: 'Cobalt', atomicMass: '58.933', group: 9, period: 4, block: 'd', category: 'transition metal' },
	{ number: 28, symbol: 'Ni', name: 'Nickel', atomicMass: '58.693', group: 10, period: 4, block: 'd', category: 'transition metal' },
	{ number: 29, symbol: 'Cu', name: 'Copper', atomicMass: '63.546', group: 11, period: 4, block: 'd', category: 'transition metal' },
	{ number: 30, symbol: 'Zn', name: 'Zinc', atomicMass: '65.38', group: 12, period: 4, block: 'd', category: 'transition metal' },
	{ number: 31, symbol: 'Ga', name: 'Gallium', atomicMass: '69.723', group: 13, period: 4, block: 'p', category: 'post-transition metal' },
	{ number: 32, symbol: 'Ge', name: 'Germanium', atomicMass: '72.630', group: 14, period: 4, block: 'p', category: 'metalloid' },
	{ number: 33, symbol: 'As', name: 'Arsenic', atomicMass: '74.922', group: 15, period: 4, block: 'p', category: 'metalloid' },
	{ number: 34, symbol: 'Se', name: 'Selenium', atomicMass: '78.971', group: 16, period: 4, block: 'p', category: 'polyatomic nonmetal' },
	{ number: 35, symbol: 'Br', name: 'Bromine', atomicMass: '79.904', group: 17, period: 4, block: 'p', category: 'halogen' },
	{ number: 36, symbol: 'Kr', name: 'Krypton', atomicMass: '83.798', group: 18, period: 4, block: 'p', category: 'noble gas' },
	{ number: 37, symbol: 'Rb', name: 'Rubidium', atomicMass: '85.468', group: 1, period: 5, block: 's', category: 'alkali metal' },
	{ number: 38, symbol: 'Sr', name: 'Strontium', atomicMass: '87.62', group: 2, period: 5, block: 's', category: 'alkaline earth metal' },
	{ number: 39, symbol: 'Y', name: 'Yttrium', atomicMass: '88.906', group: 3, period: 5, block: 'd', category: 'transition metal' },
	{ number: 40, symbol: 'Zr', name: 'Zirconium', atomicMass: '91.224', group: 4, period: 5, block: 'd', category: 'transition metal' },
	{ number: 41, symbol: 'Nb', name: 'Niobium', atomicMass: '92.906', group: 5, period: 5, block: 'd', category: 'transition metal' },
	{ number: 42, symbol: 'Mo', name: 'Molybdenum', atomicMass: '95.95', group: 6, period: 5, block: 'd', category: 'transition metal' },
	{ number: 43, symbol: 'Tc', name: 'Technetium', atomicMass: '98', group: 7, period: 5, block: 'd', category: 'transition metal' },
	{ number: 44, symbol: 'Ru', name: 'Ruthenium', atomicMass: '101.07', group: 8, period: 5, block: 'd', category: 'transition metal' },
	{ number: 45, symbol: 'Rh', name: 'Rhodium', atomicMass: '102.91', group: 9, period: 5, block: 'd', category: 'transition metal' },
	{ number: 46, symbol: 'Pd', name: 'Palladium', atomicMass: '106.42', group: 10, period: 5, block: 'd', category: 'transition metal' },
	{ number: 47, symbol: 'Ag', name: 'Silver', atomicMass: '107.87', group: 11, period: 5, block: 'd', category: 'transition metal' },
	{ number: 48, symbol: 'Cd', name: 'Cadmium', atomicMass: '112.41', group: 12, period: 5, block: 'd', category: 'transition metal' },
	{ number: 49, symbol: 'In', name: 'Indium', atomicMass: '114.82', group: 13, period: 5, block: 'p', category: 'post-transition metal' },
	{ number: 50, symbol: 'Sn', name: 'Tin', atomicMass: '118.71', group: 14, period: 5, block: 'p', category: 'post-transition metal' },
	{ number: 51, symbol: 'Sb', name: 'Antimony', atomicMass: '121.76', group: 15, period: 5, block: 'p', category: 'metalloid' },
	{ number: 52, symbol: 'Te', name: 'Tellurium', atomicMass: '127.60', group: 16, period: 5, block: 'p', category: 'metalloid' },
	{ number: 53, symbol: 'I', name: 'Iodine', atomicMass: '126.90', group: 17, period: 5, block: 'p', category: 'halogen' },
	{ number: 54, symbol: 'Xe', name: 'Xenon', atomicMass: '131.29', group: 18, period: 5, block: 'p', category: 'noble gas' },
	{ number: 55, symbol: 'Cs', name: 'Cesium', atomicMass: '132.91', group: 1, period: 6, block: 's', category: 'alkali metal' },
	{ number: 56, symbol: 'Ba', name: 'Barium', atomicMass: '137.33', group: 2, period: 6, block: 's', category: 'alkaline earth metal' },
	{ number: 57, symbol: 'La', name: 'Lanthanum', atomicMass: '138.91', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 58, symbol: 'Ce', name: 'Cerium', atomicMass: '140.12', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 59, symbol: 'Pr', name: 'Praseodymium', atomicMass: '140.91', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 60, symbol: 'Nd', name: 'Neodymium', atomicMass: '144.24', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 61, symbol: 'Pm', name: 'Promethium', atomicMass: '145', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 62, symbol: 'Sm', name: 'Samarium', atomicMass: '150.36', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 63, symbol: 'Eu', name: 'Europium', atomicMass: '151.96', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 64, symbol: 'Gd', name: 'Gadolinium', atomicMass: '157.25', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 65, symbol: 'Tb', name: 'Terbium', atomicMass: '158.93', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 66, symbol: 'Dy', name: 'Dysprosium', atomicMass: '162.50', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 67, symbol: 'Ho', name: 'Holmium', atomicMass: '164.93', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 68, symbol: 'Er', name: 'Erbium', atomicMass: '167.26', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 69, symbol: 'Tm', name: 'Thulium', atomicMass: '168.93', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 70, symbol: 'Yb', name: 'Ytterbium', atomicMass: '173.05', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 71, symbol: 'Lu', name: 'Lutetium', atomicMass: '174.97', group: null, period: 6, block: 'f', category: 'lanthanide' },
	{ number: 72, symbol: 'Hf', name: 'Hafnium', atomicMass: '178.49', group: 4, period: 6, block: 'd', category: 'transition metal' },
	{ number: 73, symbol: 'Ta', name: 'Tantalum', atomicMass: '180.95', group: 5, period: 6, block: 'd', category: 'transition metal' },
	{ number: 74, symbol: 'W', name: 'Tungsten', atomicMass: '183.84', group: 6, period: 6, block: 'd', category: 'transition metal' },
	{ number: 75, symbol: 'Re', name: 'Rhenium', atomicMass: '186.21', group: 7, period: 6, block: 'd', category: 'transition metal' },
	{ number: 76, symbol: 'Os', name: 'Osmium', atomicMass: '190.23', group: 8, period: 6, block: 'd', category: 'transition metal' },
	{ number: 77, symbol: 'Ir', name: 'Iridium', atomicMass: '192.22', group: 9, period: 6, block: 'd', category: 'transition metal' },
	{ number: 78, symbol: 'Pt', name: 'Platinum', atomicMass: '195.08', group: 10, period: 6, block: 'd', category: 'transition metal' },
	{ number: 79, symbol: 'Au', name: 'Gold', atomicMass: '196.97', group: 11, period: 6, block: 'd', category: 'transition metal' },
	{ number: 80, symbol: 'Hg', name: 'Mercury', atomicMass: '200.59', group: 12, period: 6, block: 'd', category: 'transition metal' },
	{ number: 81, symbol: 'Tl', name: 'Thallium', atomicMass: '204.38', group: 13, period: 6, block: 'p', category: 'post-transition metal' },
	{ number: 82, symbol: 'Pb', name: 'Lead', atomicMass: '207.2', group: 14, period: 6, block: 'p', category: 'post-transition metal' },
	{ number: 83, symbol: 'Bi', name: 'Bismuth', atomicMass: '208.98', group: 15, period: 6, block: 'p', category: 'post-transition metal' },
	{ number: 84, symbol: 'Po', name: 'Polonium', atomicMass: '209', group: 16, period: 6, block: 'p', category: 'post-transition metal' },
	{ number: 85, symbol: 'At', name: 'Astatine', atomicMass: '210', group: 17, period: 6, block: 'p', category: 'halogen' },
	{ number: 86, symbol: 'Rn', name: 'Radon', atomicMass: '222', group: 18, period: 6, block: 'p', category: 'noble gas' },
	{ number: 87, symbol: 'Fr', name: 'Francium', atomicMass: '223', group: 1, period: 7, block: 's', category: 'alkali metal' },
	{ number: 88, symbol: 'Ra', name: 'Radium', atomicMass: '226', group: 2, period: 7, block: 's', category: 'alkaline earth metal' },
	{ number: 89, symbol: 'Ac', name: 'Actinium', atomicMass: '227', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 90, symbol: 'Th', name: 'Thorium', atomicMass: '232.04', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 91, symbol: 'Pa', name: 'Protactinium', atomicMass: '231.04', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 92, symbol: 'U', name: 'Uranium', atomicMass: '238.03', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 93, symbol: 'Np', name: 'Neptunium', atomicMass: '237', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 94, symbol: 'Pu', name: 'Plutonium', atomicMass: '244', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 95, symbol: 'Am', name: 'Americium', atomicMass: '243', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 96, symbol: 'Cm', name: 'Curium', atomicMass: '247', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 97, symbol: 'Bk', name: 'Berkelium', atomicMass: '247', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 98, symbol: 'Cf', name: 'Californium', atomicMass: '251', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 99, symbol: 'Es', name: 'Einsteinium', atomicMass: '252', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 100, symbol: 'Fm', name: 'Fermium', atomicMass: '257', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 101, symbol: 'Md', name: 'Mendelevium', atomicMass: '258', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 102, symbol: 'No', name: 'Nobelium', atomicMass: '259', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 103, symbol: 'Lr', name: 'Lawrencium', atomicMass: '266', group: null, period: 7, block: 'f', category: 'actinide' },
	{ number: 104, symbol: 'Rf', name: 'Rutherfordium', atomicMass: '267', group: 4, period: 7, block: 'd', category: 'transition metal' },
	{ number: 105, symbol: 'Db', name: 'Dubnium', atomicMass: '268', group: 5, period: 7, block: 'd', category: 'transition metal' },
	{ number: 106, symbol: 'Sg', name: 'Seaborgium', atomicMass: '269', group: 6, period: 7, block: 'd', category: 'transition metal' },
	{ number: 107, symbol: 'Bh', name: 'Bohrium', atomicMass: '270', group: 7, period: 7, block: 'd', category: 'transition metal' },
	{ number: 108, symbol: 'Hs', name: 'Hassium', atomicMass: '269', group: 8, period: 7, block: 'd', category: 'transition metal' },
	{ number: 109, symbol: 'Mt', name: 'Meitnerium', atomicMass: '278', group: 9, period: 7, block: 'd', category: 'transition metal' },
	{ number: 110, symbol: 'Ds', name: 'Darmstadtium', atomicMass: '281', group: 10, period: 7, block: 'd', category: 'transition metal' },
	{ number: 111, symbol: 'Rg', name: 'Roentgenium', atomicMass: '282', group: 11, period: 7, block: 'd', category: 'transition metal' },
	{ number: 112, symbol: 'Cn', name: 'Copernicium', atomicMass: '285', group: 12, period: 7, block: 'd', category: 'transition metal' },
	{ number: 113, symbol: 'Nh', name: 'Nihonium', atomicMass: '286', group: 13, period: 7, block: 'p', category: 'post-transition metal' },
	{ number: 114, symbol: 'Fl', name: 'Flerovium', atomicMass: '289', group: 14, period: 7, block: 'p', category: 'post-transition metal' },
	{ number: 115, symbol: 'Mc', name: 'Moscovium', atomicMass: '290', group: 15, period: 7, block: 'p', category: 'post-transition metal' },
	{ number: 116, symbol: 'Lv', name: 'Livermorium', atomicMass: '293', group: 16, period: 7, block: 'p', category: 'post-transition metal' },
	{ number: 117, symbol: 'Ts', name: 'Tennessine', atomicMass: '294', group: 17, period: 7, block: 'p', category: 'halogen' },
	{ number: 118, symbol: 'Og', name: 'Oganesson', atomicMass: '294', group: 18, period: 7, block: 'p', category: 'noble gas' }
];

const oxidationOverrides = new Map<string, string>([
	['H', '-1, +1'],
	['C', '-4, +2, +4'],
	['N', '-3, +3, +5'],
	['O', '-2, -1'],
	['F', '-1'],
	['P', '-3, +3, +5'],
	['S', '-2, +2, +4, +6'],
	['Cl', '-1, +1, +3, +5, +7'],
	['Fe', '+2, +3'],
	['Cu', '+1, +2'],
	['Zn', '+2'],
	['Ag', '+1'],
	['Sn', '+2, +4'],
	['Pb', '+2, +4'],
	['Au', '+1, +3'],
	['Hg', '+1, +2'],
	['I', '-1, +1, +3, +5, +7'],
	['Br', '-1, +1, +3, +5'],
	['Mn', '+2 to +7'],
	['Cr', '+2, +3, +6'],
	['Co', '+2, +3'],
	['Ni', '+2, +3'],
	['Ti', '+2, +3, +4'],
	['V', '+2 to +5'],
	['Mo', '+2 to +6'],
	['W', '+2 to +6'],
	['U', '+3 to +6'],
	['Ce', '+3, +4'],
	['Eu', '+2, +3'],
	['Th', '+4'],
	['Pa', '+4, +5'],
	['Bk', '+3, +4'],
	['Cf', '+3, +4'],
	['Am', '+3, +4, +5'],
	['Pu', '+3, +4, +5, +6'],
	['Np', '+3, +4, +5, +6'],
	['Os', '+2, +3, +4, +8'],
	['Ru', '+2, +3, +4'],
	['Ir', '+3, +4, +6'],
	['Pt', '+2, +4'],
	['Re', '+2 to +7'],
	['Tc', '+4, +7'],
	['Ga', '+1, +3'],
	['Ge', '-4, +2, +4'],
	['As', '-3, +3, +5'],
	['Se', '-2, +4, +6'],
	['Te', '-2, +4, +6'],
	['At', '-1, +1, +3, +5'],
	['Po', '-2, +2, +4, +6'],
	['Sb', '-3, +3, +5'],
	['Bi', '+3, +5'],
	['B', '-3, +3'],
	['Si', '-4, +2, +4'],
	['Al', '+3'],
	['Mg', '+2'],
	['Ca', '+2'],
	['Na', '+1'],
	['K', '+1']
]);

const categoryDefaults: Record<ElementCategory, string> = {
	'alkali metal': '+1',
	'alkaline earth metal': '+2',
	'transition metal': '+2, +3',
	'post-transition metal': '+1 to +3',
	'metalloid': '-3 to +5',
	'polyatomic nonmetal': '-2 to +6',
	'diatomic nonmetal': '-1 to +5',
	'halogen': '-1, +1, +3, +5, +7',
	'noble gas': '0',
	'lanthanide': '+3',
	'actinide': '+3, +4',
	'unknown': 'varies'
};

export const categoryPalettes: Record<ElementCategory, { gradient: string; glow: string }> = {
	'alkali metal': { gradient: 'linear-gradient(135deg, #ff7b02, #ff1b6b)', glow: '#ff4f1c' },
	'alkaline earth metal': { gradient: 'linear-gradient(135deg, #ffd200, #ff7b39)', glow: '#ffb347' },
	'transition metal': { gradient: 'linear-gradient(135deg, #00f0ff, #0078ff)', glow: '#00d0ff' },
	'post-transition metal': { gradient: 'linear-gradient(135deg, #ff7af5, #9159ff)', glow: '#d95bff' },
	'metalloid': { gradient: 'linear-gradient(135deg, #26ffe6, #49c6ff)', glow: '#26ffe6' },
	'polyatomic nonmetal': { gradient: 'linear-gradient(135deg, #6bffb8, #38edff)', glow: '#5efdd5' },
	'diatomic nonmetal': { gradient: 'linear-gradient(135deg, #3dfff5, #59d0ff)', glow: '#42fff3' },
	'halogen': { gradient: 'linear-gradient(135deg, #ff57c1, #ffa7c4)', glow: '#ff57c1' },
	'noble gas': { gradient: 'linear-gradient(135deg, #b47dff, #ff6eff)', glow: '#cf87ff' },
	'lanthanide': { gradient: 'linear-gradient(135deg, #ffb347, #ffcc33)', glow: '#ffb347' },
	'actinide': { gradient: 'linear-gradient(135deg, #ff6e7f, #bfe9ff)', glow: '#ff6e7f' },
	'unknown': { gradient: 'linear-gradient(135deg, #888, #555)', glow: '#777' }
};

const orbitalSequence = [
	{ n: 1, capacity: 2 },
	{ n: 2, capacity: 2 },
	{ n: 2, capacity: 6 },
	{ n: 3, capacity: 2 },
	{ n: 3, capacity: 6 },
	{ n: 4, capacity: 2 },
	{ n: 3, capacity: 10 },
	{ n: 4, capacity: 6 },
	{ n: 5, capacity: 2 },
	{ n: 4, capacity: 10 },
	{ n: 5, capacity: 6 },
	{ n: 6, capacity: 2 },
	{ n: 4, capacity: 14 },
	{ n: 5, capacity: 10 },
	{ n: 6, capacity: 6 },
	{ n: 7, capacity: 2 },
	{ n: 5, capacity: 14 },
	{ n: 6, capacity: 10 },
	{ n: 7, capacity: 6 },
	{ n: 8, capacity: 2 },
	{ n: 6, capacity: 14 },
	{ n: 7, capacity: 10 },
	{ n: 8, capacity: 6 }
];

const buildShells = (atomicNumber: number): number[] => {
	const shells = Array(8).fill(0);
	let remaining = atomicNumber;

	for (const orbital of orbitalSequence) {
		if (remaining <= 0) break;
		const electrons = Math.min(orbital.capacity, remaining);
		shells[orbital.n - 1] += electrons;
		remaining -= electrons;
	}

	while (shells.length && shells[shells.length - 1] === 0) {
		shells.pop();
	}

	return shells;
};

const computeGridColumn = (element: RawElement): number => {
	if (element.group) return element.group;
	if (element.number >= 57 && element.number <= 71) return element.number - 53;
	if (element.number >= 89 && element.number <= 103) return element.number - 85;
	return 18;
};

const computeGridRow = (element: RawElement): number => {
	if (element.number >= 57 && element.number <= 71) return 8;
	if (element.number >= 89 && element.number <= 103) return 9;
	return element.period;
};

export type ElementRecord = RawElement & {
	gridColumn: number;
	gridRow: number;
	oxidationStates: string;
	shells: number[];
	shellLabel: string;
};

export const elements: ElementRecord[] = rawElements.map((element) => {
	const shells = buildShells(element.number);
	const oxidationStates = oxidationOverrides.get(element.symbol) ?? categoryDefaults[element.category] ?? 'varies';

	return {
		...element,
		gridColumn: computeGridColumn(element),
		gridRow: computeGridRow(element),
		oxidationStates,
		shells,
		shellLabel: shells.map((count, index) => `n${index + 1}: ${count}`).join('  |  ')
	};
});

const uniqueCategories = Array.from(new Set(elements.map((element) => element.category))) as ElementCategory[];

export const categoryLegend = uniqueCategories.map((category) => ({
	category,
	oxidation: categoryDefaults[category] ?? 'varies'
}));
