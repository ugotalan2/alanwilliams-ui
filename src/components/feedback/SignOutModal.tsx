import { createPortal } from 'react-dom'
import { ModalShell } from './ModalShell.js'

export interface SignOutModalProps {
    appName: string
    open: boolean
    onClose: () => void
    onSignOutApp: () => void | Promise<void>
    onSignOutAll: () => void | Promise<void>
    busy?: boolean
}

function modalPortalTarget(): Element {
    return (
        document.querySelector('[class*="aw-theme-"]') ??
        document.body
    )
}

export function SignOutModal({
    appName,
    open,
    onClose,
    onSignOutApp,
    onSignOutAll,
    busy = false,
}: SignOutModalProps) {
    if (!open) {
        return null
    }

    return createPortal(
        <ModalShell
            onClose={onClose}
            busy={busy}
        >
            <div className="modal-header">
                <h2 className="modal-title fs-5">
                    Sign out
                </h2>

                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    disabled={busy}
                    onClick={onClose}
                />
            </div>

            <div className="modal-body">
                <p className="mb-0">
                    Do you want to sign out of {appName} only, or all
                    AlanWilliams Apps on this browser?
                </p>
            </div>

            <div className="modal-footer flex-wrap">
                <button
                    type="button"
                    className="btn aw-btn-secondary"
                    disabled={busy}
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="btn aw-btn-secondary"
                    disabled={busy}
                    onClick={() => {
                        void onSignOutAll()
                    }}
                >
                    Sign out of all apps
                </button>

                <button
                    type="button"
                    className="btn aw-btn-app-primary"
                    disabled={busy}
                    onClick={() => {
                        void onSignOutApp()
                    }}
                >
                    Sign out of {appName}
                </button>
            </div>
        </ModalShell>,
        modalPortalTarget(),
    )
}
