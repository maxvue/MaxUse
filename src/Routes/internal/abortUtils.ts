import axios from 'axios';

/**
 * Cria o erro padrão de cancelamento (`AbortError`), compatível com a convenção
 * do `AbortController` da plataforma.
 */
export function createAbortError(message = 'Requisição cancelada'): Error {
    if (typeof DOMException !== 'undefined') return new DOMException(message, 'AbortError') as unknown as Error;

    const error = new Error(message);
    error.name = 'AbortError';
    return error;
}

/**
 * Identifica se um erro representa o cancelamento de uma requisição
 * (via `AbortSignal`, `CanceledError` do axios ou `AbortError` da plataforma).
 */
export function isAbortError(error: any): boolean {
    if (!error) return false;
    if (error.code === 'ERR_CANCELED') return true;
    if (error.name === 'AbortError' || error.name === 'CanceledError') return true;

    try {
        if (typeof axios.isCancel === 'function' && axios.isCancel(error)) return true;
    } catch {
        // Silencia ambientes onde o axios não expõe isCancel
    }

    return false;
}
