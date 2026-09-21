import os
import time
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from backup_job import run_backup
from retention import apply_retention_policy

def main():
    schedule_expr = os.getenv("BACKUP_SCHEDULE", "0 3 * * *")
    print(f"[backup] Starting scheduler with schedule: {schedule_expr}")

    scheduler = BlockingScheduler()

    @scheduler.scheduled_job(
        CronTrigger.from_crontab(schedule_expr),
        id="backup_job",
        name="FilterTrail backup",
    )
    def scheduled_backup():
        print(f"[backup] Running scheduled backup at {datetime.utcnow().isoformat()}")
        try:
            run_backup()
            apply_retention_policy()
            print("[backup] Backup and retention completed successfully")
        except Exception as e:
            print(f"[backup] Backup failed: {e!r}")

    scheduler.start()

if __name__ == "__main__":
    main()
