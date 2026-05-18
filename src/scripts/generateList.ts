import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function saveInJson(relative_path: string, data: string[]){

    const outputFile = path.resolve(__dirname, relative_path);

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
}

