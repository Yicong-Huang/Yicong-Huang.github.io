#!/usr/bin/env python3
"""Fetch Google Scholar profile metrics and write _data/scholar_citations.yml."""

from __future__ import annotations

import argparse
import html
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path


SCHOLAR_URL = "https://scholar.google.com/citations?hl=en&user={user_id}"


def parse_int(text: str) -> int:
    m = re.search(r"\d[\d,]*", text)
    if not m:
        raise ValueError(f"cannot parse integer from: {text!r}")
    return int(m.group(0).replace(",", ""))


def fetch_html(user_id: str) -> str:
    req = urllib.request.Request(
        SCHOLAR_URL.format(user_id=user_id),
        headers={
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            )
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def extract_totals(doc: str) -> dict:
    table_match = re.search(r'<table[^>]*id="gsc_rsb_st"[^>]*>(.*?)</table>', doc, re.S)
    if not table_match:
        raise RuntimeError("failed to locate metrics table: gsc_rsb_st")
    table = table_match.group(1)

    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", table, re.S | re.I)

    normalized_rows: list[list[str]] = []
    for row_html in rows:
        cells = re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row_html, re.S | re.I)
        texts = [html.unescape(re.sub(r"<[^>]+>", "", c)).strip() for c in cells]
        texts = [t for t in texts if t]
        if texts:
            normalized_rows.append(texts)

    def row_vals(label: str) -> tuple[int, int]:
        key = label.lower().replace("-", "")
        for row in normalized_rows:
            if len(row) < 3:
                continue
            first = row[0].lower().replace("-", "")
            if key in first:
                left = parse_int(row[1])
                right = parse_int(row[2])
                return left, right
        raise RuntimeError(f"failed to parse row: {label}")

    citations_all, citations_recent = row_vals("Citations")
    h_all, h_recent = row_vals("h-index")
    i10_all, i10_recent = row_vals("i10-index")

    return {
        "all": {
            "citations": citations_all,
            "h_index": h_all,
            "i10_index": i10_all,
        },
        "since_2021": {
            "citations": citations_recent,
            "h_index": h_recent,
            "i10_index": i10_recent,
        },
    }


def extract_yearly(doc: str) -> list[dict]:
    # Each bar is typically wrapped in an anchor with year and count.
    bars = re.findall(
        r'<a[^>]*class="[^"]*\bgsc_g_a\b[^"]*"[^>]*>(.*?)</a>',
        doc,
        re.S,
    )
    yearly: list[dict] = []
    for bar in bars:
        year_m = re.search(r'class="[^"]*\bgsc_g_t\b[^"]*"[^>]*>\s*(\d{4})\s*<', bar)
        count_m = re.search(r'class="[^"]*\bgsc_g_al\b[^"]*"[^>]*>\s*([\d,]+)\s*<', bar)
        if not year_m or not count_m:
            continue
        yearly.append({"year": int(year_m.group(1)), "count": int(count_m.group(1).replace(",", ""))})

    # Fallback for variant markup.
    if not yearly:
        years = [int(y) for y in re.findall(r'class="[^"]*\bgsc_g_t\b[^"]*"[^>]*>\s*(\d{4})\s*<', doc)]
        counts = [int(c.replace(",", "")) for c in re.findall(r'class="[^"]*\bgsc_g_al\b[^"]*"[^>]*>\s*([\d,]+)\s*<', doc)]
        if years and counts:
            n = min(len(years), len(counts))
            yearly = [{"year": years[i], "count": counts[i]} for i in range(n)]

    if not yearly:
        raise RuntimeError("failed to parse yearly citation bars")

    dedup = {}
    for row in yearly:
        dedup[row["year"]] = row["count"]
    ordered = [{"year": y, "count": dedup[y]} for y in sorted(dedup)]
    return ordered


def render_yaml(totals: dict, yearly: list[dict]) -> str:
    lines = [
        "totals:",
        "  all:",
        f"    citations: {totals['all']['citations']}",
        f"    h_index: {totals['all']['h_index']}",
        f"    i10_index: {totals['all']['i10_index']}",
        "  since_2021:",
        f"    citations: {totals['since_2021']['citations']}",
        f"    h_index: {totals['since_2021']['h_index']}",
        f"    i10_index: {totals['since_2021']['i10_index']}",
        "",
        "yearly:",
    ]
    for row in yearly:
        lines.append(f"  - year: {row['year']}")
        lines.append(f"    count: {row['count']}")
    lines.append("")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--user-id", required=True, help="Google Scholar user id")
    parser.add_argument(
        "--output",
        default="_data/scholar_citations.yml",
        help="Output YAML path",
    )
    parser.add_argument(
        "--graceful-http-errors",
        action="store_true",
        help="Return success when Scholar blocks the request (e.g., HTTP 403).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        doc = fetch_html(args.user_id)
    except urllib.error.HTTPError as exc:
        if args.graceful_http_errors and exc.code in {403, 429}:
            print(f"WARNING: Scholar blocked request with HTTP {exc.code}; keep existing data.")
            return 0
        raise
    totals = extract_totals(doc)
    yearly = extract_yearly(doc)
    out = render_yaml(totals, yearly)
    out_path = Path(args.output)
    out_path.write_text(out, encoding="utf-8")
    print(f"updated {out_path} with {len(yearly)} yearly points")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # pragma: no cover
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
