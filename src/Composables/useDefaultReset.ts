import { type MaybeRefOrGetter, customRef, toValue } from 'vue';
import { ulid } from 'ulid';
import type { ManualResetRefReturn, Fn } from '@vueuse/core';
import { isObjectValid } from '../Helpers/Iterables';

export function useDefaultReset<T>(defaultValue: MaybeRefOrGetter<T>, delay: number = 0): ManualResetRefReturn<T> {
    const raw_default_value = toValue(defaultValue);

    let value: T = raw_default_value;

    let timeout: any;

    let trigger: Fn;

    const reset = () => {

        if (isObjectValid(raw_default_value)){
            Object.values(raw_default_value).forEach((value) => {
                if (value === 'ulid') value = ulid().toLowerCase();
                if (value === 'now') value = new Date().toISOString();
            });
        }

        value = raw_default_value;
        trigger();
    };

    const refValue = customRef<T>((track, _trigger) => {
        trigger = _trigger;
        return {
            get() {
                track();
                return value;
            },
            set(newValue) {
                if (delay > 0) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        value = newValue;
                        trigger();
                    }, delay);
                }

            }
        };
    }) as ManualResetRefReturn<T>;

    refValue.reset = reset;

    return refValue;
}

export const refAutoReset = useDefaultReset;
