import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { NavLink, matchPath, useLocation } from 'react-router-dom'

import type { AppNavItem } from './AppNavItem'

export interface BottomNavProps {
    items: AppNavItem[]
}

function routeMatches(pathname: string, to: string) {
    if (to === '/') {
        return pathname === '/'
    }

    return Boolean(
        matchPath(
            {
                path: `${to}/*`,
                end: false,
            },
            pathname,
        ),
    )
}

export function BottomNav({ items }: BottomNavProps) {
    const location = useLocation()

    const hasOverflow = items.length > 5

    const visibleItems = hasOverflow
        ? items.slice(0, 4)
        : items

    const overflowItems = hasOverflow
        ? items.slice(4)
        : []

    const overflowActive = overflowItems.some((item) =>
        routeMatches(location.pathname, item.to),
    )

    return (
        <nav className="aw-bottom-nav d-md-none">
            <div className="aw-bottom-nav-items">
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `aw-bottom-nav-link${isActive ? ' active' : ''}`
                        }
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className="aw-bottom-nav-icon"
                        />

                        <span>{item.label}</span>
                    </NavLink>
                ))}

                {hasOverflow && (
                    <div className="dropup aw-bottom-nav-more">
                        <button
                            type="button"
                            className={`aw-bottom-nav-link aw-bottom-nav-more-trigger ${
                                overflowActive ? 'active' : ''
                            }`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <FontAwesomeIcon
                                icon={faEllipsis}
                                className="aw-bottom-nav-icon"
                            />

                            <span>More</span>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end aw-bottom-nav-more-menu">
                            {overflowItems.map((item) => {
                                const active = routeMatches(
                                    location.pathname,
                                    item.to,
                                )

                                return (
                                    <li key={item.to}>
                                        <NavLink
                                            to={item.to}
                                            className={`dropdown-item aw-bottom-nav-more-item${
                                                active ? ' active' : ''
                                            }`}
                                        >
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="me-2"
                                            />

                                            {item.label}
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}