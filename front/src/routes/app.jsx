import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import { setupStarOverlays } from '../utils/stars';
import MarsAnnotationMap from './mars.jsx';

const UNWISE = 'unwise';
const ANDROMEDA = 'andromeda';
const MARS = 'mars';
const BACKEND_URL = 'http://localhost:3001';

export default function App() {
	const osdContainerRef = useRef(null);
	const marsContainerRef = useRef(null);
	const viewerInstanceRef = useRef(null);
	const starApiRef = useRef({
		updateBrightStars: () => {},
		clearStarOverlays: () => {},
	});

	const [selected, setSelected] = useState(UNWISE);
	const [annotations, setAnnotations] = useState([]);
	const [anno, setAnno] = useState(null);

	const [searchQuery, setSearchQuery] = useState('');
	const [statusMessage, setStatusMessage] = useState('');
	const [resultsVisible, setResultsVisible] = useState(false);
	const [resultHtml, setResultHtml] = useState('');
	const [currentImageAnalysis, setCurrentImageAnalysis] = useState(null);

	const unwiseSource = {
		type: 'unwise-neo6',
		width: Math.pow(2, 11) * 256,
		height: Math.pow(2, 11) * 256,
		tileSize: 256,
		minLevel: 1,
		maxLevel: 11,
		getTileUrl: (level, x, y) => `${BACKEND_URL}/tile/unwise/${level}/${x}/${y}.jpg`,
		crossOriginPolicy: 'Anonymous',
	};

	const andromedaSource = {
		type: 'zoomifytileservice',
		width: 69536,
		height: 22230,
		tilesUrl: 'https://cdn.esahubble.org/archives/images/zoomable/heic1502a/',
	};

	/** -------- Initialize viewer + annotorious ---------- */
	useEffect(() => {
		const viewer = OpenSeadragon({
			element: osdContainerRef.current,
			prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@4.1.0/build/openseadragon/images/',
			tileSources: unwiseSource,
			showNavigationControl: true,
			showZoomControl: true,
			showHomeControl: true,
			showFullPageControl: true,
			animationTime: 1.2,
			crossOriginPolicy: 'Anonymous',
		});

		viewerInstanceRef.current = viewer;

		const annotate = Annotorious(viewer, {});
		setAnno(annotate);

		annotate.on('createAnnotation', (annotation) => {
			console.log('createAnnotation', annotation);
			setAnnotations((prev) => [...prev, annotation]);
		});

		annotate.on('updateAnnotation', (annotation) => {
			setAnnotations((prev) => prev.map((a) => (a.id === annotation.id ? annotation : a)));
		});

		annotate.on('deleteAnnotation', (annotation) => {
			setAnnotations((prev) => prev.filter((a) => a.id !== annotation.id));
		});

		// Setup stars
		starApiRef.current = setupStarOverlays(viewer, BACKEND_URL);

		return () => {
			try {
				annotate.destroy();
				viewer.destroy();
			} catch (e) {}
		};
	}, []);

	/** -------- Toggle source on selection ---------- */
	useEffect(() => {
		const viewer = viewerInstanceRef.current;
		const osdEl = osdContainerRef.current;
		const marsEl = marsContainerRef.current;

		function showOSD() {
			marsEl.style.display = 'none';
			marsEl.innerHTML = '';
			osdEl.style.display = 'block';
			viewer.viewport && viewer.viewport.goHome(true);
			viewer.forceRedraw();
		}

		function showMarsIframe() {
			osdEl.style.display = 'none';
			starApiRef.current.clearStarOverlays();
			marsEl.style.display = 'block';
		}

		if (selected === UNWISE) {
			showOSD();
			viewer.open(unwiseSource);
		} else if (selected === ANDROMEDA) {
			showOSD();
			viewer.open(andromedaSource);
		} else if (selected === MARS) {
			showMarsIframe();
		}
	}, [selected]);

	/** -------- Viewer helpers ---------- */
	function getCurrentViewInfo() {
		const viewer = viewerInstanceRef.current;
		if (!viewer?.viewport) return null;
		const bounds = viewer.viewport.getBounds();
		const zoom = viewer.viewport.getZoom();
		const center = viewer.viewport.getCenter();
		return {
			bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
			center: { x: center.x, y: center.y },
			zoom,
		};
	}

	async function getViewerScreenshotDataURL() {
		const viewer = viewerInstanceRef.current;
		if (!viewer.drawer?.canvas) {
			await new Promise((resolve) => viewer.addOnceHandler('tile-drawn', () => resolve()));
		}
		return viewer.drawer.canvas.toDataURL('image/png');
	}

	/** -------- Render result cards ---------- */
	function renderAnalysisCard(title, analysisObj) {
		const a = analysisObj || {};
		let html = `<h3>${title}</h3>`;
		if (a.analysis) html += `<h4>Analysis</h4><p>${a.analysis}</p>`;
		if (a.features?.length) html += `<h4>Features</h4><ul>${a.features.map((f) => `<li>${f}</li>`).join('')}</ul>`;
		if (a.notable_objects?.length)
			html += `<h4>Notable Objects</h4><ul>${a.notable_objects.map((o) => `<li>${o}</li>`).join('')}</ul>`;
		if (a.scale_estimate) html += `<h4>Scale</h4><p>${a.scale_estimate}</p>`;
		if (typeof a.confidence === 'number') {
			const pct = Math.round(Math.max(0, Math.min(1, a.confidence)) * 100);
			html += `<h4>Confidence</h4><p>${pct}%</p>`;
		}
		setResultHtml(html);
		setResultsVisible(true);
	}

	/** -------- Search + Analyze handlers ---------- */
	async function handleSearch() {
		const query = searchQuery.trim();
		if (!query) return;
		const mapType = selected;
		setStatusMessage('Searching...');

		try {
			const res = await fetch(`${BACKEND_URL}/search`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query, mapType }),
			});
			const result = await res.json();
			if (result.found) {
				const viewer = viewerInstanceRef.current;
				const point = new OpenSeadragon.Point(result.coordinates.x, result.coordinates.y);
				viewer.viewport.panTo(point, true);
				viewer.viewport.zoomTo(result.zoom_level || 0.7, point, true);
				renderAnalysisCard('Search Result', {
					analysis: result.description,
					confidence: result.confidence,
				});
				setStatusMessage(`Found: ${result.description}`);
			} else {
				setResultHtml(`<p>${result.message || 'Not found'}</p>`);
				setResultsVisible(true);
				setStatusMessage('Not found');
			}
		} catch (err) {
			setStatusMessage('Search failed: ' + err.message);
		}
	}

	async function handleAnalyze() {
		const mapType = selected;
		setStatusMessage('Analyzing view...');
		try {
			const dataUrl = await getViewerScreenshotDataURL();
			const res = await fetch(`${BACKEND_URL}/analyze-image`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					imageData: dataUrl,
					mapType,
					currentView: getCurrentViewInfo(),
					query: searchQuery,
				}),
			});
			const result = await res.json();
			setCurrentImageAnalysis(result.analysis);
			renderAnalysisCard('Image Analysis', result.analysis);
			setStatusMessage('Analysis complete.');
		} catch (err) {
			setStatusMessage('Analysis failed: ' + err.message);
		}
	}

	async function handleEnhancedSearch() {
		const query = searchQuery.trim();
		if (!query) {
			setStatusMessage('Please enter a query');
			return;
		}
		const mapType = selected;
		setStatusMessage('Enhanced searching...');
		try {
			let analysis = currentImageAnalysis;
			if (!analysis) {
				await handleAnalyze();
				analysis = currentImageAnalysis;
			}
			const res = await fetch(`${BACKEND_URL}/search-with-context`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query,
					mapType,
					imageAnalysis: analysis,
					currentView: getCurrentViewInfo(),
				}),
			});
			const result = await res.json();
			if (result.found) {
				const viewer = viewerInstanceRef.current;
				const point = new OpenSeadragon.Point(result.coordinates.x, result.coordinates.y);
				viewer.viewport.panTo(point, true);
				viewer.viewport.zoomTo(result.zoom_level || 0.7, point, true);
				renderAnalysisCard('Enhanced Search Result', {
					analysis: result.description,
					confidence: result.confidence,
				});
				setStatusMessage('Enhanced search complete');
			} else {
				setResultHtml(`<p>${result.message || 'Not found'}</p>`);
				setResultsVisible(true);
				setStatusMessage('Not found');
			}
		} catch (err) {
			setStatusMessage('Enhanced search failed: ' + err.message);
		}
	}

	return (
		<div
			style={{
				maxHeight: '100vh',
				overflowY: 'auto',
				padding: '1rem',
			}}
		>
			{/* --- Controls --- */}
			<div id="controls">
				<input
					type="radio"
					id="unwise"
					name="viewer_select"
					value={UNWISE}
					checked={selected === UNWISE}
					onChange={() => setSelected(UNWISE)}
				/>
				<label htmlFor="unwise">Unwise Neo6</label>

				<input
					type="radio"
					id="andromeda"
					name="viewer_select"
					value={ANDROMEDA}
					checked={selected === ANDROMEDA}
					onChange={() => setSelected(ANDROMEDA)}
				/>
				<label htmlFor="andromeda">Andromeda Galaxy</label>

				<input
					type="radio"
					id="mars"
					name="viewer_select"
					value={MARS}
					checked={selected === MARS}
					onChange={() => setSelected(MARS)}
				/>
				<label htmlFor="mars">Mars</label>
			</div>

			{/* --- Search UI --- */}
			<div id="search-container" style={{ margin: '10px 0' }}>
				<input
					type="text"
					placeholder="Ask me to find something on the map..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					style={{ width: '50%', marginRight: '10px' }}
				/>
				<button onClick={handleSearch}>Search</button>
				<button onClick={handleAnalyze}>Analyze View</button>
				{/* <button onClick={handleEnhancedSearch}>Enhanced Search</button> */}
				<div id="search-status" style={{ marginTop: '8px', color: '#0af' }}>
					{statusMessage}
				</div>
			</div>

			{/* --- Results --- */}
			{resultsVisible && (
				<div
					id="results-panel"
					style={{
						background: '#111',
						color: '#fff',
						padding: '10px',
						borderRadius: '6px',
						marginBottom: '10px',
					}}
				>
					<div id="results-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
						<h3>Search Results</h3>
						<button onClick={() => setResultsVisible(false)}>×</button>
					</div>
					<div id="results-content" dangerouslySetInnerHTML={{ __html: resultHtml }} />
				</div>
			)}

			{/* --- Viewer --- */}
			<div
				id="openseadragon-viewer"
				ref={osdContainerRef}
				style={{
					width: '100%',
					height: '80vh',
					backgroundColor: '#000',
				}}
			></div>

			{/* --- Mars map overlay --- */}
			{selected === MARS && <MarsAnnotationMap />}

			<div
				id="mars-frame-container"
				ref={marsContainerRef}
				style={{ width: '100%', height: '80vh', display: 'none' }}
			></div>
		</div>
	);
}
