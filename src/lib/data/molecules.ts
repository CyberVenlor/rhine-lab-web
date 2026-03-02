import { AtomType, BondType, type MoleculeDefinition } from '$lib/data/molecule-types';

export const waterMolecule: MoleculeDefinition = {
	name: 'Water (H2O)',
	atoms: [
		{ id: 1, type: AtomType.Oxygen, position: [0, 0, 0] },
		{ id: 2, type: AtomType.Hydrogen, position: [0.96, 0, 0.24] },
		{ id: 3, type: AtomType.Hydrogen, position: [-0.36, 0.88, -0.16] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 1, to: 3, type: BondType.Single }
	]
};

export const methaneMolecule: MoleculeDefinition = {
	name: 'Methane (CH4)',
	atoms: [
		{ id: 1, type: AtomType.Carbon, position: [0, 0, 0] },
		{ id: 2, type: AtomType.Hydrogen, position: [0.63, 0.63, 0.63] },
		{ id: 3, type: AtomType.Hydrogen, position: [-0.63, -0.63, 0.63] },
		{ id: 4, type: AtomType.Hydrogen, position: [-0.63, 0.63, -0.63] },
		{ id: 5, type: AtomType.Hydrogen, position: [0.63, -0.63, -0.63] }
	],
	bonds: [
		{ from: 1, to: 2, type: BondType.Single },
		{ from: 1, to: 3, type: BondType.Single },
		{ from: 1, to: 4, type: BondType.Single },
		{ from: 1, to: 5, type: BondType.Single }
	]
};
