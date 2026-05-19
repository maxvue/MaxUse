import { isNotValid } from '../Helpers/Validations';
import { UseDateFormatReturn, useDateFormat as vueUseDateFormat } from '@vueuse/core';
import { MaybeRefOrGetter, toValue } from 'vue';

export const useDateFormat = (initialDate: MaybeRefOrGetter<Date | number | string | undefined | null>, format: string): UseDateFormatReturn => {
    if (isNotValid(toValue(initialDate))) return vueUseDateFormat(new Date(), format);
    return vueUseDateFormat(initialDate as any, format);
};

export const dateFormat = useDateFormat;
