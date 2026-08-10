import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('infra: orphan helper files', () => {
    it('todo arquivo público está referenciado no index da categoria', () => {
        const helpersDir = path.resolve(process.cwd(), 'src/Helpers');
        const categories = fs.readdirSync(helpersDir).filter((f) => {
            const p = path.join(helpersDir, f);
            return fs.statSync(p).isDirectory() && !['autoImportData.json', 'Locales', 'VueUse'].includes(f);
        });

        for (const cat of categories) {
            const catDir = path.join(helpersDir, cat);
            const indexPath = path.join(catDir, 'index.ts');
            if (!fs.existsSync(indexPath)) continue;

            const indexSrc = fs.readFileSync(indexPath, 'utf8');
            const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== 'index.ts' && !f.startsWith('_'));

            for (const file of files) {
                const baseName = path.basename(file, '.ts');
                expect(indexSrc, `Arquivo órfão encontrado: ${cat}/${file} não é reexportado em ${cat}/index.ts`)
                    .toMatch(new RegExp(`['"]\\./${baseName}['"]`));
            }
        }
    });
});
