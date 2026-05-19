import { type MaybeRefOrGetter, customRef, toValue, Ref } from 'vue';
import { ulid } from 'ulid';
import { isObjectValid } from '../Helpers/Iterables';

export type ToRefReset<T> = T extends Ref ? T : Ref<T>;

export function useDefaultReset<T>(defaultValue: MaybeRefOrGetter<T>, delay: number = 0): ToRefReset<T> {
    const raw_default_value = toValue(defaultValue);

    let value: T = raw_default_value;

    let timeout: any;

    let trigger: () => void;

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
                value = newValue;
                trigger();

                if (delay > 0) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        reset();
                        trigger();
                    }, delay);
                }

            }
        };
    });

    // refValue.reset = reset;

    return refValue as ToRefReset<T>;
}

export const refAutoReset = useDefaultReset;
