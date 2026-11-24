# Instructions for Claude Code

FilterTrail v1: the first version of FilterTrail (FastAPI API in `api/`,
Next.js web app in `web/`, backup job), run with Docker Compose. It has been
replaced by the newer `filtertrail` repository. This repository is public.

## Rules
- Work on a branch and open a pull request; never push straight to `main`.
  One branch and pull request per kind of change.
- **Claude merges** its own and Dependabot's pull requests (squash) without
  waiting for review, once the checks pass. This repository has no CI or tests
  yet, so until it does, "checks pass" means the web app builds
  (`cd web && npm ci && npm run build`) and the change was reviewed by Claude.
- Clear conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`).
  All commits signed.
- Never commit secrets, real data, or personal infrastructure details (IP
  addresses, domains, hostnames, container names, people's names). Use
  `example.com`, `localhost` and RFC 5737 addresses (`192.0.2.x`) instead.
  Setup notes go in the gitignored `LOCAL_NOTES.md`.
- CI's **Privacy check** (`.github/scripts/privacy-check.py`) fails when new
  commits add real private or Tailscale addresses or real `*.ts.net` names,
  or use a computer's local address as commit email (it must be the GitHub
  noreply address). Genuine example addresses go in `.privacy-allow`.
- No sudo, no Docker socket.
- The owner is comfortable following steps but is not a command-line expert:
  when they must do something themselves, give exact numbered steps.
