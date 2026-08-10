import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('infra: external dependencies', () => {
    it('não empacota código de node_modules inline no dist (*.es.js)', () => {
        const distDir = path.resolve(process.cwd(), 'dist');
        if (!fs.existsSync(distDir)) return;

        const files = fs.readdirSync(distDir).filter((x) => x.endsWith('.es.js'));
        for (const f of files) {
            const src = fs.readFileSync(path.join(distDir, f), 'utf8');
            expect(src, `${f} contém código inline de node_modules`).not.toMatch(/#region node_modules/);
        }

        const distFiles = fs.readdirSync(distDir);
        const embeddedChunk = distFiles.find((x) => /^dist-.*\.js$/.test(x));
        expect(embeddedChunk, 'dist contém chunk embutido de node_modules (ex: dist-*.js)').toBeUndefined();
    });
});
