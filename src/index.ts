import * as vueUse from '@vueuse/core';
import * as lodash from 'lodash-es';
import { saveInJson } from './scripts/generateList';

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
    ...Format
};

/**
 * Helpers do VueUse (filtrados para evitar duplicatas com os próprios).
 */
const filteredVueUse = {};
const vueUseKeys = Object.keys(vueUse);
saveInJson('./vueuse-items.json', vueUseKeys);

for (const key of vueUseKeys) if (!(key in ownHelpers)) (filteredVueUse as Record<string, any>)[key] = (vueUse as Record<string, any>)[key];

/**
 * Helpers do Lodash (filtrados para evitar duplicatas com ownHelpers e filteredVueUse).
 */
const filteredLodash: Record<string, any> = {};
const lodashKeys = Object.keys(lodash);

for (const key of lodashKeys) filteredLodash[key] = (lodash as Record<string, any>)[key];


/**
 * Objeto centralizado de helpers, semelhante ao Lodash (_).
 * Contém os helpers próprios, os do VueUse e os do Lodash (sem duplicatas).
 */
export const _ = {
    ...ownHelpers,
    ...filteredVueUse,
    ...filteredLodash
};

