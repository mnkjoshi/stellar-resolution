const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const axios = require("axios");
const utils = require("./utils/utils");

//https://dashboard.render.com/web/srv-crcllkqj1k6c73coiv10/events
//https://console.firebase.google.com/u/0/project/the-golden-hind/database/the-golden-hind-default-rtdb/data/~2F

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({ origin: "*" }));

dotenv.config();

app.get("/api/stars", async (req, res) => {
    try {
        const { ralo, rahi, declo, dechi } = req.query;
        const apiUrl = `https://www.legacysurvey.org/viewer/bright/1/cat.json?ralo=${ralo}&rahi=${rahi}&declo=${declo}&dechi=${dechi}`;

        console.log(`Proxying request to: ${apiUrl}`);
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Error in proxy request:", error.message);
        res.status(500).json({
            error: "Failed to fetch data from external API",
        });
    }
});

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

/* ------------------------- Firestore Labeling ------------------------- */

const firebaseApp = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(firebaseApp);

app.get("/:map/getLabels", async (req, res) => {
    try {
        const mapKey = String(req.params.map || "").toLowerCase();
        const snapshot = await db.collection(`${mapKey}-labels`).get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching labels:", error);
        res.status(500).json({ error: "Failed to fetch labels" });
    }
});

app.post("/:map/addLabel", async (req, res) => {
    try {
        const mapKey = String(req.params.map || "").toLowerCase();
        const annotationJSON = req.body;
        const docRef = db.collection(`${mapKey}-labels`).doc(annotationJSON.id);
        await docRef.set(annotationJSON);
        res.status(201).json({ id: docRef.id });
    } catch (error) {
        console.error("Error adding label:", error);
        res.status(500).json({ error: "Failed to add label" });
    }
});

app.post("/:map/updateLabel/:id", async (req, res) => {
    try {
        const mapKey = String(req.params.map || "").toLowerCase();
        const annotationJSON = req.body;
        const incomingId = (req.params.id ?? annotationJSON?.id ?? "").toString().trim();
        if (!incomingId) return res.status(400).json({ error: "Missing annotation id" });
        if (incomingId.includes("/")) return res.status(400).json({ error: "Annotation id cannot contain '/'" });

        await db.collection(`${mapKey}-labels`).doc(incomingId).set(annotationJSON);
        res.status(200).json({ id: incomingId, ok: true }); 
    }
    catch (error) {
        console.error("Error updating label:", error);
        res.status(500).json({ error: "Failed to update label", detail: String(error) });
    }
});

app.delete("/:map/deleteLabel/:id", async (req, res) => {
    try {
        const mapKey = String(req.params.map || "").toLowerCase();
        const annotationJSON = req.body;
        const incomingId = (req.params.id ?? annotationJSON?.id ?? "").toString().trim();

        if (!incomingId) return res.status(400).json({ error: "Missing annotation id" });

        const docRef = db.collection(`${mapKey}-labels`).doc(incomingId);
        const snapshot = await docRef.get();
        if (!snapshot.exists) return res.status(404).json({ error: "Annotation not found" });
        await docRef.delete();
        res.status(200).json({ ok: true, id: incomingId, message: "Annotation deleted" });
    } catch (error) {
        console.error("Error deleting label:", error);
        res.status(500).json({ error: "Failed to delete label", detail: String(error) });
    }
});


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ------------------------- Bright stars (for overlays) ------------------------- */
const BRIGHT_STARS = [
    { name: "Sirius", ra: 101.2875, dec: -16.7161, mag: -1.46 },
    { name: "Canopus", ra: 95.9879, dec: -52.6957, mag: -0.74 },
    { name: "Arcturus", ra: 213.9154, dec: 19.1824, mag: -0.05 },
    { name: "Alpha Centauri", ra: 219.9021, dec: -60.8339, mag: -0.27 },
    { name: "Vega", ra: 279.2347, dec: 38.7837, mag: 0.03 },
    { name: "Capella", ra: 79.1723, dec: 45.9979, mag: 0.08 },
    { name: "Rigel", ra: 78.6345, dec: -8.2016, mag: 0.12 },
    { name: "Procyon", ra: 114.8255, dec: 5.225, mag: 0.38 },
    { name: "Achernar", ra: 24.4286, dec: -57.2367, mag: 0.46 },
    { name: "Betelgeuse", ra: 88.7929, dec: 7.4071, mag: 0.5 },
    { name: "Hadar", ra: 210.9558, dec: -60.3731, mag: 0.61 },
    { name: "Altair", ra: 297.6958, dec: 8.8683, mag: 0.77 },
    { name: "Aldebaran", ra: 68.98, dec: 16.5093, mag: 0.87 },
    { name: "Antares", ra: 247.3519, dec: -26.432, mag: 1.09 },
    { name: "Spica", ra: 201.2983, dec: -11.1613, mag: 0.98 },
    { name: "Pollux", ra: 116.3289, dec: 28.0262, mag: 1.14 },
    { name: "Fomalhaut", ra: 344.4128, dec: -29.6222, mag: 1.16 },
    { name: "Deneb", ra: 310.3579, dec: 45.2803, mag: 1.25 },
    { name: "Regulus", ra: 152.0929, dec: 11.9672, mag: 1.35 },
    { name: "Bellatrix", ra: 81.2828, dec: 6.3497, mag: 1.64 },
];

/* ------------------------- Map metadata ------------------------- */
const mapKnowledge = {
    unwise: {
        type: "astronomical_survey",
        description:
            "Wide-field Infrared Survey Explorer (WISE) astronomical survey data",
        coordinate_system: "equatorial",
        bounds: { ra: { min: 0, max: 360 }, dec: { min: -90, max: 90 } },
        notable_objects: {
            "galactic center": {
                ra: 266.4,
                dec: -29.0,
                description: "Center of the Milky Way galaxy",
            },
            "andromeda galaxy": {
                ra: 10.7,
                dec: 41.3,
                description: "Nearest major galaxy to Milky Way",
            },
            "orion nebula": {
                ra: 83.8,
                dec: -5.4,
                description: "Famous star-forming region",
            },
            vega: {
                ra: 279.2,
                dec: 38.8,
                description: "Bright star in constellation Lyra",
            },
            betelgeuse: {
                ra: 88.8,
                dec: 7.4,
                description: "Red supergiant star in Orion",
            },
            sirius: {
                ra: 101.3,
                dec: -16.7,
                description: "Brightest star in the night sky",
            },
            pleiades: {
                ra: 56.8,
                dec: 24.1,
                description: "Famous star cluster",
            },
            "crab nebula": {
                ra: 83.6,
                dec: 22.0,
                description: "Supernova remnant",
            },
        },
    },
    andromeda: {
        type: "galaxy_image",
        description: "High-resolution image of the Andromeda Galaxy (M31)",
        coordinate_system: "image_pixels",
        bounds: { x: { min: 0, max: 69536 }, y: { min: 0, max: 22230 } },
        notable_objects: {
            "galaxy center": {
                x: 1500,
                y: 20000,
                description: "Central black hole and bulge of Andromeda",
            },
            "spiral arms": {
                x: 25000,
                y: 8000,
                description: "Prominent spiral arm structure",
            },
            "star forming regions": {
                x: 40000,
                y: 13000,
                description: "Active star formation areas",
            },
            "dust lanes": {
                x: 30000,
                y: 10000,
                description: "Dark dust lanes in the galaxy",
            },
        },
    },
    mars: {
        type: "planetary_surface",
        description: "Mars Context Camera (CTX) mosaic showing Martian surface",
        coordinate_system: "mars_geographic",
        bounds: {
            longitude: { min: -180, max: 180 },
            latitude: { min: -90, max: 90 },
        },
        notable_objects: {
            "olympus mons": {
                longitude: -133.8,
                latitude: 18.65,
                description: "Largest volcano in the solar system",
            },
            "valles marineris": {
                longitude: -75.0,
                latitude: -14.0,
                description: "Largest canyon system on Mars",
            },
            "hellas basin": {
                longitude: 70.0,
                latitude: -42.4,
                description: "Largest visible crater on Mars",
            },
            "polar ice cap": {
                longitude: 0,
                latitude: 90,
                description: "North polar ice cap",
            },
            "gale crater": {
                longitude: 137.8,
                latitude: -5.4,
                description: "Landing site of Curiosity rover",
            },
            "jezero crater": {
                longitude: 77.5,
                latitude: 18.4,
                description: "Landing site of Perseverance rover",
            },
            "chryse planitia": {
                longitude: -27.0,
                latitude: 22.5,
                description: "Landing site of Viking 1",
            },
            "utopia planitia": {
                longitude: 117.5,
                latitude: 50.0,
                description: "Landing site of Viking 2",
            },
        },
    },
};

/* ------------------------- Helpers ------------------------- */
function convertCoordinates(mapType, coordinates) {
    const mapInfo = mapKnowledge[mapType];
    switch (mapType) {
        case "unwise": {
            const x = utils.long2x(
                utils.ra2long(coordinates.ra),
                256 * Math.pow(2, 11)
            );
            const y = utils.lat2y(
                utils.dec2lat(coordinates.dec),
                256 * Math.pow(2, 11),
                256 * Math.pow(2, 11)
            );
            return { x, y };
        }
        case "andromeda": {
            return {
                x: coordinates.x,
                y: coordinates.y,
            };
        }
        case "mars": {
            const x = (coordinates.longitude + 180) / 360.0;
            const y = 1 - (coordinates.latitude + 90) / 180.0;
            return { x, y };
        }
        default:
            return coordinates;
    }
}

/** Robustly parse JSON from an LLM reply that may contain code fences or extra text. */
function parseLLMJson(responseText) {
    if (!responseText || typeof responseText !== "string") return null;
    // 1) strip code fences if present
    let t = responseText
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```$/i, "")
        .trim();
    // 2) try full parse
    try {
        return JSON.parse(t);
    } catch {}
    // 3) try to extract the first {...} block
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
        const maybe = t.slice(start, end + 1);
        try {
            return JSON.parse(maybe);
        } catch {}
    }
    return null;
}

/* ------------------------- Tile proxy (UnWISE) ------------------------- */
app.get("/tile/unwise/:level/:x/:y.jpg", async (req, res) => {
    try {
        const { level, x, y } = req.params;
        const originUrl = `https://s3.us-west-2.amazonaws.com/unwise-neo6.legacysurvey.org/${level}/${x}/${y}.jpg`;
        const r = await fetch(originUrl);
        if (!r.ok)
            return res.status(r.status).send(`Upstream error: ${r.statusText}`);
        const ab = await r.arrayBuffer();
        res.set("Content-Type", r.headers.get("content-type") || "image/jpeg");
        res.set("Cache-Control", "public, max-age=31536000, immutable");
        res.send(Buffer.from(ab));
    } catch (e) {
        console.error("Tile proxy error:", e);
        res.status(502).send("Tile proxy failed");
    }
});

/* ------------------------- Stars endpoint ------------------------- */
app.get("/stars/bright", (req, res) => {
    res.json({ stars: BRIGHT_STARS });
});

/* ------------------------- Search ------------------------- */
app.post("/search", async (req, res) => {
    try {
        const { query, mapType } = req.body;
        if (!query || !mapType)
            return res
                .status(400)
                .json({ error: "Query and mapType are required" });
        if (!mapKnowledge[mapType])
            return res
                .status(400)
                .json({ error: `Unsupported map type: ${mapType}` });

        const mapInfo = mapKnowledge[mapType];
        const systemPrompt = `You are an expert astronomical and planetary geography assistant. You help users find locations on different types of maps.

Current map type: ${mapType}
Map description: ${mapInfo.description}
Coordinate system: ${mapInfo.coordinate_system}

Known objects for this map:
${Object.entries(mapInfo.notable_objects)
    .map(([name, obj]) => `- ${name}: ${JSON.stringify(obj)}`)
    .join("\n")}

Return strict JSON: {"found": true|false, "coordinates": {...}, "description": "", "confidence": 0-1, "zoom_level": 2-10}`;
        const userPrompt = `User query: "${query}". Respond with JSON only; do not include markdown or code fences.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 500,
        });

        const responseText = completion?.choices?.[0]?.message?.content ?? "";
        const parsed = parseLLMJson(responseText);
        if (!parsed)
            return res.status(500).json({
                error: "LLM response was not JSON",
                raw_response: responseText,
            });

        if (!parsed.found) {
            return res.json({
                found: false,
                message: parsed.description || "Location not found",
                confidence: parsed.confidence || 0,
            });
        }
        const normalizedCoords = convertCoordinates(
            mapType,
            parsed.coordinates
        );
        res.json({
            found: true,
            coordinates: normalizedCoords,
            originalQuery: query,
            description: parsed.description,
            confidence: parsed.confidence,
            zoom_level: parsed.zoom_level || 0.7,
            raw_coordinates: parsed.coordinates,
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});

/* ------------------------- Analyze (image pixels) ------------------------- */
app.post("/analyze-image", async (req, res) => {
    try {
        const { imageData, mapType, currentView, query } = req.body;
        if (!imageData || !mapType)
            return res
                .status(400)
                .json({ error: "Image data and map type are required" });
        if (!mapKnowledge[mapType])
            return res
                .status(400)
                .json({ error: `Unsupported map type: ${mapType}` });

        const mapInfo = mapKnowledge[mapType];
        const isDataUrl =
            typeof imageData === "string" && imageData.startsWith("data:");
        if (isDataUrl) {
            const base64Len = imageData.replace(
                /^data:[^;]+;base64,/i,
                ""
            ).length;
            console.log("Received image data (base64 length):", base64Len);
        } else {
            console.log("Received image URL:", String(imageData).slice(0, 128));
        }

        const analysisPrompt = `You are an expert in analyzing ${
            mapInfo.description
        }.
Current view (normalized coords): ${
            currentView ? JSON.stringify(currentView) : "Unknown"
        }

Analyze the image and return STRICT JSON (no markdown, no code fences). In addition to a concise natural-language description, attempt to classify what the image most likely contains (e.g. planet, moon, star, galaxy, nebula, star cluster, spacecraft, surface terrain, instrument artifact, unknown). For each classification provide a confidence between 0.0 and 1.0. If uncertain, include "unknown" with low confidence.

Return this JSON shape exactly:
{
  "analysis": "concise natural-language description of what you see",
  "features": ["list", "of", "features"],
  "notable_objects": ["objects if any"],
  "scale_estimate": "words about scale/zoom/extent",
  "query_response": "answer the user query if provided",
  "confidence": 0.0-1.0,
  "classification": [
     { "label": "planet|star|galaxy|nebula|moon|cluster|terrain|artifact|unknown", "subtype": "optional more specific label (e.g. Mars, Andromeda)", "confidence": 0.0-1.0, "notes": "optional brief justification" }
  ]
}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: analysisPrompt },
                        {
                            type: "image_url",
                            image_url: { url: imageData, detail: "high" },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
            temperature: 0.3,
        });

        const responseText = completion?.choices?.[0]?.message?.content ?? "";
        let analysisResult = parseLLMJson(responseText);
        if (!analysisResult) {
            // Fallback: keep text but strip fences if present
            const stripped = responseText
                .trim()
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/```$/i, "")
                .trim();
            analysisResult = {
                analysis: stripped,
                features: [],
                notable_objects: [],
                scale_estimate: "Unknown",
                query_response: stripped,
                confidence: 0.5,
                classification: [
                    {
                        label: "unknown",
                        subtype: "",
                        confidence: 0.5,
                        notes: "Fallback: raw textual analysis used because JSON parsing failed",
                    },
                ],
            };
        }

        // normalize top-level confidence
        if (
            typeof analysisResult.confidence === "number" &&
            analysisResult.confidence > 1 &&
            analysisResult.confidence <= 100
        ) {
            analysisResult.confidence = analysisResult.confidence / 100;
        }

        // ensure classification array exists and normalize confidences inside it
        if (!Array.isArray(analysisResult.classification)) {
            analysisResult.classification = analysisResult.classification
                ? [analysisResult.classification]
                : [];
        }
        analysisResult.classification = analysisResult.classification.map(
            (c) => {
                if (!c || typeof c !== "object") {
                    return {
                        label: String(c || "unknown"),
                        subtype: "",
                        confidence: 0.0,
                        notes: "",
                    };
                }
                let conf = Number(c.confidence ?? c.conf ?? 0);
                if (isNaN(conf)) conf = 0;
                if (conf > 1 && conf <= 100) conf = conf / 100;
                if (conf < 0) conf = 0;
                if (conf > 1) conf = 1;
                return {
                    label: String(c.label ?? "unknown"),
                    subtype: String(c.subtype ?? c.detail ?? ""),
                    confidence: conf,
                    notes: String(c.notes ?? c.explanation ?? ""),
                };
            }
        );

        res.json({
            success: true,
            mapType,
            currentView,
            analysis: analysisResult,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Image analysis error:", error?.response?.data || error);
        res.status(500).json({
            error: "Image analysis failed",
            message: error.message,
            detail: error?.response?.data || null,
        });
    }
});

/* ------------------------- Analyze (viewport fallback) ------------------------- */
app.post("/analyze-viewport", async (req, res) => {
    try {
        const { viewportData, mapType, query } = req.body;
        if (!viewportData || !mapType)
            return res
                .status(400)
                .json({ error: "Viewport data and map type are required" });
        if (!mapKnowledge[mapType])
            return res
                .status(400)
                .json({ error: `Unsupported map type: ${mapType}` });

        const mapInfo = mapKnowledge[mapType];
        const viewport = viewportData.viewport;

        let actualCoordinates = {};
        switch (mapType) {
            case "unwise":
                actualCoordinates = {
                    centerRA: viewport.center.x * 360.0,
                    centerDec: (1 - viewport.center.y) * 180.0 - 90.0,
                    fieldWidth: viewport.bounds.width * 360.0,
                    fieldHeight: viewport.bounds.height * 180.0,
                };
                break;
            case "andromeda":
                actualCoordinates = {
                    centerX: viewport.center.x * mapInfo.bounds.x.max,
                    centerY: viewport.center.y * mapInfo.bounds.y.max,
                    fieldWidth: viewport.bounds.width * mapInfo.bounds.x.max,
                    fieldHeight: viewport.bounds.height * mapInfo.bounds.y.max,
                };
                break;
            case "mars":
                actualCoordinates = {
                    centerLon: viewport.center.x * 360.0 - 180.0,
                    centerLat: (1 - viewport.center.y) * 180.0 - 90.0,
                    fieldWidth: viewport.bounds.width * 360.0,
                    fieldHeight: viewport.bounds.height * 180.0,
                };
                break;
        }

        const nearbyObjects = [];
        for (const [name, obj] of Object.entries(mapInfo.notable_objects)) {
            let isNearby = false;
            if (mapType === "unwise") {
                const raDistance = Math.abs(
                    obj.ra - actualCoordinates.centerRA
                );
                const decDistance = Math.abs(
                    obj.dec - actualCoordinates.centerDec
                );
                isNearby =
                    raDistance < actualCoordinates.fieldWidth / 2 &&
                    decDistance < actualCoordinates.fieldHeight / 2;
            } else if (mapType === "andromeda") {
                const xDistance = Math.abs(obj.x - actualCoordinates.centerX);
                const yDistance = Math.abs(obj.y - actualCoordinates.centerY);
                isNearby =
                    xDistance < actualCoordinates.fieldWidth / 2 &&
                    yDistance < actualCoordinates.fieldHeight / 2;
            } else if (mapType === "mars") {
                const lonDistance = Math.abs(
                    obj.longitude - actualCoordinates.centerLon
                );
                const latDistance = Math.abs(
                    obj.latitude - actualCoordinates.centerLat
                );
                isNearby =
                    lonDistance < actualCoordinates.fieldWidth / 2 &&
                    latDistance < actualCoordinates.fieldHeight / 2;
            }
            if (isNearby) nearbyObjects.push({ name, ...obj });
        }

        const analysisPrompt = `You are an expert in analyzing ${
            mapInfo.description
        }.
Current viewport coordinates: ${JSON.stringify(actualCoordinates, null, 2)}
Known objects possibly visible:\n${
            nearbyObjects
                .map((o) => `- ${o.name}: ${o.description}`)
                .join("\n") || "None"
        }

Return STRICT JSON (no markdown):
{
  "analysis": "what should be visible",
  "features": ["likely features"],
  "notable_objects": ["names if any"],
  "scale_estimate": "FOV/scale words",
  "query_response": "${query || ""}",
  "confidence": 0.0-1.0,
  "nearby_known_objects": ["${nearbyObjects.map((o) => o.name).join('", "')}"]
}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: analysisPrompt }],
            max_tokens: 800,
            temperature: 0.3,
        });

        const responseText = completion?.choices?.[0]?.message?.content ?? "";
        let analysisResult = parseLLMJson(responseText);
        if (!analysisResult) {
            const stripped = responseText
                .trim()
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/```$/i, "")
                .trim();
            analysisResult = {
                analysis: stripped,
                features: nearbyObjects.map((o) => o.name),
                notable_objects: nearbyObjects.map((o) => o.name),
                scale_estimate: `Field of view: ${actualCoordinates.fieldWidth?.toFixed(
                    2
                )} x ${actualCoordinates.fieldHeight?.toFixed(2)}`,
                query_response: stripped,
                confidence: 0.7,
                nearby_known_objects: nearbyObjects.map((o) => o.name),
            };
        }
        if (
            typeof analysisResult.confidence === "number" &&
            analysisResult.confidence > 1 &&
            analysisResult.confidence <= 100
        ) {
            analysisResult.confidence = analysisResult.confidence / 100;
        }

        res.json({
            success: true,
            mapType,
            viewportData,
            actualCoordinates,
            nearbyObjects,
            analysis: analysisResult,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Viewport analysis error:", error);
        res.status(500).json({
            error: "Viewport analysis failed",
            message: error.message,
        });
    }
});

/* ------------------------- Enhanced search ------------------------- */
app.post("/search-with-context", async (req, res) => {
    try {
        const { query, mapType, imageAnalysis, currentView } = req.body;
        if (!query || !mapType)
            return res
                .status(400)
                .json({ error: "Query and mapType are required" });
        if (!mapKnowledge[mapType])
            return res
                .status(400)
                .json({ error: `Unsupported map type: ${mapType}` });

        const mapInfo = mapKnowledge[mapType];
        let contextualPrompt = `You are an expert astronomical and planetary geography assistant.

Current map type: ${mapType}
Map description: ${mapInfo.description}
Coordinate system: ${mapInfo.coordinate_system}

Known objects:\n${Object.entries(mapInfo.notable_objects)
            .map(([n, o]) => `- ${n}: ${JSON.stringify(o)}`)
            .join("\n")}\n`;
        if (imageAnalysis) {
            contextualPrompt += `Current view analysis: ${JSON.stringify(
                imageAnalysis
            )}\n`;
        }
        if (currentView) {
            contextualPrompt += `Current viewport (normalized): ${JSON.stringify(
                currentView
            )}\n`;
        }
        contextualPrompt += `User query: "${query}"\nReturn STRICT JSON: {"found": true|false, "coordinates": {...}, "description": "", "confidence": 0-1, "zoom_level": 2-10, "context_used": ""}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: contextualPrompt }],
            temperature: 0.3,
            max_tokens: 600,
        });

        const responseText = completion?.choices?.[0]?.message?.content ?? "";
        const llmResponse = parseLLMJson(responseText);
        if (!llmResponse)
            return res.status(500).json({
                error: "LLM response was not JSON",
                raw_response: responseText,
            });

        if (!llmResponse.found) {
            return res.json({
                found: false,
                message: llmResponse.description || "Location not found",
                confidence: llmResponse.confidence || 0,
            });
        }

        const normalizedCoords = convertCoordinates(
            mapType,
            llmResponse.coordinates
        );
        res.json({
            found: true,
            coordinates: normalizedCoords,
            originalQuery: query,
            description: llmResponse.description,
            confidence: llmResponse.confidence,
            zoom_level: llmResponse.zoom_level || 0.7,
            raw_coordinates: llmResponse.coordinates,
            context_used: llmResponse.context_used || false,
            used_image_analysis: !!imageAnalysis,
        });
    } catch (error) {
        console.error("Contextual search error:", error);
        res.status(500).json({
            error: "Search failed",
            message: error.message,
        });
    }
});

/* ------------------------- Map list ------------------------- */
app.get("/maps", (req, res) => {
    const mapSummary = Object.entries(mapKnowledge).map(([key, info]) => ({
        key,
        type: info.type,
        description: info.description,
        coordinate_system: info.coordinate_system,
        notable_objects: Object.keys(info.notable_objects),
    }));
    res.json(mapSummary);
});

app.listen(PORT, () => {
    console.log(`Map search backend running on port ${PORT}`);
    console.log(
        `Tile proxy: http://localhost:${PORT}/tile/unwise/{level}/{x}/{y}.jpg`
    );
    console.log(`Stars: http://localhost:${PORT}/stars/bright`);
});

