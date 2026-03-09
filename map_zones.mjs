import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/cafes.json', 'utf8'));

// Based on the user's geocode.txt
const CAFES = [
    ["Cafe Holiday", "Near Kranti Chowk, Paithan Gate Rd", "Central / Old City"],
    ["Beans & Bistro", "Darga Rd, near Kalda Corner, above VLCC", "Central / Old City"],
    ["THE GOLDEN HOUR CAFE", "Eknath Rang Mandir Rd", "Central / Old City"],
    ["Cafe with environment", "Near Amba-Apsara Cinema Rd, opp. Devgiri Bank", "Central / Old City"],
    ["Cafe c3", "Samarthnagar Road, Nirala Bazar", "Central / Old City"],
    ["Chai Maker's Cafe", "Nirala Bazar Rd", "Central / Old City"],
    ["Cafe HD Chaha", "Aurangpura-Samarthnagar Rd, near Devgiri Bank", "Central / Old City"],
    ["Kelvin 77 Nirala Bazar", "Samarthnagar Rd, near MP Law College", "Central / Old City"],
    ["Crunch N' Quench", "Aadinath Tower, Kranti Chowk, Railway Station Rd", "Central / Old City"],
    ["Cafe House Of The Dragon", "Khokadpura Rd, behind Supreme Classes", "Central / Old City"],
    ["Spice Square - Pure Veg Restaurant", "Samarthnagar Rd", "Central / Old City"],
    ["Lado's Cafe", "Eknath Rang Mandir Rd, opp. IDBI Bank", "Central / Old City"],
    ["Coffeeholic Cafe", "Chistiya Chowk, MGM Rd", "Central / Old City"],
    ["Eat Fit Cafe", "Kranti Chowk", "Central / Old City"],
    ["Omnific Caff", "Kailash Market, near J Tower", "Railway / Kailash Market"],
    ["7 Wonder Cafe", "Bhanudas Sabhahgrah Railway Station Rd", "Railway / Kailash Market"],
    ["Cafe social", "Gopal T Point Osmanpura, Bhanudas Sabhahgrah Railway Station Rd", "Railway / Kailash Market"],
    ["Cafe Symphony (Cake & Pizzeria)", "Railway Station Rd, beside Kailash Veg Restaurant", "Railway / Kailash Market"],
    ["Cafe Avengers bite", "Kailash Market, Ahilybhai Holkar Chowk", "Railway / Kailash Market"],
    ["Rainbow cafe", "Bansilal Market, Railway Station Rd", "Railway / Kailash Market"],
    ["Café D'lite", "Railway Station Rd", "Railway / Kailash Market"],
    ["Cafe BLOOM", "Jay Tower, Kailash Market", "Railway / Kailash Market"],
    ["Spice'N'Sugar Cafe", "Kailash Market, Bhanudas Sabhahgrah Railway Station Rd", "Railway / Kailash Market"],
    ["Cafe Durga", "Bhanudas Sabhahgrah Railway Station Rd", "Railway / Kailash Market"],
    ["Blackstone Cafe & lounge", "Behind SSC Board, opp. Govt. Engineering College", "University / College Belt"],
    ["Cafe emoji", "Beside Deogiri College", "University / College Belt"],
    ["Dessert Villa Cafe", "Near SB College Rd", "University / College Belt"],
    ["Bits N Bites", "In Front Of GVT Engineering College", "University / College Belt"],
    ["Cafe me ani tu", "Near Milind College, University Rd, BAMU", "University / College Belt"],
    ["Cafe 90's", "In front of S.B. Science Gate", "University / College Belt"],
    ["Black Roast Cafe", "Akashvani Signal, Jalna Rd", "Jalna Road Corridor"],
    ["Café Coffee Day (Ira Executive)", "Beside Hotel Ira Executive, Jalna Rd", "Jalna Road Corridor"],
    ["Hotel Arpan Bar And Restaurant", "Mondha Naka, Jalna Rd", "Jalna Road Corridor"],
    ["Hyde Out Resto Cafe", "Chetan Trade Center, Jalna Rd", "Jalna Road Corridor"],
    ["Vijay Bhoj and Krushna Mewad Bhojnalay", "Jalna Rd", "Jalna Road Corridor"],
    ["BBC (Boring Banker Cafe)", "Infront of Sinchan Bhavan, Jalna Rd", "Jalna Road Corridor"],
    ["Krushna Mewad Bhojanalaya", "Sindhi Colony, Mondha Naka, Jalna Road", "Jalna Road Corridor"],
    ["Urban bites", "Kailash Arcade, Cannaught Place", "CIDCO / New Aurangabad"],
    ["Coffea Sambhajinagar", "Cannaught Place, beside Royal Enfield Showroom", "CIDCO / New Aurangabad"],
    ["Café Woodie's", "Near Tapadiya Merit School", "CIDCO / New Aurangabad"],
    ["Chéri Cafe & Eatery", "CK Tower, Dashmesh Nagar Rd, near Tapadiya Innovations School", "CIDCO / New Aurangabad"],
    ["Greme cafe", "Amurt Sai Ekdant Society", "CIDCO / New Aurangabad"],
    ["Golden Saffron Cafe", "Silver Parl, near Ridhi Sidhi Hall", "CIDCO / New Aurangabad"],
    ["Cafe ak47 295", "Amrut Sai Ekdant Society", "CIDCO / New Aurangabad"],
    ["SKY CAFE", "Pride Century, opp. Mahavitran Office", "CIDCO / New Aurangabad"],
    ["Cafe Salt And Pepper", "Near Tapadia Knowledge Park, opp. Erides", "CIDCO / New Aurangabad"],
    ["Señorita Café & Restro", "Plot No-59, Dashmesh Nagar Rd", "CIDCO / New Aurangabad"],
    ["Cafe Delicious Dream", "Khinvasara Mayfair", "CIDCO / New Aurangabad"],
    ["Café Coffee Day (Garkheda)", "Dube Towers, Garkheda Rd", "CIDCO / New Aurangabad"],
    ["Cafe humtum", "Khinvasara Park West", "CIDCO / New Aurangabad"],
    ["A•ONE CAFE", "Beed Bypass Rd, Aman Complex", "CIDCO / New Aurangabad"],
    ["Cafe 147", "Cidco Town, near Jalna Road, behind Air India Office", "CIDCO / New Aurangabad"],
    ["Bread n Butter", "Tapadia Circle", "CIDCO / New Aurangabad"],
    ["CAFE TWILIGHT", "CIDCO N3, Opp. Power House Cidco", "CIDCO / New Aurangabad"],
    ["Cafe D3 - Beyond Temptation", "Khinvasara Park", "CIDCO / New Aurangabad"],
    ["DRINCUP", "N1 Rd, CIDCO", "CIDCO / New Aurangabad"],
    ["Cafe Delight", "Trimurti Chowk, Main Road", "CIDCO / New Aurangabad"],
    ["Cafe jail", "Konark Estate, Osmanpura Rd", "Konark / Solaris Belt"],
    ["Royal Cafe", "Konark Builders Complex", "Konark / Solaris Belt"],
    ["Golden Quarter", "Satya Pushpa Solaris", "Konark / Solaris Belt"],
    ["House of Delicacies", "Satyapushpa Solaris", "Konark / Solaris Belt"],
    ["La comida", "Satya Pushpa Solaris", "Konark / Solaris Belt"]
];

function normalize(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const lookup = {};
CAFES.forEach(c => {
    lookup[normalize(c[0])] = c[2];
});

let updated = 0;
data.cafes.forEach(cafe => {
    const normName = normalize(cafe.name);
    // Find exact or partial match
    let zone = lookup[normName];
    if (!zone) {
        // Try fuzzy match
        for (const [key, val] of Object.entries(lookup)) {
            if (key.includes(normName) || normName.includes(key)) {
                zone = val;
                break;
            }
        }
    }

    // Fallback based on area if not matched
    if (!zone) {
        const a = cafe.area.toLowerCase();
        if (a.includes('kranti') || a.includes('samarth') || a.includes('nirala')) zone = "Central / Old City";
        else if (a.includes('kailash') || a.includes('railway') || a.includes('bhanudas')) zone = "Railway / Kailash Market";
        else if (a.includes('cidco') || a.includes('cannaught') || a.includes('khinvasara') || a.includes('tapadiya') || a.includes('dashmesh') || a.includes('amrut') || a.includes('garkheda')) zone = "CIDCO / New Aurangabad";
        else if (a.includes('jalna')) zone = "Jalna Road Corridor";
        else if (a.includes('university') || a.includes('college') || a.includes('deogiri')) zone = "University / College Belt";
        else if (a.includes('konark') || a.includes('solaris') || a.includes('osmanpura')) zone = "Konark / Solaris Belt";
        else zone = "Other"; // Fallback
    }

    cafe.zone = zone;
    updated++;
});

fs.writeFileSync('src/data/cafes.json', JSON.stringify(data, null, 2));
console.log(`Mapped ${updated} cafes to zones.`);
