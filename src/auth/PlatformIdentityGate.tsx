import {
    useEffect,
    type ReactNode,
} from 'react'

import { redirectToPlatformOnboarding } from './platformRedirect'

interface PlatformIdentityGateProps {
    platformPersonId: number | null | undefined
    platformBaseUrl: string
    loading?: boolean
    loadingFallback?: ReactNode
    children: ReactNode
}

export function PlatformIdentityGate({
                                         platformPersonId,
                                         platformBaseUrl,
                                         loading = false,
                                         loadingFallback = null,
                                         children,
                                     }: PlatformIdentityGateProps) {
    useEffect(() => {
        if (
            !loading &&
            platformPersonId == null
        ) {
            redirectToPlatformOnboarding(platformBaseUrl)
        }
    }, [
        loading,
        platformPersonId,
        platformBaseUrl,
    ])

    if (loading) {
        return <>{loadingFallback}</>
    }

    if (platformPersonId == null) {
        return null
    }

    return <>{children}</>
}