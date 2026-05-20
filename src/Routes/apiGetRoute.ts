import axios, { AxiosRequestConfig } from 'axios';
import { apiRoute } from './apiRoute';

export async function apiGetRoute(RouteName: string | null, data: any = {}, options: any = null): Promise<any> {
    const system_options: any = apiRoute(RouteName, data, options, 'GET');
    const config: AxiosRequestConfig = { responseType: 'json' };

    if (options?.file === true) config.responseType = 'blob';

    try {
        axios.defaults.withCredentials = true;
        return axios
            .get(system_options.routeURL, config)
            .then((response) => response.data)
            .catch((error) => console.error('[apiGetRoute.ts] AXIOS GET ERROR: ' + error.name, system_options.routeURL, error));
    } catch (error: any) {
        if (options?.error !== false) console.error('>> Erro apiGetRoute - URL: "' + system_options.routeURL + '"', error?.message);

        return null;
    }
}
