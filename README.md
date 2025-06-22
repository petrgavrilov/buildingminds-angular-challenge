# BuildingMinds Angular Coding Challenge

## Objective

Create a web app in Angular with two pages: `/buildings` and `/sites`, each displaying data with contextual and global tag filters. The app supports localStorage-based state persistence and lazy rendering for performance.

## Live Demo

https://buildingminds-angular-challenge.vercel.app/

## Architecture Overview

- **Feature Modules**: `buildings`, `sites`, and `tags` each encapsulate related pages, components, services, and models.
- **Core Services**:

  - `DataService`: for loading data from API or mock source.
  - `StorageService`: wraps `localStorage` with type safety and namespacing.
  - `EntitiesService`: a generic, reusable base class that handles entity loading, filtering, and persistence logic for both buildings and sites. It uses generics and filter pipelines to separate internal (page-specific) and external (global) filters.

- **UI Components**:

  - `LayoutComponent` and `NavComponent`: reusable layout shell and navigation bar.
  - `LazyLoadTriggerComponent`: triggers rendering of additional data when the user scrolls near the bottom of the list.

Each feature module has its own state service, extending `EntitiesService`, to encapsulate filtering and API logic in a reusable and scalable way.

## Project Structure

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

## Implementation Strategy

### Filters

- **Global Tag Filter**: Managed by a shared `TagsService`, which tracks selected tags and persists them to local storage.
- **Contextual Filters**: Each feature defines its own internal filters (e.g., `buildingType`, `siteType`) and provides them to a reusable filter pipeline.

### Filter Logic

- All filtering logic is centralized in the shared `EntitiesService`. Each feature provides its own filter functions (e.g. `filterByTags`, `filterByType`) which are composed and executed in sequence.
- This service separates internal filters from external ones (like tags), enabling modular logic.

### State Management

- Both buildings and sites services now extend `EntitiesService`, which handles:

  - Reactive state (`signal`s and `effect`s)
  - Local storage persistence per entity type
  - Filter logic encapsulation and computation
  - Data loading (`loadEntities()`)

This abstraction simplifies feature modules and prepares the codebase for potential migration to more advanced state tools like `ngrx` or signals-based stores.

## Pages Summary

### `/buildings`

- Displays: `id`, `name`, `tags`, `buildingType`
- Filters: Global `tags`, Page-specific `buildingType`

### `/sites`

- Displays: `id`, `name`, `tags`, `siteType`
- Filters: Global `tags`, Page-specific `siteType`

## State Persistence

- Filter state is saved in `localStorage` under three separate keys: one for tags, one for building filters, and one for site filters.
- Tag filters are managed globally via `TagsService`, while building and site filters are stored per entity type.
- All filters are persisted on change and restored automatically on page load.

## Handling 10,000+ Entries

- **Mock Data**: A generator script creates 10,000 mock entries for both buildings and sites.
- **Lazy Rendering**: Initially renders 50 items, with 50 more added each time the user scrolls to the bottom.
- **Implementation**: Uses a simple scroll-trigger based on `IntersectionObserver` to handle incremental rendering.

In production, this would typically be replaced by paginated API requests and server-side filtering.

## Extending With Date Filters

- Filter pipeline allows easy extension.
- To add a date filter:

  1. Add `date` to the filter data model.
  2. Add `filterByDate()` function.
  3. Append it to the filter chain in the service.
  4. Add UI input component.
  5. The rest (filtering + localStorage) works automatically.

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
