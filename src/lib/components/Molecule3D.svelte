<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { AtomType, BondType, type MoleculeDefinition } from '$lib/data/molecule-types';

	const atomAppearance: Record<AtomType, { radius: number; color: number }> = {
		[AtomType.Hydrogen]: { radius: 0.22, color: 0xf2f7ff },
		[AtomType.Carbon]: { radius: 0.36, color: 0x222831 },
		[AtomType.Nitrogen]: { radius: 0.34, color: 0x2f72ff },
		[AtomType.Oxygen]: { radius: 0.34, color: 0xe53737 },
		[AtomType.Sulfur]: { radius: 0.4, color: 0xffce3a },
		[AtomType.Chlorine]: { radius: 0.42, color: 0x4caf50 }
	};

	let {
		molecule,
		height = 320,
		autoRotate = false,
		autoRotateSpeed = 0.006,
		hoverSpinActive = false,
		hoverSpinSpeed = 0.01,
		renderScale = 1,
		targetScale = 1.2,
		debugRotationY = false,
		debugTag = ''
	}: {
		molecule: MoleculeDefinition;
		height?: number;
		autoRotate?: boolean;
		autoRotateSpeed?: number;
		hoverSpinActive?: boolean;
		hoverSpinSpeed?: number;
		renderScale?: number;
		targetScale?: number;
		debugRotationY?: boolean;
		debugTag?: string;
	} = $props();

	let mountEl: HTMLDivElement;
	let renderer: THREE.WebGLRenderer | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera | null = null;
	let moleculeRoot: THREE.Group | null = null;
	let frameId = $state(0);
	let resizeObserver: ResizeObserver | null = null;
	let isDragging = false;
	let activePointerId: number | null = null;
	let lastPointerX = 0;
	let lastPointerY = 0;
	let velocityX = 0;
	let velocityY = 0;
	let hoverScale = $state(1.2);
	let needsRender = false;
	const dragSensitivity = 0.0028;
	const inertiaDamping = 0.94;

	const disposeMesh = (mesh: THREE.Mesh) => {
		mesh.geometry.dispose();
		if (Array.isArray(mesh.material)) {
			mesh.material.forEach((material) => material.dispose());
			return;
		}
		mesh.material.dispose();
	};

	const clearGroup = (group: THREE.Group) => {
		group.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				disposeMesh(object);
			}
		});
		group.clear();
	};

	const buildAtomMesh = (type: AtomType, position: [number, number, number]) => {
		const look = atomAppearance[type];
		const geometry = new THREE.SphereGeometry(look.radius, 32, 24);
		const material = new THREE.MeshStandardMaterial({
			color: look.color,
			metalness: 0.02,
			roughness: 0.88
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(position[0], position[1], position[2]);
		return mesh;
	};

	const bondOffsets = (direction: THREE.Vector3, type: BondType, spacing = 0.11) => {
		if (type === BondType.Single) return [new THREE.Vector3(0, 0, 0)];
		const axisHint = Math.abs(direction.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
		const cross = new THREE.Vector3().crossVectors(direction, axisHint).normalize();
		if (type === BondType.Double) {
			return [cross.clone().multiplyScalar(-spacing), cross.clone().multiplyScalar(spacing)];
		}
		return [
			cross.clone().multiplyScalar(-spacing * 1.8),
			new THREE.Vector3(0, 0, 0),
			cross.clone().multiplyScalar(spacing * 1.8)
		];
	};

	const buildBondMeshes = (from: THREE.Vector3, to: THREE.Vector3, type: BondType) => {
		const segment = new THREE.Vector3().subVectors(to, from);
		const length = segment.length();
		if (length === 0) return [];

		const direction = segment.clone().normalize();
		const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
		const offsets = bondOffsets(direction, type);
		const radius = 0.08;
		const meshes: THREE.Mesh[] = [];

		for (const offset of offsets) {
			const geometry = new THREE.CylinderGeometry(radius, radius, length, 18);
			const material = new THREE.MeshStandardMaterial({
				color: 0xb8c4d6,
				metalness: 0.03,
				roughness: 0.9
			});
			const cylinder = new THREE.Mesh(geometry, material);
			const center = from.clone().add(to).multiplyScalar(0.5).add(offset);
			cylinder.position.copy(center);
			cylinder.quaternion.copy(quaternion);
			meshes.push(cylinder);
		}
		return meshes;
	};

	const fitCamera = (target: THREE.Group) => {
		if (!camera) return;
		const sphere = new THREE.Box3().setFromObject(target).getBoundingSphere(new THREE.Sphere());
		const radius = Math.max(sphere.radius, 1);
		const center = sphere.center;
		const verticalFov = THREE.MathUtils.degToRad(camera.fov);
		const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
		const fitByHeight = radius / Math.tan(verticalFov / 2);
		const fitByWidth = radius / Math.tan(horizontalFov / 2);
		const distance = Math.max(fitByHeight, fitByWidth) * 1.22;

		camera.position.set(center.x, center.y, center.z + distance);
		camera.near = Math.max(0.01, distance - radius * 3);
		camera.far = distance + radius * 4;
		camera.lookAt(center);
		camera.updateProjectionMatrix();
	};

	const recenterModel = (target: THREE.Group) => {
		const box = new THREE.Box3().setFromObject(target);
		const center = box.getCenter(new THREE.Vector3());
		for (const child of target.children) {
			child.position.sub(center);
		}
	};

	const renderMolecule = (definition: MoleculeDefinition) => {
		if (!moleculeRoot) return;

		moleculeRoot.position.set(0, 0, 0);
		moleculeRoot.rotation.set(0, 0, 0);
		clearGroup(moleculeRoot);
		const atomById = new Map<number, THREE.Vector3>();

		for (const atom of definition.atoms) {
			const atomPos = new THREE.Vector3(atom.position[0], atom.position[1], atom.position[2]);
			atomById.set(atom.id, atomPos);
			moleculeRoot.add(buildAtomMesh(atom.type, atom.position));
		}

		for (const bond of definition.bonds) {
			const from = atomById.get(bond.from);
			const to = atomById.get(bond.to);
			if (!from || !to) continue;
			for (const mesh of buildBondMeshes(from, to, bond.type)) {
				moleculeRoot.add(mesh);
			}
		}

		recenterModel(moleculeRoot);
		moleculeRoot.scale.setScalar(hoverScale);
		fitCamera(moleculeRoot);
	};

	const resize = () => {
		if (!renderer || !camera || !mountEl) return;
		const width = mountEl.clientWidth;
		const containerHeight = mountEl.clientHeight;
		// Keep molecule canvases sharp under page zoom by scaling internal draw buffer with zoom.
		const scaledDpr = Math.min(window.devicePixelRatio * Math.max(1, renderScale), 8);
		renderer.setPixelRatio(scaledDpr);
		renderer.setSize(width, containerHeight, false);
		camera.aspect = width / Math.max(containerHeight, 1);
		camera.updateProjectionMatrix();
		if (moleculeRoot) fitCamera(moleculeRoot);
		requestRender();
	};

	const hasKineticMotion = () => isDragging || Math.abs(velocityX) > 0.00001 || Math.abs(velocityY) > 0.00001;
	const isParentNodeHovered = () => {
		const nodeEl = mountEl?.closest('.node');
		return !!nodeEl && nodeEl.matches(':hover');
	};
	const isHoverSpinOn = () => hoverSpinActive || isParentNodeHovered();
	const hasContinuousMotion = () => hasKineticMotion() || (!isDragging && (isHoverSpinOn() || autoRotate));

	const hasScaleTween = () => Math.abs(hoverScale - targetScale) > 0.0005;

	const needsAnimation = () => hasContinuousMotion() || hasScaleTween();

	const scheduleNextFrame = () => {
		if (frameId) return;
		frameId = requestAnimationFrame(animate);
	};

	const renderNow = () => {
		if (!renderer || !scene || !camera) return;
		renderer.render(scene, camera);
	};

	const animate = () => {
		frameId = 0;
		if (!renderer || !scene || !camera || !moleculeRoot) {
			return;
		}
		let changed = false;
		if (isDragging || Math.abs(velocityX) > 0.00001 || Math.abs(velocityY) > 0.00001) {
			moleculeRoot.rotation.y += velocityY;
			moleculeRoot.rotation.x += velocityX;
			moleculeRoot.rotation.x = THREE.MathUtils.clamp(moleculeRoot.rotation.x, -1.35, 1.35);
			velocityX *= inertiaDamping;
			velocityY *= inertiaDamping;
			changed = true;
		}
		const hoverSpinOn = isHoverSpinOn();
		if (!isDragging && hoverSpinOn) {
			moleculeRoot.rotation.y += hoverSpinSpeed;
			changed = true;
		} else if (autoRotate) {
			moleculeRoot.rotation.y += autoRotateSpeed;
			changed = true;
		}
		const nextScale = THREE.MathUtils.lerp(hoverScale, targetScale, 0.16);
		if (Math.abs(nextScale - hoverScale) > 0.000001) {
			hoverScale = nextScale;
			moleculeRoot.scale.setScalar(hoverScale);
			changed = true;
		}

		if (changed) {
			needsRender = true;
		}
		if (debugRotationY) {
			console.debug('[Molecule3D rotationY]', {
				tag: debugTag || molecule.name,
				rotationY: Number(moleculeRoot.rotation.y.toFixed(6)),
				hoverSpinOn,
				isDragging
			});
		}
		if (needsRender) {
			renderNow();
			needsRender = false;
		}

		if (needsAnimation() || needsRender) {
			scheduleNextFrame();
			return;
		}
	};

	const requestRender = () => {
		needsRender = true;
		if (frameId) {
			cancelAnimationFrame(frameId);
			frameId = 0;
		}
		if (debugRotationY) {
			console.log('[Molecule3D requestRender]', {
				tag: debugTag || molecule.name,
				hoverSpinActive,
				needsRender
			});
		}
		animate();
	};

	const resetDragState = () => {
		isDragging = false;
		activePointerId = null;
		mountEl.style.cursor = 'default';
		requestRender();
	};

	const onPointerDown = (event: PointerEvent) => {
		isDragging = true;
		activePointerId = event.pointerId;
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
		mountEl.setPointerCapture(event.pointerId);
		mountEl.style.cursor = 'grabbing';
		requestRender();
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!isDragging || !moleculeRoot) return;
		const dx = event.clientX - lastPointerX;
		const dy = event.clientY - lastPointerY;
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
		velocityY = dx * dragSensitivity;
		velocityX = dy * dragSensitivity;
		moleculeRoot.rotation.y += velocityY;
		moleculeRoot.rotation.x += velocityX;
		moleculeRoot.rotation.x = THREE.MathUtils.clamp(moleculeRoot.rotation.x, -1.35, 1.35);
		requestRender();
	};

	const onPointerUp = (event: PointerEvent) => {
		if (activePointerId !== null && event.pointerId !== activePointerId) return;
		if (mountEl.hasPointerCapture(event.pointerId)) {
			mountEl.releasePointerCapture(event.pointerId);
		}
		resetDragState();
	};

	$effect(() => {
		if (!moleculeRoot) return;
		renderMolecule(molecule);
		requestRender();
	});

	$effect(() => {
		if (!renderer) return;
		renderScale;
		resize();
	});

	$effect(() => {
		if (!renderer) return;
		autoRotate;
		autoRotateSpeed;
		hoverSpinActive;
		hoverSpinSpeed;
		if (debugRotationY) {
			console.log('[Molecule3D hoverSpin change]', {
				tag: debugTag || molecule.name,
				hoverSpinActive,
				hoverSpinSpeed
			});
		}
		requestRender();
	});

	$effect(() => {
		if (!renderer) return;
		targetScale;
		requestRender();
	});

	onMount(() => {
		scene = new THREE.Scene();
		scene.background = null;

		camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);

		mountEl.appendChild(renderer.domElement);
		renderer.domElement.style.display = 'block';
		renderer.domElement.style.width = '100%';
		renderer.domElement.style.height = '100%';
		mountEl.addEventListener('pointerdown', onPointerDown);
		mountEl.addEventListener('pointermove', onPointerMove);
		mountEl.addEventListener('pointerup', onPointerUp);
		mountEl.addEventListener('pointercancel', onPointerUp);
		mountEl.addEventListener('lostpointercapture', resetDragState);
		mountEl.addEventListener('mouseenter', requestRender);
		mountEl.addEventListener('mouseleave', requestRender);
		window.addEventListener('blur', resetDragState);

		moleculeRoot = new THREE.Group();
		scene.add(moleculeRoot);

		const ambient = new THREE.AmbientLight(0xffffff, 0.9);
		const fill = new THREE.DirectionalLight(0xc5d4ff, 0.35);
		fill.position.set(3, 2, 4);
		const rim = new THREE.DirectionalLight(0x6bf6ff, 0.2);
		rim.position.set(-2, 3, -4);
		scene.add(ambient, fill, rim);

		hoverScale = targetScale;
		renderMolecule(molecule);
		resize();
		resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(mountEl);
		requestRender();

		return () => {
			if (frameId) cancelAnimationFrame(frameId);
			resizeObserver?.disconnect();
			if (moleculeRoot) {
				clearGroup(moleculeRoot);
				scene?.remove(moleculeRoot);
			}
			renderer?.dispose();
			if (renderer?.domElement.parentElement) {
				renderer.domElement.parentElement.removeChild(renderer.domElement);
			}
			mountEl.removeEventListener('pointerdown', onPointerDown);
			mountEl.removeEventListener('pointermove', onPointerMove);
			mountEl.removeEventListener('pointerup', onPointerUp);
			mountEl.removeEventListener('pointercancel', onPointerUp);
			mountEl.removeEventListener('lostpointercapture', resetDragState);
			mountEl.removeEventListener('mouseenter', requestRender);
			mountEl.removeEventListener('mouseleave', requestRender);
			window.removeEventListener('blur', resetDragState);
		};
	});
</script>

<div class="molecule-canvas" bind:this={mountEl} style={`height: ${height}px`} aria-label={`${molecule.name} 3D model`}></div>

<style>
	.molecule-canvas {
		position: relative;
		width: 100%;
		overflow: visible;
		cursor: default;
		touch-action: none;
	}

	:global(.molecule-canvas > canvas) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
