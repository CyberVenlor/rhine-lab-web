export enum AtomType {
	Hydrogen = 'H',
	Carbon = 'C',
	Nitrogen = 'N',
	Oxygen = 'O',
	Sulfur = 'S',
	Chlorine = 'Cl'
}

export enum BondType {
	Single = 'single',
	Double = 'double',
	Triple = 'triple'
}

export type Vec3 = [number, number, number];

export interface AtomNode {
	id: number;
	type: AtomType;
	position: Vec3;
}

export interface BondEdge {
	from: number;
	to: number;
	type: BondType;
}

export interface MoleculeDefinition {
	name: string;
	atoms: AtomNode[];
	bonds: BondEdge[];
}
