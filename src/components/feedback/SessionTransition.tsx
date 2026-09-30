export interface SessionTransitionProps {
    title: string
    message: string
}

export function SessionTransition({
    title,
    message,
}: SessionTransitionProps) {
    return (
        <main
            aria-live="polite"
            className="aw-session-transition"
        >
            <div className="text-center px-4">
                <h1 className="h4 fw-bold mb-2">
                    {title}
                </h1>
                <p className="aw-text-muted mb-0">
                    {message}
                </p>
            </div>
        </main>
    )
}
