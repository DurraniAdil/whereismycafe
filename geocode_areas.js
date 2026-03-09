import fs from 'fs';
import https from 'https';

const data = JSON.parse(fs.readFileSync('src/data/cafes.json', 'utf8'));

// A simple cache to avoid repeatedly geocoding the exact same area string
const geoCache = {};

function geocodeArea(areaQuery) {
    return new Promise((resolve) => {
        if (geoCache[areaQuery]) {
            return resolve(geoCache[areaQuery]);
        }

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(areaQuery)}&format=json&limit=1`;

        https.get(url, { headers: { 'User-Agent': 'WIMCCafeMap/1.0' } }, (res) => {
            let body = '';
            res.on('data', chunk => { body += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (json && json.length > 0) {
                        const coords = { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) };
                        geoCache[areaQuery] = coords;
                        resolve(coords);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

// Add a slight random dispersion (approx 50-150 meters) to avoid marker overlap
function addDispersion(lat, lon) {
    const rLat = (Math.random() - 0.5) * 0.003;
    const rLon = (Math.random() - 0.5) * 0.003;
    return [lat + rLat, lon + rLon];
}

async function run() {
    let updated = 0;

    // Default city center if all else fails
    const fallbackLat = 19.8762;
    const fallbackLon = 75.3433;

    for (const cafe of data.cafes) {
        let query = cafe.area;
        if (!query.includes('Aurangabad')) {
            query += ', Aurangabad, Maharashtra';
        } else if (!query.includes('Maharashtra')) {
            query += ', Maharashtra';
        }

        console.log(`Geocoding area: ${query}...`);

        let coords = await geocodeArea(query);

        // Sometimes specific areas fail, fall back to Aurangabad center
        if (!coords) {
            coords = { lat: fallbackLat, lon: fallbackLon };
        }

        const [finalLat, finalLon] = addDispersion(coords.lat, coords.lon);

        cafe.latitude = finalLat;
        cafe.longitude = finalLon;
        updated++;

        // Respect Nominatim's 1 req/sec limit if it wasn't a cache hit
        await new Promise(r => setTimeout(r, 1100));
    }

    fs.writeFileSync('src/data/cafes.json', JSON.stringify(data, null, 2));
    console.log(`\nSuccessfully populated coordinates for ${updated} cafes.`);
}

run();
