import * as Composables from '../Composables';
import * as Routes from '../Routes';
import * as Browser from './Browser';
import * as Dates from './Dates';
import * as Iterables from './Iterables';
import * as MathHelpers from './Math';
import * as Objects from './Objects';
import * as Strings from './Strings';
import * as Types from './Types';
import * as Validations from './Validations';
import * as Electrical from './Electrical';
import * as Format from './Format';
import * as VueUse from './VueUse';
import autoImportData from './autoImportData.json';

/**
 * Retorna a lista de todos os nomes de exports disponíveis na biblioteca MaxUse.
 * Gera a lista dinamicamente a partir dos módulos fonte.
 */
export const maxUseItems = (): string[] => {
    const allKeys = new Set<string>();

    const modules = [
        Composables,
        Routes,
        Browser,
        Dates,
        Iterables,
        MathHelpers,
        Objects,
        Strings,
        Types,
        Validations,
        Electrical,
        Format,
        VueUse
    ];

    for (const mod of modules) for (const key of Object.keys(mod)) {
        if (['vueUse'].includes(key)) continue;
        allKeys.add(key);
    }


    return Array.from(allKeys).sort();
};

/**
 * Helper para facilitar a importação automática de funções no `unplugin-auto-import`.
 * Contém a lista gerada de exportações organizadas do pacote.
 *
 * @example
 * ```typescript
 * import { maxUseAutoImport } from 'max-use';
 * AutoImport({ imports: [ maxUseAutoImport() ] });
 * ```
 */
export const maxUseAutoImport = autoImportData as any;