export function redirectToPlatformOnboarding(
    platformBaseUrl: string,
): void {
    const url = new URL('/onboarding', platformBaseUrl)

    url.searchParams.set(
        'returnTo',
        window.location.origin,
    )

    window.location.assign(url.toString())
}