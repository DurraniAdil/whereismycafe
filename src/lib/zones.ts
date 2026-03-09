export const ZONES: { label: string; tagline: string; cafes: string[] }[] = [
    {
        "label": "Central / Old City",
        "tagline": "Heritage vibes, walkable chaos",
        "cafes": [
            "Cafe Holiday",
            "Beans & Bistro",
            "THE GOLDEN HOUR CAFE",
            "Cafe with environment",
            "Cafe c3",
            "Chai Maker's Cafe",
            "Cafe HD Chaha",
            "Kelvin 77 Nirala Bazar",
            "Crunch N' Quench",
            "Cafe House Of The Dragon",
            "Spice Square - Pure Veg Restaurant",
            "Lado's Cafe",
            "Coffeeholic Cafe",
            "Eat Fit Cafe",
            "Spice'N'Sugar Cafe (Kailash Mkt)",
            "Cafe 90's"
        ]
    },
    {
        "label": "Railway / Kailash Market",
        "tagline": "Station buzz, quick chai spots",
        "cafes": [
            "Omnific Caff",
            "7 Wonder Cafe",
            "Cafe social",
            "Cafe Symphony (Cake & Pizzeria)",
            "Cafe Avengers bite",
            "Rainbow cafe",
            "Cafe Durga",
            "Café D'lite",
            "Cafe BLOOM",
            "Spice'N'Sugar Cafe",
            "Cafe me ani tu",
            "Cafe 90's",
            "Cafe HD Chaha"
        ]
    },
    {
        "label": "University / College Belt",
        "tagline": "Student central, late-night study",
        "cafes": [
            "Blackstone Cafe & lounge",
            "Cafe emoji",
            "Dessert Villa Cafe",
            "Bits N Bites",
            "Cafe me ani tu",
            "Cafe 90's",
            "Spice'N'Sugar Cafe"
        ]
    },
    {
        "label": "Jalna Road Corridor",
        "tagline": "Highway vibes, big portions",
        "cafes": [
            "Black Roast Cafe",
            "Café Coffee Day",
            "Hotel Arpan Bar And Restaurant",
            "Hyde Out Resto Cafe",
            "Vijay Bhoj and Krushna Mewad Bhojnalay",
            "BBC (Boring Banker Cafe)",
            "Krushna Mewad Bhojanalaya",
            "Café Coffee Day (Ira Executive)"
        ]
    },
    {
        "label": "CIDCO / New Aurangabad",
        "tagline": "Modern, spacious, parking easy",
        "cafes": [
            "Urban bites",
            "Coffea Sambhajinagar",
            "Café Woodie's",
            "Chéri Cafe & Eatery",
            "Greme cafe",
            "Golden Saffron Cafe",
            "Cafe ak47 295",
            "SKY CAFE",
            "Cafe Salt And Pepper",
            "Señorita Café & Restro",
            "Cafe Delicious Dream",
            "Café Coffee Day (Garkheda)",
            "Cafe humtum",
            "A•ONE CAFE",
            "Cafe 147",
            "Bread n Butter",
            "CAFE TWILIGHT",
            "Cafe D3 - Beyond Temptation",
            "DRINCUP",
            "Cafe Delight",
            "Cafe Foodie"
        ]
    },
    {
        "label": "Konark / Solaris Belt",
        "tagline": "Trendy highrises, Instagram spots",
        "cafes": [
            "Cafe jail",
            "Royal Cafe",
            "Golden Quarter",
            "House of Delicacies",
            "La comida",
            "Coffee N Cuisines- CAFE",
            "Suto Cafe - Sambhajinagar",
            "Cafe Royal de",
            "ROSE BUD CAFE",
            "Neem Chhav Cafe",
            "HIDE N SEEK CAFE",
            "Two Stories Cafe",
            "Cafe Rushh",
            "Twist In Flavours",
            "CAFE SPROCKET",
            "Rapid Rounds Gaming Cafe",
            "JOSHI TEA CORNER (CHAI STATION)",
            "THE REGENCY CAFE FASTFOOD AND CHINESE",
            "Parikrama Pure Veg Family Restaurant",
            "DOPA BEAN",
            "Dcr cafe",
            "Feel Me Cafe",
            "ती Coffee आणी मी",
            "Cold Coffee Break (CCB)",
            "Copains Coffee Cafe",
            "CAFE DARK VINTAGE & RESTAURANT",
            "Gapshap restaurant",
            "MeeT N TreaT Coffee Shop",
            "Coffie caat",
            "The fresh bites cafe"
        ]
    }
];

// Combine all mapped cafe names into a single array for easier lookup
export const ALL_ZONED_CAFES = ZONES.flatMap(z => z.cafes.map(name => name.toLowerCase()));