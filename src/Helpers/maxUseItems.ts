import { saveInJson } from '../scripts/generateList';
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

/**
 * Retorna a lista de todos os nomes de exports disponíveis na biblioteca MaxUse.
 * Gera a lista dinamicamente a partir dos módulos fonte, sem depender do dist.
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
        // Ignora o objeto completo do VueUse e palavras reservadas do router para não poluir a lista
        if (['vueUse'].includes(key)) continue;
        allKeys.add(key);
    }

    return Array.from(allKeys).sort();
};

const autoImport = () => {
    const items = [...maxUseItems(), '_', 'vueUse'];

    // Adicionar os tipos do VueUse dinamicamente lendo o arquivo d.ts
    const types = getVueUseTypes();

    const valueReturn = {
        '@maxvue/max-use': [
            ...items,
            ...types
        ]
    };

    saveInJson('./all-modules.json', valueReturn);

    return valueReturn;
};

export const getVueUseTypes = (): [string, string][] => {
    try {
        const fs = require('node:fs');
        const path = require('node:path');
        const dtsPath = path.resolve(process.cwd(), 'node_modules/@vueuse/core/dist/index.d.ts');

        if (!fs.existsSync(dtsPath)) return [];

        const content = fs.readFileSync(dtsPath, 'utf-8');
        const exportMatch = content.match(/export\s*\{([^}]+)\}/g);
        if (!exportMatch) return [];

        const lastExport = exportMatch[exportMatch.length - 1];
        const allExports = lastExport
            .replace(/export\s*\{|\}/g, '')
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);

        const valueKeys = Object.keys(VueUse);
        const typeExports = allExports.filter((name: string) => !valueKeys.includes(name));

        return typeExports.map((name: string) => [name, `type ${name}`]);
    } catch (e) {
        return [];
    }
};

export const maxUseAutoImport = autoImport();