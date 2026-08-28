import csv
import os
import re
import sqlite3
import json

CSV_PATH = r"d:\Personal\pin_directory\assets\data\5c2f62fe-5afa-4119-a499-fec9d604d5bd.csv"
DB_DIR = r"d:\Personal\pin_directory\server\data"
DB_PATH = os.path.join(DB_DIR, "pincodes.db")

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[\./\(\)\,\'\"]+', ' ', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def clean_title(text: str) -> str:
    text = text.strip()
    # If text is all uppercase, title-case it appropriately
    if text.isupper():
        words = text.split()
        return " ".join(w.capitalize() for w in words)
    return text

def clean_officename(text: str) -> str:
    text = clean_title(text)
    return re.sub(r'\s+(?:b\.?o\.?|s\.?o\.?|h\.?o\.?|g\.?p\.?o\.?|p\.?o\.?)$', '', text, flags=re.IGNORECASE).strip()

def main():
    os.makedirs(DB_DIR, exist_ok=True)
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
        except Exception:
            pass

    print(f"Opening database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("PRAGMA journal_mode = WAL;")
    cursor.execute("PRAGMA synchronous = NORMAL;")

    # Schema creation
    cursor.execute("""
    CREATE TABLE post_offices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pincode TEXT NOT NULL,
        officename TEXT NOT NULL,
        office_slug TEXT NOT NULL,
        officetype TEXT,
        delivery TEXT,
        district TEXT NOT NULL,
        district_slug TEXT NOT NULL,
        statename TEXT NOT NULL,
        state_slug TEXT NOT NULL,
        circle TEXT,
        region TEXT,
        division TEXT,
        latitude REAL,
        longitude REAL
    );
    """)

    cursor.execute("""
    CREATE TABLE pincodes_summary (
        pincode TEXT PRIMARY KEY,
        district TEXT NOT NULL,
        district_slug TEXT NOT NULL,
        statename TEXT NOT NULL,
        state_slug TEXT NOT NULL,
        circle TEXT,
        region TEXT,
        division TEXT,
        office_count INTEGER DEFAULT 0,
        primary_offices TEXT,
        latitude REAL,
        longitude REAL
    );
    """)

    cursor.execute("""
    CREATE TABLE states (
        state_slug TEXT PRIMARY KEY,
        statename TEXT NOT NULL,
        district_count INTEGER DEFAULT 0,
        pincode_count INTEGER DEFAULT 0,
        office_count INTEGER DEFAULT 0
    );
    """)

    cursor.execute("""
    CREATE TABLE districts (
        district_slug TEXT PRIMARY KEY,
        district TEXT NOT NULL,
        statename TEXT NOT NULL,
        state_slug TEXT NOT NULL,
        pincode_count INTEGER DEFAULT 0,
        office_count INTEGER DEFAULT 0
    );
    """)

    print("Reading CSV and inserting rows...")
    po_records = []
    pincode_agg = {}
    state_agg = {}
    district_agg = {}

    with open(CSV_PATH, mode="r", encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_pincode = row.get("pincode", "").strip()
            if not raw_pincode or len(raw_pincode) != 6:
                continue

            raw_office = row.get("officename", "").strip()
            raw_district = row.get("district", "").strip()
            raw_state = row.get("statename", "").strip()
            raw_type = row.get("officetype", "").strip()
            raw_delivery = row.get("delivery", "").strip()
            raw_circle = row.get("circlename", "").strip()
            raw_region = row.get("regionname", "").strip()
            raw_division = row.get("divisionname", "").strip()
            raw_lat = row.get("latitude", "").strip()
            raw_lng = row.get("longitude", "").strip()

            statename = clean_title(raw_state)
            state_slug = slugify(raw_state)
            district = clean_title(raw_district)
            district_slug = slugify(raw_district)
            officename = clean_officename(raw_office)
            office_slug = slugify(raw_office)

            delivery = "Delivery" if "delivery" in raw_delivery.lower() and "non" not in raw_delivery.lower() else "Non-Delivery"

            lat = None
            lng = None
            if raw_lat and raw_lat.upper() != "NA":
                try:
                    lat = float(raw_lat)
                except ValueError:
                    lat = None
            if raw_lng and raw_lng.upper() != "NA":
                try:
                    lng = float(raw_lng)
                except ValueError:
                    lng = None

            po_records.append((
                raw_pincode, officename, office_slug, raw_type, delivery,
                district, district_slug, statename, state_slug,
                raw_circle, raw_region, raw_division, lat, lng
            ))

            # Aggregate pincodes
            if raw_pincode not in pincode_agg:
                pincode_agg[raw_pincode] = {
                    "district": district,
                    "district_slug": district_slug,
                    "statename": statename,
                    "state_slug": state_slug,
                    "circle": raw_circle,
                    "region": raw_region,
                    "division": raw_division,
                    "offices": [],
                    "lat": lat,
                    "lng": lng
                }
            pincode_agg[raw_pincode]["offices"].append(officename)
            if pincode_agg[raw_pincode]["lat"] is None and lat is not None:
                pincode_agg[raw_pincode]["lat"] = lat
                pincode_agg[raw_pincode]["lng"] = lng

            # Aggregate states
            if state_slug not in state_agg:
                state_agg[state_slug] = {
                    "statename": statename,
                    "districts": set(),
                    "pincodes": set(),
                    "offices": 0
                }
            state_agg[state_slug]["districts"].add(district_slug)
            state_agg[state_slug]["pincodes"].add(raw_pincode)
            state_agg[state_slug]["offices"] += 1

            # Aggregate districts
            if district_slug not in district_agg:
                district_agg[district_slug] = {
                    "district": district,
                    "statename": statename,
                    "state_slug": state_slug,
                    "pincodes": set(),
                    "offices": 0
                }
            district_agg[district_slug]["pincodes"].add(raw_pincode)
            district_agg[district_slug]["offices"] += 1

    print(f"Parsed {len(po_records)} post office rows. Bulk inserting into database...")
    cursor.executemany("""
    INSERT INTO post_offices (
        pincode, officename, office_slug, officetype, delivery,
        district, district_slug, statename, state_slug,
        circle, region, division, latitude, longitude
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, po_records)

    print("Inserting pincodes_summary...")
    pincode_rows = []
    for pin, data in pincode_agg.items():
        pincode_rows.append((
            pin, data["district"], data["district_slug"],
            data["statename"], data["state_slug"],
            data["circle"], data["region"], data["division"],
            len(data["offices"]), json.dumps(data["offices"][:10]),
            data["lat"], data["lng"]
        ))
    cursor.executemany("""
    INSERT INTO pincodes_summary (
        pincode, district, district_slug, statename, state_slug,
        circle, region, division, office_count, primary_offices,
        latitude, longitude
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, pincode_rows)

    print("Inserting states...")
    state_rows = [
        (slug, data["statename"], len(data["districts"]), len(data["pincodes"]), data["offices"])
        for slug, data in state_agg.items()
    ]
    cursor.executemany("""
    INSERT INTO states (state_slug, statename, district_count, pincode_count, office_count)
    VALUES (?, ?, ?, ?, ?);
    """, state_rows)

    print("Inserting districts...")
    district_rows = [
        (slug, data["district"], data["statename"], data["state_slug"], len(data["pincodes"]), data["offices"])
        for slug, data in district_agg.items()
    ]
    cursor.executemany("""
    INSERT INTO districts (district_slug, district, statename, state_slug, pincode_count, office_count)
    VALUES (?, ?, ?, ?, ?, ?);
    """, district_rows)

    print("Creating indexes...")
    cursor.execute("CREATE INDEX idx_po_pincode ON post_offices(pincode);")
    cursor.execute("CREATE INDEX idx_po_state_slug ON post_offices(state_slug);")
    cursor.execute("CREATE INDEX idx_po_dist_slug ON post_offices(district_slug);")
    cursor.execute("CREATE INDEX idx_po_office_slug ON post_offices(office_slug);")
    cursor.execute("CREATE INDEX idx_po_name ON post_offices(officename);")
    cursor.execute("CREATE INDEX idx_dist_state ON districts(state_slug);")

    conn.commit()
    conn.close()
    print("Database built successfully!")

if __name__ == "__main__":
    main()
