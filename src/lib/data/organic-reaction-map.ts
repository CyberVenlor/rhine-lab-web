import { AtomType, BondType, type MoleculeDefinition } from '$lib/data/molecule-types';

export interface OrganicNode {
	id: string;
	label: string;
	molecule: MoleculeDefinition;
	x: number;
	y: number;
}

export interface OrganicLink {
	from: string;
	to: string;
}

const polymerUnit: MoleculeDefinition = {
	name: 'Polyethylene unit',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-0.6, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position: [0.6, 0, 0] },
		{ id: 3, type: AtomType.Hydrogen, position: [-1.1, 0.8, 0] },
		{ id: 4, type: AtomType.Hydrogen, position: [-1.1, -0.8, 0] },
		{ id: 5, type: AtomType.Hydrogen, position: [1.1, 0.8, 0] },
		{ id: 6, type: AtomType.Hydrogen, position: [1.1, -0.8, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 1, to: 3, type: BondType.Single },
		{ from: 1, to: 4, type: BondType.Single },
		{ from: 2, to: 5, type: BondType.Single },
		{ from: 2, to: 6, type: BondType.Single }
	]
};

const propane: MoleculeDefinition = {
	name: 'Propane',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-1.0, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position: [0, 0, 0] },
		{ id: 3, type: AtomType.Carbon, position: [1.0, 0, 0] },
		{ id: 4, type: AtomType.Hydrogen, position: [-1.6, 0.8, 0] },
		{ id: 5, type: AtomType.Hydrogen, position: [1.6, 0.8, 0] },
		{ id: 6, type: AtomType.Hydrogen, position: [0, -1.0, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 2, to: 3, type: BondType.Single },
		{ from: 1, to: 4, type: BondType.Single },
		{ from: 3, to: 5, type: BondType.Single },
		{ from: 2, to: 6, type: BondType.Single }
	]
};

const ethene: MoleculeDefinition = {
	name: 'Ethene',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-0.65, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position: [0.65, 0, 0] },
		{ id: 3, type: AtomType.Hydrogen, position: [-1.2, 0.85, 0] },
		{ id: 4, type: AtomType.Hydrogen, position: [-1.2, -0.85, 0] },
		{ id: 5, type: AtomType.Hydrogen, position: [1.2, 0.85, 0] },
		{ id: 6, type: AtomType.Hydrogen, position: [1.2, -0.85, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Double },
		{ from: 1, to: 3, type: BondType.Single },
		{ from: 1, to: 4, type: BondType.Single },
		{ from: 2, to: 5, type: BondType.Single },
		{ from: 2, to: 6, type: BondType.Single }
	]
};

const propanone: MoleculeDefinition = {
	name: 'Propanone',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-1.05, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position: [0, 0, 0] },
		{ id: 3, type: AtomType.Carbon, position: [1.05, 0, 0] },
		{ id: 4, type: AtomType.Oxygen, position: [0, 1.2, 0] },
		{ id: 5, type: AtomType.Hydrogen, position: [-1.7, 0.75, 0] },
		{ id: 6, type: AtomType.Hydrogen, position: [1.7, -0.75, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 2, to: 3, type: BondType.Single },
		{ from: 2, to: 4, type: BondType.Double },
		{ from: 1, to: 5, type: BondType.Single },
		{ from: 3, to: 6, type: BondType.Single }
	]
};

const ethanol: MoleculeDefinition = {
	name: 'Ethanol',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-0.9, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position: [0.35, 0, 0] },
		{ id: 3, type: AtomType.Oxygen, position: [1.4, 0.35, 0] },
		{ id: 4, type: AtomType.Hydrogen, position: [1.95, 1.0, 0] },
		{ id: 5, type: AtomType.Hydrogen, position: [-1.55, 0.85, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 2, to: 3, type: BondType.Single },
		{ from: 3, to: 4, type: BondType.Single },
		{ from: 1, to: 5, type: BondType.Single }
	]
};

const ethanal: MoleculeDefinition = {
	name: 'Ethanal',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-0.9, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position: [0.35, 0, 0] },
		{ id: 3, type: AtomType.Oxygen, position: [1.25, 0.95, 0] },
		{ id: 4, type: AtomType.Hydrogen, position: [1.2, -0.95, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 2, to: 3, type: BondType.Double },
		{ from: 2, to: 4, type: BondType.Single }
	]
};

const chloromethane: MoleculeDefinition = {
	name: 'Chloromethane',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [0, 0, 0] },
		{ id: 2, type: AtomType.Chlorine, position: [1.25, 0, 0] },
		{ id: 3, type: AtomType.Hydrogen, position: [-0.8, 0.8, 0] },
		{ id: 4, type: AtomType.Hydrogen, position: [-0.8, -0.8, 0] },
		{ id: 5, type: AtomType.Hydrogen, position: [0, 0, 1.0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 1, to: 3, type: BondType.Single },
		{ from: 1, to: 4, type: BondType.Single },
		{ from: 1, to: 5, type: BondType.Single }
	]
};

const methylAcetate: MoleculeDefinition = {
	name: 'Methyl acetate',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-1.25, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position: [0, 0, 0] },
		{ id: 3, type: AtomType.Oxygen, position: [0.8, 0.95, 0] },
		{ id: 4, type: AtomType.Oxygen, position: [0.85, -0.95, 0] },
		{ id: 5, type: AtomType.Carbon, position: [2.1, -0.95, 0] },
		{ id: 6, type: AtomType.Hydrogen, position: [2.85, -1.65, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 2, to: 3, type: BondType.Double },
		{ from: 2, to: 4, type: BondType.Single },
		{ from: 4, to: 5, type: BondType.Single },
		{ from: 5, to: 6, type: BondType.Single }
	]
};

const methylamine: MoleculeDefinition = {
	name: 'Methylamine',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-0.75, 0, 0] },
		{ id: 2, type: AtomType.Nitrogen, position: [0.65, 0.2, 0] },
		{ id: 3, type: AtomType.Hydrogen, position: [1.35, 0.95, 0] },
		{ id: 4, type: AtomType.Hydrogen, position: [1.2, -0.75, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 2, to: 3, type: BondType.Single },
		{ from: 2, to: 4, type: BondType.Single }
	]
};

const acetonitrile: MoleculeDefinition = {
	name: 'Acetonitrile',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-1.0, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position:[0.25, 0, 0] },
		{ id: 3, type: AtomType.Nitrogen, position: [1.45, 0, 0] },
		{ id: 4, type: AtomType.Hydrogen, position: [-1.6, 0.8, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 2, to: 3, type: BondType.Triple },
		{ from: 1, to: 4, type: BondType.Single }
	]
};

const aceticAcid: MoleculeDefinition = {
	name: 'Acetic acid',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [-1.1, 0, 0] },
		{ id: 2, type: AtomType.Carbon, position: [0.1, 0, 0] },
		{ id: 3, type: AtomType.Oxygen, position: [0.95, 0.95, 0] },
		{ id: 4, type: AtomType.Oxygen, position: [0.95, -0.95, 0] },
		{ id: 5, type: AtomType.Hydrogen, position: [1.7, -1.45, 0] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 2, to: 3, type: BondType.Double },
		{ from: 2, to: 4, type: BondType.Single },
		{ from: 4, to: 5, type: BondType.Single }
	]
};

export const organicNodes: OrganicNode[] = [
	{ id: 'polymers', label: 'POLYMERS', molecule: polymerUnit, x: 18, y: 3 },
	{ id: 'ketones', label: 'KETONES', molecule: propanone, x: 44, y: 3 },
	{ id: 'alkane', label: 'ALKANE', molecule: propane, x: 3, y: 20 },
	{ id: 'alkene', label: 'ALKENE', molecule: ethene, x: 24, y: 24 },
	{ id: 'alcohol', label: 'ALCOHOL', molecule: ethanol, x: 50, y: 24 },
	{ id: 'aldehydes', label: 'ALDEHYDES', molecule: ethanal, x: 75, y: 28 },
	{ id: 'halogenoalkanes', label: 'HALOGENOALKANES', molecule: chloromethane, x: 18, y: 44 },
	{ id: 'esters', label: 'ESTERS', molecule: methylAcetate, x: 47, y: 45 },
	{ id: 'amines', label: 'AMINES', molecule: methylamine, x: 8, y: 70 },
	{ id: 'nitrile', label: 'NITRILE', molecule: acetonitrile, x: 31, y: 70 },
	{ id: 'carboxylic-acid', label: 'CARBOXYLIC ACID', molecule: aceticAcid, x: 57, y: 65 }
];

export const organicLinks: OrganicLink[] = [
	{ from: 'polymers', to: 'alkene' },
	{ from: 'alkane', to: 'alkene' },
	{ from: 'alkane', to: 'halogenoalkanes' },
	{ from: 'alkene', to: 'ketones' },
	{ from: 'alkene', to: 'alcohol' },
	{ from: 'alkene', to: 'halogenoalkanes' },
	{ from: 'ketones', to: 'alcohol' },
	{ from: 'alcohol', to: 'aldehydes' },
	{ from: 'alcohol', to: 'esters' },
	{ from: 'halogenoalkanes', to: 'amines' },
	{ from: 'halogenoalkanes', to: 'nitrile' },
	{ from: 'nitrile', to: 'amines' },
	{ from: 'nitrile', to: 'carboxylic-acid' },
	{ from: 'esters', to: 'carboxylic-acid' },
	{ from: 'carboxylic-acid', to: 'alcohol' }
];
