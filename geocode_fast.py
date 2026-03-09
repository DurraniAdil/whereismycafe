import json
import time
import requests
import random
import urllib.parse

def add_dispersion(lat, lon):
    # Add roughly ~100-200m randomness
    r_lat = (random.random() - 0.5) * 0.003
    r_lon = (random.random() - 0.5) * 0.003
    return lat + r_lat, lon + r_lon

def main():
    with open('src/data/cafes.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    geo_cache = {}
    updated = 0
    fallback_lat, fallback_lon = 19.8762, 75.3433
    
    for cafe in data:
        query = cafe.get('area', '')
        if not query:
            continue
            
        if 'Aurangabad' not in query:
            query += ', Aurangabad, Maharashtra'
        elif 'Maharashtra' not in query:
            query += ', Maharashtra'
            
        print(f"Geocoding area: {query}...", end=' ')
        
        coords = None
        if query in geo_cache:
            coords = geo_cache[query]
        else:
            url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(query)}&format=json&limit=1"
            headers = {'User-Agent': 'WIMCCafeMap/1.0'}
            try:
                r = requests.get(url, headers=headers, timeout=10)
                jd = r.json()
                if jd and len(jd) > 0:
                    coords = (float(jd[0]['lat']), float(jd[0]['lon']))
                    geo_cache[query] = coords
                time.sleep(1.1)
            except Exception as e:
                print(f"(Error: {e})", end=' ')
                pass
                
        if not coords:
            coords = (fallback_lat, fallback_lon)
            print("Failed, using fallback.")
        else:
            print(f"Success! {coords}")
            
        flat, flon = add_dispersion(coords[0], coords[1])
        cafe['latitude'] = round(flat, 6)
        cafe['longitude'] = round(flon, 6)
        updated += 1
        
    with open('src/data/cafes.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        
    print(f"\nSuccessfully populated coordinates for {updated} cafes.")

if __name__ == '__main__':
    main()
