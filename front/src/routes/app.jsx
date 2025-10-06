import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import Annotorious from "@recogito/annotorious-openseadragon";
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";
import { setupStarOverlays } from "../utils/stars";
import MarsAnnotationMap from "./mars.jsx";

const UNWISE = "unwise";
const ANDROMEDA = "andromeda";
const MARS = "mars";
const BACKEND_URL = "https://stellar-resolution.onrender.com";

export default function App() {
    const osdContainerRef = useRef(null);
    const viewerInstanceRef = useRef(null);
    const starApiRef = useRef({
        updateBrightStars: () => {},
        clearStarOverlays: () => {},
    });

    const [selected, setSelected] = useState(UNWISE);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [resultsVisible, setResultsVisible] = useState(false);
    const [resultHtml, setResultHtml] = useState("");
    const [currentImageAnalysis, setCurrentImageAnalysis] = useState(null);

    const unwiseSource = {
        type: "unwise-neo6",
        width: Math.pow(2, 11) * 256,
        height: Math.pow(2, 11) * 256,
        tileSize: 256,
        minLevel: 1,
        maxLevel: 11,
        getTileUrl: (level, x, y) =>
            `${BACKEND_URL}/tile/unwise/${level}/${x}/${y}.jpg`,
        crossOriginPolicy: "Anonymous",
    };

    const andromedaSource = {
        type: "zoomifytileservice",
        width: 69536,
        height: 22230,
        tilesUrl:
            "https://cdn.esahubble.org/archives/images/zoomable/heic1502a/",
    };

    /** -------- Initialize viewer + annotorious ---------- */
    useEffect(() => {
        const viewer = OpenSeadragon({
            element: osdContainerRef.current,
            prefixUrl:
                "https://cdn.jsdelivr.net/npm/openseadragon@4.1.0/build/openseadragon/images/",
            tileSources: unwiseSource,
            showNavigationControl: true,
            showZoomControl: true,
            showHomeControl: true,
            showFullPageControl: true,
            animationTime: 1.2,
            crossOriginPolicy: "Anonymous",
            zoomPerClick: 1,
        });

        viewerInstanceRef.current = viewer;
        const annotate = Annotorious(viewer, {});

        const fetchAnnotations = async (mapKey) => {
            const res = await fetch(`${BACKEND_URL}/${mapKey}/getLabels`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const annotations = await res.json();
            console.log('Fetched annotations:', annotations);
            annotations.forEach(a => annotate.addAnnotation(a));
        };
        fetchAnnotations(selected);

		annotate.on('createAnnotation', async (annotation) => {
            const res = await fetch(`${BACKEND_URL}/${selected}/addLabel`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(annotation),
			});
			const result = await res.json();
            console.log('Label creation result:', result);
		});

		// annotate.on("updateAnnotation", async (updated, previous) => {
        //     try {
        //         const id = (updated.id || "").toString();
        //         const res = await fetch(`${BACKEND_URL}/${selected}/updateLabel/${encodeURIComponent(id)}`, {
        //             method: "POST",
        //             headers: { "Content-Type": "application/json" },
        //             body: JSON.stringify(updated),
        //         });

        //         if (!res.ok) {
        //             const err = await res.json().catch(() => ({}));
        //             throw new Error(`HTTP ${res.status}: ${err.error || "Update failed"}`);
        //         }

        //         const result = await res.json();
        //         console.log("Updated annotation:", result);
        //     } catch (e) {
        //         console.error("Failed to update annotation:", e);
        //     }
        // });

		// annotate.on('deleteAnnotation', async (annotation) => {
        //     try {
        //         const id = (annotation.id || "").toString();
        //         const res = await fetch(`${BACKEND_URL}/${selected}/deleteLabel/${encodeURIComponent(id)}`, {
        //             method: "DELETE",
        //         });
        //         const result = await res.json();
        //         console.log("Deleted annotation:", result);
        //     } catch (e) {
        //         console.error("Failed to delete annotation:", e);
        //     }

		// });

        // Setup stars
        starApiRef.current = setupStarOverlays(viewer, BACKEND_URL);

        return () => {
            try {
                annotate.destroy();
                viewer.destroy();
            } catch (e) {}
        };
    }, [selected]);

    /** -------- Toggle source on selection ---------- */
    useEffect(() => {
        const viewer = viewerInstanceRef.current;
        const osdEl = osdContainerRef.current;

        function showOSD() {
            osdEl.style.display = "block";
            viewer.viewport && viewer.viewport.goHome(true);
            viewer.forceRedraw();
        }

        function showMarsIframe() {
            osdEl.style.display = "none";
            starApiRef.current.clearStarOverlays();
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
            bounds: {
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: bounds.height,
            },
            center: { x: center.x, y: center.y },
            zoom,
        };
    }

    async function getViewerScreenshotDataURL() {
        const viewer = viewerInstanceRef.current;
        if (!viewer.drawer?.canvas) {
            await new Promise((resolve) =>
                viewer.addOnceHandler("tile-drawn", () => resolve())
            );
        }
        return viewer.drawer.canvas.toDataURL("image/png");
    }

    /** -------- Render result cards ---------- */
    function renderAnalysisCard(title, analysisObj) {
        const a = analysisObj || {};
        let html = `<h3>${title}</h3>`;
        if (a.analysis) html += `<h4>Analysis</h4><p>${a.analysis}</p>`;
        if (a.features?.length)
            html += `<h4>Features</h4><ul>${a.features
                .map((f) => `<li>${f}</li>`)
                .join("")}</ul>`;
        if (a.notable_objects?.length)
            html += `<h4>Notable Objects</h4><ul>${a.notable_objects
                .map((o) => `<li>${o}</li>`)
                .join("")}</ul>`;
        if (a.scale_estimate)
            html += `<h4>Scale</h4><p>${a.scale_estimate}</p>`;
        if (typeof a.confidence === "number") {
            const pct = Math.round(
                Math.max(0, Math.min(1, a.confidence)) * 100
            );
            html += `<h4>Confidence</h4><p>${pct}%</p>`;
        }
        // Classification: show best guess and list of candidates with confidences
        if (Array.isArray(a.classification) && a.classification.length > 0) {
            // best guess = highest confidence entry
            const best = a.classification.reduce((prev, cur) =>
                (cur?.confidence ?? 0) > (prev?.confidence ?? 0) ? cur : prev
            );
            if (best) {
                const bestPct = Math.round((best.confidence ?? 0) * 100);
                html += `<h4>Classification (best guess)</h4><p><strong>${
                    best.label
                }</strong>${
                    best.subtype ? ` — ${best.subtype}` : ""
                } (${bestPct}%)</p>`;
                if (best.notes)
                    html += `<p class="classification-notes">${best.notes}</p>`;
            }

            // full candidate list
            html += `<h5>Candidates</h5><ul>`;
            a.classification
                .slice()
                .sort((x, y) => (y.confidence ?? 0) - (x.confidence ?? 0))
                .forEach((c) => {
                    const label = c?.label ?? "unknown";
                    const subtype = c?.subtype ? ` — ${c.subtype}` : "";
                    const pct = Math.round((c?.confidence ?? 0) * 100);
                    const notes = c?.notes ? ` — ${c.notes}` : "";
                    html += `<li><strong>${label}</strong>${subtype} <span style="opacity:0.85">(${pct}%)</span>${notes}</li>`;
                });
            html += `</ul>`;
        }
        setResultHtml(html);
        setResultsVisible(true);
    }

    /** -------- Search + Analyze handlers ---------- */
    async function handleSearch() {
        const query = searchQuery.trim();
        if (!query) return;
        const mapType = selected;
        setStatusMessage("Searching...");

        try {
            const res = await fetch(`${BACKEND_URL}/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, mapType }),
            });
            const result = await res.json();
            if (result.found) {
                const viewer = viewerInstanceRef.current;
                // after you load your tileSource and have the viewer ready...
                const tiledImage = viewer.world.getItemAt(0); // or whichever item you're using
                const imgPt = new OpenSeadragon.Point(
                    result.coordinates.x,
                    result.coordinates.y
                );

                const vpPt = tiledImage.imageToViewportCoordinates(imgPt);
                viewer.viewport.panTo(vpPt, true);

                const zoom = result.zoom_level
                    ? tiledImage.imageToViewportZoom(result.zoom_level)
                    : 1;

                viewer.viewport.zoomTo(zoom, vpPt, true);
                viewer.viewport.ensureVisible(true);
                renderAnalysisCard("Search Result", {
                    analysis: result.description,
                    confidence: result.confidence,
                });
                setStatusMessage(`Found: ${result.description}`);
            } else {
                setResultHtml(`<p>${result.message || "Not found"}</p>`);
                setResultsVisible(true);
                setStatusMessage("Not found");
            }
        } catch (err) {
            setStatusMessage("Search failed: " + err.message);
        }
    }

    async function handleAnalyze() {
        const mapType = selected;
        setStatusMessage("Analyzing view...");
        try {
            const dataUrl = await getViewerScreenshotDataURL();
            const res = await fetch(`${BACKEND_URL}/analyze-image`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageData: dataUrl,
                    mapType,
                    currentView: getCurrentViewInfo(),
                    query: searchQuery,
                }),
            });
            const result = await res.json();
            setCurrentImageAnalysis(result.analysis);
            renderAnalysisCard("Image Analysis", result.analysis);
            setStatusMessage("Analysis complete.");
        } catch (err) {
            setStatusMessage("Analysis failed: " + err.message);
        }
    }

    async function handleEnhancedSearch() {
        const query = searchQuery.trim();
        if (!query) {
            setStatusMessage("Please enter a query");
            return;
        }
        const mapType = selected;
        setStatusMessage("Enhanced searching...");
        try {
            let analysis = currentImageAnalysis;
            if (!analysis) {
                await handleAnalyze();
                analysis = currentImageAnalysis;
            }
            const res = await fetch(`${BACKEND_URL}/search-with-context`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                const point = new OpenSeadragon.Point(
                    result.coordinates.x,
                    result.coordinates.y
                );
                viewer.viewport.panTo(point, true);
                viewer.viewport.zoomTo(result.zoom_level || 0.7, point, true);
                renderAnalysisCard("Enhanced Search Result", {
                    analysis: result.description,
                    confidence: result.confidence,
                });
                setStatusMessage("Enhanced search complete");
            } else {
                setResultHtml(`<p>${result.message || "Not found"}</p>`);
                setResultsVisible(true);
                setStatusMessage("Not found");
            }
        } catch (err) {
            setStatusMessage("Enhanced search failed: " + err.message);
        }
    }

    return (
        <div
            className="app-container"
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <style>{`
                /* layout: viewer (left) + results (right). responsive: stacks on small screens */
                .main-content { display: flex; flex-direction: row; gap: 12px; align-items: flex-start; width: 100%; }
                .viewer-column { flex: 1 1 80%; min-width: 0; } /* min-width:0 to allow proper flex shrinking */
                .results-column { width: 20%; min-width: 220px; max-width: 360px; overflow-y: auto; box-shadow: 0 0 8px rgba(0,0,0,0.08); background: #fff; border-left: 1px solid rgba(0,0,0,0.06); }
                .results-column .results-header { display:flex; justify-content:space-between; align-items:center; padding:0.5rem; border-bottom:1px solid rgba(0,0,0,0.06); }
                .results-column .results-content { padding:0.5rem; }
                @media (max-width: 800px) {
                    .main-content { flex-direction: column; }
                    .results-column { width: 100%; max-height: 30vh; min-width: 0; }
                }
            `}</style>
            <div className="controls-panel">
                <div className="search-container">
                    <div className="search-input-group">
                        <div className="dropdown-group">
                            <label htmlFor="viewer-select" className="dropdown-label">
                                Select Map:
                            </label>
                            <select
                                id="viewer-select"
                                className="viewer-dropdown"
                                value={selected}
                                onChange={(e) => setSelected(e.target.value)}
                            >
                                <option value={UNWISE}>unWISE NEO6</option>
                                <option value={ANDROMEDA}>Andromeda Galaxy</option>
                                <option value={MARS}>Mars</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Ask me to find something on the map..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                        />
                        <div className="button-group">
                            <button
                                className="btn btn-primary"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={handleAnalyze}
                            >
                                Analyze View
                            </button>
                        </div>
                    </div>
                    <div className="search-status">{statusMessage}</div>
                </div>
            </div>

            {/* --- Results --- */}
            {resultsVisible && (
                <div
                    className="results-panel"
                    style={{
                        position: "relative",
                        maxHeight: "30vh",
                        overflowY: "auto",
                        zIndex: 1,
                        margin: "0.5rem 0",
                    }}
                >
                    <div className="results-header">
                        <h3>Search Results</h3>
                        <button
                            className="btn btn-close"
                            onClick={() => setResultsVisible(false)}
                        >
                            x
                        </button>
                    </div>
                    <div
                        className="results-content"
                        dangerouslySetInnerHTML={{ __html: resultHtml }}
                    />
                </div>
            )}

            {/* --- Viewer --- */}
            <div
                className="viewer-container"
                style={{
                    flex: "1 1 auto",
                    minHeight: "50vh",
                    overflow: "auto",
                }}
            >
                <div
                    id="openseadragon-viewer"
                    ref={osdContainerRef}
                    className="map-canvas"
                ></div>

                {/* --- Mars map overlay --- */}
                {selected === MARS && <MarsAnnotationMap />}
                <div className="viewer-source-text">
                    {selected === ANDROMEDA ? (
                        <span>ESA/Hubble</span>
                    ) : selected === UNWISE ? (
                        <span>
                            unWISE / NASA/JPL-Caltech / D. Lang (Perimeter Institute)
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
