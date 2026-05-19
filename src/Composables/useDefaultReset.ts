import { ref, Ref, customRef,CustomRefFactory } from 'vue';
import { ulid } from 'ulid';

export function useDefaultReset(value: any, delay: number = 0) {
    let timeout: any;
    const default_value = JSON.stringify(value);
    return customRef((track, trigger) => {
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

            },
            reset() {
                const reset_data = JSON.parse(default_value);

                if (typeof reset_data === 'object') for (const k in reset_data){
                    if (reset_data[k] === 'ulid') reset_data[k] = ulid().toLowerCase();
                    if (reset_data[k] === 'now') reset_data[k] = new Date().toISOString();
                }

                value = reset_data;
            }
        };
    });
}
export const refAutoReset = useDefaultReset;
