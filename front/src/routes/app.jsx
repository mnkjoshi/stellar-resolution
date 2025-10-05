import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { setupStarOverlays } from "../utils/stars";

const UNWISE = "unwise";
const ANDROMEDA = "andromeda";
const MARS = "mars";

export default function App() {
  const viewerRef = useRef(null);
  const osdContainerRef = useRef(null);
  const marsContainerRef = useRef(null);
  const [selected, setSelected] = useState(UNWISE);
  const viewerInstanceRef = useRef(null);
  const starApiRef = useRef({ updateBrightStars: () => {}, clearStarOverlays: () => {} });

  useEffect(() => {
    // Define tile sources
    const unwiseSource = {
      type: "unwise-neo6",
      width: Math.pow(2, 11) * 256,
      height: Math.pow(2, 11) * 256,
      tileSize: 256,
      minLevel: 1,
      maxLevel: 11,
      getTileUrl: function (level, x, y) {
        return (
          "https://s3.us-west-2.amazonaws.com/unwise-neo6.legacysurvey.org/" +
          level +
          "/" +
          x +
          "/" +
          y +
          ".jpg"
        );
      },
    };

    const andromedaSource = {
      type: "zoomifytileservice",
      width: 69536,
      height: 22230,
      tilesUrl: "https://cdn.esahubble.org/archives/images/zoomable/heic1502a/",
    };

    // Init OSD
    viewerInstanceRef.current = OpenSeadragon({
      element: osdContainerRef.current,
      prefixUrl:
        "https://cdn.jsdelivr.net/npm/openseadragon@4.1.0/build/openseadragon/images/",
      tileSources: unwiseSource,
      showNavigationControl: true,
      showZoomControl: true,
      showHomeControl: true,
      showFullPageControl: true,
      animationTime: 1.2,
    });

    // Setup star overlays
    starApiRef.current = setupStarOverlays(viewerInstanceRef.current);

    // Cleanup on unmount
    return () => {
      try {
        viewerInstanceRef.current && viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      } catch (e) {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    // Toggle views based on `selected`
    const viewer = viewerInstanceRef.current;
    const osdEl = osdContainerRef.current;
    const marsContainer = marsContainerRef.current;
    const MARS_IFRAME_SRC =
      "https://murray-lab.caltech.edu/CTX/V01/SceneView/MurrayLabCTXmosaic.html";

    function showOSD() {
      marsContainer.style.display = "none";
      marsContainer.innerHTML = "";
      osdEl.style.display = "block";
      viewer.viewport && viewer.viewport.goHome(true);
      viewer.forceRedraw();
    }

    function showMarsIframe() {
      osdEl.style.display = "none";
      starApiRef.current.clearStarOverlays();
      if (!marsContainer.querySelector("iframe")) {
        const iframe = document.createElement("iframe");
        iframe.src = MARS_IFRAME_SRC;
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("marginheight", "0");
        iframe.setAttribute("marginwidth", "0");
        iframe.setAttribute("title", "Mars CTX Scene Viewer");
        marsContainer.appendChild(iframe);
      }
      marsContainer.style.display = "block";
    }

    starApiRef.current.clearStarOverlays();

    if (selected === UNWISE) {
      showOSD();
      viewer.open(
        {
          type: unwiseSource.type,
          width: unwiseSource.width,
          height: unwiseSource.height,
          tileSize: unwiseSource.tileSize,
          minLevel: unwiseSource.minLevel,
          maxLevel: unwiseSource.maxLevel,
          getTileUrl: unwiseSource.getTileUrl,
        },
        /* immediately */ true
      );
    } else if (selected === ANDROMEDA) {
      showOSD();
      viewer.open(andromedaSource);
    } else if (selected === MARS) {
      showMarsIframe();
    }
  }, [selected]);

  return (
    <div>
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

      <div
        id="openseadragon-viewer"
        ref={osdContainerRef}
        style={{ width: "100%", height: "90vh", backgroundColor: "#000" }}
      ></div>

      <div
        id="mars-frame-container"
        aria-label="Mars CTX Scene Viewer"
        role="region"
        ref={marsContainerRef}
        style={{ width: "100%", height: "90vh", display: "none" }}
      ></div>
    </div>
  );
}
