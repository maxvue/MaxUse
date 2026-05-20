import { MaybeRefOrGetter } from 'vue';
type RefStringOrNull = MaybeRefOrGetter<string | null | undefined>;
type MayBeRefData = MaybeRefOrGetter<any>;
export declare function getCachedApi(routeName: RefStringOrNull, dataToRequest?: MayBeRefData, keyCache?: RefStringOrNull): Promise<any>;
export {};
//# sourceMappingURL=getCachedApi.d.ts.map