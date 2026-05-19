import { MaybeRefOrGetter } from 'vue';
export declare function isset<T extends object, K extends PropertyKey>(obj: MaybeRefOrGetter<any>, key: K): obj is T & Record<K, NonNullable<unknown>>;
export declare const isSet: typeof isset;
export declare const hasKey: typeof isset;
export declare const keyExists: typeof isset;
export declare const keyExist: typeof isset;
//# sourceMappingURL=isset%20copy.d.ts.map