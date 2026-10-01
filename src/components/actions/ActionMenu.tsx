import {
    cloneElement,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type MouseEvent,
    type ReactElement,
} from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

type MenuContentProps = {
    className?: string
    onClick?: (event: MouseEvent<HTMLElement>) => void
}

export type ActionMenuProps = {
    title: string
    triggerClassName?: string
    children: ReactElement<MenuContentProps>
}

export function ActionMenu({
    title,
    triggerClassName = 'btn btn-sm aw-btn-menu',
    children,
}: ActionMenuProps) {
    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState<{
        top: number
        right: number
    } | null>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuId = useId()

    const updatePosition = useCallback(() => {
        const trigger = triggerRef.current
        if (!trigger) return

        const rect = trigger.getBoundingClientRect()
        setPosition({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
        })
    }, [])

    useEffect(() => {
        if (!open) return

        updatePosition()

        function closeOnOutsidePointer(event: PointerEvent) {
            const target = event.target
            if (!(target instanceof Element)) {
                setOpen(false)
                return
            }

            if (target.closest(`[data-action-menu-id="${menuId}"]`) === null) {
                setOpen(false)
                setPosition(null)
            }
        }

        document.addEventListener('pointerdown', closeOnOutsidePointer, true)
        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsidePointer, true)
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition)
        }
    }, [menuId, open, updatePosition])

    return (
        <div data-action-menu-id={menuId} className="dropdown aw-action-menu">
            <button
                ref={triggerRef}
                type="button"
                className={triggerClassName}
                title={title}
                aria-expanded={open}
                onClick={() => {
                    if (open) {
                        setOpen(false)
                        setPosition(null)
                        return
                    }

                    updatePosition()
                    setOpen(true)
                }}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
            {open &&
                position &&
                createPortal(
                    <div
                        data-action-menu-id={menuId}
                        className="dropdown aw-action-menu"
                        style={{
                            position: 'fixed',
                            top: position.top,
                            right: position.right,
                            zIndex: 1080,
                        }}
                    >
                        {cloneElement(children, {
                            className:
                                `${children.props.className ?? ''} show position-static`.trim(),
                            onClick: (event) => {
                                children.props.onClick?.(event)
                                setOpen(false)
                                setPosition(null)
                            },
                        })}
                    </div>,
                    document.body,
                )}
        </div>
    )
}
