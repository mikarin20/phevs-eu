#!/usr/bin/env python3
# auto_data_scraper.py
# Usage: python auto_data_scraper.py --input models.txt --batch 20
# Requires: requests, beautifulsoup4, lxml
# Output: outputs/auto_data_results.csv and outputs/batches/batch_*.csv

import requests
from bs4 import BeautifulSoup
import argparse
import csv
import os
import time
import urllib.parse
from typing import List

BASE_SEARCH = "https://www.auto-data.net/en/?f_go=1&search="
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; AutoDataScraper/1.0; +https://yourdomain.example)"
}

def normalize_line(line: str) -> str:
    return line.strip()

def build_query(term: str) -> str:
    # auto-data supports query via GET param; we'll URL-encode term
    return BASE_SEARCH + urllib.parse.quote_plus(term)

def scrape_first_result(search_html: str) -> str:
    soup = BeautifulSoup(search_html, "lxml")
    # Results usually in <div class="search-result"> or direct table of results.
    # We'll try several fallbacks.
    # 1) link in table of results:
    link = soup.select_one("table.table a")
    if link and link.has_attr("href"):
        return urllib.parse.urljoin("https://www.auto-data.net", link["href"])
    # 2) generic first anchor in results area
    link = soup.select_one("a.result-link, a[href*='/en/']")
    if link and link.has_attr("href"):
        return urllib.parse.urljoin("https://www.auto-data.net", link["href"])
    # 3) fallback: first <a> pointing to /en/ models
    for a in soup.find_all("a", href=True):
        if "/en/" in a["href"] and "model" in a.get_text("").lower() or "plug-in" in a.get_text("").lower():
            return urllib.parse.urljoin("https://www.auto-data.net", a["href"])
    return ""

def find_autodata_url(term: str) -> str:
    q = build_query(term)
    try:
        r = requests.get(q, headers=HEADERS, timeout=15)
        r.raise_for_status()
        url = scrape_first_result(r.text)
        # If search returns a direct redirect to model page, requests will have r.url updated:
        if url == "" and r.url and "auto-data.net/en" in r.url:
            # if r.url looks like an entry page and not the search landing, use it
            url = r.url
        return url
    except Exception as e:
        print(f"ERROR searching '{term}': {e}")
        return ""

def chunk_list(items: List[str], n: int):
    for i in range(0, len(items), n):
        yield items[i:i+n]

def main(input_file: str, batch_size: int, delay: float):
    with open(input_file, "r", encoding="utf-8") as f:
        lines = [normalize_line(l) for l in f if l.strip()]

    os.makedirs("outputs/batches", exist_ok=True)
    results = []
    for idx, line in enumerate(lines, start=1):
        # prefer brand+model query: extract last path segment if line is URL, else use raw
        term = line
        if line.startswith("http"):
            # try to extract readable name from URL path
            path = urllib.parse.urlparse(line).path
            parts = [p for p in path.split("/") if p]
            # heuristic: last 2-3 parts joined
            if parts:
                guess = " ".join(parts[-3:]).replace("-", " ")
                term = guess
        print(f"[{idx}/{len(lines)}] Searching Auto-Data for: {term}")
        url = find_autodata_url(term)
        if not url:
            # try a more verbose query: include 'plug-in hybrid' tag
            alt_term = f"{term} plug-in hybrid 2025"
            print(f"  Not found, trying alt: {alt_term}")
            url = find_autodata_url(alt_term)
        if not url:
            results.append((line, "Not found"))
        else:
            results.append((line, url))
        time.sleep(delay)

    # write all results CSV
    out_all = "outputs/auto_data_results.csv"
    with open(out_all, "w", newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["source_line", "auto_data_url_or_status"])
        for r in results:
            writer.writerow(r)
    print(f"Wrote {len(results)} rows to {out_all}")

    # write batches
    for i, chunk in enumerate(chunk_list(results, batch_size), start=1):
        out_batch = f"outputs/batches/batch_{i:02d}.csv"
        with open(out_batch, "w", newline='', encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["source_line", "auto_data_url_or_status"])
            for r in chunk:
                writer.writerow(r)
        print(f"Wrote batch {i} ({len(chunk)} rows) to {out_batch}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Find Auto-Data links for model list")
    parser.add_argument("--input", "-i", default="models.txt", help="Input file (one URL or model per line)")
    parser.add_argument("--batch", "-b", type=int, default=20, help="Batch size for output files")
    parser.add_argument("--delay", "-d", type=float, default=1.2, help="Delay between requests (s)")
    args = parser.parse_args()
    main(args.input, args.batch, args.delay)
