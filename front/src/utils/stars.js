import OpenSeadragon from "openseadragon";

export function setupStarOverlays(viewer) {
  let starOverlays = [];
  let debounceTimer;
  const DOT_VISIBILITY_THRESHOLD = 5;
  const TEXT_VISIBILITY_THRESHOLD = 10;

  function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
  }

  async function updateBrightStars() {
    try {
      if (
        viewer.world.getItemCount() === 0 ||
        viewer.world.getItemAt(0).source.getTileUrl(1, 0, 0).indexOf("unwise") === -1
      ) {
        clearStarOverlays();
        return;
      }

      const bounds = viewer.viewport.getBounds();
      const zoom = viewer.viewport.getZoom();
      const ralo = bounds.x * 360;
      const rahi = (bounds.x + bounds.width) * 360;
      const dechi = 90 - bounds.y * 180;
      const declo = 90 - (bounds.y + bounds.height) * 180;

      if (zoom < DOT_VISIBILITY_THRESHOLD) {
        clearStarOverlays();
        return;
      }

      const url = `/api/stars?ralo=${ralo}&rahi=${rahi}&declo=${declo}&dechi=${dechi}`;

      const response = await fetch(url);
      const data = await response.json();
      clearStarOverlays();

      if (data.rd && data.name) {
        const showText = zoom >= TEXT_VISIBILITY_THRESHOLD;
        for (let i = 0; i < data.rd.length; i++) {
          const ra = data.rd[i][0];
          const dec = data.rd[i][1];
          const name = data.name[i];
          const point = new OpenSeadragon.Point(ra / 360, (90 - dec) / 180);

          const overlayDiv = document.createElement("div");
          overlayDiv.className = showText ? "star-label" : "star-dot";
          if (showText) overlayDiv.textContent = name;

          viewer.addOverlay({
            element: overlayDiv,
            location: point,
            placement: "CENTER",
          });
          starOverlays.push(overlayDiv);
        }
      }
    } catch (err) {
      console.error("Failed to fetch bright stars:", err);
    }
  }

  function clearStarOverlays() {
    starOverlays.forEach((el) => viewer.removeOverlay(el));
    starOverlays = [];
  }

  // Hook into viewer
  viewer.addHandler("open", updateBrightStars);
  viewer.addHandler("viewport-change", () => debounce(updateBrightStars, 500));

  return { updateBrightStars, clearStarOverlays };
}
