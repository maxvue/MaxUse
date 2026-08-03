import axios from 'axios';
import { apiRoute } from './apiRoute';
import { getConfiguredHeaders, getWithCredentials } from './config';

/**
 * Realiza uma requisição HTTP PUT para uma rota nomeada.
 * Inclui automaticamente os headers configurados via `setApiRequestConfig`.
 *
 * @param RouteName - Nome da rota (ex: 'api.usuarios.update').
 * @param data - Corpo da requisição (JSON).
 * @param options - Opções extras passadas para `apiRoute`.
 * @returns Os dados da resposta ou null em caso de erro. Retorna false se a rota for inválida.
 */
export async function apiPutRoute(RouteName: string, data: any | null = null, options: any = null) {
    const system_options: any = apiRoute(RouteName, data, options, 'PUT');

    if (!system_options) return false;

    try {
        const response = await axios.put(system_options.routeURL, data, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...getConfiguredHeaders(),
                ...(typeof localStorage !== 'undefined' && localStorage.getItem('selected.client.id') ? { 'X-Client-Id': localStorage.getItem('selected.client.id') } : {})
            },
            withCredentials: getWithCredentials()
        });
        return response.data;
    } catch (error) {
        console.error('>> Erro ao fazer a requisição:', error);
        return null;
    }
}
