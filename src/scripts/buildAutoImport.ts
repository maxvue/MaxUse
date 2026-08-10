import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

import * as Composables from '../Composables';
import * as Routes from '../Routes';
import * as Browser from '../Helpers/Browser';
import * as Dates from '../Helpers/Dates';
import * as Iterables from '../Helpers/Iterables';
import * as MathHelpers from '../Helpers/Math';
import * as Objects from '../Helpers/Objects';
import * as Strings from '../Helpers/Strings';
import * as Types from '../Helpers/Types';
import * as Validations from '../Helpers/Validations';
import * as Electrical from '../Helpers/Electrical';
import * as Format from '../Helpers/Format';
import * as Lang from '../Helpers/Lang';
import * as Functions from '../Helpers/Functions';
import * as Utils from '../Helpers/Utils';
import * as Seq from '../Helpers/Seq';
import * as VueUse from '../Helpers/VueUse';
import * as VueUseCore from '../Helpers/VueUse/core';

const maxUseItems = (): string[] => {
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
        Lang,
        Functions,
        Utils,
        Seq,
        VueUse
    ];

    for (const mod of modules) for (const key of Object.keys(mod)) {
        if (['vueUse'].includes(key)) continue;
        allKeys.add(key);
    }

    return Array.from(allKeys).sort();
};

const getVueUseTypes = (valueKeys: string[]): string[] => {
    try {
        let corePkgPath;
        try {
            corePkgPath = require.resolve('@vueuse/core/package.json');
        } catch {
            console.error('getVueUseTypes: Could not resolve @vueuse/core/package.json');
            return [];
        }

        const dtsPath = path.resolve(path.dirname(corePkgPath), 'dist/index.d.ts');

        if (!fs.existsSync(dtsPath)) {
            console.error('getVueUseTypes: dtsPath not found:', dtsPath);
            return [];
        }

        const content = fs.readFileSync(dtsPath, 'utf-8');
        const exportMatch = content.match(/export\s*\{([^}]+)\}/g);
        if (!exportMatch) {
            console.error('getVueUseTypes: exportMatch failed');
            return [];
        }

        const cleanExportEntry = (entryStr: string): string => {
            let str = entryStr.trim();
            if (str.startsWith('type ')) str = str.slice(5).trim();
            if (str.includes(' as ')) {
                const parts = str.split(/\s+as\s+/);
                str = parts[parts.length - 1].trim();
            }
            return str;
        };

        const lastExport = exportMatch[exportMatch.length - 1];
        const allExports = lastExport
            .replace(/export\s*\{|\}/g, '')
            .split(',')
            .map((s: string) => cleanExportEntry(s))
            .filter(Boolean);

        const typeExports = allExports.filter((name: string) => !valueKeys.includes(name) && !name.includes(' '));
        const typesSet = new Set<string>(typeExports);

        let sharedPkgPath;
        try {
            sharedPkgPath = require.resolve('@vueuse/shared/package.json');
        } catch {}

        if (sharedPkgPath) {
            const sharedDtsPath = path.resolve(path.dirname(sharedPkgPath), 'dist/index.d.ts');
            if (fs.existsSync(sharedDtsPath)) {
                const sharedContent = fs.readFileSync(sharedDtsPath, 'utf-8');
                const sharedExportMatch = sharedContent.match(/export\s*\{([^}]+)\}/g);
                if (sharedExportMatch) {
                    const sharedLastExport = sharedExportMatch[sharedExportMatch.length - 1];
                    const sharedAllExports = sharedLastExport
                        .replace(/export\s*\{|\}/g, '')
                        .split(',')
                        .map((s: string) => cleanExportEntry(s))
                        .filter(Boolean);

                    const sharedTypeExports = sharedAllExports.filter((name: string) => !valueKeys.includes(name) && !name.includes(' '));
                    sharedTypeExports.forEach((t) => typesSet.add(t));
                }
            }
        }

        return Array.from(typesSet);
    } catch (e) {
        console.error('Error in getVueUseTypes:', e);
        return [];
    }
};

export const generateAutoImportData = () => {
    const items = [...maxUseItems(), '_', 'vueUse'];
    const vueUseValueKeys = [...Object.keys(VueUseCore), ...Object.keys(VueUse)];
    const types = getVueUseTypes(vueUseValueKeys).filter((t) => !items.includes(t));

    const valueReturn = [
        {
            '@maxvue/max-use': items
        },
        {
            from: '@maxvue/max-use',
            imports: types,
            type: true
        }
    ];

    const outputFile = path.resolve(__dirname, '../Helpers/autoImportData.json');
    fs.writeFileSync(outputFile, JSON.stringify(valueReturn, null, 2));
    console.log(`Auto-import data generated successfully at ${outputFile}`);
};

// Execute directly
generateAutoImportData();
