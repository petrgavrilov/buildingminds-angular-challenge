# BuildingMinds Angular Coding Challenge

## Objective

Create a web app in Angular with two pages: `/buildings` and `/sites`, each displaying data with contextual and global tag filters. The app supports localStorage-based state persistence and lazy rendering for performance.

## Architecture Overview

- **Feature Modules**: `buildings`, `sites`, and `tags` each encapsulate related pages, components, services, and models.
- **Shared Core**:

  - `DataService`: for loading data.
  - `StorageService`: wraps `localStorage` with type safety and namespacing.
  - `LayoutComponent` and `NavComponent`: reusable UI shell.
  - `LazyLoadTriggerComponent`: handles infinite scroll logic.

Each feature module has its own state service to encapsulate filtering and API logic.

## Implementation Strategy

### Filters

- **Global Tag Filter**: Shared `TagsService` manages selected tags and persists them.
- **Contextual Filters**: Each page (buildings/sites) has its own filter (buildingType/siteType).

### Filter Logic

- Each service uses an array of filter functions (e.g. `filterByTags`, `filterByType`) applied through a reducer.
- Filters are persistent across refreshes using `localStorage`, managed via `StorageService`.

### State Management

- Each service encapsulates:

  - Data loading (`loadBuildings()`, `loadSites()`)
  - Filter state (`signal`s + `effect` to auto-save)
  - Computed filtered result

Services are signal-based, but structured to be easily migrated to `ngrx` or other state libraries.

## Pages Summary

### `/buildings`

- Displays: `id`, `name`, `tags`, `buildingType`
- Filters: Global `tags`, Page-specific `buildingType`
- Components: `BuildingsComponent`, `BuildingsSkeletonComponent`

### `/sites`

- Displays: `id`, `name`, `tags`, `siteType`
- Filters: Global `tags`, Page-specific `siteType`
- Components: `SitesComponent`, `SitesSkeletonComponent`

## State Persistence

- Filter state (`tags`, `buildingType`, `siteType`) is saved in `localStorage` per page.
- Automatically restored on app initialization via each feature's service.

## Handling 10,000+ Entries

- **Mock Data**: Generator script creates 10,000 entries for each entity.
- **Lazy Rendering**: Table displays 50 items initially, loading 50 more each time user scrolls to the bottom.
- **Implementation**: Simple scroll-trigger using `IntersectionObserver`.

In a real-world app, pagination and server-side filtering would be used instead of full client-side storage.

## Extending With Date Filters

- Filter pipeline allows easy extension.
- To add a date filter:

  1. Add `date` to the filter data model.
  2. Add `filterByDate()` function.
  3. Append it to the filter chain in the service.
  4. Add UI input component.

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Generate mock data:

```bash
npm run generate:mock
```

3. Start dev server:

```bash
npm start
```

## Tech Stack

- Angular 19
- Tailwind CSS + PrimeNG

## 📁 Project Structure

```
src/app
├── buildings
├── sites
├── tags
├── core
│   ├── services
│   └── tokens
└── ui
    └── components
```

## Known Improvements

- Some duplication exists between buildings/sites services. I kept it to keep the code simple and easy to read. In real apps, these features often evolve differently anyway.

- Shared filtering logic could be extracted, but I preferred clear separation for this challenge.

- Pagination and server-side filtering would be used in production. Here I used lazy rendering with mock data for simplicity.
