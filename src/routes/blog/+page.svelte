<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
	import copperUrl from '$lib/assets/models/copper.obj?url';
	import gearUrl from '$lib/assets/models/gear.obj?url';
	import gpuUrl from '$lib/assets/models/gpu.obj?url';
	import mcbUrl from '$lib/assets/models/mcb.obj?url';

	type ProfileCard = {
		eyebrow: string;
		title: string;
		body: string;
		meta?: string[];
		variant?: 'standard' | 'pixel';
	};

	type GhostCard = {
		eyebrow: string;
		title: string;
		body: string;
	};

	type HeartDrop = {
		id: number;
		left: string;
		delay: string;
		duration: string;
		size: string;
	};

	const heartDrops: HeartDrop[] = [
		{ id: 1, left: '6%', delay: '-0.4s', duration: '4.8s', size: '0.95rem' },
		{ id: 2, left: '10%', delay: '-1.2s', duration: '5.1s', size: '1.05rem' },
		{ id: 3, left: '14%', delay: '-2.1s', duration: '4.6s', size: '0.9rem' },
		{ id: 4, left: '18%', delay: '-0.9s', duration: '5.4s', size: '1.2rem' },
		{ id: 5, left: '22%', delay: '-1.7s', duration: '4.9s', size: '1rem' },
		{ id: 6, left: '27%', delay: '-2.8s', duration: '5.2s', size: '1.3rem' },
		{ id: 7, left: '32%', delay: '-0.2s', duration: '4.7s', size: '0.88rem' },
		{ id: 8, left: '37%', delay: '-1.5s', duration: '5.5s', size: '1.1rem' },
		{ id: 9, left: '42%', delay: '-2.4s', duration: '4.8s', size: '1.35rem' },
		{ id: 10, left: '47%', delay: '-0.7s', duration: '5s', size: '0.96rem' },
		{ id: 11, left: '52%', delay: '-1.9s', duration: '5.3s', size: '1.15rem' },
		{ id: 12, left: '57%', delay: '-2.7s', duration: '4.7s', size: '1rem' },
		{ id: 13, left: '62%', delay: '-0.5s', duration: '5.4s', size: '1.25rem' },
		{ id: 14, left: '67%', delay: '-1.3s', duration: '4.9s', size: '0.92rem' },
		{ id: 15, left: '72%', delay: '-2s', duration: '5.1s', size: '1.08rem' },
		{ id: 16, left: '77%', delay: '-2.9s', duration: '4.6s', size: '1.22rem' },
		{ id: 17, left: '82%', delay: '-0.8s', duration: '5.2s', size: '0.98rem' },
		{ id: 18, left: '87%', delay: '-1.6s', duration: '4.8s', size: '1.4rem' },
		{ id: 19, left: '91%', delay: '-2.3s', duration: '5.3s', size: '1.05rem' },
		{ id: 20, left: '95%', delay: '-1s', duration: '4.7s', size: '0.9rem' }
	];

	const quickFacts: ProfileCard[] = [
		{
			eyebrow: 'Identity',
			title: 'Wang Zicheng',
			body: 'High school student at Nanjing Foreign Language School (NFLS)',
			meta: ['Class of 2027', 'Computer Engineering applicant']
		},
		{
			eyebrow: 'School',
			title: 'Academic Environment',
			body: 'Nanjing Foreign Language School',
			meta: ['Mathematics', 'Physics', 'Computer science', 'Chemistry']
		},
		{
			eyebrow: 'Focus',
			title: 'Current Direction',
			body: 'Interested in hardware systems, embedded computing, and intelligent devices',
			meta: ['Hardware-software integration', 'Systems thinking']
		}
	];

	const sections: ProfileCard[] = [
		{
			eyebrow: 'Main Profile',
			title: 'Academic foundation and direction',
			body: 'I am Wang Zicheng, a student in the Class of 2027 at Nanjing Foreign Language School. My academic focus is mathematics, physics, computer science, and engineering, with a long-term interest in building complete systems rather than isolated components.',
			meta: ['NFLS', 'Class of 2027', 'Academic profile']
		},
		{
			eyebrow: 'Major',
			title: 'Computer Engineering as the core path',
			body: 'My intended university major is Computer Engineering. I want to study embedded systems, hardware-software co-design, computer architecture, communication systems, intelligent sensors, cyber-physical systems, robotics, and autonomous systems in a rigorous engineering context.',
			meta: ['Embedded systems', 'Computer architecture', 'Robotics'],
			variant: 'pixel'
		},
		{
			eyebrow: 'Awards',
			title: 'Competition and academic results',
			body: 'Selected recognitions include AMC 12 A/B AIME qualification, BMO Gold, CCC Gold, Physics Bowl Component 2 Gold, SMC Gold, ACSL Round 3, RobotMaster national finals qualification, Global Game Jam Top 1% Project, EPQ graded A*, and an IELTS score of 7.5.',
			meta: ['AMC 12', 'BMO Gold', 'CCC Gold', 'RobotMaster nationals'],
			variant: 'pixel'
		},
		{
			eyebrow: 'Professional Interests',
			title: 'Technical work across hardware and software',
			body: 'My work is centered on systems that combine software, electronics, communication, and deployment. I use Rust, C++, C#, and Python, and I have practical interest in ESP32, Raspberry Pi, microcontrollers, backend services, Linux systems, networking, CAD, PCB design, electronics prototyping, and collaborative development workflows with Git.',
			meta: ['Rust', 'Embedded systems', 'Networking', 'Git collaboration', 'CAD']
		},
		{
			eyebrow: 'Projects',
			title: 'Independent engineering and programming practice',
			body: 'I have developed embedded and IoT systems using ESP32 and Raspberry Pi, built backend and networked systems in Rust, and designed hardware modules involving sensors and communication devices. I am especially interested in end-to-end system building where hardware and software are designed together.',
			meta: ['ESP32', 'Raspberry Pi', 'Backend services', 'Sensors']
		},
		{
			eyebrow: 'Creative Work',
			title: 'Games, simulation, and procedural systems',
			body: 'Beyond engineering systems, I am interested in game development with Unity and Godot. I explore procedural systems, physics simulation, and experimental gameplay design, and I have participated in Global Game Jam to build prototype projects in a collaborative setting.',
			meta: ['Unity', 'Godot', 'Procedural systems']
		},
		{
			eyebrow: 'Interests',
			title: 'What I return to outside formal coursework',
			body: 'My personal interests include mathematical and physics competitions, electronics and maker projects, game design, simulation systems, and engineering prototyping. I am motivated by turning mathematical and physical principles into practical systems that can be tested and built.',
			meta: ['Math competitions', 'Electronics', 'Simulation', 'Prototyping']
		},
		{
			eyebrow: 'Traits',
			title: 'How I approach engineering problems',
			body: 'I am most interested in designing complex systems that integrate hardware design, embedded computing, networking, and intelligent algorithms. That requires structured problem-solving, system design discipline, and a willingness to move between theory, implementation, and prototyping.',
			meta: ['Problem solving', 'System design', 'Cross-disciplinary work'],
			variant: 'pixel'
		},
		{
			eyebrow: 'AI Perspective',
			title: 'AI as an engineering tool',
			body: 'I view AI as a practical engineering tool that can augment human capability in software development, system design, and rapid prototyping. I am particularly interested in how AI can be integrated with hardware platforms and embedded devices to create more adaptive and intelligent technologies.',
			meta: ['Engineering tool', 'Rapid prototyping', 'Embedded AI']
		}
	];

	const ghostCards: GhostCard[] = [
		{
			eyebrow: 'Education',
			title: 'Nanjing Foreign Language School',
			body: 'High school student in the Class of 2027 with a focus on mathematics, physics, computer science, and engineering.'
		},
		{
			eyebrow: 'Direction',
			title: 'Computer Engineering',
			body: 'Focused on embedded systems, communication, and hardware-software co-design.'
		},
		{
			eyebrow: 'Recognition',
			title: 'Awards and competitions',
			body: 'AMC 12 A/B AIME qualifier, BMO Gold, Physics Bowl Component 2 Gold, EPQ A*, and more.'
		},
		{
			eyebrow: 'Perspective',
			title: 'AI and systems',
			body: 'Interested in combining intelligent algorithms with embedded devices and real engineering systems.'
		}
	];

	let backgroundEl: HTMLDivElement;
	let footerCardEl: HTMLElement;
	let sectionEls: HTMLElement[] = [];
	let pixelCardEls: HTMLElement[] = [];
	let pixelCanvasEls: HTMLCanvasElement[] = [];
	let mounted = false;
	let resourcesReady = false;
	let showHeartRain = false;
	let heartRainTriggered = false;
	let scrollY = 0;
	let viewportHeight = 1;
	let maxScroll = 1;

	let renderer: THREE.WebGLRenderer | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera | null = null;
	let modelGroup: THREE.Group | null = null;
	let frameId = 0;
	let resizeObserver: ResizeObserver | null = null;
	let modelEntries: { root: THREE.Group; pivot: THREE.Group; color: THREE.Color }[] = [];
	let lastScrollY = 0;
	let spinVelocity = 0;
	let lookAtY = 0;
	let pixelFrameCounter = 0;
	let footerObserver: IntersectionObserver | null = null;
	let pixelBufferCanvas: HTMLCanvasElement | null = null;
	let pixelBufferContext: CanvasRenderingContext2D | null = null;
	const loader = new OBJLoader();
	const modelColors = ['#ff8a2a', '#ffb16a', '#ffd6b0', '#f5f7ff'].map((value) => new THREE.Color(value));
	const modelSpecs = [
		{ url: copperUrl, x: -1.15, y: 4.1, z: -0.1, size: 2.2, tiltX: 0.42, tiltY: -0.66, tiltZ: 0.2 },
		{ url: mcbUrl, x: -4.05, y: 1.8, z: 0.02, size: 1.95, tiltX: 0.24, tiltY: 0.7, tiltZ: -0.16 },
		{ url: gearUrl, x: -1.08, y: -0.95, z: 0.08, size: 2.05, tiltX: 0.94, tiltY: -0.18, tiltZ: 0.52 },
		{ url: gpuUrl, x: -4.15, y: -3.35, z: -0.12, size: 2.25, tiltX: -0.36, tiltY: 0.5, tiltZ: -0.08 }
	];

	const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

	const sectionStyle = (index: number) => {
		if (!mounted) {
			return '--progress: 0; --drift: 0px;';
		}
		const element = sectionEls[index];
		if (!element) {
			return '--progress: 0; --drift: 0px;';
		}
		const rect = element.getBoundingClientRect();
		const anchor = viewportHeight * 0.72;
		const progress = clamp(1 - (rect.top - anchor) / viewportHeight, 0, 1);
		const drift = (index % 2 === 0 ? -1 : 1) * (1 - progress) * 96;
		return `--progress: ${progress.toFixed(3)}; --drift: ${drift.toFixed(1)}px;`;
	};

	const updateViewport = () => {
		viewportHeight = window.innerHeight || 1;
		scrollY = window.scrollY;
		maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
	};

	const disposeObject = (object: THREE.Object3D) => {
		object.traverse((child) => {
			if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
				child.geometry.dispose();
				if (Array.isArray(child.material)) {
					child.material.forEach((material) => material.dispose());
					return;
				}
				child.material.dispose();
			}
		});
	};

	const loadObj = async (url: string) => loader.loadAsync(url);

	const prepareModel = (source: THREE.Group, targetSize: number) => {
		const root = source.clone(true);
		const wireframeRoot = new THREE.Group();
		root.updateMatrixWorld(true);
		root.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;
			const geometry = child.geometry.clone();
			geometry.applyMatrix4(child.matrixWorld);
			const wireframe = new THREE.WireframeGeometry(geometry);
			const line = new THREE.LineSegments(
				wireframe,
				new THREE.LineBasicMaterial({
					color: 0xffffff,
					transparent: true,
					opacity: 0.88
				})
			);
			wireframeRoot.add(line);
			geometry.dispose();
		});

		const box = new THREE.Box3().setFromObject(wireframeRoot);
		const center = box.getCenter(new THREE.Vector3());
		const size = box.getSize(new THREE.Vector3());
		const longestSide = Math.max(size.x, size.y, size.z, 0.001);
		wireframeRoot.children.forEach((child) => {
			child.position.sub(center);
		});
		wireframeRoot.scale.setScalar(targetSize / longestSide);
		return wireframeRoot;
	};

	const updateWireColor = (object: THREE.Object3D, color: THREE.Color) => {
		object.traverse((child) => {
			if (!(child instanceof THREE.LineSegments)) return;
			const material = child.material;
			if (material instanceof THREE.LineBasicMaterial) {
				material.color.copy(color);
				material.opacity = 0.82;
			}
		});
	};

	const resizeScene = () => {
		if (!renderer || !camera || !backgroundEl) return;
		const width = backgroundEl.clientWidth;
		const height = backgroundEl.clientHeight;
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(width, height, false);
		camera.aspect = width / Math.max(height, 1);
		camera.updateProjectionMatrix();
	};

	const renderPixelCards = () => {
		if (!renderer || !pixelBufferCanvas || !pixelBufferContext) return;
		const bufferCanvas = pixelBufferCanvas;
		const bufferContext = pixelBufferContext;
		const sourceCanvas = renderer.domElement;
		const sourceRect = sourceCanvas.getBoundingClientRect();
		if (!sourceRect.width || !sourceRect.height) return;
		const scaleX = sourceCanvas.width / sourceRect.width;
		const scaleY = sourceCanvas.height / sourceRect.height;

		pixelCardEls.forEach((cardEl, index) => {
			const targetCanvas = pixelCanvasEls[index];
			if (!cardEl || !targetCanvas) return;

			const rect = cardEl.getBoundingClientRect();
			if (rect.bottom < 0 || rect.top > viewportHeight || rect.right < 0 || rect.left > window.innerWidth) {
				return;
			}
			const clippedWidth = Math.max(1, Math.min(rect.width, sourceRect.right - rect.left, rect.right - sourceRect.left));
			const clippedHeight = Math.max(1, Math.min(rect.height, sourceRect.bottom - rect.top, rect.bottom - sourceRect.top));
			if (clippedWidth <= 1 || clippedHeight <= 1) return;

			const sx = Math.max(0, (rect.left - sourceRect.left) * scaleX);
			const sy = Math.max(0, (rect.top - sourceRect.top) * scaleY);
			const sw = Math.max(1, clippedWidth * scaleX);
			const sh = Math.max(1, clippedHeight * scaleY);
			const dotPitch = 7;
			const lowWidth = Math.max(12, Math.round(rect.width / dotPitch));
			const lowHeight = Math.max(10, Math.round(rect.height / dotPitch));
			if (bufferCanvas.width !== lowWidth || bufferCanvas.height !== lowHeight) {
				bufferCanvas.width = lowWidth;
				bufferCanvas.height = lowHeight;
			}

			bufferContext.imageSmoothingEnabled = false;
			bufferContext.clearRect(0, 0, lowWidth, lowHeight);
			bufferContext.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, lowWidth, lowHeight);

			const pixels = bufferContext.getImageData(0, 0, lowWidth, lowHeight).data;
			const outputWidth = Math.max(1, Math.round(rect.width));
			const outputHeight = Math.max(1, Math.round(rect.height));
			if (targetCanvas.width !== outputWidth || targetCanvas.height !== outputHeight) {
				targetCanvas.width = outputWidth;
				targetCanvas.height = outputHeight;
			}

			const context = targetCanvas.getContext('2d');
			if (!context) return;
			context.clearRect(0, 0, outputWidth, outputHeight);
			const stepX = outputWidth / lowWidth;
			const stepY = outputHeight / lowHeight;
			const radius = Math.min(stepX, stepY) * 0.34;

			for (let y = 0; y < lowHeight; y += 1) {
				for (let x = 0; x < lowWidth; x += 1) {
					const offset = (y * lowWidth + x) * 4;
					const alpha = pixels[offset + 3] / 255;
					if (alpha < 0.08) continue;
					const r = pixels[offset];
					const g = pixels[offset + 1];
					const b = pixels[offset + 2];
					context.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(0.96, alpha)})`;
					context.beginPath();
					context.arc((x + 0.5) * stepX, (y + 0.5) * stepY, radius, 0, Math.PI * 2);
					context.fill();
				}
			}
		});
	};

	const animate = (time: number) => {
		frameId = requestAnimationFrame(animate);
		if (!renderer || !scene || !camera || !modelGroup) return;

		const scrollDelta = scrollY - lastScrollY;
		lastScrollY = scrollY;
		spinVelocity = THREE.MathUtils.lerp(spinVelocity, scrollDelta * 0.0012, 0.12);
		const scrollProgress = clamp(scrollY / maxScroll, 0, 1);

		modelEntries.forEach((entry, index) => {
			const drift = time * 0.00018 + index * 0.6;
			entry.pivot.rotation.y += spinVelocity * (index % 2 === 0 ? 1 : -1) + 0.0015 + index * 0.00018;
			entry.pivot.rotation.x = Math.sin(drift) * 0.18;
			entry.pivot.rotation.z = Math.cos(drift * 0.86) * 0.22;
			entry.root.position.z = modelSpecs[index].z + Math.sin(drift * 1.3) * 0.08;
			const pulse = 0.92 + Math.sin(time * 0.0009 + index) * 0.08;
			updateWireColor(entry.root, entry.color.clone().multiplyScalar(pulse));
		});

		lookAtY = THREE.MathUtils.lerp(4.15, -3.9, scrollProgress);
		camera.position.y = lookAtY + 0.18;
		camera.position.z = 5.2;
		camera.position.x = -2.7 + Math.sin(time * 0.00012) * 0.12;
		camera.lookAt(-2.7, lookAtY, 0);
		renderer.render(scene, camera);
		pixelFrameCounter = (pixelFrameCounter + 1) % 3;
		if (pixelFrameCounter === 0) {
			renderPixelCards();
		}
	};

	onMount(() => {
		mounted = true;
		let destroyed = false;
		pixelBufferCanvas = document.createElement('canvas');
		pixelBufferContext = pixelBufferCanvas.getContext('2d', { willReadFrequently: true });
		const bodyOverflow = document.body.style.overflow;
		const htmlOverflow = document.documentElement.style.overflow;
		document.body.style.overflow = 'hidden';
		document.documentElement.style.overflow = 'hidden';
		window.scrollTo(0, 0);
		updateViewport();

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
		camera.position.set(-2.7, 4.2, 5.2);

		renderer = new THREE.WebGLRenderer({
			antialias: false,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.setClearColor(0x000000, 0);
		backgroundEl.appendChild(renderer.domElement);
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.inset = '0';
		renderer.domElement.style.width = '100%';
		renderer.domElement.style.height = '100%';
		renderer.domElement.style.display = 'block';

		modelGroup = new THREE.Group();
		scene.add(modelGroup);

		resizeScene();
		frameId = requestAnimationFrame(animate);

		const onScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', updateViewport);

		resizeObserver = new ResizeObserver(() => {
			updateViewport();
			resizeScene();
		});
		resizeObserver.observe(backgroundEl);

		if (footerCardEl) {
			footerObserver = new IntersectionObserver(
				(entries) => {
					const [entry] = entries;
					if (!entry?.isIntersecting || heartRainTriggered) return;
					heartRainTriggered = true;
					showHeartRain = true;
					footerObserver?.disconnect();
				},
				{ threshold: 0.55 }
			);
			footerObserver.observe(footerCardEl);
		}

		void Promise.all(modelSpecs.map((spec) => loadObj(spec.url)))
			.then((loaded) => {
				if (destroyed || !modelGroup) return;
				modelEntries = loaded.map((source, index) => {
					const spec = modelSpecs[index];
					const pivot = new THREE.Group();
					const root = prepareModel(source, spec.size);
					const color = modelColors[index] ?? new THREE.Color('#ffffff');
					pivot.position.set(spec.x, spec.y, 0);
					pivot.rotation.set(spec.tiltX, spec.tiltY, spec.tiltZ);
					root.position.z = spec.z;
					updateWireColor(root, color);
					pivot.add(root);
					modelGroup?.add(pivot);
					return { root, pivot, color };
				});
			})
			.finally(() => {
				if (destroyed) return;
				resourcesReady = true;
				document.body.style.overflow = bodyOverflow;
				document.documentElement.style.overflow = htmlOverflow;
			});

		return () => {
			destroyed = true;
			document.body.style.overflow = bodyOverflow;
			document.documentElement.style.overflow = htmlOverflow;
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', updateViewport);
			if (frameId) cancelAnimationFrame(frameId);
			resizeObserver?.disconnect();
			footerObserver?.disconnect();
			modelEntries.forEach((entry) => disposeObject(entry.pivot));
			renderer?.dispose();
			scene?.clear();
			pixelBufferCanvas = null;
			pixelBufferContext = null;
			backgroundEl.querySelector('canvas')?.remove();
		};
	});
</script>

<svelte:head>
	<title>Wang Zicheng | Academic Profile</title>
	<meta
		name="description"
		content="Academic profile of Wang Zicheng, a Nanjing Foreign Language School student focused on Computer Engineering, embedded systems, and intelligent devices."
	/>
</svelte:head>

<div class="blog-page">
	<div class="background" bind:this={backgroundEl}></div>
	<div class="ambient ambient-left"></div>
	<div class="ambient ambient-right"></div>

	<section class="hero">
		<div class="hero-shell">
			<div class="intro-chip">Academic Profile / Wang Zicheng</div>
			<h1>Wang Zicheng, NFLS Class of 2027.</h1>
			<p>
				This page presents verified background information drawn from my academic profile, including
				education, intended major, awards, technical interests, personal traits, and my perspective
				on AI.
			</p>
			{#if resourcesReady}
				<div class="scroll-cue" aria-hidden="true">
					<span>Scroll</span>
					<svg viewBox="0 0 24 24">
						<path
							d="M12 17.2a1 1 0 0 1-.7-.29l-5-5a1 1 0 1 1 1.4-1.42l4.3 4.3 4.3-4.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-.7.29Z"
							fill="currentColor"
						/>
					</svg>
				</div>
			{:else}
				<div class="scroll-cue loading-cue" aria-hidden="true">
					<span>Loading</span>
					<div class="loading-dots">
						<i></i>
						<i></i>
						<i></i>
					</div>
				</div>
			{/if}
		</div>

		<div class="quick-facts">
			{#each quickFacts as fact, index}
				<article class="glass-card fact-card" style={`--index: ${index};`}>
					<p class="eyebrow">{fact.eyebrow}</p>
					<h2>{fact.title}</h2>
					<p class="body">{fact.body}</p>
					{#if fact.meta}
						<div class="meta-row">
							{#each fact.meta as item}
								<span>{item}</span>
							{/each}
						</div>
					{/if}
				</article>
			{/each}
		</div>
	</section>

	<section class="story">
		{#each sections as section, index}
			<div
				class:align-right={index % 2 === 1}
				class:compact={index % 3 === 1}
				class="story-row"
				bind:this={sectionEls[index]}
				style={sectionStyle(index)}
			>
				<aside class:ghost-right={index % 2 === 0} class="ghost-card glass-card">
					<p class="eyebrow">{ghostCards[index % ghostCards.length].eyebrow}</p>
					<h3>{ghostCards[index % ghostCards.length].title}</h3>
					<p class="body">{ghostCards[index % ghostCards.length].body}</p>
				</aside>
				<article
					class:pixel-card={section.variant === 'pixel'}
					class="glass-card story-card"
					bind:this={pixelCardEls[index]}
				>
					<div class:pixel-viewport={section.variant === 'pixel'} class="card-surface">
						{#if section.variant === 'pixel'}
							<canvas class="pixel-layer" bind:this={pixelCanvasEls[index]}></canvas>
						{/if}
						<div class:pixel-content={section.variant === 'pixel'} class="card-copy">
							<p class="eyebrow">{section.eyebrow}</p>
							<h2>{section.title}</h2>
							<p class="body">{section.body}</p>
							{#if section.meta}
								<div class="meta-row">
									{#each section.meta as item}
										<span>{item}</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</article>
			</div>
		{/each}
	</section>

	<section class="outro">
		<article class="glass-card outro-card" bind:this={footerCardEl}>
			{#if showHeartRain}
				<div class="heart-rain" aria-hidden="true">
					{#each heartDrops as heart}
						<span
							class="heart"
							style={`--left: ${heart.left}; --delay: ${heart.delay}; --duration: ${heart.duration}; --size: ${heart.size};`}
						>
							❤️
						</span>
					{/each}
				</div>
			{/if}
			<p class="eyebrow">Closing</p>
			<h2>谢谢阅读</h2>
			<p class="outro-subtitle">Thanks for reading.</p>
			<p class="body">
				Project is on GitHub public repo. Visit the repository or contribution page below for
				more.
			</p>
			<div class="outro-links">
				<a href="https://github.com/CyberVenlor/rhine-lab-web" target="_blank" rel="noreferrer">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.37-1.33-1.73-1.33-1.73-1.09-.74.08-.72.08-.72 1.2.09 1.84 1.22 1.84 1.22 1.08 1.82 2.82 1.3 3.5.99.11-.76.42-1.3.76-1.6-2.66-.3-5.47-1.31-5.47-5.86 0-1.3.47-2.37 1.23-3.21-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.22a11.5 11.5 0 0 1 6 0c2.29-1.54 3.29-1.22 3.29-1.22.65 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.21 0 4.56-2.82 5.55-5.5 5.85.43.36.82 1.07.82 2.16v3.2c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z"
						/>
					</svg>
					Repository
				</a>
				<a href="https://github.com/CyberVenlor" target="_blank" rel="noreferrer">
					Contribute
				</a>
			</div>
		</article>
	</section>
</div>

<style>
	:global(body) {
		color: #f3f7fb;
	}

	.blog-page {
		--glass-fill: rgba(248, 249, 252, 0.08);
		--glass-stroke-light: rgba(255, 255, 255, 0.22);
		--glass-stroke-dark: rgba(0, 0, 0, 0.58);
		--text-muted: rgba(238, 245, 255, 0.7);
		position: relative;
		min-height: 100vh;
		overflow-x: clip;
		background:
			radial-gradient(circle at 18% 16%, rgba(88, 130, 255, 0.08), transparent 22%),
			radial-gradient(circle at 80% 22%, rgba(67, 255, 220, 0.05), transparent 26%),
			radial-gradient(circle at 55% 70%, rgba(255, 255, 255, 0.03), transparent 34%),
			#010101;
	}

	.background,
	.ambient {
		position: fixed;
		inset: 0;
		pointer-events: none;
	}

	.background {
		z-index: 2;
		opacity: 0.92;
	}

	.background :global(canvas) {
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}

	.ambient {
		filter: blur(90px);
		opacity: 0.22;
		z-index: 0;
	}

	.ambient-left {
		background: radial-gradient(circle, rgba(97, 175, 255, 0.12), transparent 42%);
		transform: translate(-24%, -10%);
	}

	.ambient-right {
		background: radial-gradient(circle, rgba(60, 255, 223, 0.08), transparent 38%);
		transform: translate(34%, 12%);
	}

	.hero,
	.story {
		position: relative;
	}

	.hero {
		padding: clamp(5rem, 10vw, 8rem) clamp(1.2rem, 4vw, 3rem) 2rem;
	}

	.hero-shell {
		max-width: 52rem;
		padding: clamp(1.35rem, 3vw, 2rem);
		margin: 0 auto;
		position: relative;
		z-index: 4;
		border: 1px solid var(--glass-stroke-light);
		border-radius: 2rem;
		background: rgba(246, 247, 250, 0.07);
		backdrop-filter: blur(28px) saturate(135%);
		box-shadow:
			0 0 0 1px var(--glass-stroke-dark),
			0 1px 0 rgba(255, 255, 255, 0.06) inset,
			0 18px 44px rgba(0, 0, 0, 0.34);
	}

	.intro-chip,
	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 0.72rem;
		color: rgba(217, 231, 255, 0.72);
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	.hero-shell h1 {
		margin-top: 1rem;
		font-size: clamp(2.8rem, 7vw, 6.2rem);
		line-height: 0.95;
		max-width: 10ch;
		font-weight: 400;
	}

	.hero-shell p {
		margin-top: 1.15rem;
		max-width: 34rem;
		color: var(--text-muted);
		font-size: clamp(0.98rem, 1.8vw, 1.18rem);
		line-height: 1.45;
	}

	.scroll-cue {
		position: absolute;
		right: clamp(1.1rem, 3vw, 1.7rem);
		bottom: clamp(1rem, 2.4vw, 1.4rem);
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: rgba(229, 238, 251, 0.64);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		animation: scroll-cue-float 1.8s ease-in-out infinite;
	}

	.scroll-cue svg {
		width: 1rem;
		height: 1rem;
		flex: 0 0 auto;
	}

	.loading-cue {
		gap: 0.55rem;
	}

	.loading-dots {
		display: inline-flex;
		align-items: center;
		gap: 0.24rem;
	}

	.loading-dots i {
		display: block;
		width: 0.34rem;
		height: 0.34rem;
		border-radius: 999px;
		background: currentColor;
		opacity: 0.35;
		animation: loading-pulse 0.9s ease-in-out infinite;
	}

	.loading-dots i:nth-child(2) {
		animation-delay: 0.15s;
	}

	.loading-dots i:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes scroll-cue-float {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.58;
		}

		50% {
			transform: translateY(6px);
			opacity: 0.92;
		}
	}

	@keyframes loading-pulse {
		0%,
		100% {
			transform: scale(0.72);
			opacity: 0.28;
		}

		50% {
			transform: scale(1);
			opacity: 0.92;
		}
	}

	.quick-facts {
		max-width: 76rem;
		margin: clamp(2.5rem, 6vw, 5rem) auto 0;
		position: relative;
		z-index: 4;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.glass-card {
		position: relative;
		border-radius: 1.75rem;
		border: 1px solid var(--glass-stroke-light);
		background: var(--glass-fill);
		backdrop-filter: blur(24px) saturate(135%);
		box-shadow:
			0 0 0 1px var(--glass-stroke-dark),
			0 1px 0 rgba(255, 255, 255, 0.05) inset,
			0 14px 36px rgba(0, 0, 0, 0.3);
		overflow: hidden;
	}

	.glass-card::before {
		display: none;
	}

	.fact-card {
		min-height: 15rem;
		padding: 1.25rem;
		transform: translateY(calc(var(--index) * 14px));
	}

	.fact-card h2,
	.story-card h2 {
		margin-top: 0.7rem;
		font-size: clamp(1.3rem, 3vw, 2rem);
		font-weight: 400;
	}

	.body {
		margin-top: 0.9rem;
		color: rgba(239, 245, 255, 0.82);
		font-size: 0.98rem;
		line-height: 1.55;
	}

	.meta-row {
		margin-top: 1.2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.meta-row span {
		padding: 0.42rem 0.74rem;
		border-radius: 999px;
		background: rgba(137, 169, 222, 0.18);
		border: 1px solid rgba(176, 199, 235, 0.24);
		color: rgba(232, 239, 249, 0.9);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.meta-row span:nth-child(4n + 1) {
		background: rgba(121, 162, 223, 0.18);
		border-color: rgba(163, 191, 235, 0.24);
		color: rgba(227, 236, 248, 0.9);
	}

	.meta-row span:nth-child(4n + 2) {
		background: rgba(168, 136, 219, 0.18);
		border-color: rgba(198, 173, 232, 0.24);
		color: rgba(236, 229, 247, 0.9);
	}

	.meta-row span:nth-child(4n + 3) {
		background: rgba(121, 191, 169, 0.18);
		border-color: rgba(162, 216, 197, 0.24);
		color: rgba(226, 241, 235, 0.9);
	}

	.meta-row span:nth-child(4n + 4) {
		background: rgba(211, 156, 112, 0.18);
		border-color: rgba(229, 188, 151, 0.24);
		color: rgba(245, 234, 223, 0.9);
	}

	.story {
		padding: clamp(2rem, 4vw, 3rem) clamp(1.2rem, 4vw, 3rem) 10rem;
	}

	.outro {
		position: relative;
		padding: 0 clamp(1.2rem, 4vw, 3rem) 8rem;
		z-index: 4;
	}

	.outro-card {
		width: min(42rem, calc(100vw - 2.4rem));
		margin: 0 auto;
		padding: clamp(1.6rem, 4vw, 2.4rem);
		position: relative;
		z-index: 2;
		text-align: center;
		overflow: hidden;
	}

	.outro-card h2 {
		margin-top: 0.7rem;
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		font-weight: 400;
	}

	.outro-subtitle {
		margin-top: 0.45rem;
		color: rgba(223, 233, 249, 0.66);
		font-size: 0.88rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.outro-card .body {
		max-width: 32rem;
		margin-left: auto;
		margin-right: auto;
	}

	.outro-links {
		margin-top: 1.4rem;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.9rem;
	}

	.outro-links a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.72rem 1.05rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.08);
		color: rgba(247, 250, 255, 0.92);
		text-decoration: none;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}

	.outro-links a svg {
		width: 1rem;
		height: 1rem;
		flex: 0 0 auto;
	}

	.outro-links a:hover {
		transform: translateY(-1px);
		border-color: rgba(255, 255, 255, 0.22);
		background: rgba(255, 255, 255, 0.12);
	}

	.heart-rain {
		position: absolute;
		inset: 0;
		top: -7rem;
		height: calc(100% + 14rem);
		pointer-events: none;
		overflow: hidden;
		z-index: 3;
	}

	.heart {
		position: absolute;
		left: var(--left);
		top: 0;
		font-size: var(--size);
		opacity: 0;
		filter: drop-shadow(0 10px 16px rgba(255, 74, 119, 0.25));
		animation: heart-fall var(--duration) linear infinite;
		animation-delay: var(--delay);
	}

	@keyframes heart-fall {
		0% {
			transform: translate3d(0, -2rem, 0) scale(0.75) rotate(0deg);
			opacity: 0;
		}

		12% {
			opacity: 1;
		}

		100% {
			transform: translate3d(0, calc(100% + 11rem), 0) scale(1.05) rotate(14deg);
			opacity: 0;
		}
	}

	.story-row {
		display: flex;
		justify-content: flex-start;
		min-height: 38vh;
		align-items: center;
		position: relative;
		margin: clamp(1.5rem, 5vh, 3.5rem) 0;
	}

	.story-row.align-right {
		justify-content: flex-end;
	}

	.story-row.compact {
		min-height: 30vh;
	}

	.story-card {
		position: relative;
		z-index: 4;
		width: min(36rem, calc(100vw - 2.4rem));
		transform:
			translate3d(var(--drift), calc((1 - var(--progress)) * 34px), 0)
			scale(calc(0.96 + var(--progress) * 0.04))
			rotate(calc((0.5 - var(--progress)) * 1.4deg));
		opacity: 1;
		filter: none;
		transition:
			transform 220ms ease-out,
			opacity 220ms ease-out,
			filter 220ms ease-out,
			border-color 220ms ease-out;
	}

	.card-surface {
		position: relative;
		padding: clamp(1.3rem, 3vw, 1.8rem);
		border-radius: inherit;
	}

	.pixel-card {
		background: rgba(248, 249, 252, 0.045);
	}

	.pixel-viewport {
		position: relative;
		isolation: isolate;
		background: rgba(14, 16, 20, 0.12);
		overflow: hidden;
	}

	.pixel-layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		opacity: 0.88;
		border-radius: inherit;
		pointer-events: none;
	}

	.pixel-content {
		position: relative;
		z-index: 1;
		font-size: 1.06em;
		text-shadow: 0 0 0.01px currentColor;
		color: rgba(245, 248, 255, 0.96);
	}

	.pixel-card .meta-row {
		position: relative;
		z-index: 2;
	}

	.pixel-card .meta-row span {
		position: relative;
		z-index: 2;
		background-clip: padding-box;
	}

	.pixel-card .eyebrow {
		font-size: 0.82rem;
		letter-spacing: 0.18em;
	}

	.pixel-card h2 {
		font-size: clamp(1.55rem, 3.2vw, 2.18rem);
		line-height: 1.02;
	}

	.pixel-card .body {
		font-size: 1.04rem;
		line-height: 1.58;
	}

	.story-row:nth-child(3n) .story-card {
		width: min(40rem, calc(100vw - 2.4rem));
	}

	.story-row:nth-child(4n) .story-card {
		width: min(32rem, calc(100vw - 2.4rem));
	}

	.ghost-card {
		position: absolute;
		z-index: 1;
		left: clamp(1rem, 7vw, 5rem);
		width: min(18rem, 32vw);
		padding: 1rem 1.05rem;
		opacity: 0.34;
		filter: blur(6px);
		transform: translate3d(0, 0, 0) scale(0.96);
		pointer-events: none;
		user-select: none;
		-webkit-user-select: none;
		background: rgba(248, 249, 252, 0.045);
		backdrop-filter: blur(32px) saturate(118%);
	}

	.ghost-card.ghost-right {
		left: auto;
		right: clamp(1rem, 7vw, 5rem);
	}

	.ghost-card h3 {
		margin-top: 0.65rem;
		font-size: 1.15rem;
		font-weight: 400;
		color: rgba(248, 250, 255, 0.86);
	}

	.ghost-card .body {
		margin-top: 0.7rem;
		font-size: 0.84rem;
		line-height: 1.45;
		color: rgba(236, 240, 250, 0.68);
	}

	.story-card:hover,
	.fact-card:hover {
		border-color: rgba(255, 255, 255, 0.24);
	}

	@media (max-width: 820px) {
		.hero {
			padding-top: 4.5rem;
		}

		.hero-shell h1 {
			max-width: 12ch;
			font-size: clamp(2.5rem, 12vw, 4.4rem);
		}

		.scroll-cue {
			right: 1.1rem;
			bottom: 1rem;
		}

		.quick-facts {
			grid-template-columns: 1fr;
		}

		.fact-card {
			transform: none;
			min-height: auto;
		}

		.story-row,
		.story-row.align-right {
			justify-content: center;
			min-height: 54vh;
		}

		.ghost-card {
			display: none;
		}

		.story-card,
		.story-row:nth-child(3n) .story-card,
		.story-row:nth-child(4n) .story-card {
			width: min(100%, 34rem);
		}

		.outro-card {
			width: min(100%, 34rem);
		}
	}
</style>
