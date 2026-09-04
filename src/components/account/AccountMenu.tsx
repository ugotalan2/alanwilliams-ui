import {
    useEffect,
    useRef,
    useState,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
    faArrowRightFromBracket,
    faCheck,
    faChevronRight,
    faCircleUser,
    faDesktop,
    faGrip,
    faMoon,
    faSun,
    faUser,
} from '@fortawesome/free-solid-svg-icons'
import {
    useTheme,
} from '../../index'
import type {
    ThemePreference,
} from '../../theme/ThemeContext'

interface AppearanceOptionProps {
    label: string
    icon: IconDefinition
    selected: boolean
    onSelect: () => void
}

function AppearanceOption({
                              label,
                              icon,
                              selected,
                              onSelect,
                          }: AppearanceOptionProps) {
    return (
        <button
            type="button"
            className={`dropdown-item aw-account-submenu-item ${
                selected ? 'active' : ''
            }`}
            onClick={(event) => {
                event.stopPropagation()
                onSelect()
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                className="me-2"
            />

            <span>{label}</span>

            {selected && (
                <FontAwesomeIcon
                    icon={faCheck}
                    className="ms-auto"
                />
            )}
        </button>
    )
}

export interface AccountMenuProps {
    onProfile: () => void
    onApps: () => void
    onSignOut: () => void | Promise<void>

    appItems?: AccountMenuItem[]

    onAppearanceChange?: (
        preference: ThemePreference,
    ) => void | Promise<void>
}

export function AccountMenu({
                                onProfile,
                                onApps,
                                onSignOut,
                                appItems = [],
                                onAppearanceChange,
                            }: AccountMenuProps) {
    const [appearanceOpen, setAppearanceOpen] =
        useState(false)

    const dropdownToggleRef =
        useRef<HTMLButtonElement>(null)

    const {
        preference,
        setPreference,
    } = useTheme()

    const appearanceIcon =
        preference === 'system'
            ? faDesktop
            : preference === 'light'
                ? faSun
                : faMoon

    const appearanceLabel =
        preference === 'system'
            ? 'System'
            : preference === 'light'
                ? 'Light'
                : 'Dark'

    async function changeAppearance(
        newPreference: ThemePreference,
    ) {
        const previousPreference = preference

        setPreference(newPreference)
        setAppearanceOpen(false)

        try {
            await onAppearanceChange?.(newPreference)
        } catch (error) {
            setPreference(previousPreference)
            throw error
        }
    }

    useEffect(() => {
        const toggleElement = dropdownToggleRef.current

        if (!toggleElement) {
            return
        }

        const handleDropdownHidden = () => {
            setAppearanceOpen(false)
        }

        toggleElement.addEventListener(
            'hidden.bs.dropdown',
            handleDropdownHidden,
        )

        return () => {
            toggleElement.removeEventListener(
                'hidden.bs.dropdown',
                handleDropdownHidden,
            )
        }
    }, [])

    return (
        <div className="dropdown">
            <button
                ref={dropdownToggleRef}
                type="button"
                className="aw-account-menu-trigger dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Open profile menu"
            >
                <FontAwesomeIcon icon={faCircleUser} />
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={onProfile}
                    >
                        <FontAwesomeIcon
                            icon={faUser}
                            className="me-2"
                        />
                        My Profile
                    </button>
                </li>

                <li>
                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={onApps}
                    >
                        <FontAwesomeIcon
                            icon={faGrip}
                            className="me-2"
                        />
                        My Apps
                    </button>
                </li>

                {appItems.map((item) => (
                    <li key={item.label}>
                        <button
                            type="button"
                            className="dropdown-item"
                            onClick={item.onClick}
                        >
                            {item.icon && (
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className="me-2"
                                />
                            )}

                            {item.label}
                        </button>
                    </li>
                ))}

                <li className="aw-account-submenu">
                    <button
                        type="button"
                        className="dropdown-item aw-account-submenu-trigger"
                        onClick={(event) => {
                            event.stopPropagation()
                            setAppearanceOpen(
                                (open) => !open,
                            )
                        }}
                        aria-expanded={appearanceOpen}
                    >
                        <span className="d-flex align-items-center">
                            <FontAwesomeIcon
                                icon={appearanceIcon}
                                className="me-2"
                            />
                            {appearanceLabel}
                        </span>

                        <FontAwesomeIcon
                            icon={faChevronRight}
                            className={
                                appearanceOpen
                                    ? 'aw-submenu-chevron open'
                                    : 'aw-submenu-chevron'
                            }
                        />
                    </button>

                    {appearanceOpen && (
                        <div className="aw-account-submenu-items">
                            <AppearanceOption
                                label="System"
                                icon={faDesktop}
                                selected={preference === 'system'}
                                onSelect={() => {
                                    void changeAppearance('system')
                                }}
                            />

                            <AppearanceOption
                                label="Light"
                                icon={faSun}
                                selected={preference === 'light'}
                                onSelect={() => {
                                    void changeAppearance('light')
                                }}
                            />

                            <AppearanceOption
                                label="Dark"
                                icon={faMoon}
                                selected={preference === 'dark'}
                                onSelect={() => {
                                    void changeAppearance('dark')
                                }}
                            />
                        </div>
                    )}
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li>
                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                            void onSignOut()
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faArrowRightFromBracket}
                            className="me-2"
                        />
                        Sign Out
                    </button>
                </li>
            </ul>
        </div>
    )
}

export interface AccountMenuItem {
    label: string
    icon?: IconDefinition
    onClick: () => void
}