import os
import re
from datetime import datetime, timedelta
from pathlib import Path

def apply_retention_policy():
    backup_dest = os.environ.get("BACKUP_DEST_LOCAL", "/backups/filtertrail")
    days = int(os.environ.get("BACKUP_RETENTION_DAYS", "3"))
    weeks = int(os.environ.get("BACKUP_RETENTION_WEEKS", "0"))
    months = int(os.environ.get("BACKUP_RETENTION_MONTHS", "0"))

    backup_dir = Path(backup_dest)
    if not backup_dir.exists():
        return

    # Encrypted backups: filtertrail-YYYYMMDD-HHMMSS.enc.tar
    pattern = re.compile(r"^filtertrail-(\d{8})-(\d{6})\.enc\.tar$")
    files = []
    for f in backup_dir.iterdir():
        m = pattern.match(f.name)
        if m:
            date_str = m.group(1)  # YYYYMMDD
            dt = datetime.strptime(date_str, "%Y%m%d")
            files.append((dt, f))

    files.sort(key=lambda x: x[0], reverse=True)  # newest first

    now = datetime.utcnow()
    to_delete = set()

    # Keep all backups within the last N days
    if days > 0:
        cutoff_days = now - timedelta(days=days)
        for dt, f in files:
            if dt < cutoff_days:
                break
        # Everything after break is kept; mark rest for possible deletion
        idx = 0
        for i, (dt, f) in enumerate(files):
            if dt >= cutoff_days:
                continue
            idx = i
            break
        else:
            idx = len(files)
        # Candidates beyond daily window:
        daily_keep = [f for dt, f in files if dt >= cutoff_days]
        candidates = [f for dt, f in files if dt < cutoff_days]
    else:
        candidates = [f for _, f in files]
        daily_keep = []

    # Weekly retention: keep one per week for last N weeks
    if weeks > 0:
        weekly_keep = []
        current_week = now.isocalendar()[1]
        current_year = now.isocalendar()[0]
        kept_weeks = set()
        for dt, f in files:
            iso = dt.isocalendar()
            week_key = (iso[0], iso[1])
            weeks_ago = (now - dt).days // 7
            if weeks_ago < weeks and week_key not in kept_weeks:
                weekly_keep.append(f)
                kept_weeks.add(week_key)
        to_delete.update(set(candidates) - set(weekly_keep))
    else:
        if days == 0:
            to_delete.update(candidates)

    # Monthly retention: keep one per month for last N months
    if months > 0:
        monthly_keep = []
        kept_months = set()
        for dt, f in files:
            month_key = (dt.year, dt.month)
            months_ago = (now.year - dt.year) * 12 + (now.month - dt.month)
            if months_ago < months and month_key not in kept_months:
                monthly_keep.append(f)
                kept_months.add(month_key)
        # Combine with weekly/daily logic as needed; simple approach:
        # keep union of daily/weekly/monthly, delete rest
        keep_set = set(daily_keep) | set(weekly_keep if weeks > 0 else []) | set(monthly_keep)
        all_files = [f for _, f in files]
        to_delete = set(all_files) - keep_set

    # Delete marked files
    for f in to_delete:
        print(f"[retention] Deleting old backup: {f.name}")
        f.unlink(missing_ok=True)
