# Changelog

All notable changes to the FilterTrail project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the project uses Semantic Versioning.

> **Pre-release:** FilterTrail is an early alpha build. Features, database schemas, routes, and UI behavior may change without backward compatibility. Use test data and maintain backups.

## [Unreleased]

Changes planned after the current alpha build will be documented here.

## [0.1.0-alpha.1] - 2026-09-21

### Added

- Vehicle retirement workflow with reason, notes, retirement timestamp, and optional sale price.
- `PUT /api/vehicles/{vehicle_id}/retire` API endpoint.
- Vehicle removal page at `/vehicles/[vehicleId]/remove`.
- Server action for submitting vehicle retirement details.
- Sale-price fields for vehicles, tools, and parts in MariaDB.
- Dynamic vehicle dashboard refresh after vehicle creation.
- Responsive Loans dashboard table handling with horizontal scrolling.
- Sidebar-aware content layout to prevent navigation overlap.
- Shared navigation and application styling improvements.
- Frontend ignore rules for `.next`, `node_modules`, and local environment files.

### Changed

- Extended the Vehicle SQLAlchemy model with `sale_price`, retirement metadata, and retirement notes.
- Extended Vehicle create, update, response, and retirement schemas.
- Updated vehicle routes to persist sale price during retirement.
- Updated vehicle create, edit, detail, and removal pages.
- Updated the vehicle dashboard to use dynamic data and show current records after changes.
- Updated Loans layout spacing to account for the fixed navigation sidebar.
- Updated active and returned Loans tables to support wide-screen and narrow-screen layouts.
- Updated Docker Compose and web-container configuration for development changes.
- Updated shared navigation, dashboard, tools, and parts frontend files.
- Added frontend package-lock tracking.

### Fixed

- Fixed vehicle removal route and frontend/API path mismatches.
- Fixed missing vehicle removal page.
- Fixed incorrect Server Action import paths.
- Fixed missing `/api` prefixes in vehicle API calls.
- Fixed sale price not being submitted by the retirement form.
- Fixed the vehicle dashboard not refreshing after adding a vehicle.
- Fixed Loans table content being hidden beneath the sidebar.
- Fixed Add Vehicle JSX structure and compilation errors.
- Fixed duplicate `dynamic` and `revalidate` exports on the vehicle dashboard.
- Fixed Fast Refresh and stale Server Action errors during development.

### Database Notes

- Sale-price columns were added to the `vehicles`, `tools`, and `parts` tables.
- Vehicle retirement is implemented as a soft-delete workflow; retired records remain available for reference.
- Database changes were applied manually through MariaDB during development.

### Technical Stack

- Backend: FastAPI, SQLAlchemy, PyMySQL.
- Frontend: Next.js 14 and React.
- Database: MariaDB/MySQL.
- Containerization: Docker Compose.

## Version History

| Version | Date | Description |
| --- | --- | --- |
| Unreleased | — | Planned changes after the current alpha build |
| 0.1.0-alpha.1 | 2026-09-21 | Initial early alpha build with vehicle retirement, sale-price tracking, dashboard updates, and responsive UI fixes |
