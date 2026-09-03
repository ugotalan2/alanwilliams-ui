import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import type { AppNavItem } from './AppNavItem'

export interface SideNavProps {
    items: AppNavItem[]
}

export function SideNav({ items }: SideNavProps) {
    return (
        <aside className="aw-side-nav d-none d-md-flex flex-column">
            <nav className="aw-side-nav-items">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `aw-side-nav-link${isActive ? ' active' : ''}`
                        }
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className="aw-side-nav-icon"
                        />

                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}