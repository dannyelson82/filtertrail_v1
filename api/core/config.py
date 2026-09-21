import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
UPLOADS_PATH = os.getenv("UPLOADS_PATH", "/app/uploads")
BACKUP_PATH = os.getenv("BACKUP_PATH", "/backups/filtertrail")
ENCRYPTION_PASSPHRASE = os.getenv("ENCRYPTION_PASSPHRASE", "")
BACKUP_SCHEDULE = os.getenv("BACKUP_SCHEDULE", "0 3 * * *")
BACKUP_RETENTION_DAYS = int(os.getenv("BACKUP_RETENTION_DAYS", "3"))
BACKUP_RETENTION_WEEKS = int(os.getenv("BACKUP_RETENTION_WEEKS", "0"))
BACKUP_RETENTION_MONTHS = int(os.getenv("BACKUP_RETENTION_MONTHS", "0"))

# OIDC (not used yet, will be enabled later)
OIDC_ISSUER = os.getenv("OIDC_ISSUER", "")
OIDC_CLIENT_ID = os.getenv("OIDC_CLIENT_ID", "")
OIDC_CLIENT_SECRET = os.getenv("OIDC_CLIENT_SECRET", "")
OIDC_REDIRECT_URI = os.getenv("OIDC_REDIRECT_URI", "")
