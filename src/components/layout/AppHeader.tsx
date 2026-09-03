import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'

export interface HeaderNavigationItem {
    label: string
    to: string
}

export interface AppHeaderProps {
    brandLabel: string
    brandTo?: string

    lightLogoSrc: string
    darkLogoSrc?: string

    navigation?: HeaderNavigationItem[]

    authLoaded?: boolean
    signedIn?: boolean

    signedOutMenu?: ReactNode
    signedInMenu?: ReactNode

    onSignIn?: () => void

    collapseId?: string
}

export function AppHeader({
                              brandLabel,
                              brandTo = '/',
                              lightLogoSrc,
                              darkLogoSrc,
                              navigation = [],
                              authLoaded = true,
                              signedIn = false,
                              signedOutMenu,
                              signedInMenu,
                              onSignIn,
                              collapseId = 'awNavbar',
                          }: AppHeaderProps) {
    return (
        <nav className="navbar navbar-expand-md aw-navbar sticky-top">
            <div className="container">
                <NavLink
                    to={brandTo}
                    className="navbar-brand d-flex align-items-center gap-2"
                >
                    <span className="aw-brand-logo-container">
                        <img
                            src={lightLogoSrc}
                            alt=""
                            className="aw-brand-logo aw-brand-logo-light"
                        />

                        {darkLogoSrc && (
                            <img
                                src={darkLogoSrc}
                                alt=""
                                className="aw-brand-logo aw-brand-logo-dark"
                            />
                        )}
                    </span>

                    <span className="fw-semibold">
                        {brandLabel}
                    </span>
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-controls={collapseId}
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div
                    className="collapse navbar-collapse"
                    id={collapseId}
                >
                    <div className="navbar-nav aw-mobile-nav-row ms-auto align-items-center">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                data-label={item.label}
                                className={({ isActive }) =>
                                    `nav-link ${
                                        isActive ? 'active' : ''
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        {authLoaded && (
                            signedIn ? (
                                signedInMenu
                            ) : (
                                <>
                                    {signedOutMenu}

                                    {onSignIn && (
                                        <button
                                            type="button"
                                            className="btn aw-btn-accent aw-mobile-sign-in ms-md-2"
                                            onClick={onSignIn}
                                        >
                                            <FontAwesomeIcon
                                                icon={faRightToBracket}
                                                className="me-2"
                                            />
                                            Sign In / Sign Up
                                        </button>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}