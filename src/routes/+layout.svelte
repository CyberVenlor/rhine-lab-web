<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
	/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

{@render children?.()}

<style>
	@font-face {
		font-family: 'Aux Mono';
		src: url('/fonts/aux-mono/Aux%20Mono.ttf') format('truetype'),
			url('/fonts/aux-mono/Aux%20Mono.otf') format('opentype');
		font-weight: 400;
		font-style: normal;
		font-display: swap;
	}

	:global(html),
	:global(body) {
		background-color: #000;
		min-height: 100%;
		font-family: 'Aux Mono', 'Courier New', monospace;
		line-height: 1.1;
		margin: 0;
		letter-spacing: 0;
	}

	:global(h1),
	:global(h2),
	:global(h3),
	:global(h4),
	:global(h5),
	:global(h6) {
		/* margin: 1;
		line-height: 1.1;
		letter-spacing: 0; */
	}
</style>
