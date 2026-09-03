import { NavLink } from 'react-router-dom'

export interface AppFooterLink {
    label: string
    to: string
}

export interface AppFooterProps {
    copyright?: string
    links?: AppFooterLink[]
}

export function AppFooter({
                              copyright = '© AlanWilliams Apps',
                              links = [],
                          }: AppFooterProps) {
    return (
        <footer className="aw-footer border-top py-4 mt-auto">
            <div className="container">
                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2 gap-sm-3 small aw-text-muted">
                    <span>{copyright}</span>

                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="aw-text-muted"
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </footer>
    )
}