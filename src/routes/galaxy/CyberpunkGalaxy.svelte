<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Group, Material, Mesh, Object3D } from 'three';
	import copperModel from '$lib/assets/models/copper.obj?url';
	import gearModel from '$lib/assets/models/gear.obj?url';
	import gpuModel from '$lib/assets/models/gpu.obj?url';
	import mcbModel from '$lib/assets/models/mcb.obj?url';

	type ThreeModule = typeof import('three');
	type OBJLoaderModule = typeof import('three/examples/jsm/loaders/OBJLoader.js');

	type LoadedModel = {
		group: Group;
		spinX: number;
		spinY: number;
		baseX: number;
		baseY: number;
		floatOffset: number;
	};

	const modelAssets = [copperModel, gearModel, gpuModel, mcbModel];
	const modelColors = ['#91f7ff', '#4cc9ff', '#b6fbff', '#67d7ff'];

	let container: HTMLDivElement | null = null;
	let cleanup: (() => void) | null = null;

	onMount(async () => {
		if (typeof window === 'undefined' || !container) {
			return;
		}

		const THREE: ThreeModule = await import('three');
		const { OBJLoader }: OBJLoaderModule = await import('three/examples/jsm/loaders/OBJLoader.js');

		const scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2('#020304', 0.05);

		const camera = new THREE.PerspectiveCamera(
			42,
			container.clientWidth / container.clientHeight,
			0.1,
			120
		);
		camera.position.set(0, 0, 16);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		container.appendChild(renderer.domElement);

		const ambientLight = new THREE.AmbientLight('#a8eeff', 0.65);
		const keyLight = new THREE.DirectionalLight('#7fdfff', 1.1);
		keyLight.position.set(4, 6, 10);
		const fillLight = new THREE.DirectionalLight('#0f5d82', 0.45);
		fillLight.position.set(-6, -2, 4);
		scene.add(ambientLight, keyLight, fillLight);

		const loader = new OBJLoader();
		const loadedModels = await Promise.all(
			modelAssets.map(async (asset, index) => {
				const obj = await loader.loadAsync(asset);
				const group = normalizeModel(obj, THREE, modelColors[index]);
				const baseX = index % 2 === 0 ? -3.4 : 3.4;
				const baseY = 6 - index * 4.2;
				const loadedModel: LoadedModel = {
					group,
					spinX: 0.002 + index * 0.00035,
					spinY: 0.0035 + index * 0.00045,
					baseX,
					baseY,
					floatOffset: index * 0.9
				};

				group.position.set(baseX, baseY, -2 - index * 0.6);
				group.rotation.set(index * 0.4, index % 2 === 0 ? -0.55 : 0.55, index * 0.18);
				scene.add(group);
				return loadedModel;
			})
		);

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

		let scrollProgress = 0;
		const updateScrollProgress = () => {
			const maxScroll = Math.max(
				document.documentElement.scrollHeight - window.innerHeight,
				window.innerHeight
			);
			scrollProgress = window.scrollY / maxScroll;
		};
		updateScrollProgress();
		window.addEventListener('scroll', updateScrollProgress, { passive: true });

		const clock = new THREE.Clock();
		let animationFrame = 0;

		const renderLoop = () => {
			const elapsed = clock.getElapsedTime();
			const scrollRotation = scrollProgress * Math.PI * 2.6;

			for (const [index, model] of loadedModels.entries()) {
				model.group.rotation.x += model.spinX;
				model.group.rotation.y = scrollRotation * (0.6 + index * 0.16) + elapsed * model.spinY;
				model.group.rotation.z = Math.sin(elapsed * 0.35 + model.floatOffset) * 0.2;
				model.group.position.x = model.baseX + Math.sin(elapsed * 0.4 + model.floatOffset) * 0.18;
				model.group.position.y = model.baseY - scrollProgress * 2.8 +
					Math.sin(elapsed * 0.55 + model.floatOffset) * 0.28;
			}

			camera.position.y += ((scrollProgress - 0.5) * -1.8 - camera.position.y) * 0.06;
			camera.lookAt(0, 0, -2);

			renderer.render(scene, camera);
			animationFrame = requestAnimationFrame(renderLoop);
		};

		renderLoop();

		cleanup = () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('scroll', updateScrollProgress);
			if (resizeObserver) {
				resizeObserver.disconnect();
			} else {
				window.removeEventListener('resize', handleResize);
			}
			for (const model of loadedModels) {
				scene.remove(model.group);
				disposeObject(model.group);
			}
			renderer.dispose();
			if (container?.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	});

	onDestroy(() => {
		cleanup?.();
	});

	function normalizeModel(object: Group, THREE: ThreeModule, color: string) {
		const box = new THREE.Box3().setFromObject(object);
		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());
		const maxDimension = Math.max(size.x, size.y, size.z) || 1;
		const scale = 3.1 / maxDimension;

		object.position.sub(center);
		object.scale.setScalar(scale);

		object.traverse((child: Object3D) => {
			const mesh = child as Mesh;
			if (!mesh.isMesh || !mesh.geometry) {
				return;
			}

			mesh.material = new THREE.MeshStandardMaterial({
				color,
				wireframe: true,
				transparent: true,
				opacity: 0.42,
				metalness: 0.15,
				roughness: 0.45
			});
		});

		return object;
	}

	function disposeObject(object: Object3D) {
		object.traverse((child: Object3D) => {
			const mesh = child as Object3D & { geometry?: { dispose: () => void }; material?: Material | Material[] };
			mesh.geometry?.dispose();

			if (Array.isArray(mesh.material)) {
				mesh.material.forEach((material: Material) => material.dispose());
			} else {
				mesh.material?.dispose();
			}
		});
	}
</script>

<section class="galaxy-panel">
	<div class="scene-background" bind:this={container} aria-hidden="true"></div>
	<div class="content">
		<p class="eyebrow">Rhine-Lab // Hardware Constellation Field</p>
		<h2>OBJ Drift Array</h2>
		<p>
			Four hardware artifacts are suspended as a background field, stacked from top to bottom and
			alternating across the frame. Their rotation rate responds to page scroll so the scene keeps
			moving as the console descends.
		</p>
	</div>
</section>

<style>
	:global(body) {
		background:
			radial-gradient(circle at top, rgba(18, 32, 38, 0.22), transparent 26%),
			linear-gradient(180deg, #040607 0%, #010102 32%, #000000 100%);
		color: #e6f7ff;
		min-height: 220vh;
	}

	.galaxy-panel {
		position: relative;
		min-height: 200vh;
		padding: clamp(2rem, 4vw, 4rem);
		overflow: clip;
	}

	.scene-background {
		position: fixed;
		inset: 0;
		z-index: 0;
		background:
			radial-gradient(circle at 20% 10%, rgba(77, 140, 153, 0.08), transparent 24%),
			radial-gradient(circle at 80% 30%, rgba(59, 107, 117, 0.06), transparent 28%),
			linear-gradient(180deg, rgba(3, 8, 10, 0.85), rgba(0, 0, 0, 0.96));
	}

	.content {
		position: relative;
		z-index: 1;
		max-width: 34rem;
		padding-top: clamp(8rem, 14vh, 11rem);
	}

	.content h2 {
		margin: 0.4rem 0 1rem;
		font-size: clamp(2.4rem, 5vw, 4.8rem);
		color: #d9fbff;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.eyebrow {
		margin: 0;
		letter-spacing: 0.22em;
		font-size: 0.72rem;
		color: rgba(176, 235, 244, 0.74);
		text-transform: uppercase;
	}

	.content p {
		margin: 0;
		color: rgba(219, 241, 245, 0.76);
		line-height: 1.65;
		font-size: clamp(0.98rem, 1.6vw, 1.08rem);
	}

	:global(.scene-background canvas) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	
	@media (max-width: 700px) {
		:global(body) {
			min-height: 180vh;
		}

		.galaxy-panel {
			min-height: 170vh;
		}

		.content {
			max-width: 100%;
			padding-top: 6.5rem;
		}
	}
</style>
