#!/usr/bin/env python3
"""
Generate timestamped public snapshot artifacts (scaffold).

Outputs per product:
- summary.json
- latest.pdf (placeholder text payload for pipeline handoff)
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path

PRODUCTS = ["atlas", "skygrid", "strait-signal", "relaypoint"]


def render_pdf_placeholder(product: str, generated_at: str) -> bytes:
    content = (
        f"Obsidian Dynamics Public Snapshot\n"
        f"Product: {product}\n"
        f"Generated at: {generated_at}\n"
        f"Note: Replace placeholder writer with real PDF renderer.\n"
    )
    # Intentional placeholder: deployment pipeline can swap this with ReportLab/WeasyPrint.
    return content.encode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate public snapshot scaffold artifacts.")
    parser.add_argument("--out", default="snapshots", help="Output root directory")
    parser.add_argument("--products", nargs="*", default=PRODUCTS, help="Product ids to generate")
    args = parser.parse_args()

    now = dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    root = Path(args.out).resolve()
    root.mkdir(parents=True, exist_ok=True)

    for product in args.products:
        product_dir = root / product / "public_snapshot"
        product_dir.mkdir(parents=True, exist_ok=True)

        payload = {
            "product": product,
            "generated_at": now,
            "watermark": "PUBLIC SNAPSHOT",
            "status": "scaffold",
            "notes": "Replace with real KPI pack generation pipeline."
        }
        (product_dir / "summary.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
        (product_dir / "latest.pdf").write_bytes(render_pdf_placeholder(product, now))

    print(json.dumps({"ok": True, "generated_at": now, "output_root": str(root)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

