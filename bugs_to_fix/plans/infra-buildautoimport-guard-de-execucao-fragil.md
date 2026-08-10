# buildautoimport-guard-de-execucao-fragil

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/scripts/buildAutoImport.ts:153`

## Problema
O guard `if (import.meta.url === \`file://${__filename}\`)` falha silenciosamente quando o caminho contém caracteres percent-encoded na URL (espaços, acentos — plausível em máquina pt-BR) ou no Windows (`file:///C:/...`), fazendo o prebuild terminar com sucesso **sem gerar nada**.

## Plano de correção
1. Comparar `import.meta.url === pathToFileURL(process.argv[1]).href`; ou simplesmente chamar `generateAutoImportData()` incondicionalmente (o script só roda via `npm run prebuild`).

## Testes
- Rodar `npm run prebuild` e verificar que o JSON é regravado (mtime/conteúdo).
