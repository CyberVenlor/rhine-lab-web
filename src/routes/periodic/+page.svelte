<svelte:head>
	<title>Neon Periodic Interface</title>
</svelte:head>

<script lang="ts">
	import type { ElementRecord } from '$lib/data/elements';
	import { categoryLegend, categoryPalettes, elements } from '$lib/data/elements';

	const sortedElements = [...elements].sort((a, b) => a.number - b.number);
	const fallbackElement = sortedElements.find((item) => item.symbol === 'C') ?? sortedElements[0];
	let activeElement: ElementRecord = fallbackElement;

	const setActiveElement = (element: ElementRecord) => {
		activeElement = element;
	};
</script>

<main class="periodic-page">
	<section class="hero">
		<p class="eyebrow">Neural Lattice Diagnostics</p>
		<h1>Cybernetic Periodic Grid</h1>
		<p class="lede">
			Hover across the lattice to reveal oxidation signatures, quantum shell distributions, and the neon pulse of
			each element. Designed for fast chemical reconnaissance in low-light laboratories.
		</p>
	</section>

	<section class="interface">
		<div
			class="detail-panel"
			style={`--detail-gradient: ${categoryPalettes[activeElement.category].gradient}; --detail-glow: ${categoryPalettes[activeElement.category].glow};`}
		>
			<div class="detail-grid">
				<div class="symbol-stack">
					<span class="atomic-number">{activeElement.number}</span>
					<span class="symbol">{activeElement.symbol}</span>
					<span class="name">{activeElement.name}</span>
				</div>
				<div class="meta">
					<div class="meta-line">
						<p>Atomic Mass</p>
						<strong>{activeElement.atomicMass}</strong>
					</div>
					<div class="meta-line">
						<p>Group · Period · Block</p>
						<strong>
							{activeElement.group ?? '—'} · {activeElement.period} · {activeElement.block.toUpperCase()}
						</strong>
					</div>
					<div class="meta-line">
						<p>Category</p>
						<strong>{activeElement.category}</strong>
					</div>
				</div>
				<div class="meta">
					<div class="meta-line">
						<p>Oxidation Range</p>
						<strong>{activeElement.oxidationStates}</strong>
					</div>
					<div class="meta-line">
						<p>Quantum Layers</p>
						<strong>{activeElement.shellLabel}</strong>
					</div>
				</div>
				<div class="shell-stream">
					{#each activeElement.shells as electrons, idx}
						<div class="shell-pill" style={`--shell-fill: ${Math.min(electrons * 5, 100)}%;`}>
							<div class="pill-label">
								<span>n{idx + 1}</span>
								<span>{electrons}</span>
							</div>
							<div class="pill-meter">
								<span class="fill"></span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid-shell">
			<div class="grid-background"></div>
			<div class="periodic-grid">
				{#each sortedElements as element}
					<button
						type="button"
						class="element-card"
						style={`grid-column: ${element.gridColumn}; grid-row: ${element.gridRow}; --tile-gradient: ${categoryPalettes[element.category].gradient}; --tile-glow: ${categoryPalettes[element.category].glow};`}
						on:mouseenter={() => setActiveElement(element)}
						on:focus={() => setActiveElement(element)}
						aria-label={`${element.name}, atomic number ${element.number}`}
					>
						<span class="number">{element.number}</span>
						<span class="symbol">{element.symbol}</span>
						<span class="label">{element.name}</span>
					</button>
				{/each}
			</div>

			<div class="legend">
				{#each categoryLegend as item}
					<div class="legend-item">
						<span class="swatch" style={`background-image: ${categoryPalettes[item.category].gradient};`}></span>
						<div>
							<p>{item.category}</p>
							<small>Oxidation: {item.oxidation}</small>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>

<style>
	:global(body) {
		background: radial-gradient(circle at 20% 20%, #092032, #020610 60%);
		color: #eafaff;
		font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
		min-height: 100vh;
	}

	.periodic-page {
		padding: clamp(1.5rem, 3vw, 3.75rem);
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		animation: fadeIn 1.2s ease-out;
	}

	.hero {
		text-align: center;
		max-width: 720px;
		margin: 0 auto;
	}

	.hero .eyebrow {
		letter-spacing: 0.4em;
		text-transform: uppercase;
		color: rgba(120, 232, 255, 0.8);
		font-size: 0.8rem;
		margin-bottom: 0.6rem;
	}

	.hero h1 {
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		margin: 0 0 1rem;
		color: #f4ffff;
		text-shadow: 0 0 30px rgba(102, 240, 255, 0.8);
	}

	.hero .lede {
		color: rgba(221, 245, 255, 0.75);
		font-size: 1rem;
		line-height: 1.7;
		margin: 0;
	}

	.interface {
		display: grid;
		grid-template-columns: minmax(280px, 1fr) 2fr;
		gap: clamp(1.5rem, 2vw, 2.5rem);
		align-items: stretch;
	}

	.detail-panel {
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 1.5rem;
		padding: 1.5rem;
		background: rgba(3, 8, 20, 0.85);
		position: relative;
		overflow: hidden;
		box-shadow: 0 0 25px rgba(0, 195, 255, 0.25);
	}

	.detail-panel::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image: var(--detail-gradient);
		opacity: 0.15;
		filter: blur(12px);
		z-index: 0;
	}

	.detail-grid {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1.25rem;
	}

	.symbol-stack {
		background: rgba(4, 12, 26, 0.8);
		border-radius: 1rem;
		padding: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: 0 0 30px rgba(0, 204, 255, 0.2);
		text-align: center;
	}

	.atomic-number {
		display: block;
		font-size: 1rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 0.5rem;
	}

	.symbol-stack .symbol {
		font-size: clamp(3rem, 6vw, 4.5rem);
		font-weight: 600;
		color: #f9ffff;
	}

	.symbol-stack .name {
		display: block;
		margin-top: 0.35rem;
		letter-spacing: 0.3em;
		font-size: 0.85rem;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.65);
	}

	.meta {
		background: rgba(2, 12, 22, 0.65);
		padding: 1.25rem;
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.meta-line {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-bottom: 0.9rem;
	}

	.meta-line:last-child {
		margin-bottom: 0;
	}

	.meta-line p {
		margin: 0;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: rgba(255, 255, 255, 0.55);
	}

	.meta-line strong {
		font-size: 1rem;
		color: #f6fbff;
		font-weight: 600;
	}

	.shell-stream {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		background: rgba(5, 16, 32, 0.75);
		border-radius: 1rem;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.shell-pill {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.shell-pill .pill-label {
		display: flex;
		justify-content: space-between;
		text-transform: uppercase;
		font-size: 0.85rem;
		letter-spacing: 0.2em;
		color: rgba(255, 255, 255, 0.7);
	}

	.shell-pill .pill-meter {
		height: 6px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 999px;
		overflow: hidden;
	}

	.shell-pill .pill-meter .fill {
		display: block;
		height: 100%;
		width: var(--shell-fill);
		background: linear-gradient(90deg, rgba(0, 255, 234, 0.9), rgba(128, 64, 255, 0.9));
		box-shadow: 0 0 12px rgba(64, 249, 255, 0.7);
		transition: width 0.4s ease;
	}

	.grid-shell {
		position: relative;
		border-radius: 1.5rem;
		padding: clamp(1rem, 2vw, 1.5rem);
		background: rgba(1, 7, 15, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.grid-background {
		position: absolute;
		inset: 1.5rem;
		border-radius: 1rem;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(180deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 60px 60px;
		filter: drop-shadow(0 0 14px rgba(0, 255, 247, 0.2));
		animation: gridPulse 12s linear infinite;
	}

	.periodic-grid {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(18, minmax(40px, 1fr));
		grid-template-rows: repeat(9, minmax(50px, 74px));
		gap: 0.35rem;
	}

	.element-card {
		position: relative;
		background-image: var(--tile-gradient);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.75rem;
		padding: 0.35rem 0.4rem 0.5rem;
		text-align: left;
		color: #fff;
		text-shadow: 0 0 8px rgba(0, 0, 0, 0.45);
		transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
		box-shadow: 0 0 15px rgba(2, 244, 255, 0.25);
	}

	.element-card:hover,
	.element-card:focus-visible {
		transform: translateY(-4px) scale(1.04);
		border-color: rgba(255, 255, 255, 0.4);
		box-shadow: 0 0 25px var(--tile-glow), 0 0 45px rgba(0, 255, 247, 0.25);
		outline: none;
	}

	.element-card .number {
		display: block;
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.85);
	}

	.element-card .symbol {
		display: block;
		font-size: clamp(1rem, 3vw, 1.65rem);
		font-weight: 600;
		margin: 0.15rem 0 0.1rem;
	}

	.element-card .label {
		display: block;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.8);
	}

	.legend {
		position: relative;
		z-index: 1;
		margin-top: 1.25rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.legend-item {
		display: flex;
		gap: 0.8rem;
		align-items: center;
		background: rgba(0, 7, 18, 0.7);
		padding: 0.75rem 1rem;
		border-radius: 0.85rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.legend-item p {
		margin: 0;
		font-weight: 600;
		color: #f7fbff;
	}

	.legend-item small {
		display: block;
		color: rgba(255, 255, 255, 0.65);
		margin-top: 0.25rem;
		letter-spacing: 0.1em;
		font-size: 0.7rem;
	}

	.swatch {
		width: 34px;
		height: 34px;
		border-radius: 0.6rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 0 16px rgba(255, 255, 255, 0.25);
	}

	@keyframes gridPulse {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(60px, 60px, 0);
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 1100px) {
		.interface {
			grid-template-columns: 1fr;
		}

		.periodic-grid {
			grid-template-rows: repeat(9, minmax(50px, 80px));
		}
	}

	@media (max-width: 640px) {
		.periodic-grid {
			grid-template-columns: repeat(9, minmax(40px, 1fr));
		}

		.element-card {
			padding: 0.35rem;
		}

		.legend {
			grid-template-columns: repeat(1, minmax(150px, 1fr));
		}
	}
</style>
