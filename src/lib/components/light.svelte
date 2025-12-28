<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	type LightState = 'on' | 'off';
	type ConnectionState = 'disconnected' | 'connecting' | 'online' | 'error';
	type StatePayload = { type: 'state'; state: LightState };

	const stateCopy: Record<LightState, string> = {
		on: 'Photon surge engaged',
		off: 'Power rails idle'
	};

	const connectionBadge: Record<ConnectionState, string> = {
		disconnected: 'link lost',
		online: 'neural uplink stable',
		connecting: 'dialing grid',
		error: 'signal corrupted'
	};

	let lightState: LightState = 'off';
	let connectionStatus: ConnectionState = 'disconnected';
	let lastSignal: string | null = null;
	let pulseKey = 0;
	let websocket: WebSocket | null = null;
	let reconnectHandle: ReturnType<typeof setTimeout> | null = null;

	const resolveWsUrl = () => {
		if (!browser) return '';
		if (import.meta.env.VITE_LIGHT_WS_URL) {
			return import.meta.env.VITE_LIGHT_WS_URL;
		}
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const host = window.location.host;
		return `${protocol}//${host}/ws`;
	};

	const cleanup = () => {
		websocket?.close();
		websocket = null;
		if (reconnectHandle) {
			clearTimeout(reconnectHandle);
			reconnectHandle = null;
		}
	};

	onMount(() => {
		if (browser) {
			connect();
		}
		return cleanup;
	});

	onDestroy(cleanup);

	const connect = () => {
		if (!browser) {
			return;
		}
		cleanup();
		connectionStatus = 'connecting';
		try {
			websocket = new WebSocket(resolveWsUrl());
		} catch (err) {
			console.error('failed to create websocket', err);
			connectionStatus = 'error';
			queueReconnect();
			return;
		}

		websocket.addEventListener('open', () => {
			connectionStatus = 'online';
		});

		websocket.addEventListener('message', (event) => {
			try {
				const payload: StatePayload = JSON.parse(event.data);
				if (payload?.type === 'state' && (payload.state === 'on' || payload.state === 'off')) {
					handleStateUpdate(payload.state);
				}
			} catch (err) {
				console.warn('bad payload from backend', err);
			}
		});

		websocket.addEventListener('close', () => {
			connectionStatus = 'disconnected';
			queueReconnect();
		});

		websocket.addEventListener('error', () => {
			connectionStatus = 'error';
		});
	};

	const queueReconnect = () => {
		if (!browser) return;
		if (reconnectHandle) {
			clearTimeout(reconnectHandle);
		}
		reconnectHandle = setTimeout(() => {
			connectionStatus = 'connecting';
			connect();
		}, 2500);
	};

	const handleStateUpdate = (state: LightState) => {
		lightState = state;
		lastSignal = new Date().toLocaleTimeString();
		pulseKey += 1;
	};

	const sendCommand = (command: 'toggle' | 'on' | 'off') => {
		if (!websocket || websocket.readyState !== WebSocket.OPEN) {
			return;
		}
		websocket.send(command);
	};

	const toggleLight = () => sendCommand('toggle');
	const forceOn = () => sendCommand('on');
	const forceOff = () => sendCommand('off');
</script>

<section class="light-scene">
	<div class="scanline" aria-hidden="true"></div>
	<div class="grid" aria-hidden="true"></div>
	<div class="light-shell" data-state={lightState}>
		<header>
			<span class="badge">NERV LIGHT</span>
			<span class={`connection ${connectionStatus}`}>
				{connectionBadge[connectionStatus]}
			</span>
		</header>

		<div class="holo-ring" data-pulse={pulseKey}>
			<div class="ring"></div>
			<div class="ring inner"></div>
			<div class="ring core"></div>
			<div class={`state-chip ${lightState}`}>{lightState}</div>
		</div>

		<p class="state-copy">{stateCopy[lightState]}</p>

		<div class="telemetry">
			<div>
				<span class="metric-label">last signal</span>
				<strong>{lastSignal ?? 'waiting...'}</strong>
			</div>
			<div>
				<span class="metric-label">flux channel</span>
				<strong class={lightState}>{lightState === 'on' ? '0xFF-A3' : '0x00-00'}</strong>
			</div>
			<div>
				<span class="metric-label">uplink</span>
				<strong>{connectionStatus}</strong>
			</div>
		</div>

		<div class="actions">
			<button class="primary" on:click={toggleLight} disabled={connectionStatus !== 'online'}>
				{lightState === 'on' ? 'power down' : 'ignite pulse'}
			</button>
			<button class="ghost" on:click={forceOn} disabled={connectionStatus !== 'online'}>
				force on
			</button>
			<button class="ghost" on:click={forceOff} disabled={connectionStatus !== 'online'}>
				force off
			</button>
		</div>
	</div>
</section>

<style>
	:global(html, body) {
		margin: 0;
		height: 100%;
		overflow: hidden;
		touch-action: none;
		background: radial-gradient(circle at top, #311f54 0%, #05030a 45%, #010101 100%);
	}

	:global(body) {
		margin: 0;
		font-family: 'JetBrains Mono', 'Share Tech Mono', 'Space Grotesk', system-ui, sans-serif;
		min-height: 100%;
		color: #f5f5ff;
	}

	.light-scene {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		overflow: hidden;
	}

	.scanline {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			rgba(255, 255, 255, 0.04),
			rgba(255, 255, 255, 0.04) 2px,
			transparent 2px,
			transparent 4px
		);
		mix-blend-mode: screen;
		animation: drift 6s linear infinite;
	}

	.grid {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(rgba(0, 255, 255, 0.06) 1px, transparent 1px),
			linear-gradient(90deg, rgba(180, 0, 255, 0.08) 1px, transparent 1px);
		background-size: 80px 80px;
		opacity: 0.3;
		transform: perspective(400px) rotateX(60deg) scale(1.4);
		filter: blur(1px);
	}

	.light-shell {
		position: relative;
		width: min(520px, 90vw);
		padding: 2.5rem;
		background: rgba(5, 5, 15, 0.85);
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow:
			0 0 60px rgba(146, 44, 255, 0.35),
			inset 0 0 40px rgba(74, 236, 221, 0.12);
		border-radius: 1.5rem;
		backdrop-filter: blur(12px);
		overflow: hidden;
	}

	.light-shell::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(120deg, rgba(255, 0, 138, 0.25), rgba(0, 255, 213, 0.18));
		opacity: 0.35;
		filter: blur(40px);
		pointer-events: none;
	}

	header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 0.9rem;
	}

	.badge {
		color: #00ffd5;
		font-weight: 700;
	}

	.connection {
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		font-size: 0.75rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.connection.online {
		color: #00ffc8;
		box-shadow: 0 0 20px rgba(0, 255, 200, 0.4);
	}

	.connection.connecting {
		color: #ffaa33;
	}

	.connection.disconnected,
	.connection.error {
		color: #ff3b7f;
	}

	.holo-ring {
		position: relative;
		height: 200px;
		display: grid;
		place-items: center;
		margin-bottom: 1.5rem;
	}

	.holo-ring[data-pulse] .ring {
		animation: rotate 28s linear infinite;
	}

	.ring {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 2px solid rgba(0, 255, 221, 0.25);
		box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
	}

	.ring.inner {
		width: 70%;
		height: 70%;
		border-color: rgba(255, 0, 221, 0.28);
		animation-direction: reverse;
	}

	.ring.core {
		width: 45%;
		height: 45%;
		border-color: rgba(255, 255, 255, 0.35);
	}

	.state-chip {
		position: relative;
		padding: 0.8rem 2rem;
		border-radius: 999px;
		text-transform: uppercase;
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		backdrop-filter: blur(6px);
		border: 1px solid rgba(255, 255, 255, 0.4);
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.25);
	}

	.state-chip.on {
		color: #8affff;
		text-shadow: 0 0 20px rgba(79, 255, 227, 0.8);
	}

	.state-chip.off {
		color: #ff6fb7;
		text-shadow: 0 0 20px rgba(255, 0, 128, 0.6);
	}

	.state-copy {
		position: relative;
		margin: 0 0 2rem;
		font-size: 1.05rem;
		letter-spacing: 0.05em;
		color: rgba(245, 245, 255, 0.85);
	}

	.telemetry {
		position: relative;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
		text-transform: uppercase;
		font-size: 0.8rem;
	}

	.telemetry .metric-label {
		color: rgba(255, 255, 255, 0.6);
		letter-spacing: 0.2em;
		display: block;
		margin-bottom: 0.3rem;
		text-transform: uppercase;
	}

	.telemetry strong {
		font-size: 1rem;
		letter-spacing: 0.1em;
	}

	.telemetry strong.on {
		color: #8affff;
	}

	.telemetry strong.off {
		color: #ff68a0;
	}

	.actions {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-top: 1rem;
	}

	button {
		flex: 1;
		padding: 0.9rem 1.2rem;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-weight: 700;
		border: none;
		background: transparent;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	button.primary {
		background: linear-gradient(120deg, #ff00e5, #00ffd5);
		color: #050505;
		box-shadow: 0 10px 25px rgba(0, 255, 221, 0.4);
	}

	button.ghost {
		border: 1px solid rgba(255, 255, 255, 0.35);
		color: #f5f5ff;
	}

	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		box-shadow: none;
	}

	button:not(:disabled):hover {
		transform: translateY(-2px) scale(1.01);
		box-shadow: 0 15px 35px rgba(255, 0, 234, 0.35);
	}

	@keyframes drift {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-15px);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 540px) {
		.light-shell {
			padding: 1.5rem;
		}

		header {
			flex-direction: column;
		}

		button {
			flex-basis: 100%;
		}
	}
</style>
