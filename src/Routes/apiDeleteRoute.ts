import axios from 'axios';
import { apiRoute } from './apiRoute';

/**
 * Realiza uma requisição HTTP DELETE para uma rota Ziggy nomeada.
 * Inclui automaticamente o token CSRF do meta tag e headers padrão para Laravel.
 *
 * @param RouteName - Nome da rota Ziggy (ex: 'api.usuarios.destroy').
 * @param data - Corpo da requisição (enviado no campo `data` do axios.delete).
 * @param options - Opções extras passadas para `apiRoute`.
 * @returns Os dados da resposta ou null em caso de erro. Retorna false se a rota for inválida.
 */
export async function apiDeleteRoute(RouteName: string | null, data: any | null = null, options: any = null) {
    const system_options: any = apiRoute(RouteName, data, options, 'DELETE');

    if (!system_options) return false;

    try {
        const token: string = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const response = await axios.delete(system_options.routeURL, {
            data: data,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('>> Erro ao fazer a requisição:', error);
        return null;
    }
}
