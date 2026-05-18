import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Since this is a script, we can safely use node internals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// We need to import the modules to get the keys.
// However, compiling TypeScript just to get keys is complex if we import src directly.
// But we can execute this using tsx.
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
import * as VueUse from '../Helpers/VueUse';

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
        VueUse
    ];

    for (const mod of modules) for (const key of Object.keys(mod)) {
        if (['vueUse'].includes(key)) continue;
        allKeys.add(key);
    }


    return Array.from(allKeys).sort();
};

const getVueUseTypes = (): [string, string][] => {
    try {
        let corePkgPath;
        try {
            corePkgPath = require.resolve('@vueuse/core/package.json');
        } catch (e) {
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

        const lastExport = exportMatch[exportMatch.length - 1];
        const allExports = lastExport
            .replace(/export\s*\{|\}/g, '')
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);

        const valueKeys = Object.keys(VueUse);
        const typeExports = allExports.filter((name: string) => !valueKeys.includes(name));

        const types = typeExports.map((name: string) => [name, `type ${name}`]) as [string, string][];

        let sharedPkgPath;
        try {
            sharedPkgPath = require.resolve('@vueuse/shared/package.json');
        } catch (e) {}

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
                        .map((s: string) => s.trim())
                        .filter(Boolean);

                    const sharedTypeExports = sharedAllExports.filter((name: string) => !valueKeys.includes(name));
                    const sharedTypes = sharedTypeExports.map((name: string) => [name, `type ${name}`]) as [string, string][];
                    types.push(...sharedTypes);
                }
            }
        }

        return types;
    } catch (e) {
        console.error('Error in getVueUseTypes:', e);
        return [];
    }
};

export const generateAutoImportData = () => {
    const items = [...maxUseItems(), '_', 'vueUse'];
    const types = getVueUseTypes();

    const valueReturn = {
        '@maxvue/max-use': [
            ...items,
            ...types
        ]
    };

    const outputFile = path.resolve(__dirname, '../Helpers/autoImportData.json');
    fs.writeFileSync(outputFile, JSON.stringify(valueReturn, null, 2));
    console.log(`Auto-import data generated successfully at ${outputFile}`);
};

// Execute if run directly
if (import.meta.url === `file://${__filename}`) generateAutoImportData();

