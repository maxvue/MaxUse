import axios, { AxiosRequestConfig } from 'axios';
import { apiRoute } from './apiRoute';

/**
 * Realiza uma requisição HTTP GET para uma rota Ziggy nomeada.
 * Suporta download de arquivos (blob) e tratamento de erros configurável.
 *
 * @param RouteName - Nome da rota Ziggy (ex: 'api.usuarios.index').
 * @param data - Parâmetros da rota (substituídos na URL).
 * @param options - Opções extras. `{ file: true }` altera responseType para blob. `{ error: false }` silencia erros no console.
 * @returns Os dados da resposta ou null em caso de erro.
 */
export async function apiGetRoute(RouteName: string | null, data: any = {}, options: any = null): Promise<any> {
    const system_options: any = apiRoute(RouteName, data, options, 'GET');
    const config: AxiosRequestConfig = { responseType: 'json' };

    if (options?.file === true) config.responseType = 'blob';

    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(system_options.routeURL, config);
        return response.data;
    } catch (error: any) {
        if (options?.error !== false) console.error('>> Request ERRO - URL: "' + system_options.routeURL + '"', error?.message);

        return null;
    }
}