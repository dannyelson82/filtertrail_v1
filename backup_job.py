import os
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

def run_backup():
    db_url = os.environ["DATABASE_URL"]
    uploads_path = os.environ.get("UPLOADS_PATH", "/app/uploads")
    backup_dest = os.environ.get("BACKUP_DEST_LOCAL", "/backups/filtertrail")
    encryption_key = os.environ.get("BACKUP_ENCRYPTION_KEY", "")

    # Parse MySQL URL: mysql://user:pass@host:port/dbname
    # Simple parsing; adjust if you use more complex URLs
    # mysql://filtertrail:PASSWORD@localhost:3306/filtertrail
    from urllib.parse import urlparse, unquote

    parsed = urlparse(db_url)
    user = parsed.username
    password = unquote(parsed.password)
    host = parsed.hostname
    port = parsed.port or 3306
    db_name = parsed.path.lstrip("/")

    timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    backup_dir = Path(backup_dest)
    backup_dir.mkdir(parents=True, exist_ok=True)

    db_dump_file = backup_dir / f"filtertrail-db-{timestamp}.sql"
    archive_file = backup_dir / f"filtertrail-{timestamp}.tar"
    encrypted_file = backup_dir / f"filtertrail-{timestamp}.enc.tar"

    # 1) Dump database
    print("[backup] Dumping database...")
    mysql_cmd = [
        "mysqldump",
        f"--host={host}",
        f"--port={port}",
        f"--user={user}",
        f"--password={password}",
        "--single-transaction",
        "--quick",
        "--lock-tables=false",
        db_name,
    ]
    with open(db_dump_file, "wb") as f:
        subprocess.run(mysql_cmd, check=True, stdout=f)

    # 2) Create tar archive (db dump + uploads)
    print("[backup] Creating archive...")
    # We'll create a tar with:
    #   db/filtertrail-*.sql
    #   uploads/...
    db_dir_name = db_dump_file.name
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)
        db_staging = tmpdir / "db"
        db_staging.mkdir()
        (db_staging / db_dir_name).symlink_to(db_dump_file)

        uploads_staging = tmpdir / "uploads"
        uploads_staging.symlink_to(uploads_path)

        tar_cmd = [
            "tar",
            "-cf",
            str(archive_file),
            "-C",
            str(tmpdir),
            "db",
            "uploads",
        ]
        subprocess.run(tar_cmd, check=True)

    # 3) Encrypt archive with OpenSSL
    print("[backup] Encrypting archive...")
    openssl_cmd = [
        "openssl",
        "enc",
        "-aes-256-cbc",
        "-salt",
        "-pbkdf2",
        "-in",
        str(archive_file),
        "-out",
        str(encrypted_file),
        "-pass",
        f"pass:{encryption_key}",
    ]
    subprocess.run(openssl_cmd, check=True)

    # 4) Clean up unencrypted files
    print("[backup] Cleaning up unencrypted files...")
    archive_file.unlink(missing_ok=True)
    db_dump_file.unlink(missing_ok=True)

    print(f"[backup] Backup completed: {encrypted_file}")
