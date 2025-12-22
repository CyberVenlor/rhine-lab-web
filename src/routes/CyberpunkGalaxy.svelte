<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement | null = null;
	let cleanup: (() => void) | null = null;

	const pointer = { x: 0, y: 0 };

	onMount(() => {
		if (!container) {
			return;
		}

		const scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2('#030310', 0.06);

		const camera = new THREE.PerspectiveCamera(
			60,
			container.clientWidth / container.clientHeight,
			0.1,
			100
		);
		camera.position.set(0, 1.2, 7);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const galaxy = createGalaxy();
		scene.add(galaxy);

		const halo = createHalo();
		scene.add(halo);

		const neonGrid = createNeonGrid();
		scene.add(neonGrid);

		scene.add(new THREE.AmbientLight('#50d8ff', 0.7));
		const rimLight = new THREE.DirectionalLight('#ff5de6', 1.2);
		rimLight.position.set(-5, 4, 3);
		scene.add(rimLight);

		const handlePointerMove = (event: PointerEvent) => {
			pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
		};
		window.addEventListener('pointermove', handlePointerMove);

		const handleResize = () => {
			if (!container) {
				return;
			}
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		};

		let resizeObserver: ResizeObserver | null = null;
		const ResizeObserverCtor =
			typeof window !== 'undefined' ? window.ResizeObserver : undefined;

		if (ResizeObserverCtor) {
			resizeObserver = new ResizeObserverCtor(handleResize);
			resizeObserver.observe(container);
		} else {
			window.addEventListener('resize', handleResize);
		}

		const clock = new THREE.Clock();
		let animationFrame: number;

		const renderLoop = () => {
			const elapsed = clock.getElapsedTime();

			galaxy.rotation.y += 0.001 + pointer.x * 0.002;
			galaxy.rotation.x += (pointer.y * 0.25 - galaxy.rotation.x) * 0.02;
			halo.rotation.y += 0.0005;

			neonGrid.position.y = Math.sin(elapsed * 0.5) * 0.1 - 1.5;
			neonGrid.rotation.y += 0.0008;

			camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.02;
			camera.lookAt(0, 0, 0);

			renderer.render(scene, camera);
			animationFrame = requestAnimationFrame(renderLoop);
		};

		renderLoop();

		cleanup = () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('pointermove', handlePointerMove);
			if (resizeObserver) {
				resizeObserver.disconnect();
			} else {
				window.removeEventListener('resize', handleResize);
			}
			scene.remove(galaxy, halo, neonGrid);
			disposeObject(halo);
			disposeObject(neonGrid);
			disposePoints(galaxy);
			renderer.dispose();
			if (container?.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	});

	onDestroy(() => {
		cleanup?.();
	});

	function createGalaxy() {
		const geometry = new THREE.BufferGeometry();
		const starCount = 6000;
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);
		const colorInside = new THREE.Color('#4ee8ff');
		const colorOutside = new THREE.Color('#ff0ddc');

		for (let i = 0; i < starCount; i += 1) {
			const i3 = i * 3;
			const radius = Math.random() * 5;
			const spinAngle = radius * 1.5;
			const branchAngle = ((i % 5) / 5) * Math.PI * 2;
			const randomOffset = () => Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1);

			const x = Math.cos(branchAngle + spinAngle) * radius + randomOffset() * 0.2;
			const y = randomOffset() * 0.3;
			const z = Math.sin(branchAngle + spinAngle) * radius + randomOffset() * 0.2;

			positions[i3] = x;
			positions[i3 + 1] = y * 0.5;
			positions[i3 + 2] = z;

			const mixedColor = colorInside.clone();
			mixedColor.lerp(colorOutside, radius / 5);

			colors[i3] = mixedColor.r;
			colors[i3 + 1] = mixedColor.g;
			colors[i3 + 2] = mixedColor.b;
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 0.035,
			sizeAttenuation: true,
			depthWrite: false,
			vertexColors: true,
			transparent: true,
			alphaTest: 0.02,
			map: createParticleTexture(),
			blending: THREE.AdditiveBlending
		});

		return new THREE.Points(geometry, material);
	}

	function createHalo() {
		const geometry = new THREE.RingGeometry(2.5, 3.5, 128);
		const material = new THREE.MeshBasicMaterial({
			color: '#2bf4ff',
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.35
		});

		const halo = new THREE.Mesh(geometry, material);
		halo.rotation.x = Math.PI / 2;
		return halo;
	}

	function createNeonGrid() {
		const grid = new THREE.Group();
		const gridMaterial = new THREE.LineBasicMaterial({
			color: '#52fffb',
			transparent: true,
			opacity: 0.2
		});

		const size = 20;
		const divisions = 30;
		const step = (size * 2) / divisions;

		for (let i = -divisions / 2; i <= divisions / 2; i += 1) {
			const geometry = new THREE.BufferGeometry().setFromPoints([
				new THREE.Vector3(i * step, 0, -size),
				new THREE.Vector3(i * step, 0, size)
			]);
			const line = new THREE.Line(geometry, gridMaterial);
			grid.add(line);
		}

		for (let i = -divisions / 2; i <= divisions / 2; i += 1) {
			const geometry = new THREE.BufferGeometry().setFromPoints([
				new THREE.Vector3(-size, 0, i * step),
				new THREE.Vector3(size, 0, i * step)
			]);
			const line = new THREE.Line(geometry, gridMaterial);
			grid.add(line);
		}

		grid.position.y = -1.5;
		return grid;
	}

	function createParticleTexture() {
		const size = 64;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return null;
		}

		const gradient = ctx.createRadialGradient(
			size / 2,
			size / 2,
			0,
			size / 2,
			size / 2,
			size / 2
		);
		gradient.addColorStop(0, 'rgba(255,255,255,1)');
		gradient.addColorStop(0.2, 'rgba(81,255,249,0.8)');
		gradient.addColorStop(1, 'rgba(255,13,220,0)');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, size, size);

		const texture = new THREE.CanvasTexture(canvas);
		return texture;
	}

	function disposeObject(object: THREE.Object3D) {
		object.traverse((child: THREE.Object3D) => {
			const geometry = (child as THREE.Mesh | THREE.Line | THREE.Points).geometry;
			const material = (child as THREE.Mesh | THREE.Line | THREE.Points).material;

			geometry?.dispose();

			if (Array.isArray(material)) {
				material.forEach((mat: THREE.Material) => mat.dispose());
			} else {
				material?.dispose();
			}
		});
	}

	function disposePoints(points: THREE.Points) {
		points.geometry.dispose();
		if (Array.isArray(points.material)) {
			points.material.forEach((mat: THREE.Material) => mat.dispose());
		} else {
			points.material.dispose();
		}
	}
</script>

<section class="galaxy-panel">
	<div class="content">
		<p class="eyebrow">Rhine-Lab // Starlight Research Initiative</p>
		<h2>Neon Singularity</h2>
		<p>
			Interact with the synthetic galaxy used by Rhine-Lab navigators to simulate extra-dimensional
			trajectories. Drag your pointer to bend the spiral arms and feel the chronal drift.
		</p>
	</div>
	<div class="canvas-wrapper" bind:this={container} aria-label="Cyberpunk galaxy visualization"></div>
</section>

<style>
	:global(body) {
		background: radial-gradient(circle at top, #0d0022, #03020a 60%, #010102);
		color: #e6faff;
		font-family: 'Space Grotesk', 'Segoe UI', system-ui, sans-serif;
		min-height: 100vh;
	}

	.galaxy-panel {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2.5rem;
		align-items: center;
		padding: clamp(2rem, 5vw, 4rem);
		background: rgba(3, 3, 15, 0.8);
		border: 1px solid rgba(107, 213, 255, 0.2);
		border-radius: 24px;
		box-shadow: 0 20px 50px rgba(0, 10, 25, 0.6);
		backdrop-filter: blur(8px);
	}

	.content h2 {
		font-size: clamp(2rem, 4vw, 3.5rem);
		margin: 0.3rem 0 1rem;
		color: #a8f8ff;
		text-shadow: 0 0 15px rgba(79, 255, 239, 0.6);
	}

	.eyebrow {
		letter-spacing: 0.2em;
		font-size: 0.75rem;
		color: rgba(148, 255, 249, 0.8);
		text-transform: uppercase;
	}

	.content p {
		max-width: 48ch;
		color: rgba(214, 249, 255, 0.8);
		line-height: 1.7;
	}

	.canvas-wrapper {
		width: 100%;
		min-height: 420px;
		aspect-ratio: 4 / 3;
		background: radial-gradient(circle at 30% 20%, rgba(84, 0, 94, 0.5), transparent 70%);
		border-radius: 18px;
		overflow: hidden;
		border: 1px solid rgba(80, 255, 253, 0.2);
		position: relative;
		box-shadow: inset 0 0 30px rgba(0, 255, 245, 0.1), 0 0 35px rgba(255, 16, 194, 0.2);
	}

	:global(.canvas-wrapper canvas) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
</style>
