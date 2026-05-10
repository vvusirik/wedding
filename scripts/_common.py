"""Shared helpers for guest-list scripts.

The Google Sheet is treated as a passive snapshot of the latest withjoy export
— it carries the same column schema as the export. Both the sheet and the CSV
are read header-aware (case-insensitive lookup of `first name`, `last name`,
`tags`), so the underlying schema may evolve without code changes.
"""

from __future__ import annotations

import csv
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import gspread
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_PATH = REPO_ROOT / ".env.local"

SHEET_RANGE_DEFAULT = "A:Z"

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

REQUIRED_COLUMNS = ("first_name", "last_name", "tags")


@dataclass(frozen=True)
class Guest:
    first_name: str
    last_name: str
    tags: tuple[str, ...]

    @property
    def key(self) -> tuple[str, str]:
        return (self.first_name.strip().lower(), self.last_name.strip().lower())

    @property
    def display(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def tags_joined(self) -> str:
        return ", ".join(self.tags)


def load_env() -> None:
    if not ENV_PATH.exists():
        die(f".env.local not found at {ENV_PATH}")
    load_dotenv(ENV_PATH)


def get_worksheet() -> gspread.Worksheet:
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    sheet_id = os.environ.get("GUEST_SHEET_ID")
    if not raw:
        die("GOOGLE_SERVICE_ACCOUNT_JSON missing from .env.local")
    if not sheet_id:
        die("GUEST_SHEET_ID missing from .env.local")

    try:
        info = json.loads(raw)
    except json.JSONDecodeError as exc:
        die(f"GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON: {exc}")

    creds = Credentials.from_service_account_info(info, scopes=SCOPES)
    client = gspread.authorize(creds)
    sh = client.open_by_key(sheet_id)

    sheet_range = os.environ.get("GUEST_SHEET_RANGE", SHEET_RANGE_DEFAULT)
    if "!" in sheet_range:
        ws_name = sheet_range.split("!", 1)[0]
        try:
            return sh.worksheet(ws_name)
        except gspread.WorksheetNotFound:
            die(f"worksheet '{ws_name}' not found in sheet")
    return sh.sheet1


def normalize_tags(raw: str) -> tuple[str, ...]:
    if not raw:
        return ()
    return tuple(t.strip().lower() for t in raw.split(",") if t.strip())


def _normalize_header(h: str) -> str:
    return h.strip().lower().replace(" ", "_")


def _parse_rows(source: str, headers: list[str], rows: list[list[str]]) -> list[Guest]:
    """Parse data rows by looking up required columns by header name."""
    normalized = [_normalize_header(h) for h in headers]

    def col(name: str) -> int:
        try:
            return normalized.index(name)
        except ValueError:
            die(
                f"{source} is missing required column '{name}'. "
                f"Found columns: {headers}"
            )

    i_first, i_last, i_tags = (col(c) for c in REQUIRED_COLUMNS)

    guests: list[Guest] = []
    for row in rows:
        if not row or all(not str(c).strip() for c in row):
            continue
        first = str(row[i_first]).strip() if i_first < len(row) else ""
        last = str(row[i_last]).strip() if i_last < len(row) else ""
        tags_raw = str(row[i_tags]) if i_tags < len(row) else ""
        if not first and not last:
            continue
        guests.append(Guest(first_name=first, last_name=last, tags=normalize_tags(tags_raw)))
    return guests


def read_csv_guests(path: str) -> list[Guest]:
    p = Path(path)
    if not p.is_file():
        die(f"CSV not found: {p}")
    with p.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        try:
            headers = next(reader)
        except StopIteration:
            die(f"CSV {p} is empty")
        return _parse_rows(str(p), headers, list(reader))


def read_sheet_guests(ws: gspread.Worksheet) -> list[Guest]:
    rows = ws.get_all_values()
    if not rows:
        return []
    return _parse_rows(f"sheet '{ws.title}'", rows[0], rows[1:])


def index_by_key(guests: Iterable[Guest]) -> dict[tuple[str, str], Guest]:
    return {g.key: g for g in guests}


def die(msg: str) -> "None":
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)
