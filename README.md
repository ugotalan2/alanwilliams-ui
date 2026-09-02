# alanwilliams-ui

Shared React UI and design-system package for AlanWilliams Apps.

`alanwilliams-ui` provides the reusable frontend foundation used by
applications such as Platform, Agenda, Budget, Chores, Fitness, and
future AlanWilliams Apps.

## Goals

-   Keep AlanWilliams Apps visually consistent.
-   Avoid copying shared CSS, icons, headers, navigation, and account UI
    between repositories.
-   Preserve distinct app identities through configurable themes.
-   Keep every application independently deployable.
-   Version shared frontend behavior through a normal npm package.

## Package Direction

Published package:

``` text
@alanwilliams/ui
```

Distribution:

``` text
GitHub npm Packages
```

The package is a build-time dependency. It is not a deployed frontend
service.

## Intended Contents

``` text
src/
├── components/
│   ├── account/
│   ├── layout/
│   └── navigation/
├── icons/
├── styles/
│   ├── tokens.css
│   ├── base.css
│   ├── components.css
│   └── themes.css
├── types/
└── index.ts
```

Expected shared functionality includes:

-   design tokens
-   common CSS
-   light/dark appearance styles
-   Platform/Agenda/Budget/Chores/Fitness themes
-   shared app icons
-   application shell
-   header
-   account-menu presentation
-   desktop navigation
-   mobile navigation
-   common reusable UI primitives

## Example Consumer Usage

Target API:

``` tsx
import {
  AppShell,
  AccountMenu,
} from '@alanwilliams/ui'

import '@alanwilliams/ui/styles.css'
```

Application-owned configuration can then be supplied to shared
components:

``` tsx
<AppShell
  app="agenda"
  name="Agenda"
  navigation={agendaNavigation}
>
  {children}
</AppShell>
```

The consuming application owns its routes and navigation definitions.
`alanwilliams-ui` owns how the shared shell is rendered and styled.

## Ownership Boundaries

This package owns presentation, not application data or authorization.

It does **not** own:

-   Platform Person data
-   Clerk-to-Person linkage
-   profile persistence
-   appearance preference persistence
-   My Apps persistence
-   app memberships
-   domain authorization
-   application workflows
-   backend APIs

Platform and individual apps retain those responsibilities.

## App Themes

Current app identity direction:

  App        Accent
  ---------- ----------------
  Platform   navy
  Agenda     BYU Royal Blue
  Budget     green
  Chores     gold
  Fitness    dark red

The shared interface remains primarily neutral. Accent colors identify
the current app through logos, navigation, primary actions, links, and
selected highlights.

## Appearance

Shared appearance modes:

``` text
SYSTEM
LIGHT
DARK
```

This package provides the reusable rendering mechanics. Platform owns
persistence of the user's global appearance preference.

## Development Baseline

-   Node.js 24 LTS
-   npm 11
-   React 19.2.x
-   TypeScript 6.0.x
-   Vite 8.2.x
-   Bootstrap 5.3.x
-   Font Awesome 7.3.x

See `ALANWILLIAMS_UI_ARCHITECTURE.md` for the full architecture and
dependency boundaries.

## Initial Implementation Plan

1.  Configure the npm package/build.
2.  Configure GitHub Packages publishing.
3.  Extract shared styles, themes, and approved icons from
    `alanwilliams-platform`.
4.  Make Platform consume `@alanwilliams/ui`.
5.  Extract reusable shell/header/navigation/account components.
6.  Make Agenda consume `@alanwilliams/ui`.
7.  Remove duplicated shared assets after each consumer is verified.

Platform is the reference implementation and first consumer. Agenda is
the second consumer used to validate that the shared API is genuinely
reusable rather than Platform-specific.

## Documentation

-   `ALANWILLIAMS_UI_ARCHITECTURE.md` --- source of truth for shared UI
    architecture and ownership boundaries.
-   `ALANWILLIAMS_UI_OVERVIEW.md` --- current project purpose,
    direction, and status.
-   `README.md` --- repository introduction and developer entry point.

## Related Repositories

-   `alanwilliams-platform`
-   `alanwilliams-agenda`
-   `alanwilliams-spring-security`
-   `alanwilliams-database`

## Status

Initial repository created. Shared package scaffolding and GitHub
Packages publishing are the next implementation steps.
