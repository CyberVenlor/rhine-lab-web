<script lang="ts">
	import CyberpunkGalaxy from './CyberpunkGalaxy.svelte';
</script>

<main class="page">
	<header>
		<h1>Rhine-Lab Experimental Console</h1>
		<p>Initiating stellar rendering suite...</p>
	</header>
	<CyberpunkGalaxy />
</main>

<style>
	.page {
		max-width: 1200px;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 4rem);
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	header h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3.2rem);
		color: #c5f5ff;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	header p {
		margin: 0.5rem 0 0;
		color: rgba(198, 248, 255, 0.75);
		letter-spacing: 0.2em;
		font-size: 0.85rem;
		text-transform: uppercase;
	}
</style>
