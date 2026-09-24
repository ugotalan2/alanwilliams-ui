export {
    ThemeContext,
    type ThemeContextValue,
    type ThemePreference,
} from './theme/ThemeContext.js'

export { ThemeProvider } from './theme/ThemeProvider.js'
export { useTheme } from './theme/useTheme.js'
export { AppearanceMenu } from './components/account/AppearanceMenu.js'

export { AccountMenu } from './components/account/AccountMenu.js'
export type {
    AccountMenuProps,
    AccountMenuItem,
} from './components/account/AccountMenu.js'

export {
    AppHeader,
    type AppHeaderProps,
    type HeaderNavigationItem,
} from './components/layout/AppHeader.js'

export {
    AppFooter,
    type AppFooterProps,
    type AppFooterLink,
} from './components/layout/AppFooter.js'

export { AppShell } from './components/layout/AppShell.js'
export type { AppShellProps } from './components/layout/AppShell.js'

export { SideNav } from './components/navigation/SideNav.js'
export type { SideNavProps } from './components/navigation/SideNav.js'

export { BottomNav } from './components/navigation/BottomNav.js'
export type { BottomNavProps } from './components/navigation/BottomNav.js'

export type { AppNavItem } from './components/navigation/AppNavItem.js'

export { PlatformIdentityGate } from './auth/PlatformIdentityGate.js'

export {
    redirectToPlatformOnboarding,
} from './auth/platformRedirect.js'
export { ModalShell } from './components/feedback/ModalShell.js'
