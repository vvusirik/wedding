"""Report differences between a withjoy CSV export and the live Google Sheet.

Read-only. Prints a diff report — added, removed, and tag-changed guests —
between a withjoy CSV export and the current sheet contents. Does not mutate
the sheet. Intended use: run after replacing the sheet from a fresh export to
confirm what changed (or to spot drift before importing).

Usage:
    scripts/.venv/bin/python scripts/reconcile.py path/to/withjoy.csv
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts._common import (
    Guest,
    die,
    get_worksheet,
    index_by_key,
    load_env,
    read_csv_guests,
    read_sheet_guests,
)

# ANSI colors
GREEN, RED, YELLOW, DIM, BOLD, RESET = (
    "\033[32m",
    "\033[31m",
    "\033[33m",
    "\033[2m",
    "\033[1m",
    "\033[0m",
)


def _fmt_tags(tags: tuple[str, ...]) -> str:
    return ", ".join(tags) if tags else f"{DIM}(none){RESET}"


def diff(csv_guests: list[Guest], sheet_guests: list[Guest]):
    csv_idx = index_by_key(csv_guests)
    sheet_idx = index_by_key(sheet_guests)

    added = [csv_idx[k] for k in csv_idx if k not in sheet_idx]
    removed = [sheet_idx[k] for k in sheet_idx if k not in csv_idx]
    changed = [
        (sheet_idx[k], csv_idx[k])
        for k in csv_idx
        if k in sheet_idx and sorted(sheet_idx[k].tags) != sorted(csv_idx[k].tags)
    ]
    return added, removed, changed


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        die(f"usage: {argv[0]} <withjoy.csv>")

    load_env()
    csv_path = argv[1]
    csv_guests = read_csv_guests(csv_path)
    ws = get_worksheet()
    sheet_guests = read_sheet_guests(ws)

    print(f"CSV:   {len(csv_guests):>4} guests  ({csv_path})")
    print(f"Sheet: {len(sheet_guests):>4} guests  (worksheet '{ws.title}')")
    print()

    added, removed, changed = diff(csv_guests, sheet_guests)

    if not (added or removed or changed):
        print(f"{GREEN}no differences. sheet matches export.{RESET}")
        return 0

    if added:
        print(f"{BOLD}{GREEN}+ ADDED ({len(added)}){RESET}  in CSV, not in sheet")
        for g in sorted(added, key=lambda g: g.key):
            print(f"  + {g.display:<28}  tags: {_fmt_tags(g.tags)}")
        print()

    if removed:
        print(f"{BOLD}{RED}- REMOVED ({len(removed)}){RESET}  in sheet, not in CSV")
        for g in sorted(removed, key=lambda g: g.key):
            print(f"  - {g.display:<28}  tags: {_fmt_tags(g.tags)}")
        print()

    if changed:
        print(f"{BOLD}{YELLOW}~ CHANGED ({len(changed)}){RESET}  tag differences")
        for sh, cs in sorted(changed, key=lambda pair: pair[0].key):
            print(f"  ~ {sh.display}")
            print(f"      {RED}- {_fmt_tags(sh.tags)}{RESET}")
            print(f"      {GREEN}+ {_fmt_tags(cs.tags)}{RESET}")
        print()

    print(
        f"{BOLD}summary:{RESET} "
        f"{GREEN}+{len(added)}{RESET}  "
        f"{RED}-{len(removed)}{RESET}  "
        f"{YELLOW}~{len(changed)}{RESET}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
