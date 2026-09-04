# AlanWilliams UI - Project Overview

## Purpose

`alanwilliams-ui` is the shared frontend design system and React
component library for the AlanWilliams Apps ecosystem.

Its purpose is to make Platform, Agenda, Budget, Chores, Fitness, and
future applications feel like one connected product family without
copying the same CSS, icons, headers, navigation, account menus, and
responsive behavior into every repository.

The package is consumed at build time by each application and does not
run as a separate service.

## Product Direction

AlanWilliams Apps should provide:

``` text
one product family
-> consistent visual language
-> consistent account/navigation experience
-> distinct app identity
-> independently deployable apps
```

`alanwilliams-ui` supplies the reusable frontend foundation for that
experience.

## Why This Repository Exists

Before this package, Platform contained the initial shared visual
language:

-   design tokens
-   shared cards and typography
-   appearance styles
-   app theme previews
-   app icons
-   header/account patterns
-   responsive navigation patterns

Copying those files into Agenda and every future app would create
multiple implementations that drift over time.

The shared package changes that model to:

``` text
build once
-> publish a version
-> consume everywhere
```

A fix to a shared component or style can be released once and adopted by
each app through a normal dependency upgrade.

## Ownership

### Shared UI Owns

-   design tokens
-   common CSS
-   reusable light/dark appearance styles
-   app visual themes
-   shared app icons and brand assets
-   common application shell
-   reusable header
-   reusable account-menu presentation
-   desktop navigation presentation
-   mobile navigation presentation
-   common responsive behavior
-   shared reusable visual components

### Platform Owns

-   canonical Person
-   Clerk-to-Person linkage
-   profile/account data
-   global appearance preference persistence
-   My Apps preferences
-   onboarding
-   cross-app identity contracts

### Individual Apps Own

-   domain pages
-   route definitions
-   navigation choices
-   app-specific workflows
-   memberships and permissions
-   domain data
-   app-specific settings
-   backend authorization

The shared UI package renders common experiences; it does not become a
cross-app data service.

## App Identity

Each app keeps its own recognizable accent while sharing the same
neutral interface system.

Current direction:

``` text
Platform -> navy
Agenda   -> BYU Royal Blue
Budget   -> green
Chores   -> gold
Fitness  -> dark red
```

The interface should remain primarily neutral, with app identity
concentrated in the logo, navigation, primary actions, links, and
selected highlights.

## Shared Account Experience

The target shared account menu across apps is:

``` text
My Profile
My Apps
[optional app-specific items]
Appearance
---------
Sign Out
```

`alanwilliams-ui` should provide the reusable presentation and
interaction structure.

Ownership of the underlying behavior remains outside the package:

-   profile -\> Platform
-   appearance persistence -\> Platform
-   My Apps -\> Platform
-   authentication/sign-out -\> Clerk

## Appearance

Supported global appearance modes:

``` text
SYSTEM
LIGHT
DARK
```

The package owns the CSS/theme mechanics required to display these modes
consistently.

Platform remains the source of truth for a Person's saved appearance
preference.

## Distribution

The package is intended to be published through GitHub npm Packages and
consumed as:

``` text
@ugotalan2/ui
```

Conceptually:

``` tsx
import {
  AppShell,
  AccountMenu,
} from '@ugotalan2/ui'

import '@ugotalan2/ui/styles.css'
```

Apps receive the shared code during their build. They do not load CSS or
JavaScript from the Platform website at runtime.

## Initial Migration Plan

The initial implementation should proceed in this order:

1.  Create the `alanwilliams-ui` package and publishing setup.
2.  Extract shared tokens, CSS, themes, and icons from Platform.
3.  Convert Platform to consume the package.
4.  Verify Platform remains visually and functionally correct.
5.  Extract reusable header, shell, navigation, and account-menu
    presentation.
6.  Make Agenda consume the package.
7.  Build Agenda's signed-out landing experience and signed-in shell
    using shared components.
8.  Use the package as the frontend baseline for future AlanWilliams
    apps.

## Current Status

Repository created.

Architecture direction established:

-   versioned npm package
-   GitHub Packages distribution
-   build-time consumption
-   shared CSS/assets/components
-   Platform first consumer
-   Agenda second consumer
-   no runtime dependency on the Platform frontend

Implementation and publishing setup are the next steps.

## Current Milestone

The package is now published through `@ugotalan2/ui@0.5.4`, with
Platform and Agenda as active consumers.

Agenda has verified the shared light/dark theme system, full-width
header, account menu, responsive application shell, sticky desktop side
navigation, fixed mobile bottom navigation, generated mobile `More`
overflow, and app-specific navigation color through `--app-primary`.

The account menu supports generic app-specific entries such as
`Agenda Settings` without putting app-specific behavior in the shared
package. The shared UI foundation is ready for Agenda domain feature
development.
