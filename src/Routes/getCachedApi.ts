import { toValue, type MaybeRefOrGetter } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { useRoute } from 'ziggy-js';
import { isBlank } from '../Helpers/Types';

type RefStringOrNull = MaybeRefOrGetter<string | null | undefined>;
type MayBeRefData = MaybeRefOrGetter<any>;

export async function getCachedApi(routeName: RefStringOrNull, dataToRequest: MayBeRefData = null, keyCache: RefStringOrNull = null ): Promise<any> {

    const route_name = toValue(routeName);

    if (isBlank(route_name)) return null;


    const data_request = toValue(dataToRequest) ?? {};

    const key = toValue(keyCache) ?? route_name + '_' + JSON.stringify(data_request);

    const data = localStorage.getItem(key);

    if (data) return JSON.parse(data);

    const route = useRoute();
    const routeUrl = route(String(route_name), data_request);

    const config: AxiosRequestConfig = { responseType: 'json' };
    axios.defaults.withCredentials = true;
    const response = await axios.get(routeUrl, config);
    const data_return = response.data;
    console.log({ key: key, return: data_return });
    localStorage.setItem(key, JSON.stringify(data_return));
    return data_return;
}