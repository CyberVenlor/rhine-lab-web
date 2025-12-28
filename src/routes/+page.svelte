<script lang="ts">
	import Light from '$lib/components/light.svelte';
</script>

<svelte:head>
	<title>NERV Light Control</title>
	<meta
		name="description"
		content="Cyberpunk control surface for the NERV light relay with live telemetry."
	/>
</svelte:head>

<main class="landing">
	<Light />
</main>

<style>
	.landing {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
