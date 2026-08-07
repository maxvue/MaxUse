import { apiRoute } from './apiRoute';
import axios from 'axios';
import { getConfiguredHeaders, getWithCredentials } from './config';

/**
 * Realiza upload de arquivos via requisição HTTP POST (multipart/form-data) para uma rota nomeada.
 * Converte automaticamente dados em FormData, incluindo serialização de objetos aninhados via JSON.
 *
 * @param RouteName - Nome da rota (ex: 'api.documentos.upload').
 * @param files - Arquivos a serem enviados. Aceita `{ files: File[] }`, `File[]`, um `File` único ou null.
 * @param data - Dados adicionais enviados junto com os arquivos.
 * @param options - Opções extras passadas para `apiRoute`. `{ error: false }` silencia erros no console.
 * @returns Os dados da resposta, false se a rota for inválida, ou null em caso de erro na requisição.
 */
export async function apiUploadRoute(RouteName: string, files: any = null, data: any = {}, options: any = null) {

    const system_options: any = apiRoute(RouteName, data, options, 'POST');


    if (!system_options) return false;


    // Criando o FormData
    const formData = new FormData();

    // Adicionando os dados ao FormData
    for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (typeof value === 'object' && value !== null) formData.append(key, JSON.stringify(value));
        else formData.append(key, value);

    }


    // Normaliza a entrada: aceita null, File único, File[] ou { files: File[] }
    const raw_files = files?.files ?? files;
    const file_list: any[] = raw_files == null ? [] : (Array.isArray(raw_files) ? raw_files : [raw_files]);


    // Adicionando os arquivos ao FormData
    file_list.forEach((fileItem: any, index: number) => {
        formData.append(`files[${index}]`, fileItem, fileItem.name);
    });

    try {
        const message_response = await axios.post(system_options.routeURL, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest',
                ...getConfiguredHeaders(),
                ...(typeof localStorage !== 'undefined' && localStorage.getItem('selected.client.id') ? { 'X-Client-Id': localStorage.getItem('selected.client.id') } : {})
            },
            withCredentials: getWithCredentials()
        });
        return message_response.data;
    } catch (error) {
        if (options?.error !== false) console.error('>> Erro ao fazer o upload - Rota: ' + RouteName, error);
        return null;
    }
}
