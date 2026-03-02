<script lang="ts">
	import { onMount } from 'svelte';
	import Molecule3D from '$lib/components/Molecule3D.svelte';
	import { organicNodes } from '$lib/data/organic-reaction-map';

	type PixelPoint = { x: number; y: number };
	type ArrowShape = {
		key: string;
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		arrowX: number;
		arrowY: number;
		labelX: number;
		labelY: number;
		angle: number;
		labelAngle: number;
		label: string;
	};
	type DecoBlock = {
		id: string;
		x: number;
		y: number;
		depth: number;
		width: number;
		height: number;
		type: 'dots' | 'cross';
		opacity?: number;
	};

	type Link = {
		from: string;
		to: string;
		lane?: number;
		label: string;
	};

	const links: Link[] = [
		{ from: 'polymers', to: 'alkene', label: 'cracking' },
		{ from: 'alkane', to: 'alkene', label: 'cracking' },
		{ from: 'alkane', to: 'halogenoalkanes', label: 'substitution' },
		{ from: 'alkene', to: 'ketones', label: 'oxidation' },
		{ from: 'alkene', to: 'alcohol', lane: 14, label: 'hydration' },
		{ from: 'alcohol', to: 'alkene', lane: 14, label: 'dehydration' },
		{ from: 'alkene', to: 'halogenoalkanes', lane: 14, label: 'HX addition' },
		{ from: 'halogenoalkanes', to: 'alkene', lane: 14, label: 'elimination' },
		{ from: 'ketones', to: 'alcohol', lane: 14, label: 'reduction' },
		{ from: 'alcohol', to: 'ketones', lane: 14, label: 'oxidation' },
		{ from: 'alcohol', to: 'aldehydes', label: 'controlled oxidation' },
		{ from: 'alcohol', to: 'esters', lane: 14, label: 'esterification' },
		{ from: 'esters', to: 'alcohol', lane: 14, label: 'hydrolysis' },
		{ from: 'halogenoalkanes', to: 'amines', label: 'amination' },
		{ from: 'halogenoalkanes', to: 'nitrile', label: 'CN substitution' },
		{ from: 'nitrile', to: 'amines', label: 'hydrogenation' },
		{ from: 'nitrile', to: 'carboxylic-acid', label: 'hydrolysis' },
		{ from: 'esters', to: 'carboxylic-acid', lane: 14, label: 'acid hydrolysis' },
		{ from: 'carboxylic-acid', to: 'esters', lane: 14, label: 'esterification' }
	];

	let viewportEl: HTMLElement;
	let stageEl: HTMLElement;
	let titleEl: HTMLHeadingElement;
	let titlePrimaryEl: HTMLSpanElement;
	let titleMirrorEl: HTMLSpanElement;
	const nodeEls = new Map<string, HTMLElement>();
	const stageWidth = 1600;
	const stageHeight = 1020;
	let arrows = $state<ArrowShape[]>([]);
	let resizeObserver: ResizeObserver | null = null;
	let zoom = $state(0.8);
	let panX = 60;
	let panY = 0;
	const panOriginX = panX;
	const panOriginY = panY;
	let parallaxPanX = $state(panX);
	let parallaxPanY = $state(panY);
	const panElasticPx = 110;
	const panElasticResistance = 0.28;
	const panFreeRangeWhenFitted = 150;
	const panLeftClampOffset = 0;
	let hoveredNodeId = $state<string | null>(null);
	let hoverClearTimer: number | null = null;
	let transformFrame = 0;
	let isPanning = false;
	let panStartX = 0;
	let panStartY = 0;
	let pointerStartX = 0;
	let pointerStartY = 0;
	const activePointers = new Map<number, { x: number; y: number }>();
	let pinchActive = false;
	let pinchLastDistance = 0;
	let pinchLastCenterX = 0;
	let pinchLastCenterY = 0;
	let titleShift = $state(0);
	let titleCycleWidth = $state(0);
	const titleScrollGain = 0.42;
	const titleText = '// REACTIONS OF ORGANIC CHEMISTRY';

	type PositionedNode = (typeof organicNodes)[number] & { layoutX: number; layoutY: number; depth: number };

	const layoutPositionsLandscape: Record<string, { x: number; y: number; depth: number }> = {
		polymers: { x: 14, y: 7, depth: 1.2 },
		ketones: { x: 35, y: 6, depth: 0.88 },
		alkane: { x: 6, y: 28, depth: 1.04 },
		alkene: { x: 25, y: 27, depth: 1.2 },
		alcohol: { x: 45, y: 28, depth: 1.12 },
		aldehydes: { x: 60, y: 6, depth: 0.82 },
		halogenoalkanes: { x: 21, y: 49, depth: 1.3 },
		esters: { x: 45, y: 49, depth: 1.16 },
		amines: { x: 9, y: 72, depth: 1 },
		nitrile: { x: 31, y: 72, depth: 1.1 },
		'carboxylic-acid': { x: 48, y: 75, depth: 1.2 }
	};
	const layoutPositionsPortrait: Record<string, { x: number; y: number; depth: number }> = {
		polymers: { x: 38, y: 7, depth: 1.2 },
		alkane: { x: 5, y: 5, depth: 1.04 },
		alkene: { x: 22, y: 7, depth: 1.2 },
		ketones: { x: 36, y: 23, depth: 0.88 },
		alcohol: { x: 25, y: 28, depth: 1.12 },
		aldehydes: { x: 36, y: 48, depth: 0.82 },
		halogenoalkanes: { x: 3, y: 25, depth: 1.3 },
		esters: { x: 25, y: 55, depth: 1.16 },
		amines: { x: 3, y: 48, depth: 1 },
		nitrile: { x: 16, y: 40, depth: 1.1 },
		'carboxylic-acid': { x: 5, y: 67, depth: 1.2 }
	};
	let isPortrait = $state(false);
	const parallaxStrengthX = 1.1;
	const parallaxStrengthY = 1.1;
	const depthScaleStrength = 0.06;
	const depthLayerBase = 120;
	const depthLayerStep = 90;
	const decoBlocks: DecoBlock[] = [
		{ id: 'deco-01', x: 8, y: 8, depth: 0.82, width: 34, height: 30, type: 'dots', opacity: 0.82 },
		{ id: 'deco-02', x: 16, y: 8, depth: 0.88, width: 48, height: 42, type: 'dots', opacity: 0.86 },
		
		{ id: 'deco-04', x: 32, y: 8, depth: 1.02, width: 78, height: 58, type: 'dots', opacity: 0.95 },
	

		{ id: 'deco-07', x: 56, y: 8, depth: 1.2, width: 124, height: 92, type: 'dots', opacity: 0.84 },
	

		{ id: 'deco-10', x: 8, y: 26, depth: 1.16, width: 118, height: 74, type: 'dots', opacity: 0.91 },
	
		{ id: 'deco-12', x: 32, y: 26, depth: 0.96, width: 66, height: 48, type: 'dots', opacity: 0.85 },
		{ id: 'deco-13', x: 44, y: 26, depth: 0.86, width: 42, height: 34, type: 'dots', opacity: 0.98 },
		{ id: 'deco-14', x: 56, y: 26, depth: 1.22, width: 132, height: 96, type: 'dots', opacity: 0.87 },

		{ id: 'deco-16', x: 80, y: 26, depth: 1.02, width: 72, height: 54, type: 'dots', opacity: 0.81 },
		{ id: 'deco-17', x: 10, y: 44, depth: 0.9, width: 58, height: 44, type: 'dots', opacity: 0.88 },
	
		{ id: 'deco-19', x: 34, y: 44, depth: 1.18, width: 114, height: 84, type: 'dots', opacity: 0.83 },
		{ id: 'deco-20', x: 46, y: 44, depth: 1.04, width: 82, height: 60, type: 'dots', opacity: 0.92 },
		
		{ id: 'deco-22', x: 70, y: 44, depth: 1.24, width: 138, height: 102, type: 'dots', opacity: 0.86 },
		{ id: 'deco-23', x: 8, y: 62, depth: 1.08, width: 90, height: 66, type: 'dots', opacity: 0.9 },
	
		{ id: 'deco-25', x: 32, y: 62, depth: 0.88, width: 46, height: 34, type: 'dots', opacity: 0.95 },
	
		{ id: 'deco-27', x: 56, y: 62, depth: 1.14, width: 106, height: 78, type: 'dots', opacity: 0.97 },
		
		{ id: 'deco-29', x: 80, y: 62, depth: 0.84, width: 38, height: 30, type: 'dots', opacity: 0.93 },
		{ id: 'deco-30', x: 10, y: 80, depth: 1.2, width: 126, height: 94, type: 'dots', opacity: 0.85 },
	
		{ id: 'deco-32', x: 34, y: 80, depth: 1, width: 76, height: 58, type: 'dots', opacity: 0.88 },
		{ id: 'deco-33', x: 46, y: 80, depth: 0.9, width: 56, height: 42, type: 'dots', opacity: 0.98 },
	
		{ id: 'deco-35', x: 70, y: 80, depth: 1.16, width: 110, height: 82, type: 'dots', opacity: 0.91 }
	];
	let centeredNodes = $state<PositionedNode[]>([]);
	let startupIndexById = $state<Record<string, number>>({});
	const nodeBootDurationMs = 360;
	const nodeBootStepMs = 72;
	const arrowsRevealDelayMs = 300;
	const startupTotalMs = (organicNodes.length - 1) * nodeBootStepMs + nodeBootDurationMs;

	const depthToLayer = (depth: number) =>
		Math.max(1, Math.round(depthLayerBase + (depth - 1) * depthLayerStep));

	const rebuildLayout = () => {
		const positions = isPortrait ? layoutPositionsPortrait : layoutPositionsLandscape;
		const nodes = organicNodes.map((node) => ({
			...node,
			layoutX: positions[node.id]?.x ?? 50,
			layoutY: positions[node.id]?.y ?? 50,
			depth: positions[node.id]?.depth ?? 1
		}));
		const ordered = [...nodes].sort((a, b) => a.layoutX - b.layoutX || a.layoutY - b.layoutY);
		const nextIndex: Record<string, number> = {};
		for (let i = 0; i < ordered.length; i += 1) {
			nextIndex[ordered[i].id] = i;
		}
		centeredNodes = nodes;
		startupIndexById = nextIndex;
	};
	rebuildLayout();

	const nodeParallaxStyle = (
		layoutX: number,
		layoutY: number,
		depth: number,
		bootDelay: number,
		currentParallaxPanX: number,
		currentParallaxPanY: number
	) => {
		const deltaX = currentParallaxPanX - panOriginX;
		const deltaY = currentParallaxPanY - panOriginY;
		const depthDelta = depth - 1;
		const offsetX = deltaX * depthDelta * parallaxStrengthX;
		const offsetY = deltaY * depthDelta * parallaxStrengthY;
		const scale = Math.min(1.12, Math.max(0.92, 1 + depthDelta * depthScaleStrength));
		const z = depthToLayer(depth);
		return `left: calc(${layoutX}% + ${offsetX.toFixed(2)}px); top: calc(${layoutY}% + ${offsetY.toFixed(2)}px); --boot-delay: ${bootDelay}; --node-scale: ${scale.toFixed(3)}; z-index: ${z};`;
	};

	const decoParallaxStyle = (block: DecoBlock, currentParallaxPanX: number, currentParallaxPanY: number) => {
		const deltaX = currentParallaxPanX - panOriginX;
		const deltaY = currentParallaxPanY - panOriginY;
		const depthDelta = block.depth - 1;
		const offsetX = deltaX * depthDelta * parallaxStrengthX;
		const offsetY = deltaY * depthDelta * parallaxStrengthY;
		const z = depthToLayer(block.depth);
		const alpha = block.opacity ?? 0.2;
		return `left: calc(${block.x}% + ${offsetX.toFixed(2)}px); top: calc(${block.y}% + ${offsetY.toFixed(2)}px); width: ${block.width}px; height: ${block.height}px; opacity: ${alpha}; z-index: ${z}; transform: translate(-50%, -50%);`;
	};

	const formulas: Record<string, string> = {
		polymers: '(C2H4)n',
		alkane: 'C3H8',
		alkene: 'C2H4',
		ketones: 'C3H6O',
		alcohol: 'C2H6O',
		aldehydes: 'C2H4O',
		halogenoalkanes: 'CH3Cl',
		esters: 'C3H6O2',
		amines: 'CH5N',
		nitrile: 'C2H3N',
		'carboxylic-acid': 'C2H4O2'
	};

	const registerNode = (element: HTMLElement, id: string) => {
		nodeEls.set(id, element);
		requestAnimationFrame(refreshArrows);
		return {
			destroy() {
				nodeEls.delete(id);
				requestAnimationFrame(refreshArrows);
			}
		};
	};

	const nodeRectRelative = (id: string) => {
		const node = nodeEls.get(id);
		if (!node || !stageEl) return null;
		const rect = node.getBoundingClientRect();
		const mapRect = stageEl.getBoundingClientRect();
		const scale = Math.max(zoom, 0.0001);
		return {
			// getBoundingClientRect is in viewport pixels (already zoomed);
			// convert back to stage-space so SVG coordinates stay aligned.
			x: (rect.left - mapRect.left) / scale,
			y: (rect.top - mapRect.top) / scale,
			width: rect.width / scale,
			height: rect.height / scale
		};
	};

	const clippedPoint = (from: PixelPoint, to: PixelPoint, halfW: number, halfH: number): PixelPoint => {
		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const tx = dx === 0 ? Infinity : halfW / Math.abs(dx);
		const ty = dy === 0 ? Infinity : halfH / Math.abs(dy);
		const t = Math.min(tx, ty);
		return { x: from.x + dx * t, y: from.y + dy * t };
	};

	const makeArrow = (
		source: PixelPoint,
		target: PixelPoint,
		fromHalfW: number,
		fromHalfH: number,
		toHalfW: number,
		toHalfH: number,
		key: string,
		label: string,
		offset = 0
	): ArrowShape => {
		const start = clippedPoint(source, target, fromHalfW, fromHalfH);
		const end = clippedPoint(target, source, toHalfW, toHalfH);
		const dx = end.x - start.x;
		const dy = end.y - start.y;
		const dist = Math.hypot(dx, dy) || 1;
		const ux = dx / dist;
		const uy = dy / dist;
		const nx = -uy;
		const ny = ux;
		const shiftX = nx * offset;
		const shiftY = ny * offset;
		const x1 = start.x + ux * 8 + shiftX;
		const y1 = start.y + uy * 8 + shiftY;
		const x2 = end.x - ux * 8 + shiftX;
		const y2 = end.y - uy * 8 + shiftY;
		const midX = (x1 + x2) / 2;
		const midY = (y1 + y2) / 2;
		const labelOffset = 10 + Math.abs(offset) * 0.2;
		const labelX = midX + nx * labelOffset;
		const labelY = midY + ny * labelOffset;
		const angle = Math.atan2(y2 - y1, x2 - x1);
		const angleDeg = (angle * 180) / Math.PI;
		const labelAngle = angleDeg > 90 || angleDeg < -90 ? angleDeg + 180 : angleDeg;
		return {
			key,
			x1,
			y1,
			x2,
			y2,
			arrowX: midX,
			arrowY: midY,
			labelX,
			labelY,
			angle,
			labelAngle,
			label
		};
	};

	const refreshArrows = () => {
		if (!stageEl) return;
		const result: ArrowShape[] = [];

		for (const link of links) {
			const fromRect = nodeRectRelative(link.from);
			const toRect = nodeRectRelative(link.to);
			if (!fromRect || !toRect) continue;

			const fromCenter = { x: fromRect.x + fromRect.width / 2, y: fromRect.y + fromRect.height / 2 };
			const toCenter = { x: toRect.x + toRect.width / 2, y: toRect.y + toRect.height / 2 };
			const fromHalfW = fromRect.width / 2;
			const fromHalfH = fromRect.height / 2;
			const toHalfW = toRect.width / 2;
			const toHalfH = toRect.height / 2;

			result.push(
				makeArrow(
					fromCenter,
					toCenter,
					fromHalfW,
					fromHalfH,
					toHalfW,
					toHalfH,
					`${link.from}-${link.to}-${link.lane ?? 0}`,
					link.label,
					link.lane ?? 0
				)
			);
		}

		arrows = result;
	};

	const applyStageTransform = () => {
		if (!stageEl) return;
		// Avoid CSS zoom (mobile Safari mismatch). Use a standard matrix transform:
		// screen = zoom * (world + pan)
		const tx = panX * zoom;
		const ty = panY * zoom;
		stageEl.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${tx}, ${ty})`;
	};

	const scheduleTransform = () => {
		if (transformFrame) return;
		transformFrame = requestAnimationFrame(() => {
			transformFrame = 0;
			applyStageTransform();
			refreshArrows();
		});
	};

	const clampPan = (nextPanX: number, nextPanY: number) => {
		if (!viewportEl) {
			return { x: nextPanX, y: nextPanY };
		}
		const viewportWidth = viewportEl.clientWidth;
		const viewportHeight = viewportEl.clientHeight;
		const scale = Math.max(zoom, 0.0001);
		const fitMinX = viewportWidth / scale - stageWidth;
		const fitMinY = viewportHeight / scale - stageHeight;
		const fitMaxX = 0;
		const fitMaxY = 0;

		const clampAxis = (value: number, fitMin: number, fitMax: number, origin: number) => {
			if (fitMin > fitMax) {
				// Even when content fits inside viewport, keep a small movable range
				// so panning/parallax can still be perceived.
				const hardMin = origin - panFreeRangeWhenFitted;
				const hardMax = origin + panFreeRangeWhenFitted;
				if (value < hardMin) {
					const overshoot = hardMin - value;
					return hardMin - Math.min(panElasticPx, overshoot * panElasticResistance);
				}
				if (value > hardMax) {
					const overshoot = value - hardMax;
					return hardMax + Math.min(panElasticPx, overshoot * panElasticResistance);
				}
				return value;
			}
			// Keep clamp centered around the initial pan origin.
			const halfRange = Math.max(Math.abs(fitMax - origin), Math.abs(origin - fitMin));
			const hardMin = origin - halfRange;
			const hardMax = origin + halfRange;
			if (value < hardMin) {
				const overshoot = hardMin - value;
				return hardMin - Math.min(panElasticPx, overshoot * panElasticResistance);
			}
			if (value > hardMax) {
				const overshoot = value - hardMax;
				return hardMax + Math.min(panElasticPx, overshoot * panElasticResistance);
			}
			return value;
		};
		return {
			x: Math.min(clampAxis(nextPanX, fitMinX, fitMaxX, panOriginX), panOriginX + panLeftClampOffset),
			y: clampAxis(nextPanY, fitMinY, fitMaxY, panOriginY)
		};
	};

	const applyPan = (nextPanX: number, nextPanY: number, affectParallax: boolean) => {
		const prevPanX = panX;
		const prevPanY = panY;
		const clamped = clampPan(nextPanX, nextPanY);
		panX = clamped.x;
		panY = clamped.y;
		const moved = Math.abs(panX - prevPanX) + Math.abs(panY - prevPanY);
		if (moved > 0 && titleCycleWidth > 0) {
			titleShift += moved * titleScrollGain;
			while (titleShift >= titleCycleWidth) {
				titleShift -= titleCycleWidth;
			}
		}
		if (affectParallax) {
			parallaxPanX += panX - prevPanX;
			parallaxPanY += panY - prevPanY;
		}
	};

	const updateTitleCycle = () => {
		if (!titlePrimaryEl || !titleMirrorEl) return;
		titleCycleWidth = titleMirrorEl.offsetLeft - titlePrimaryEl.offsetLeft;
		if (titleCycleWidth <= 0) {
			titleShift = 0;
			return;
		}
		titleShift = titleShift % titleCycleWidth;
	};

	const getPinchPair = () => {
		const points = Array.from(activePointers.values());
		if (points.length < 2) return null;
		return [points[0], points[1]] as const;
	};

	const getPinchMetrics = (a: { x: number; y: number }, b: { x: number; y: number }) => {
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		return {
			distance: Math.hypot(dx, dy),
			centerX: (a.x + b.x) / 2,
			centerY: (a.y + b.y) / 2
		};
	};

	const startPan = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		if (target.closest('.node')) return;
		activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
		viewportEl.setPointerCapture(event.pointerId);
		const pair = getPinchPair();
		if (pair) {
			const pinch = getPinchMetrics(pair[0], pair[1]);
			pinchActive = true;
			isPanning = false;
			pinchLastDistance = Math.max(pinch.distance, 1);
			pinchLastCenterX = pinch.centerX;
			pinchLastCenterY = pinch.centerY;
			return;
		}
		pinchActive = false;
		isPanning = true;
		panStartX = panX;
		panStartY = panY;
		pointerStartX = event.clientX;
		pointerStartY = event.clientY;
	};

	const movePan = (event: PointerEvent) => {
		if (!activePointers.has(event.pointerId)) return;
		activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
		if (pinchActive) {
			const pair = getPinchPair();
			if (!pair) return;
			const pinch = getPinchMetrics(pair[0], pair[1]);
			const rect = viewportEl.getBoundingClientRect();
			const centerX = pinch.centerX - rect.left;
			const centerY = pinch.centerY - rect.top;
			const prevZoom = zoom;
			const scaleFactor = pinch.distance / Math.max(pinchLastDistance, 1);
			const nextZoom = Math.min(2.4, Math.max(0.8, zoom * scaleFactor));
			zoom = nextZoom;
			let nextPanX = panX + centerX * (1 / zoom - 1 / prevZoom);
			let nextPanY = panY + centerY * (1 / zoom - 1 / prevZoom);
			nextPanX += (pinch.centerX - pinchLastCenterX) / Math.max(zoom, 0.0001);
			nextPanY += (pinch.centerY - pinchLastCenterY) / Math.max(zoom, 0.0001);
			applyPan(nextPanX, nextPanY, false);
			pinchLastDistance = Math.max(pinch.distance, 1);
			pinchLastCenterX = pinch.centerX;
			pinchLastCenterY = pinch.centerY;
			scheduleTransform();
			return;
		}
		if (!isPanning) return;
		const nextPanX = panStartX + (event.clientX - pointerStartX);
		const nextPanY = panStartY + (event.clientY - pointerStartY);
		applyPan(nextPanX, nextPanY, true);
		scheduleTransform();
	};

	const clearHoveredNode = () => {
		if (hoverClearTimer !== null) {
			window.clearTimeout(hoverClearTimer);
			hoverClearTimer = null;
		}
		if (hoveredNodeId !== null) {
			hoveredNodeId = null;
		}
	};

	const onNodeMouseEnter = (nodeId: string, event: MouseEvent) => {
		if (hoverClearTimer !== null) {
			window.clearTimeout(hoverClearTimer);
			hoverClearTimer = null;
		}
		hoveredNodeId = nodeId;
		console.debug('[organic-reactions] pointerenter', {
			nodeId,
			clientX: event.clientX,
			clientY: event.clientY,
			pointerType: 'mouse',
			hoveredNodeId
		});
	};

	const onNodeMouseLeave = (nodeId: string, event: MouseEvent) => {
		const currentNode = event.currentTarget as HTMLElement | null;
		if (hoverClearTimer !== null) {
			window.clearTimeout(hoverClearTimer);
		}
		hoverClearTimer = window.setTimeout(() => {
			hoverClearTimer = null;
			if (currentNode?.matches(':hover')) {
				return;
			}
			if (hoveredNodeId === nodeId) {
				hoveredNodeId = null;
			}
		}, 90);
		console.debug('[organic-reactions] pointerleave', {
			nodeId,
			clientX: event.clientX,
			clientY: event.clientY,
			pointerType: 'mouse',
			hoveredNodeId
		});
	};

	const endPan = (event: PointerEvent) => {
		activePointers.delete(event.pointerId);
		if (viewportEl.hasPointerCapture(event.pointerId)) {
			viewportEl.releasePointerCapture(event.pointerId);
		}
		const pair = getPinchPair();
		if (pair) {
			const pinch = getPinchMetrics(pair[0], pair[1]);
			pinchActive = true;
			isPanning = false;
			pinchLastDistance = Math.max(pinch.distance, 1);
			pinchLastCenterX = pinch.centerX;
			pinchLastCenterY = pinch.centerY;
			return;
		}
		pinchActive = false;
		const rest = Array.from(activePointers.entries())[0];
		if (rest) {
			isPanning = true;
			panStartX = panX;
			panStartY = panY;
			pointerStartX = rest[1].x;
			pointerStartY = rest[1].y;
			return;
		}
		isPanning = false;
	};

	const resetPointerState = () => {
		isPanning = false;
		pinchActive = false;
		activePointers.clear();
		clearHoveredNode();
	};

	const onWheel = (event: WheelEvent) => {
		event.preventDefault();
		// Trackpad two-finger pan maps to wheel delta without ctrl.
		if (!event.ctrlKey) {
			applyPan(panX - event.deltaX, panY - event.deltaY, true);
			scheduleTransform();
			return;
		}
		// Pinch zoom (ctrl+wheel) keeps cursor position stable.
		const rect = viewportEl.getBoundingClientRect();
		const cursorX = event.clientX - rect.left;
		const cursorY = event.clientY - rect.top;
		const prevZoom = zoom;
		const oldPanX = panX;
		const oldPanY = panY;
		const factor = event.deltaY < 0 ? 1.03 : 0.97;
		const nextZoom = Math.min(2.4, Math.max(0.8, zoom * factor));
		zoom = nextZoom;
		// Keep zoom centered on pointer for CSS zoom model:
		// screen = zoom * (world + pan)
		const nextPanX = oldPanX + cursorX * (1 / zoom - 1 / prevZoom);
		const nextPanY = oldPanY + cursorY * (1 / zoom - 1 / prevZoom);
		applyPan(nextPanX, nextPanY, false);
		scheduleTransform();
	};

	const suppressContextMenu = (event: MouseEvent) => {
		event.preventDefault();
	};

	const resetView = () => {
		zoom = 1;
		applyPan(0, 0, false);
		parallaxPanX = panOriginX;
		parallaxPanY = panOriginY;
		scheduleTransform();
	};

	const zoomIn = () => {
		zoom = Math.min(2.4, zoom * 1.12);
		applyPan(panX, panY, false);
		scheduleTransform();
	};

	const zoomOut = () => {
		zoom = Math.max(0.8, zoom * 0.9);
		applyPan(panX, panY, false);
		scheduleTransform();
	};

	onMount(() => {
		const updateOrientation = () => {
			const nextPortrait =
				window.matchMedia('(orientation: portrait)').matches || window.innerHeight > window.innerWidth;
			if (nextPortrait === isPortrait) return;
			isPortrait = nextPortrait;
			rebuildLayout();
			scheduleTransform();
		};
		const blockNativeWheel = (event: WheelEvent) => {
			event.preventDefault();
		};
		const blockNativeTouch = (event: TouchEvent) => {
			event.preventDefault();
		};
		const blockNativeGesture = (event: Event) => {
			event.preventDefault();
		};

		const onWindowBlur = () => {
			resetPointerState();
		};

		window.addEventListener('wheel', blockNativeWheel, { passive: false });
		window.addEventListener('touchmove', blockNativeTouch, { passive: false });
		window.addEventListener('gesturestart', blockNativeGesture as EventListener, { passive: false });
		window.addEventListener('gesturechange', blockNativeGesture as EventListener, { passive: false });
		window.addEventListener('gestureend', blockNativeGesture as EventListener, { passive: false });
		window.addEventListener('blur', onWindowBlur);

		updateOrientation();
		requestAnimationFrame(updateTitleCycle);
		applyStageTransform();
		requestAnimationFrame(refreshArrows);
		const onResize = () => {
			updateOrientation();
			updateTitleCycle();
			refreshArrows();
		};
		window.addEventListener('resize', onResize);
		resizeObserver = new ResizeObserver(refreshArrows);
		resizeObserver.observe(stageEl);
		return () => {
			if (transformFrame) cancelAnimationFrame(transformFrame);
			if (hoverClearTimer !== null) {
				window.clearTimeout(hoverClearTimer);
				hoverClearTimer = null;
			}
			window.removeEventListener('wheel', blockNativeWheel);
			window.removeEventListener('touchmove', blockNativeTouch);
			window.removeEventListener('gesturestart', blockNativeGesture as EventListener);
			window.removeEventListener('gesturechange', blockNativeGesture as EventListener);
			window.removeEventListener('gestureend', blockNativeGesture as EventListener);
			window.removeEventListener('blur', onWindowBlur);
			window.removeEventListener('resize', onResize);
			resizeObserver?.disconnect();
		};
	});
</script>

<svelte:head>
	<title>Organic Reactions Map</title>
	<meta name="description" content="Examples of organic molecule classes with reaction-style arrows." />
</svelte:head>

<main class="page">
	<h1 bind:this={titleEl}>
		<span class="title-track" style={`transform: translateX(${-titleShift}px);`}>
			<span bind:this={titlePrimaryEl}>{titleText}</span>
			<span bind:this={titleMirrorEl} aria-hidden="true">{titleText}</span>
			<span aria-hidden="true">{titleText}</span>
			<span aria-hidden="true">{titleText}</span>
			<span aria-hidden="true">{titleText}</span>
		</span>
	</h1>

	<section class="map-wrap">
		<div
			class="viewport"
			bind:this={viewportEl}
			role="application"
			aria-label="Organic reactions canvas"
			onwheel={onWheel}
			onpointerdown={startPan}
			onpointermove={movePan}
			onpointerup={endPan}
			onpointercancel={endPan}
			oncontextmenu={suppressContextMenu}
		>
			<div class="stage" bind:this={stageEl}>
				<aside
					class="canvas-totem"
					aria-label="Organic reactions strip"
					style={`left:-30px; top:0px; height:800px; width:30px;`}
				>
					<div class="canvas-totem__graphic"></div>
					<div class="canvas-totem__label">
						<span class="canvas-totem__cn">有机反应</span>
						<span class="canvas-totem__en">ORGANIC REACTIONS</span>
					</div>
				</aside>
				<svg
					class="arrows"
					viewBox={`0 0 ${stageWidth} ${stageHeight}`}
					preserveAspectRatio="none"
					style={`--arrows-reveal-duration: ${startupTotalMs}ms; --arrows-reveal-delay: ${arrowsRevealDelayMs}ms;`}
					aria-hidden="true"
				>
					<g class="arrows-reveal">
						{#each arrows as arrow (arrow.key)}
							<g class="arrow-item">
								<line class="dash-flow" x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} />
								<text
									x={arrow.labelX}
									y={arrow.labelY}
									transform={`rotate(${arrow.labelAngle}, ${arrow.labelX}, ${arrow.labelY})`}
								>
									{arrow.label}
								</text>
							</g>
						{/each}
					</g>
				</svg>

					{#each decoBlocks as block (block.id)}
						<div
							class="deco-block"
							class:dots={block.type === 'dots'}
							class:cross={block.type === 'cross'}
							style={decoParallaxStyle(block, parallaxPanX, parallaxPanY)}
							aria-hidden="true"
						></div>
					{/each}

					{#each centeredNodes as node (node.id)}
						<article
							class="node"
							class:hovered={hoveredNodeId === node.id}
							style={nodeParallaxStyle(
								node.layoutX,
								node.layoutY,
								node.depth,
								startupIndexById[node.id] ?? 0,
								parallaxPanX,
								parallaxPanY
							)}
							use:registerNode={node.id}
							onmouseenter={(event) => onNodeMouseEnter(node.id, event)}
						onmouseleave={(event) => onNodeMouseLeave(node.id, event)}
					>
						<h2>{node.label}</h2>
						<div class="molecule-layer">
							<div class="molecule-visual">
								<Molecule3D
									molecule={node.molecule}
									height={80}
									renderScale={zoom}
									autoRotate={false}
									hoverSpinActive={hoveredNodeId === node.id}
									hoverSpinSpeed={0.01}
									targetScale={hoveredNodeId === node.id ? 6.0 : 5.0}
								/>
							</div>
						</div>
						<p class="formula">{formulas[node.id] ?? ''}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>
</main>

<style>
	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 0.8rem 1rem 1rem;
		background: #000;
		color: #fff;
		overflow: hidden;
		touch-action: none;
	}

	:global(html),
	:global(body) {
		overflow: hidden;
		overscroll-behavior: none;
	}

	h1 {
		margin: 0;
		width: 100%;
		font-size: clamp(1.6rem, 2.8vw, 2.9rem);
		font-weight: 900;
		letter-spacing: 0.06em;
		line-height: 1;
		color: #ffbf2f;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
	}

	.title-track {
		display: inline-flex;
		align-items: center;
		gap: 40px;
		will-change: transform;
	}

	.map-wrap {
		flex: 1 1 auto;
		min-height: 0;
		margin-top: 0.45rem;
	}

	.viewport {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		cursor: default;
		border: 1px solid transparent;
	}

	.viewport:active {
		cursor: default;
	}

	.stage {
		position: absolute;
		left: 0;
		top: 0;
		width: 1600px;
		height: 1020px;
		transform-origin: 0 0;
		will-change: transform;
	}

	.canvas-totem {
		position: absolute;
		background: #ffbf2f;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.55rem 0.35rem;
		box-shadow: 0 0 0 1px rgba(255, 191, 47, 0.45) inset;
		pointer-events: none;
		z-index: 0;
	}

	.canvas-totem__graphic {
		flex: 1 1 auto;
		margin-bottom: 0.45rem;
		background: repeating-linear-gradient(
			-32deg,
			rgba(0, 0, 0, 0.3) 0px,
			rgba(0, 0, 0, 0.3) 1px,
			transparent 1px,
			transparent 6px
		);
		opacity: 0.9;
	}

	.canvas-totem__label {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		color: #121212;
		font-weight: 900;
		line-height: 1;
	}

	.canvas-totem__cn {
		font-size: 1.15rem;
		letter-spacing: 0.04em;
		writing-mode: vertical-rl;
		text-orientation: mixed;
		align-self: center;
	}

	.canvas-totem__en {
		font-size: 0.52rem;
		letter-spacing: 0.1em;
		writing-mode: vertical-rl;
		text-orientation: mixed;
		align-self: center;
	}

	.arrows {
		position: absolute;
		inset: 0;
		width: 1600px;
		height: 1020px;
		z-index: 1;
		pointer-events: auto;
	}

	.node {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: scale(var(--node-scale, 1));
		transform-origin: center center;
		z-index: 2;
		padding: 0;
		border-left: none;
		border-right: none;
		border-top: none;
		border-bottom: 1px solid #ffbf2f;
		border-radius: 0;
		background: #000;
		width: max-content;
		height: max-content;
		opacity: 0;
		animation: node-boot 360ms steps(1, end) both;
		animation-delay: calc(var(--boot-delay, 0) * 72ms);
	}

	.deco-block {
		position: absolute;
		pointer-events: none;
		background-color: rgba(105, 112, 124, 0.08);
		backdrop-filter: blur(0.4px);
	}

	.deco-block.dots {
		background-color: transparent;
		background-image: radial-gradient(rgba(178, 184, 193, 0.42) 1px, transparent 1px);
		background-size: 12px 12px;
	}

	.deco-block.cross {
		background-image:
			linear-gradient(
				45deg,
				transparent 47%,
				rgba(178, 184, 193, 0.44) 47%,
				rgba(178, 184, 193, 0.44) 53%,
				transparent 53%
			),
			linear-gradient(
				-45deg,
				transparent 47%,
				rgba(178, 184, 193, 0.44) 47%,
				rgba(178, 184, 193, 0.44) 53%,
				transparent 53%
			);
		background-size: 18px 18px;
	}

	.node::before {
		content: '';
		display: block;
		width: 100%;
		height: 6px;
		flex: 0 0 6px;
		background: repeating-linear-gradient(
			-45deg,
			#ffbf2f 0px,
			#ffbf2f 0.5px,
			transparent 1px,
			transparent 2px
		);
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-align: center;
		color: #fff;
		white-space: nowrap;
		line-height: 1;
	}

	.molecule-layer {
		position: relative;
		width: 0;
		height: 40px;
		overflow: visible;
	}

	.molecule-visual {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 128px;
		height: 80px;
		transform: translate(-50%, -50%);
		overflow: visible;
	}

	.formula {
		margin: 0;
		align-self: flex-end;
		font-size: 0.56rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: rgba(255, 255, 255, 0.85);
		white-space: nowrap;
		line-height: 1;
	}

	.arrows line {
		stroke: #ffbf2f;
		stroke-width: 1.5;
		stroke-dasharray: 8 10;
		stroke-linecap: round;
		transition: stroke-width 120ms ease;
		pointer-events: stroke;
	}

	.arrows .arrow-item:hover line {
		stroke-width: 3;
	}

	.arrows line.dash-flow {
		animation: dash-backward 1s linear infinite;
	}

	.arrows text {
		fill: #ffbf2f;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.03em;
		text-anchor: middle;
		dominant-baseline: central;
		pointer-events: auto;
	}

	.arrows-reveal {
		clip-path: inset(0 100% 0 0);
		animation: arrows-reveal var(--arrows-reveal-duration, 1000ms) linear both;
		animation-delay: var(--arrows-reveal-delay, 300ms);
	}

	@keyframes dash-backward {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: 18;
		}
	}

	@keyframes node-boot {
		0% {
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		22% {
			opacity: 0;
		}
		35% {
			opacity: 1;
		}
		46% {
			opacity: 0;
		}
		62% {
			opacity: 1;
		}
		78% {
			opacity: 0.35;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes arrows-reveal {
		from {
			clip-path: inset(0 100% 0 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}

</style>
