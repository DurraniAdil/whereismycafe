import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/cafes.json', 'utf8'));
const links = JSON.parse(fs.readFileSync('links_extracted.json', 'utf8'));

let updated = 0;

const normalize = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const linkMap = {};
links.forEach(l => {
    const match = l.link.match(/query=([^&]+)/);
    if (match) {
        const decoded = decodeURIComponent(match[1]);
        const namePart = decoded.split(',')[0];
        linkMap[normalize(namePart)] = l.link;
    }
});

data.cafes.forEach(cafe => {
    const cafeNameNorm = normalize(cafe.name);

    if (linkMap[cafeNameNorm]) {
        cafe.googleMapsUrl = linkMap[cafeNameNorm];
        updated++;
    } else {
        for (const [key, url] of Object.entries(linkMap)) {
            if (key.includes(cafeNameNorm) || cafeNameNorm.includes(key)) {
                cafe.googleMapsUrl = url;
                updated++;
                break;
            }
        }
    }
});

fs.writeFileSync('src/data/cafes.json', JSON.stringify(data, null, 2));
console.log(`Successfully updated ${updated} cafe map links.`);
