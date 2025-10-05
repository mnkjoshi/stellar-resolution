import OpenSeadragon from "openseadragon";
import {
    ra2long,
    long2ra,
    dec2lat,
    lat2dec,
    long2x,
    x2long,
    lat2y,
    y2lat,
} from "./utils.js";

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
                viewer.world
                    .getItemAt(0)
                    .source.getTileUrl(1, 0, 0)
                    .indexOf("unwise") === -1
            ) {
                clearStarOverlays();
                return;
            }

            const bounds = viewer.viewport.getBounds();
            const zoom = viewer.viewport.getZoom();
            const width = 256 * Math.pow(2, 11);
            const height = width;

            const rahi = long2ra(x2long(bounds.x * width, width));
            const ralo = long2ra(
                x2long((bounds.x + bounds.width) * width, width)
            );
            const declo = dec2lat(
                y2lat((bounds.y + bounds.height) * height, width, height)
            );
            const dechi = dec2lat(y2lat(bounds.y * height, width, height));

            if (zoom < DOT_VISIBILITY_THRESHOLD) {
                clearStarOverlays();
                return;
            }

            const url = `http://localhost:3001/api/stars?ralo=${ralo}&rahi=${rahi}&declo=${declo}&dechi=${dechi}`;

            const response = await fetch(url);
            const data = await response.json();
            clearStarOverlays();

            if (data.rd && data.name) {
                const showText = zoom >= TEXT_VISIBILITY_THRESHOLD;
                for (let i = 0; i < data.rd.length; i++) {
                    const x = long2x(ra2long(data.rd[i][0]), width);
                    const y = lat2y(dec2lat(data.rd[i][1]), width, height);
                    const name = data.name[i];
                    const point = new OpenSeadragon.Point(
                        x / width,
                        y / height
                    );
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
    viewer.addHandler("viewport-change", () =>
        debounce(updateBrightStars, 500)
    );

    return { updateBrightStars, clearStarOverlays };
}
