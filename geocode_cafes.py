"""
Aurangabad Cafe Geocoder
------------------------
Fetches lat/lon for each cafe using Nominatim (OpenStreetMap) — no API key needed.
Outputs: aurangabad_cafe_coords.xlsx

Requirements:
    pip install requests openpyxl

Run:
    python geocode_cafes.py
"""

import time
import urllib.parse
import requests
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

CAFES = [
    ("Cafe Holiday",                          "Near Kranti Chowk, Paithan Gate Rd",                                  "Central / Old City"),
    ("Beans & Bistro",                        "Darga Rd, near Kalda Corner, above VLCC",                             "Central / Old City"),
    ("THE GOLDEN HOUR CAFE",                  "Eknath Rang Mandir Rd",                                               "Central / Old City"),
    ("Cafe with environment",                 "Near Amba-Apsara Cinema Rd, opp. Devgiri Bank",                       "Central / Old City"),
    ("Cafe c3",                               "Samarthnagar Road, Nirala Bazar",                                     "Central / Old City"),
    ("Chai Maker's Cafe",                     "Nirala Bazar Rd",                                                     "Central / Old City"),
    ("Cafe HD Chaha",                         "Aurangpura-Samarthnagar Rd, near Devgiri Bank",                       "Central / Old City"),
    ("Kelvin 77 Nirala Bazar",                "Samarthnagar Rd, near MP Law College",                                "Central / Old City"),
    ("Crunch N' Quench",                      "Aadinath Tower, Kranti Chowk, Railway Station Rd",                    "Central / Old City"),
    ("Cafe House Of The Dragon",              "Khokadpura Rd, behind Supreme Classes",                               "Central / Old City"),
    ("Spice Square - Pure Veg Restaurant",    "Samarthnagar Rd",                                                     "Central / Old City"),
    ("Lado's Cafe",                           "Eknath Rang Mandir Rd, opp. IDBI Bank",                               "Central / Old City"),
    ("Coffeeholic Cafe",                      "Chistiya Chowk, MGM Rd",                                              "Central / Old City"),
    ("Eat Fit Cafe",                          "Kranti Chowk",                                                        "Central / Old City"),
    ("Omnific Caff",                          "Kailash Market, near J Tower",                                        "Railway / Kailash Market"),
    ("7 Wonder Cafe",                         "Bhanudas Sabhahgrah Railway Station Rd",                              "Railway / Kailash Market"),
    ("Cafe social",                           "Gopal T Point Osmanpura, Bhanudas Sabhahgrah Railway Station Rd",     "Railway / Kailash Market"),
    ("Cafe Symphony (Cake & Pizzeria)",       "Railway Station Rd, beside Kailash Veg Restaurant",                   "Railway / Kailash Market"),
    ("Cafe Avengers bite",                    "Kailash Market, Ahilybhai Holkar Chowk",                              "Railway / Kailash Market"),
    ("Rainbow cafe",                          "Bansilal Market, Railway Station Rd",                                  "Railway / Kailash Market"),
    ("Café D'lite",                           "Railway Station Rd",                                                   "Railway / Kailash Market"),
    ("Cafe BLOOM",                            "Jay Tower, Kailash Market",                                           "Railway / Kailash Market"),
    ("Spice'N'Sugar Cafe",                    "Kailash Market, Bhanudas Sabhahgrah Railway Station Rd",              "Railway / Kailash Market"),
    ("Cafe Durga",                            "Bhanudas Sabhahgrah Railway Station Rd",                              "Railway / Kailash Market"),
    ("Blackstone Cafe & lounge",              "Behind SSC Board, opp. Govt. Engineering College",                    "University / College Belt"),
    ("Cafe emoji",                            "Beside Deogiri College",                                              "University / College Belt"),
    ("Dessert Villa Cafe",                    "Near SB College Rd",                                                   "University / College Belt"),
    ("Bits N Bites",                          "In Front Of GVT Engineering College",                                  "University / College Belt"),
    ("Cafe me ani tu",                        "Near Milind College, University Rd, BAMU",                             "University / College Belt"),
    ("Cafe 90's",                             "In front of S.B. Science Gate",                                       "University / College Belt"),
    ("Black Roast Cafe",                      "Akashvani Signal, Jalna Rd",                                          "Jalna Road Corridor"),
    ("Café Coffee Day (Ira Executive)",       "Beside Hotel Ira Executive, Jalna Rd",                                "Jalna Road Corridor"),
    ("Hotel Arpan Bar And Restaurant",        "Mondha Naka, Jalna Rd",                                               "Jalna Road Corridor"),
    ("Hyde Out Resto Cafe",                   "Chetan Trade Center, Jalna Rd",                                       "Jalna Road Corridor"),
    ("Vijay Bhoj and Krushna Mewad Bhojnalay","Jalna Rd",                                                            "Jalna Road Corridor"),
    ("BBC (Boring Banker Cafe)",              "Infront of Sinchan Bhavan, Jalna Rd",                                 "Jalna Road Corridor"),
    ("Krushna Mewad Bhojanalaya",             "Sindhi Colony, Mondha Naka, Jalna Road",                              "Jalna Road Corridor"),
    ("Urban bites",                           "Kailash Arcade, Cannaught Place",                                     "CIDCO / New Aurangabad"),
    ("Coffea Sambhajinagar",                  "Cannaught Place, beside Royal Enfield Showroom",                      "CIDCO / New Aurangabad"),
    ("Café Woodie's",                         "Near Tapadiya Merit School",                                          "CIDCO / New Aurangabad"),
    ("Chéri Cafe & Eatery",                   "CK Tower, Dashmesh Nagar Rd, near Tapadiya Innovations School",       "CIDCO / New Aurangabad"),
    ("Greme cafe",                            "Amurt Sai Ekdant Society",                                            "CIDCO / New Aurangabad"),
    ("Golden Saffron Cafe",                   "Silver Parl, near Ridhi Sidhi Hall",                                  "CIDCO / New Aurangabad"),
    ("Cafe ak47 295",                         "Amrut Sai Ekdant Society",                                            "CIDCO / New Aurangabad"),
    ("SKY CAFE",                              "Pride Century, opp. Mahavitran Office",                               "CIDCO / New Aurangabad"),
    ("Cafe Salt And Pepper",                  "Near Tapadia Knowledge Park, opp. Erides",                            "CIDCO / New Aurangabad"),
    ("Señorita Café & Restro",                "Plot No-59, Dashmesh Nagar Rd",                                       "CIDCO / New Aurangabad"),
    ("Cafe Delicious Dream",                  "Khinvasara Mayfair",                                                  "CIDCO / New Aurangabad"),
    ("Café Coffee Day (Garkheda)",            "Dube Towers, Garkheda Rd",                                            "CIDCO / New Aurangabad"),
    ("Cafe humtum",                           "Khinvasara Park West",                                                "CIDCO / New Aurangabad"),
    ("A•ONE CAFE",                            "Beed Bypass Rd, Aman Complex",                                        "CIDCO / New Aurangabad"),
    ("Cafe 147",                              "Cidco Town, near Jalna Road, behind Air India Office",                "CIDCO / New Aurangabad"),
    ("Bread n Butter",                        "Tapadia Circle",                                                      "CIDCO / New Aurangabad"),
    ("CAFE TWILIGHT",                         "CIDCO N3, Opp. Power House Cidco",                                    "CIDCO / New Aurangabad"),
    ("Cafe D3 - Beyond Temptation",           "Khinvasara Park",                                                     "CIDCO / New Aurangabad"),
    ("DRINCUP",                               "N1 Rd, CIDCO",                                                        "CIDCO / New Aurangabad"),
    ("Cafe Delight",                          "Trimurti Chowk, Main Road",                                           "CIDCO / New Aurangabad"),
    ("Cafe jail",                             "Konark Estate, Osmanpura Rd",                                         "Konark / Solaris Belt"),
    ("Royal Cafe",                            "Konark Builders Complex",                                             "Konark / Solaris Belt"),
    ("Golden Quarter",                        "Satya Pushpa Solaris",                                                "Konark / Solaris Belt"),
    ("House of Delicacies",                   "Satyapushpa Solaris",                                                 "Konark / Solaris Belt"),
    ("La comida",                             "Satya Pushpa Solaris",                                                "Konark / Solaris Belt"),
]

ZONE_COLORS = {
    "Central / Old City":        "FFF3B0",
    "Railway / Kailash Market":  "D0EFFF",
    "University / College Belt": "D4EDDA",
    "Jalna Road Corridor":       "FFE5D9",
    "CIDCO / New Aurangabad":    "EDE7F6",
    "Konark / Solaris Belt":     "FFFDE7",
}

HEADERS = ["#", "Cafe Name", "Zone", "Address", "Latitude", "Longitude", "Google Maps Link"]
COL_WIDTHS = [4, 34, 24, 48, 14, 14, 22]


def maps_url(name, address):
    q = urllib.parse.quote(f"{name}, {address}, Aurangabad, Maharashtra")
    return f"https://www.google.com/maps/search/?api=1&query={q}"


def geocode(name, address):
    """Query Nominatim for lat/lon. Falls back to city centre on failure."""
    query = f"{name}, {address}, Aurangabad, Maharashtra, India"
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": query, "format": "json", "limit": 1}
    headers = {"User-Agent": "AurangabadCafeGeocoder/1.0"}
    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        data = r.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
        # retry with just address + city
        params["q"] = f"{address}, Aurangabad, Maharashtra, India"
        r = requests.get(url, params=params, headers=headers, timeout=10)
        data = r.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"  ERROR: {e}")
    return None, None


def build_excel(results):
    wb = Workbook()
    ws = wb.active
    ws.title = "Cafe Coordinates"

    thin = Side(style="thin", color="CCCCCC")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    header_fill = PatternFill("solid", start_color="1A1A2E")
    for col, (h, w) in enumerate(zip(HEADERS, COL_WIDTHS), 1):
        c = ws.cell(row=1, column=col, value=h)
        c.font = Font(bold=True, color="FFFFFF", size=11, name="Arial")
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border
        ws.column_dimensions[c.column_letter].width = w

    ws.row_dimensions[1].height = 28
    ws.freeze_panes = "A2"

    for i, (name, address, zone, lat, lon) in enumerate(results, 1):
        row = i + 1
        fill = PatternFill("solid", start_color=ZONE_COLORS[zone])
        url = maps_url(name, address)

        for col, val in enumerate([i, name, zone, address, lat, lon], 1):
            c = ws.cell(row=row, column=col, value=val)
            c.font = Font(name="Arial", size=10)
            c.fill = fill
            c.alignment = Alignment(vertical="center", wrap_text=True)
            c.border = border

        link_cell = ws.cell(row=row, column=7, value="Open in Maps ↗")
        link_cell.hyperlink = url
        link_cell.font = Font(name="Arial", size=10, color="0D47A1", underline="single")
        link_cell.fill = fill
        link_cell.border = border

        ws.row_dimensions[row].height = 18

    out = "aurangabad_cafe_coords.xlsx"
    wb.save(out)
    print(f"\nSaved → {out}")


def main():
    results = []
    for i, (name, address, zone) in enumerate(CAFES, 1):
        print(f"[{i:02d}/{len(CAFES)}] {name}...", end=" ", flush=True)
        lat, lon = geocode(name, address)
        status = f"✓ ({lat:.5f}, {lon:.5f})" if lat else "✗ not found"
        print(status)
        results.append((name, address, zone, lat, lon))
        time.sleep(1.1)  # Nominatim rate limit: max 1 req/sec

    found = sum(1 for *_, lat, lon in results if lat)
    print(f"\nGeocoded {found}/{len(CAFES)} cafes successfully.")
    build_excel(results)


if __name__ == "__main__":
    main()
