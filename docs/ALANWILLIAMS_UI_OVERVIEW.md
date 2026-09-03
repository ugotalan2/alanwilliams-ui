# AlanWilliams UI - Project Overview

## Purpose

`alanwilliams-ui` is the shared frontend design system and React
component library for AlanWilliams Apps. It lets Platform, Agenda, and
future apps share one visual/account/navigation language without copying
CSS or components between repositories.

The package is consumed at build time and is not a deployed service.

## Product Direction

``` text
one product family
-> consistent visual language
-> consistent account/navigation experience
-> distinct app identity
-> independently deployable apps
```

## Ownership

### Shared UI owns

-   semantic design tokens and common CSS
-   SYSTEM / LIGHT / DARK rendering mechanics
-   app identity themes and approved app/brand assets
-   `ThemeProvider`, appearance presentation, account-menu presentation
-   shared header and footer
-   authenticated `AppShell`
-   desktop side-navigation presentation
-   mobile bottom-navigation presentation
-   shared responsive/accessibility behavior

### Platform owns

-   canonical Person and Clerk linkage
-   profile/account data
-   persisted global appearance preference
-   My Apps and onboarding
-   cross-app identity/routing contracts

### Individual apps own

-   authentication-state decisions about whether the authenticated shell
    is rendered
-   route definitions and ordered navigation choices
-   domain pages/workflows
-   memberships, permissions, settings, and backend authorization

Shared UI renders presentation. It does not query Platform APIs, persist
Person state, or decide app authorization.

## App Identity

``` text
Platform -> navy
Agenda   -> BYU Royal Blue
Budget   -> green
Chores   -> gold
Fitness  -> dark red
```

Each app theme sets `--app-primary`. Shared app navigation and primary
actions use that variable directly; the package does not hard-code
Platform navy into reusable app navigation.

## Shared Navigation Contract

Apps supply one ordered flat `AppNavItem[]`:

``` ts
interface AppNavItem {
    label: string
    to: string
    icon: IconDefinition
}
```

The consuming app filters this list for the current user's permissions
before passing it to `AppShell`.

Desktop: - shows all supplied authorized items - side navigation uses
`--app-primary` - remains sticky beneath the sticky shared header -
independently scrolls if its own content exceeds the viewport

Mobile: - fixed bottom navigation using `--app-primary` - 1-5 items:
show all - more than 5: show first 4 plus package-generated `More` -
`More` contains `items.slice(4)` - an active overflow route makes `More`
active - safe-area space is filled by the same app-primary surface -
shell content reserves bottom-nav clearance automatically

The mobile bottom navigation currently uses a flexible `68px` minimum
content height plus `env(safe-area-inset-bottom, 0px)`.

## Header / Footer / Account

The shared header is sticky. Public vs authenticated behavior is
selected by the consuming app; the UI package does not know Clerk.

The footer remains a separate legal/support surface. Privacy, Terms,
Contact, and copyright are not moved into the mobile `More` menu.

Target shared account menu:

``` text
My Profile
Appearance
My Apps
---------
Sign Out
```

Handlers and persistence remain app/Platform supplied.

## Distribution

Current package:

``` text
@ugotalan2/ui
```

Registry: GitHub npm Packages.

Current proven release:

``` text
0.5.1
```

Platform is the first proven consumer. Agenda is the next consumer.

## Current Status

Implemented and published: - package/publishing pipeline - tokens/base
CSS/themes/icons - shared `ThemeProvider` - shared Appearance and
Account menus - shared `AppHeader` - shared `AppFooter` - shared
`AppShell` - shared desktop `SideNav` - shared mobile `BottomNav` -
sticky header/desktop nav behavior - mobile overflow and safe-area
behavior - app-primary navigation theming

Next: 1. adopt `@ugotalan2/ui@0.5.1` in Agenda 2. render Agenda with
`aw-theme-agenda` 3. replace duplicated shell/theme/navigation
presentation 4. then layer Agenda organization context and
permission-filtered navigation on top
