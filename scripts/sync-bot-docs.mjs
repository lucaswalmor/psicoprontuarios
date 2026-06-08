import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'bot-docs');

const { BOT_DOCS, getBotDocRawPath } = await import('../src/config/botDocs.js');

fs.mkdirSync(outDir, { recursive: true });

const manifest = {
    updatedAt: new Date().toISOString(),
    docs: []
};

for (const doc of BOT_DOCS) {
    const source = path.join(root, doc.file);
    const target = path.join(outDir, doc.file);

    if (!fs.existsSync(source)) {
        console.warn(`[sync-bot-docs] Arquivo não encontrado: ${doc.file}`);
        continue;
    }

    fs.copyFileSync(source, target);
    manifest.docs.push({
        slug: doc.slug,
        title: doc.title,
        file: doc.file,
        path: getBotDocRawPath(doc.file),
        previewPath: `/bot-docs/${doc.slug}`
    });
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`[sync-bot-docs] ${manifest.docs.length} arquivo(s) copiado(s) para public/bot-docs/`);
