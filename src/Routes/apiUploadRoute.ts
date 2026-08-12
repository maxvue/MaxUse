import { apiRoute, type ApiRouteOptions } from './apiRoute';
import axios from 'axios';
import { getConfiguredHeaders, getWithCredentials } from './config';

/**
 * Realiza upload de arquivos via requisição HTTP POST (multipart/form-data) para uma rota nomeada.
 * Converte automaticamente dados em FormData, incluindo serialização de objetos aninhados via JSON.
 *
 * @template T - Tipo do payload de retorno da API.
 * @param RouteName - Nome da rota (ex: 'api.documentos.upload').
 * @param files - Arquivos a serem enviados. Aceita `{ files: File[] }`, `File[]`, um `File` único ou null.
 * @param data - Dados adicionais enviados junto com os arquivos.
 * @param options - Opções extras passadas para `apiRoute` (incluindo `route_params`, `onError`, `throw`).
 * @returns Os dados da resposta, false se a rota for inválida, ou null em caso de erro na requisição.
 */
export async function apiUploadRoute<T = any>(
    RouteName: string | null | undefined,
    files: any = null,
    data: any = {},
    options: ApiRouteOptions | null = null
): Promise<T | null | false> {
    const system_options = apiRoute(RouteName, data, options, 'POST');

    if (!system_options) return false;

    // Criando o FormData
    const formData = new FormData();

    // Adicionando os dados ao FormData
    if (data && typeof data === 'object') for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (value === null || value === undefined) continue;

        if (typeof value === 'object' && !(value instanceof Blob)) formData.append(key, JSON.stringify(value));
        else formData.append(key, value);

    }


    // Normaliza a entrada: aceita null, File único, File[] ou { files: File[] }
    const raw_files = files?.files ?? files;
    const file_list: any[] = raw_files == null ? [] : (Array.isArray(raw_files) ? raw_files : [raw_files]);

    // Adicionando os arquivos ao FormData
    file_list.forEach((fileItem: any, index: number) => {
        if (fileItem && fileItem.name) formData.append(`files[${index}]`, fileItem, fileItem.name);
        else if (fileItem) formData.append(`files[${index}]`, fileItem);

    });

    try {
        const message_response = await axios.post(system_options.routeURL, formData, {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...getConfiguredHeaders(),
                ...options?.headers,
                ...(typeof localStorage !== 'undefined' && localStorage.getItem('selected.client.id') ? { 'X-Client-Id': localStorage.getItem('selected.client.id') } : {})
            },
            withCredentials: getWithCredentials(),
            ...(options?.onUploadProgress ? { onUploadProgress: options.onUploadProgress } : {})
        });
        return message_response.data;
    } catch (error: any) {
        if (options?.onError) options.onError(error);
        if (options?.error !== false) console.error('>> Erro ao fazer o upload - Rota: ' + RouteName, error);
        if (options?.throw) throw error;

        return null;
    }
}
