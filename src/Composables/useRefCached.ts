import { ref, Ref, toValue, type MaybeRefOrGetter, computed, watch, onScopeDispose } from 'vue';
import { useStorage as vueUseStore } from '@vueuse/core';
import { isEqual } from 'lodash-es';

export type ToRefCached<T> = [T] extends [Ref] ? T : Ref<T>;
type KeyCached = MaybeRefOrGetter<string | number | null | undefined>;

export function useRefCached<T>(key: KeyCached, default_value: T): ToRefCached<T> {
    const raw_key = computed(() => toValue(key) ? String(toValue(key)) : 'no-key');

    const state = ref<T>(default_value) as ToRefCached<T>;

    // Sincronização reativa entre abas via evento nativo "storage"
    const onStorageEvent = (event: StorageEvent) => {
        if (event.key !== raw_key.value || event.storageArea !== localStorage) return;

        if (event.newValue !== null) {
            try {
                state.value = JSON.parse(event.newValue);
            } catch {
                state.value = default_value;
            }
        } else state.value = default_value;

    };

    window.addEventListener('storage', onStorageEvent);
    onScopeDispose(() => window.removeEventListener('storage', onStorageEvent));

    watch(raw_key, () => {

        if (!raw_key.value) return;

        // Leitura síncrona do localStorage
        const raw = localStorage.getItem(raw_key.value);
        if (raw !== null) {
            try {
                state.value = JSON.parse(raw);
            } catch {
                state.value = default_value;
            }
            return;
        }

        state.value = default_value;

    }, { immediate: true });

    watch(state, (new_value) => {
        if (!raw_key.value) return;
        localStorage.setItem(raw_key.value, JSON.stringify(new_value));
    }, { immediate: true });

    return state;
}

export const useRefStorage = useRefCached;
export const useCached = useRefCached;
export const useSharedCache = useRefCached;

export type UseStoreCached<T> = [T] extends [Ref] ? T : Ref<T>;
export function useStorage<T>(key: KeyCached, default_value: T) {
    const raw_key = computed(() => toValue(key) ? String(toValue(key)) : 'no-key');

    // Como o vueUseStore
    const default_value_str = computed(() => JSON.stringify(toValue(default_value)));
    const storaged_data = vueUseStore(raw_key, default_value_str);

    const ref_data = ref(JSON.parse(storaged_data.value)) as ToRefCached<T>;

    watch(storaged_data, () => {
        const data_parse = JSON.parse(storaged_data.value);
        if (!isEqual(data_parse, ref_data.value)) ref_data.value = data_parse;
    });

    watch(() => ref_data.value, () => {
        const data_parse = JSON.parse(storaged_data.value);
        if (!isEqual(data_parse, ref_data.value)) storaged_data.value = JSON.stringify(ref_data.value);
    }, { deep: true, immediate: true });

    return ref_data;
}