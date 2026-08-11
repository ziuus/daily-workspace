#!/usr/bin/env python3
"""Real Reddit warmup status reporter.

Reads the actual campaign tracker at ~/.reddit-campaign/state.md
(written by the Hermes cron reddit-warmup-daily-morning/evening) and
reports the REAL campaign state. Does NOT post anything itself —
the real posting happens in the Hermes cron with kimi-webbridge.

Exit 0 = campaign active/healthy, 1 = state missing or stalled.
"""
import os
import re
import sys
from datetime import datetime, timezone

STATE = os.path.expanduser("~/.reddit-campaign/state.md")


def main():
    if not os.path.exists(STATE):
        print("[WARMUP] No campaign state found at ~/.reddit-campaign/state.md")
        print("[WARMUP] The Hermes cron (reddit-warmup-daily-morning/evening) writes this file.")
        print("[WARMUP] Status: NOT CONFIGURED")
        return 1

    with open(STATE, encoding="utf-8") as f:
        text = f.read()

    username = re.search(r"username:\s*([\w-]+)", text)
    karma = re.search(r"comment_karma\s*=\s*([-\d]+)", text)
    link_karma = re.search(r"link_karma\s*=\s*([-\d]+)", text)
    goal = re.search(r"Goal:\s*(.+)", text)

    verified = "VERIFIED LIVE" in text
    posted_count = text.count("[x]")
    day_lines = re.findall(r"^## Day (\d+)", text, re.M)

    print(f"[WARMUP] Campaign tracker: {STATE}")
    if username:
        print(f"[WARMUP] Account: {username.group(1)}")
    if karma or link_karma:
        print(f"[WARMUP] Karma: comment={karma.group(1) if karma else '?'} link={link_karma.group(1) if link_karma else '?'}")
    if goal:
        print(f"[WARMUP] Goal: {goal.group(1).strip()}")
    print(f"[WARMUP] Verified posts: {posted_count}")
    if day_lines:
        print(f"[WARMUP] Days active: {len(day_lines)} (through Day {day_lines[-1]})")
    print(f"[WARMUP] Tracker last modified: {datetime.fromtimestamp(os.path.getmtime(STATE), tz=timezone.utc).isoformat()}")

    # Staleness check: if state file is older than 3 days, flag it
    age_days = (datetime.now(timezone.utc) - datetime.fromtimestamp(os.path.getmtime(STATE), tz=timezone.utc)).total_seconds() / 86400
    if age_days > 3:
        print(f"[WARMUP] WARNING: tracker has not been updated in {age_days:.1f} days — cron may be failing")
        return 1

    print("[WARMUP] Status: ACTIVE")
    return 0


if __name__ == "__main__":
    sys.exit(main())
