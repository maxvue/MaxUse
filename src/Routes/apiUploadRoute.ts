import { apiRoute, type ApiRouteOptions } from './apiRoute';
import axios from 'axios';
import { getConfiguredHeaders, getWithCredentials } from './config';
import { isAbortError } from './internal/abortUtils';

/**
 * Performs multipart file upload via HTTP POST (`multipart/form-data`) to a named route.
 * Automatically constructs FormData, including JSON serialization of nested objects.
 *
 * @template T - Expected API response payload type.
 * @param RouteName - Named route string (e.g. 'api.documents.upload').
 * @param files - Files to upload. Accepts `{ files: File[] }`, `File[]`, a single `File`, or null.
 * @param data - Additional payload data sent alongside files.
 * @param options - Extra options (use `options.route_params` for URL placeholders, `onUploadProgress`, `onError`, `throw`, etc.).
 * @returns Response data, false if the route is invalid, or null on request failure.
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

    const signal = options?.signal;
    const progress_callback = options?.onUploadProgress;

    // Guarda o callback de progresso: após o abort (ex: desmontagem do componente),
    // eventos ainda em trânsito não devem escrever em refs já destruídas.
    const onUploadProgress = progress_callback
        ? (progressEvent: any) => {
            if (signal?.aborted) return;
            progress_callback(progressEvent);
        }
        : undefined;

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
            ...(onUploadProgress ? { onUploadProgress } : {}),
            ...(signal ? { signal } : {})
        });
        return message_response.data;
    } catch (error: any) {
        // Cancelamento não é erro: não loga, não chama onError
        if (isAbortError(error)) {
            if (options?.throw) throw error;

            return null;
        }

        if (options?.onError) options.onError(error);
        if (options?.error !== false) console.error('>> Erro ao fazer o upload - Rota: ' + RouteName, error);
        if (options?.throw) throw error;

        return null;
    }
}
