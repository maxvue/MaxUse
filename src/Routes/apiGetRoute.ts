import axios, { AxiosRequestConfig } from 'axios';
import { apiRoute } from './apiRoute';

export async function apiGetRoute(RouteName: string | null, data: any = {}, options: any = null): Promise<any> {
    const system_options: any = apiRoute(RouteName, data, options, 'GET');
    const config: AxiosRequestConfig = { responseType: 'json' };

    if (options?.file === true) config.responseType = 'blob';

    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(system_options.routeURL, config);
        return response.data;
    } catch (error: any) {
        if (options?.error !== false) console.error('>> Erro apiGetRoute - URL: "' + system_options.routeURL + '"', error?.message);

        return null;
    }
}
