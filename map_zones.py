import json

with open('src/data/cafes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

CAFES = [
    ("Cafe Holiday", "Central / Old City"),
    ("Beans & Bistro", "Central / Old City"),
    ("THE GOLDEN HOUR CAFE", "Central / Old City"),
    ("Cafe with environment", "Central / Old City"),
    ("Cafe c3", "Central / Old City"),
    ("Chai Maker's Cafe", "Central / Old City"),
    ("Cafe HD Chaha", "Central / Old City"),
    ("Kelvin 77 Nirala Bazar", "Central / Old City"),
    ("Crunch N' Quench", "Central / Old City"),
    ("Cafe House Of The Dragon", "Central / Old City"),
    ("Spice Square - Pure Veg Restaurant", "Central / Old City"),
    ("Lado's Cafe", "Central / Old City"),
    ("Coffeeholic Cafe", "Central / Old City"),
    ("Eat Fit Cafe", "Central / Old City"),
    ("Omnific Caff", "Railway / Kailash Market"),
    ("7 Wonder Cafe", "Railway / Kailash Market"),
    ("Cafe social", "Railway / Kailash Market"),
    ("Cafe Symphony (Cake & Pizzeria)", "Railway / Kailash Market"),
    ("Cafe Avengers bite", "Railway / Kailash Market"),
    ("Rainbow cafe", "Railway / Kailash Market"),
    ("Café D'lite", "Railway / Kailash Market"),
    ("Cafe BLOOM", "Railway / Kailash Market"),
    ("Spice'N'Sugar Cafe", "Railway / Kailash Market"),
    ("Cafe Durga", "Railway / Kailash Market"),
    ("Blackstone Cafe & lounge", "University / College Belt"),
    ("Cafe emoji", "University / College Belt"),
    ("Dessert Villa Cafe", "University / College Belt"),
    ("Bits N Bites", "University / College Belt"),
    ("Cafe me ani tu", "University / College Belt"),
    ("Cafe 90's", "University / College Belt"),
    ("Black Roast Cafe", "Jalna Road Corridor"),
    ("Café Coffee Day (Ira Executive)", "Jalna Road Corridor"),
    ("Hotel Arpan Bar And Restaurant", "Jalna Road Corridor"),
    ("Hyde Out Resto Cafe", "Jalna Road Corridor"),
    ("Vijay Bhoj and Krushna Mewad Bhojnalay", "Jalna Road Corridor"),
    ("BBC (Boring Banker Cafe)", "Jalna Road Corridor"),
    ("Krushna Mewad Bhojanalaya", "Jalna Road Corridor"),
    ("Urban bites", "CIDCO / New Aurangabad"),
    ("Coffea Sambhajinagar", "CIDCO / New Aurangabad"),
    ("Café Woodie's", "CIDCO / New Aurangabad"),
    ("Chéri Cafe & Eatery", "CIDCO / New Aurangabad"),
    ("Greme cafe", "CIDCO / New Aurangabad"),
    ("Golden Saffron Cafe", "CIDCO / New Aurangabad"),
    ("Cafe ak47 295", "CIDCO / New Aurangabad"),
    ("SKY CAFE", "CIDCO / New Aurangabad"),
    ("Cafe Salt And Pepper", "CIDCO / New Aurangabad"),
    ("Señorita Café & Restro", "CIDCO / New Aurangabad"),
    ("Cafe Delicious Dream", "CIDCO / New Aurangabad"),
    ("Café Coffee Day (Garkheda)", "CIDCO / New Aurangabad"),
    ("Cafe humtum", "CIDCO / New Aurangabad"),
    ("A•ONE CAFE", "CIDCO / New Aurangabad"),
    ("Cafe 147", "CIDCO / New Aurangabad"),
    ("Bread n Butter", "CIDCO / New Aurangabad"),
    ("CAFE TWILIGHT", "CIDCO / New Aurangabad"),
    ("Cafe D3 - Beyond Temptation", "CIDCO / New Aurangabad"),
    ("DRINCUP", "CIDCO / New Aurangabad"),
    ("Cafe Delight", "CIDCO / New Aurangabad"),
    ("Cafe jail", "Konark / Solaris Belt"),
    ("Royal Cafe", "Konark / Solaris Belt"),
    ("Golden Quarter", "Konark / Solaris Belt"),
    ("House of Delicacies", "Konark / Solaris Belt"),
    ("La comida", "Konark / Solaris Belt")
]

lookup = {''.join(c for c in name.lower() if c.isalnum()): zone for name, zone in CAFES}

for c in data:
    nn = ''.join(ch for ch in c['name'].lower() if ch.isalnum())
    zone = lookup.get(nn)
    if not zone:
        for k, v in lookup.items():
            if k in nn or nn in k:
                zone = v
                break
    if not zone:
        a = c['area'].lower()
        if 'kranti' in a or 'samarth' in a or 'nirala' in a: zone = 'Central / Old City'
        elif 'kailash' in a or 'railway' in a or 'bhanudas' in a: zone = 'Railway / Kailash Market'
        elif any(x in a for x in ['cidco', 'cannaught', 'khinvasara', 'tapadiya', 'dashmesh', 'amrut', 'garkheda']): zone = 'CIDCO / New Aurangabad'
        elif 'jalna' in a: zone = 'Jalna Road Corridor'
        elif 'university' in a or 'college' in a or 'deogiri' in a: zone = 'University / College Belt'
        elif 'konark' in a or 'solaris' in a or 'osmanpura' in a: zone = 'Konark / Solaris Belt'
        else: zone = 'Other'
    c['zone'] = zone

with open('src/data/cafes.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print('Updated cafes.json successfully.')
