import axios from 'axios';
import { apiRoute } from './apiRoute';

/**
 * Realiza uma requisição HTTP POST para uma rota Ziggy nomeada.
 * Inclui automaticamente o token CSRF do meta tag e headers padrão para Laravel.
 *
 * @param RouteName - Nome da rota Ziggy (ex: 'api.usuarios.store').
 * @param data - Corpo da requisição (JSON).
 * @param options - Opções extras passadas para `apiRoute`.
 * @returns Os dados da resposta ou null em caso de erro. Retorna false se a rota for inválida.
 */
export async function apiPostRoute(RouteName: string | null, data: any | null = null, options: any = null) {
    const system_options: any = apiRoute(RouteName, data, options, 'POST');

    if (!system_options) return false;

    try {
        const token: string = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const response = await axios.post(system_options.routeURL, data, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest',
                ...(typeof localStorage !== 'undefined' && localStorage.getItem('selected.client.id') ? { 'X-Client-Id': localStorage.getItem('selected.client.id') } : {})
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('>> Erro ao fazer a requisição - Rota: ' + RouteName, error);
        return null;
    }

}
