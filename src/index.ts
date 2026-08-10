import * as vueUse from '@vueuse/core';
export * as vueUse from '@vueuse/core';

import * as Browser from './Helpers/Browser';
import * as Dates from './Helpers/Dates';
import * as Iterables from './Helpers/Iterables';
import * as Math from './Helpers/Math';
import * as Objects from './Helpers/Objects';
import * as Strings from './Helpers/Strings';
import * as Types from './Helpers/Types';
import * as Validations from './Helpers/Validations';
import * as Electrical from './Helpers/Electrical';
import * as Format from './Helpers/Format';
import * as Lang from './Helpers/Lang';
import * as Functions from './Helpers/Functions';
import * as Utils from './Helpers/Utils';
import * as Seq from './Helpers/Seq';
import * as Composables from './Composables';
import * as Routes from './Routes';

// Exporta os módulos principais
export * from './Composables';
export * from './Routes';

// Exporta as categorias de Helpers de forma modular
export * from './Helpers/Browser';
export * from './Helpers/Dates';
export * from './Helpers/Iterables';
export * from './Helpers/Math';
export * from './Helpers/Objects';
export * from './Helpers/Strings';
export * from './Helpers/Types';
export * from './Helpers/Validations';
export * from './Helpers/Electrical';
export * from './Helpers/Format';
export * from './Helpers/Lang';
export * from './Helpers/Functions';
export * from './Helpers/Utils';
export * from './Helpers/Seq';
export * from './Helpers/VueUse';

// Resolução de ambiguidade
export { refAutoReset, useCached, useStorage, useTimeAgo, useDateFormat } from './Composables';
export { now } from './Helpers/Dates';
export { get, set } from './Helpers/Objects';
export { isObject } from './Helpers/Types';
export { formatCep, formatCnpj, formatCpf, formatCpfCnpj, formatPhone, maskSensitive } from './Helpers/Strings';

export { maxUseItems, maxUseAutoImport } from './Helpers/maxUseItems';

/**
 * Helpers Próprios da MaxUse.
 */
const ownHelpers = {
    ...Composables,
    ...Routes,
    ...Browser,
    ...Dates,
    ...Iterables,
    ...Math,
    ...Objects,
    ...Strings,
    ...Types,
    ...Validations,
    ...Electrical,
    ...Format,
    ...Lang,
    ...Functions,
    ...Utils,
    ...Seq
};

/**
 * Helpers do VueUse (filtrados para evitar duplicatas com os próprios).
 */
const filteredVueUse = {} as Omit<typeof vueUse, keyof typeof ownHelpers | 'vueUse'>;
const vueUseKeys = Object.keys(vueUse).filter((key) => key !== 'vueUse');

for (const key of vueUseKeys) if (!(key in ownHelpers)) (filteredVueUse as Record<string, any>)[key] = (vueUse as Record<string, any>)[key];

/**
 * Objeto centralizado de helpers, semelhante ao Lodash (_).
 * Contém os helpers próprios e os do VueUse (sem duplicatas).
 */
export const _ = {
    ...ownHelpers,
    ...filteredVueUse
};

