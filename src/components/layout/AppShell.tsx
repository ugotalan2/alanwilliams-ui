import type { ReactNode } from 'react'

import { BottomNav } from '../navigation/BottomNav.js'
import { SideNav } from '../navigation/SideNav.js'
import type { AppNavItem } from '../navigation/AppNavItem.js'

export interface AppShellProps {
    navigation: AppNavItem[]
    children: ReactNode
}

export function AppShell({
                             navigation,
                             children,
                         }: AppShellProps) {
    return (
        <div className="aw-app-shell">
            <SideNav items={navigation} />

            <div className="aw-app-shell-content">
                {children}
            </div>

            <BottomNav items={navigation} />
        </div>
    )
}