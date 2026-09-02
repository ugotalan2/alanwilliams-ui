# AlanWilliams UI - Architecture

## Scope

This document is the source of truth for the architecture and ownership
boundaries of `alanwilliams-ui`.

`alanwilliams-ui` is the shared frontend design-system and React UI
library for the AlanWilliams Apps ecosystem. It is a build-time
dependency consumed by independently deployable applications such as
Platform, Agenda, Budget, Chores, Fitness, and future apps.

Cross-repository platform architecture remains owned by
`ALANWILLIAMS_PLATFORM_ARCHITECTURE.md`. Application-specific
navigation, workflows, domain UI, and authorization remain owned by each
application repository.

## Architecture Principles

-   Keep applications independently deployable.
-   Share reusable frontend design and behavior through a versioned npm
    package rather than copy/paste.
-   Treat `alanwilliams-ui` as the frontend counterpart to
    `alanwilliams-spring-security`: reusable library code, not a
    deployed service.
-   Keep shared presentation separate from Platform-owned account data
    and app-owned domain data.
-   Prefer configurable shared components over app-specific branching
    inside the library.
-   Keep app identity declarative: app name, icon, accent theme,
    navigation, and routes are supplied by the consuming app.
-   Package shared assets at build time so an application's runtime does
    not depend on `alanwilliams.app` being available.
-   Maintain accessibility and responsive behavior in shared components
    so fixes propagate consistently across apps.
-   Avoid cross-repository source imports, Git submodules, and
    externally hosted shared CSS as the primary reuse mechanism.

## Technology Baseline

The package follows the AlanWilliams Platform frontend baseline:

-   React `19.2.x`
-   React Router `7.x` where routing-aware components are provided
-   TypeScript `6.0.x`
-   Vite `8.2.x`
-   Bootstrap `5.3.x`
-   Font Awesome `7.3.x`
-   React Font Awesome `3.x`
-   Node.js `24.x LTS`
-   npm `11.x`

Exact compatible versions are locked by this repository and its
consumers. Shared major/minor baseline changes are coordinated with the
Platform architecture.

## Repository Role

### `alanwilliams-ui`

Owns reusable frontend presentation and interaction primitives shared
across AlanWilliams Apps.

Initial ownership includes:

-   design tokens
-   shared typography and spacing conventions
-   shared surface/card styles
-   shared button and form styling
-   shared light/dark appearance mechanics
-   per-app visual theme definitions
-   app icons and shared brand assets
-   reusable application shell components
-   reusable header components
-   reusable account-menu presentation
-   reusable desktop navigation components
-   reusable mobile navigation components
-   responsive layout behavior
-   shared accessibility behavior for those components

### `alanwilliams-ui` Does Not Own

-   canonical Person data
-   Clerk-to-Person linkage
-   profile persistence
-   appearance preference persistence
-   My Apps preference persistence
-   onboarding state
-   app memberships
-   app authorization
-   app-specific domain workflows
-   app-specific routes or navigation choices
-   Agenda meetings/questions/assignments
-   Budget financial domain behavior
-   backend APIs

Those remain owned by Platform or the appropriate application.

## Distribution Model

`alanwilliams-ui` is distributed as a versioned npm package:

``` text
alanwilliams-ui repository
        |
        v
GitHub npm Packages
        |
        v
@ugotalan2/ui
        |
        +--> alanwilliams-platform
        +--> alanwilliams-agenda
        +--> alanwilliams-budget
        +--> alanwilliams-chores
        `--> future apps
```

Consumers install a published package version. They do not copy the
library source into their repositories.

Conceptual consumer dependency:

``` json
{
  "dependencies": {
    "@ugotalan2/ui": "0.1.0"
  }
}
```

Current package/publishing contract:

-   npm package: `@ugotalan2/ui`
-   registry: GitHub npm Packages (`https://npm.pkg.github.com`)
-   package scope follows the GitHub owner `ugotalan2`
-   package publication runs from the `alanwilliams-ui` repository with its
    repository `GITHUB_TOKEN` and `packages: write`
-   consumers authenticate with package-read credentials when GitHub Packages
    access is required

Package branding and repository naming remain `alanwilliams-ui`; the
`@ugotalan2` prefix is the GitHub npm registry namespace.

## Build-Time Dependency Rule

Shared CSS, icons, and React components are bundled into each consuming
application during its normal frontend build.

Docker consumers install private GitHub npm dependencies using Docker BuildKit
secrets. Package credentials are mounted only for the dependency-install step,
used to create temporary npm registry authentication, and removed before the
step completes. Credentials must not be copied into source-controlled `.npmrc`
files or baked into application images.

For local AlanWilliams app builds, Compose may source `GITHUB_TOKEN` from the
existing local env file and expose it to the build as a BuildKit secret. The
token is build-only and is not a frontend runtime environment variable.

Applications must not depend on runtime delivery of shared CSS or
JavaScript from `alanwilliams.app`.

This preserves:

-   independent deployment
-   predictable version compatibility
-   offline/local development
-   rollback capability
-   isolation from Platform frontend outages

## Package Structure

Target structure:

``` text
alanwilliams-ui/
├── src/
│   ├── components/
│   │   ├── account/
│   │   ├── layout/
│   │   └── navigation/
│   ├── icons/
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── themes.css
│   ├── types/
│   └── index.ts
├── package.json
├── README.md
├── ALANWILLIAMS_UI_ARCHITECTURE.md
└── ALANWILLIAMS_UI_OVERVIEW.md
```

The exact internal folder structure may evolve without becoming a
cross-repository architecture change as long as the public package
contract remains stable.

## Styling Architecture

### Shared Tokens

Common tokens define neutral product-family behavior such as:

-   backgrounds
-   surfaces
-   borders
-   text
-   muted text
-   spacing
-   radii
-   navigation dimensions
-   focus behavior

Example conceptual variables:

``` css
:root {
  --aw-bg: ...;
  --aw-surface: ...;
  --aw-border: ...;
  --aw-text: ...;
  --aw-text-muted: ...;
}
```

### App Themes

Each application has a distinct visual identity layered on top of the
shared neutral system.

Current direction:

  App        Accent direction
  ---------- -------------------
  Platform   AlanWilliams navy
  Agenda     BYU Royal Blue
  Budget     green
  Chores     gold
  Fitness    dark red

Apps should remain mostly neutral. App identity is emphasized through:

-   logo/icon
-   active navigation
-   primary actions
-   links
-   tags/highlights where appropriate

App themes must not be confused with domain concepts. For example,
Agenda domain `theme` records are meeting/content tags and remain
Agenda-owned.

### Appearance

Global appearance modes are:

``` text
SYSTEM
LIGHT
DARK
```

`alanwilliams-ui` owns the reusable mechanics and styles required to
render those modes.

Platform owns the persisted Person appearance preference. A consuming
app is responsible for obtaining the current preference through the
appropriate Platform contract and applying it to the shared UI.

The UI package must not query the Platform database or persist Person
preferences itself.

## Shared Component Architecture

Shared components should accept configuration rather than know
application business logic.

Conceptual example:

``` tsx
<AppShell
  app="agenda"
  name="Agenda"
  navigation={agendaNavigation}
>
  ...
</AppShell>
```

The consuming application owns `agendaNavigation`; the shared package
owns how navigation is rendered responsively.

### Application Shell

The shared application shell may provide:

-   branded top header
-   desktop side navigation
-   mobile bottom navigation
-   responsive content region
-   account-menu slot/component
-   app theme application

### Navigation

Navigation definitions are app-owned because available destinations are
domain-specific.

The shared library owns:

-   rendering
-   active state styling
-   responsive behavior
-   accessible navigation interaction
-   common icon/text layout

### Account Menu

The shared library may own the visual and interaction component for the
common account menu.

Target product-family menu:

``` text
My Profile
Appearance
My Apps
---------
Sign Out
```

Data and actions remain externally supplied:

-   Platform owns profile data.
-   Platform owns appearance persistence.
-   Platform owns My Apps preferences.
-   Clerk owns authentication/sign-out.
-   Consumers provide handlers/data to the reusable component.

This prevents the UI package from becoming a hidden Platform service
client.

## Icons and Brand Assets

Shared AlanWilliams Apps icons and reusable brand assets belong in
`alanwilliams-ui` so each application consumes the same approved assets.

Consumers should import assets from the package rather than maintaining
independent copies.

Application-specific content imagery that is not part of the shared
product-family identity remains in the application repository.

## Public API

Consumers should import from stable package entry points rather than
internal source paths.

Preferred:

``` tsx
import {
  AppShell,
  AccountMenu,
  agendaTheme,
} from '@ugotalan2/ui'

import '@ugotalan2/ui/styles.css'
```

Avoid:

``` tsx
import AppShell from '@ugotalan2/ui/src/components/layout/AppShell'
```

Internal implementation paths are not part of the compatibility
contract.

## Dependency Boundaries

The library should minimize required peer/runtime dependencies.

React and React DOM should normally be peer dependencies so consuming
apps do not bundle conflicting React copies.

Routing-aware components may use React Router when the shared behavior
genuinely requires it, but the library should avoid owning an
application's route table.

Clerk integration should be kept at a clean boundary. Shared
presentation may accept authentication/account callbacks or small
adapter interfaces rather than embedding Platform-specific account
persistence.

## Versioning

Use semantic versioning for published package releases.

General policy:

-   patch: compatible bug fixes and visual corrections
-   minor: backward-compatible components, props, tokens, or themes
-   major: breaking public API, token, or behavioral changes

Consumers upgrade deliberately. A new library release does not silently
alter already deployed applications.

During early `0.x` development, breaking changes may occur more
frequently, but they should still be documented and coordinated across
active consumers.

## Initial Consumer Migration

Recommended sequence:

1.  Establish the package, build, exports, and GitHub Packages
    publishing. **Complete:** `@ugotalan2/ui@0.1.0` is published.
2.  Move shared design tokens, base CSS, app themes, and approved icons
    from Platform into `alanwilliams-ui`. **Complete for the initial CSS/assets
    extraction.**
3.  Make Platform consume the package and verify no visual regression.
    **Complete for shared CSS:** Platform consumes `@ugotalan2/ui@0.1.0`;
    Platform-specific My Profile/My Apps/preview styles remain local.
4.  Extract/configure reusable shell, header, navigation, and
    account-menu presentation.
5.  Make Agenda the second consumer.
6.  Remove duplicated shared assets/styles from application repositories
    after migration.
7.  Use the same package as the starting point for Budget, Chores,
    Fitness, and future apps.

Platform should be the first compatibility test because it currently
contains the working reference implementation. Agenda should be the
second consumer before the shared API is considered established.

## Testing Expectations

The shared library should test reusable behavior at the library level
where practical.

Priority areas:

-   component rendering
-   active navigation states
-   responsive behavior that can be tested without browser-specific
    layout assumptions
-   appearance/theme application
-   account-menu interaction
-   accessibility semantics
-   stable public exports

Each consuming app remains responsible for integration tests covering
its own routes, auth, data, and domain behavior.

## Security and Privacy

`alanwilliams-ui` is a frontend presentation library and must not become
a source of authorization truth.

Rules:

-   never use hidden/disabled UI as the sole authorization control
-   backend services continue to enforce authorization
-   do not store Clerk secrets in the package
-   do not embed environment-specific secrets in shared assets
-   do not expose Platform Person data beyond what a consumer
    intentionally provides to a component
-   do not implement cross-app data access inside generic UI components

## Deployment

`alanwilliams-ui` has no production runtime service, container,
database, or public domain.

Its operational lifecycle is:

``` text
develop
-> test
-> publish @ugotalan2/ui version to GitHub Packages
-> consumer pins/upgrades dependency
-> Docker build authenticates with a BuildKit secret
-> npm installs the package
-> consumer bundles shared UI assets/code
-> consumer deploys normally
```

A package publication and an application deployment are separate events.

## Architecture Decision Summary

`alanwilliams-ui` is the canonical reusable frontend design-system
package for AlanWilliams Apps.

It centralizes shared styling, themes, brand assets, and reusable React
shell/components while preserving:

-   Platform ownership of canonical account/profile state
-   app ownership of domain UI and navigation decisions
-   independent application deployment
-   explicit versioned upgrades
-   build-time rather than runtime coupling
