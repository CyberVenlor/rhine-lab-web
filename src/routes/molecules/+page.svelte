<script lang="ts">
	import Molecule3D from '$lib/components/Molecule3D.svelte';
	import { methaneMolecule, waterMolecule } from '$lib/data/molecules';

	const molecules = [waterMolecule, methaneMolecule];
</script>

<svelte:head>
	<title>Molecule Lab</title>
	<meta name="description" content="Interactive 3D molecule preview for water and methane." />
</svelte:head>

<main class="page">
	<header class="hero">
		<h1>Molecule Lab</h1>
		<p>通过原子坐标和键类型渲染 3D 分子结构（当前示例：水分子、甲烷）。</p>
	</header>

	<section class="grid">
		{#each molecules as molecule (molecule.name)}
			<article class="card">
				<h2>{molecule.name}</h2>
				<p>{molecule.atoms.length} atoms · {molecule.bonds.length} bonds</p>
				<Molecule3D molecule={molecule} height={340} />
			</article>
		{/each}
	</section>
</main>

<style>
	.page {
		min-height: 100vh;
		padding: clamp(1rem, 2vw, 2rem);
		color: #e9efff;
		background: #1f1f1f;
	}

	.hero {
		max-width: 920px;
		margin: 0 auto 1.2rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		letter-spacing: 0.05em;
	}

	.hero p {
		margin-top: 0.65rem;
		opacity: 0.84;
	}

	.grid {
		max-width: 920px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.card {
		background: transparent;
		border: 1px solid transparent;
		border-radius: 16px;
		padding: 0.9rem;
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.card p {
		margin: 0.35rem 0 0.8rem;
		font-size: 0.88rem;
		opacity: 0.75;
	}
</style>
