# AlanWilliams UI - Architecture

## Scope

This document is the source of truth for `alanwilliams-ui`, the
versioned shared frontend design-system and React UI library used by
independently deployable AlanWilliams Apps.

Cross-repository identity and integration contracts belong in
`ALANWILLIAMS_PLATFORM_ARCHITECTURE.md`. Domain routes, permissions, and
workflows remain app-owned.

## Principles

-   share reusable frontend behavior through a versioned npm package,
    not copy/paste
-   keep apps independently deployable
-   keep presentation separate from Platform account data and app domain
    data
-   prefer configurable components over app-specific branching
-   package assets at build time; no runtime dependency on the Platform
    frontend
-   keep authorization in app backends
-   use Docker for Node/npm build and validation workflows

## Technology Baseline

React 19.2.x, React Router 7.x, TypeScript 6.x, Vite 8.2.x, Bootstrap
5.3.x, Font Awesome 7.3.x, Node 24 LTS, npm 11.x.

## Distribution

``` text
alanwilliams-ui
-> GitHub npm Packages
-> @ugotalan2/ui
-> Platform / Agenda / future apps
```

Current proven package version: `0.5.1`.

Consumers pin/upgrade deliberately. Package publication and consumer
deployment are separate events. Private registry credentials are
build-only and are passed through Docker BuildKit secrets; they are not
committed or baked into runtime images.

## Ownership Boundary

### Shared UI owns

-   semantic design tokens/common CSS
-   light/dark mechanics
-   app themes and approved shared assets
-   reusable header/footer
-   account-menu and appearance presentation
-   authenticated app-shell presentation
-   desktop/mobile navigation rendering
-   responsive/accessibility behavior

### Shared UI does not own

-   Clerk authentication state
-   Platform Person/Profile APIs
-   persisted appearance/My Apps state
-   app memberships or authorization
-   app route tables
-   Agenda/other domain workflows
-   backend APIs

Apps decide whether to render a public layout or authenticated shell.
Shared UI must not import Clerk or decide `isSignedIn`.

## Styling Architecture

App identity tokens are defined centrally, and theme classes inject the
active app color:

``` css
.aw-theme-platform { --app-primary: var(--aw-app-platform); }
.aw-theme-agenda   { --app-primary: var(--aw-app-agenda); }
```

Reusable app navigation uses `var(--app-primary)` directly.

Universal navigation-state values are root-level shared tokens because
they do not vary by appearance:

``` css
--aw-nav-text: rgba(255, 255, 255, 0.82);
--aw-nav-text-strong: #ffffff;
--aw-nav-hover-bg: rgba(255, 255, 255, 0.12);
--aw-nav-active-bg: #ffffff;
```

Do not introduce a shared nav-background token that aliases Platform
navy. Light/dark blocks should contain values that actually vary by
appearance.

Top/header navigation remains on the shared surface and uses the shared
accent-highlight behavior. App-primary colored surfaces are reserved for
app navigation and primary app actions.

## Appearance

Modes:

``` text
SYSTEM
LIGHT
DARK
```

The package owns rendering mechanics and local theme application.
Platform owns authenticated Person persistence. Consumers bridge
persisted state into the shared `ThemeProvider`.

## Public Component Contract

Stable public exports currently include: - `ThemeProvider` / theme
hooks/types - `AppearanceMenu` - `AccountMenu` - `AppHeader` -
`AppFooter` - `AppShell` - `SideNav` - `BottomNav` - `AppNavItem` -
shared icons/assets - `styles.css`

Consumers import from package entry points, never internal `src/...`
paths.

## AppShell / Navigation Contract

Apps provide one ordered, permission-filtered list:

``` ts
export interface AppNavItem {
    label: string
    to: string
    icon: IconDefinition
}
```

`AppShell` owns only responsive rendering:

``` tsx
<AppShell navigation={navigation}>
    {children}
</AppShell>
```

### Desktop

-   all supplied items are rendered
-   side nav uses `--app-primary`
-   shared header is sticky
-   side nav is sticky immediately beneath the header
-   content scrolls normally
-   side nav independently scrolls if its own contents exceed available
    viewport height
-   no arbitrary desktop item-count overflow rule

Current layout tokens:

``` css
--aw-side-nav-width: 220px;
--aw-header-height: 73px;
```

The header-height token may be tuned if rendered header dimensions
change.

### Mobile

Current bottom-nav content height:

``` css
--aw-bottom-nav-height: 68px;
```

Use `min-height`, not a rigid height, to tolerate larger
text/accessibility settings.

Behavior: - 1-5 items: render all - \>5 items: render first 4 plus
generated `More` - overflow is `items.slice(4)` - package supplies the
ellipsis icon - overflow menu opens above the fixed bar on a neutral
dropdown surface - active overflow route marks `More` and the matching
overflow item active - labels remain single-line and ellipsize when
necessary

Safe-area contract:

``` css
min-height: calc(
    var(--aw-bottom-nav-height) +
    env(safe-area-inset-bottom, 0px)
);
padding-bottom: env(safe-area-inset-bottom, 0px);
```

The safe-area region uses the same `--app-primary` background.
`AppShell` reserves equivalent bottom content clearance.

Use standards-based CSS safe areas. Do not add JavaScript
`visualViewport` workarounds unless real-device testing demonstrates a
need.

### Permission Boundary

The package receives only the items an app wants rendered. Apps may
derive them from organization/role/permission state. Hiding a
destination is UX only; backend authorization remains authoritative.

A future user preference may reorder navigation by reordering the
supplied array upstream. No shared preference/reordering infrastructure
exists now.

## Header

`AppHeader` is shared presentation. It supports public/authenticated
menu slots and app branding supplied by the consumer.

The header is sticky at the top of the viewport. The UI package does not
determine signed-in state.

Platform currently uses explicit navy/light and white/dark W logo
assets. Other apps may add explicit dark variants later if contrast
requires them.

## Footer

`AppFooter` is separate from app navigation. Legal/support destinations
such as Privacy, Terms, Contact, and copyright remain footer content and
are not folded into the mobile app-navigation overflow.

## Account Menu

Shared presentation:

``` text
My Profile
Appearance
My Apps
---------
Sign Out
```

Consumers provide navigation/sign-out/persistence handlers. Shared UI
does not query Platform.

## Versioning

-   patch: compatible fixes/visual corrections
-   minor: backward-compatible public additions
-   major: breaking public contract changes

`0.5.1` is a patch over `0.5.0`: sticky header/desktop navigation,
mobile spacing/accessibility/safe-area refinements, and navigation-token
cleanup; no public API change.

## Consumer Migration

1.  package/publishing --- complete
2.  shared tokens/themes/icons --- complete
3.  Platform CSS/theme adoption --- complete
4.  shared ThemeProvider/account/header/footer --- complete
5.  shared AppShell/SideNav/BottomNav --- complete
6.  Platform `0.5.1` shell verification --- complete
7.  Agenda adoption --- next
8.  remove duplicated Agenda shared presentation after verification
9.  use the same package baseline for future apps

## Security

Shared UI is never an authorization source. It contains no Clerk
secrets, no Platform persistence credentials, and no generic cross-app
data access.

## Deployment Lifecycle

``` text
develop
-> Docker build/test
-> publish @ugotalan2/ui
-> consumer upgrades pinned version
-> consumer Docker build installs package
-> consumer bundles assets/code
-> consumer deploys independently
```
