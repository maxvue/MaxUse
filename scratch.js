const fs = require('fs');
const path = require('path');

const getVueUseTypes = () => {
    try {
        const dtsPath = path.resolve(process.cwd(), 'node_modules/@vueuse/core/dist/index.d.ts');
        if (!fs.existsSync(dtsPath)) {
            console.log("File not found");
            return [];
        }

        const content = fs.readFileSync(dtsPath, 'utf-8');
        const exportMatch = content.match(/export\s*\{([^}]+)\}/g);
        if (!exportMatch) {
            console.log("No export match found");
            return [];
        }

        console.log(`Found ${exportMatch.length} matches`);
        const lastExport = exportMatch[exportMatch.length - 1];
        
        const allExports = lastExport
            .replace(/export\s*\{|\}/g, '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        console.log(`Extracted ${allExports.length} items`);
        
        // Let's print the first 5 and last 5 to verify
        console.log(allExports.slice(0, 5));
        console.log(allExports.slice(-5));
        return [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

getVueUseTypes();
