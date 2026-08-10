/**
 * Detecta se o dispositivo atual possui suporte a interações via toque (touch).
 *
 * @returns true se o dispositivo suportar toque, caso contrário false.
 */
export function isTouchDevice(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        ((navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0
    );
}
