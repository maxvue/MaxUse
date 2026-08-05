/**
 * Manifesto de categorização dos 279 helpers do lodash-es faltantes na MaxUse.
 * Fonte da verdade para a geração de lodash_migrate/.
 *
 * fase 1: primitivos sem dependência (Lang, Math, Strings simples, Utils básicos)
 * fase 2: arrays/coleções (Iterables)
 * fase 3: objetos/strings/math derivados
 * fase 4: functions/utils (FP, template)
 * fase 5: Seq/chaining
 */
export interface HelperEntry {
    nome: string;
    categoria: 'Iterables' | 'Objects' | 'Strings' | 'Math' | 'Lang' | 'Functions' | 'Utils' | 'Seq';
    fase: 1 | 2 | 3 | 4 | 5;
    depende_de: string[];
    /** alias de outro helper — implementação é re-export */
    alias_de?: string;
    /** observação de peculiaridade do lodash a cobrir em teste */
    nota?: string;
}

export const HELPERS: HelperEntry[] = [
    // ─────────────────────────────────────────────────────────────
    // FASE 1 — Lang: type guards e conversões (sem dependências)
    // ─────────────────────────────────────────────────────────────
    { nome: 'isNil', categoria: 'Lang', fase: 1, depende_de: [], nota: 'true para null e undefined' },
    { nome: 'isNull', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isUndefined', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isBoolean', categoria: 'Lang', fase: 1, depende_de: [], nota: 'aceita objeto Boolean' },
    { nome: 'isString', categoria: 'Lang', fase: 1, depende_de: [], nota: 'aceita objeto String' },
    { nome: 'isFunction', categoria: 'Lang', fase: 1, depende_de: [], nota: 'true para async/generator/proxy de função' },
    { nome: 'isSymbol', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isRegExp', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isError', categoria: 'Lang', fase: 1, depende_de: [], nota: 'true para DOMException e objetos com name+message' },
    { nome: 'isElement', categoria: 'Lang', fase: 1, depende_de: [], nota: 'nodeType === 1 e não plain object' },
    { nome: 'isArguments', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isArrayBuffer', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isBuffer', categoria: 'Lang', fase: 1, depende_de: [], nota: 'false quando Buffer não existe (browser)' },
    { nome: 'isTypedArray', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isMap', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isSet', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isWeakMap', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isWeakSet', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isNative', categoria: 'Lang', fase: 1, depende_de: [], nota: 'lodash lança em ambientes com core-js' },
    { nome: 'isObjectLike', categoria: 'Lang', fase: 1, depende_de: [], nota: 'typeof object e não null (arrays incluídos)' },
    { nome: 'isPlainObject', categoria: 'Lang', fase: 1, depende_de: [], nota: 'true para Object.create(null); false para class instance' },
    { nome: 'isLength', categoria: 'Lang', fase: 1, depende_de: [], nota: 'inteiro >=0 e <= MAX_SAFE_INTEGER' },
    { nome: 'isArrayLike', categoria: 'Lang', fase: 1, depende_de: ['isLength'], nota: 'string é array-like; função não é' },
    { nome: 'isArrayLikeObject', categoria: 'Lang', fase: 1, depende_de: ['isArrayLike', 'isObjectLike'], nota: 'string NÃO é' },
    { nome: 'isFinite', categoria: 'Lang', fase: 1, depende_de: [], nota: 'só number primitivo; "3" é false (difere do global)' },
    { nome: 'isInteger', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isSafeInteger', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'isNaN', categoria: 'Lang', fase: 1, depende_de: [], nota: 'true para new Number(NaN); difere do global isNaN' },
    { nome: 'eq', categoria: 'Lang', fase: 1, depende_de: [], nota: 'SameValueZero: NaN eq NaN é true; +0 eq -0 é true' },
    { nome: 'gt', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'gte', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'lt', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'lte', categoria: 'Lang', fase: 1, depende_de: [] },
    { nome: 'toFinite', categoria: 'Lang', fase: 1, depende_de: [], nota: 'Infinity vira 1.7976931348623157e+308' },
    { nome: 'toInteger', categoria: 'Lang', fase: 1, depende_de: ['toFinite'], nota: 'trunca: "3.9" => 3' },
    { nome: 'toLength', categoria: 'Lang', fase: 1, depende_de: ['toInteger'], nota: 'clamp em [0, 4294967295]' },
    { nome: 'toSafeInteger', categoria: 'Lang', fase: 1, depende_de: ['toInteger'], nota: 'clamp em MAX_SAFE_INTEGER' },
    { nome: 'castArray', categoria: 'Lang', fase: 1, depende_de: [], nota: 'castArray() sem args retorna []' },
    { nome: 'toPath', categoria: 'Lang', fase: 1, depende_de: [], nota: '\'a[0].b.c\' => [\'a\',\'0\',\'b\',\'c\']' },
    { nome: 'toPlainObject', categoria: 'Lang', fase: 1, depende_de: [], nota: 'copia propriedades herdadas' },
    { nome: 'toString', categoria: 'Lang', fase: 1, depende_de: [], nota: 'null/undefined => ""; preserva sinal de -0' },
    { nome: 'clone', categoria: 'Lang', fase: 1, depende_de: [], nota: 'shallow; preserva tipo (Date, RegExp, Map...)' },
    { nome: 'cloneWith', categoria: 'Lang', fase: 1, depende_de: ['clone'], nota: 'customizer undefined => fallback para clone' },
    { nome: 'cloneDeepWith', categoria: 'Lang', fase: 1, depende_de: [], nota: 'customizer undefined => fallback para cloneDeep' },
    { nome: 'isEqualWith', categoria: 'Lang', fase: 1, depende_de: [], nota: 'customizer undefined => fallback para isEqual' },
    { nome: 'isMatch', categoria: 'Lang', fase: 1, depende_de: [], nota: 'comparação parcial profunda' },
    { nome: 'isMatchWith', categoria: 'Lang', fase: 1, depende_de: ['isMatch'], nota: 'customizer undefined => fallback para isMatch' },

    // ─────────────────────────────────────────────────────────────
    // FASE 1 — Math (aritmética pura)
    // ─────────────────────────────────────────────────────────────
    { nome: 'add', categoria: 'Math', fase: 1, depende_de: [], nota: 'add() sem args retorna 0' },
    { nome: 'subtract', categoria: 'Math', fase: 1, depende_de: [] },
    { nome: 'multiply', categoria: 'Math', fase: 1, depende_de: [], nota: 'multiply() sem args retorna 1' },
    { nome: 'divide', categoria: 'Math', fase: 1, depende_de: [], nota: 'divide() sem args retorna 1' },
    { nome: 'ceil', categoria: 'Math', fase: 1, depende_de: [], nota: 'precisão: ceil(4.006, 2) => 4.01' },
    { nome: 'floor', categoria: 'Math', fase: 1, depende_de: [], nota: 'precisão: floor(4.006, 2) => 4' },
    { nome: 'round', categoria: 'Math', fase: 1, depende_de: [], nota: 'precisão negativa: round(4060, -2) => 4100' },
    { nome: 'inRange', categoria: 'Math', fase: 1, depende_de: [], nota: '2 args => range [0, n); swap se start > end' },
    { nome: 'random', categoria: 'Math', fase: 1, depende_de: [], nota: 'random(true) => float; assinatura variádica' },
    { nome: 'parseInt', categoria: 'Math', fase: 1, depende_de: [], nota: 'radix default 10 mesmo com "0x"' },

    // ─────────────────────────────────────────────────────────────
    // FASE 1 — Strings (manipulação pura)
    // ─────────────────────────────────────────────────────────────
    { nome: 'toLower', categoria: 'Strings', fase: 1, depende_de: [], nota: 'converte null => ""' },
    { nome: 'toUpper', categoria: 'Strings', fase: 1, depende_de: [], nota: 'converte null => ""' },
    { nome: 'trim', categoria: 'Strings', fase: 1, depende_de: [], nota: 'aceita chars customizados' },
    { nome: 'trimStart', categoria: 'Strings', fase: 1, depende_de: [], nota: 'aceita chars customizados' },
    { nome: 'trimEnd', categoria: 'Strings', fase: 1, depende_de: [], nota: 'aceita chars customizados' },
    { nome: 'repeat', categoria: 'Strings', fase: 1, depende_de: ['toInteger'], nota: 'repeat("a", 0) => ""' },
    { nome: 'startsWith', categoria: 'Strings', fase: 1, depende_de: [], nota: 'position clampado' },
    { nome: 'endsWith', categoria: 'Strings', fase: 1, depende_de: [], nota: 'position define fim virtual' },
    { nome: 'escape', categoria: 'Strings', fase: 1, depende_de: [], nota: 'escapa & < > " \x27 apenas' },
    { nome: 'unescape', categoria: 'Strings', fase: 1, depende_de: [], nota: 'inverso de escape' },
    { nome: 'escapeRegExp', categoria: 'Strings', fase: 1, depende_de: [] },
    { nome: 'deburr', categoria: 'Strings', fase: 1, depende_de: [], nota: 'remove diacríticos: "déjà vu" => "deja vu"' },
    { nome: 'words', categoria: 'Strings', fase: 1, depende_de: [], nota: 'separa camelCase e unicode; aceita pattern' },
    { nome: 'split', categoria: 'Strings', fase: 1, depende_de: [], nota: 'assinatura lodash com limit' },
    { nome: 'replace', categoria: 'Strings', fase: 1, depende_de: [] },
    { nome: 'lowerFirst', categoria: 'Strings', fase: 1, depende_de: [] },
    { nome: 'upperFirst', categoria: 'Strings', fase: 1, depende_de: [] },
    { nome: 'pad', categoria: 'Strings', fase: 1, depende_de: [], nota: 'distribui sobra à direita' },
    { nome: 'padStart', categoria: 'Strings', fase: 1, depende_de: [] },
    { nome: 'padEnd', categoria: 'Strings', fase: 1, depende_de: [] },

    // ─────────────────────────────────────────────────────────────
    // FASE 1 — Utils básicos (sem dependência)
    // ─────────────────────────────────────────────────────────────
    { nome: 'stubArray', categoria: 'Utils', fase: 1, depende_de: [] },
    { nome: 'stubFalse', categoria: 'Utils', fase: 1, depende_de: [] },
    { nome: 'stubObject', categoria: 'Utils', fase: 1, depende_de: [] },
    { nome: 'stubString', categoria: 'Utils', fase: 1, depende_de: [] },
    { nome: 'stubTrue', categoria: 'Utils', fase: 1, depende_de: [] },
    { nome: 'constant', categoria: 'Utils', fase: 1, depende_de: [] },
    { nome: 'defaultTo', categoria: 'Utils', fase: 1, depende_de: [], nota: 'substitui NaN, null e undefined' },
    { nome: 'uniqueId', categoria: 'Utils', fase: 1, depende_de: [], nota: 'contador global compartilhado' },
    { nome: 'range', categoria: 'Utils', fase: 1, depende_de: ['toFinite'], nota: 'step inferido; range(4) => [0,1,2,3]' },
    { nome: 'rangeRight', categoria: 'Utils', fase: 1, depende_de: ['range'] },
    { nome: 'times', categoria: 'Utils', fase: 1, depende_de: ['toInteger'] },
    { nome: 'nthArg', categoria: 'Utils', fase: 1, depende_de: ['toInteger'], nota: 'índice negativo conta do fim' },

    // ─────────────────────────────────────────────────────────────
    // FASE 2 — Iterables: arrays e coleções
    // ─────────────────────────────────────────────────────────────
    { nome: 'compact', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'remove false, null, 0, "", undefined, NaN' },
    { nome: 'concat', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'não muta; achata 1 nível de arrays passados' },
    { nome: 'head', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'tail', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'initial', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'nth', categoria: 'Iterables', fase: 2, depende_de: ['toInteger'], nota: 'índice negativo conta do fim' },
    { nome: 'slice', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'versão lodash não é a nativa' },
    { nome: 'reverse', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'MUTA o array (igual Array#reverse)' },
    { nome: 'fill', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'MUTA o array' },
    { nome: 'join', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'indexOf', categoria: 'Iterables', fase: 2, depende_de: ['toInteger'], nota: 'fromIndex negativo' },
    { nome: 'lastIndexOf', categoria: 'Iterables', fase: 2, depende_de: ['toInteger'] },
    { nome: 'includes', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'funciona em objeto e string; SameValueZero' },
    { nome: 'drop', categoria: 'Iterables', fase: 2, depende_de: ['toInteger'], nota: 'n default 1' },
    { nome: 'dropRight', categoria: 'Iterables', fase: 2, depende_de: ['toInteger'] },
    { nome: 'take', categoria: 'Iterables', fase: 2, depende_de: ['toInteger'] },
    { nome: 'takeRight', categoria: 'Iterables', fase: 2, depende_de: ['toInteger'] },
    { nome: 'flatten', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'apenas 1 nível' },
    { nome: 'flattenDeep', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'flattenDepth', categoria: 'Iterables', fase: 2, depende_de: ['toInteger'] },
    { nome: 'fromPairs', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'zip', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'unzip', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'zipObject', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'without', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'SameValueZero' },
    { nome: 'difference', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'SameValueZero' },
    { nome: 'intersection', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'union', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'xor', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'diferença simétrica' },
    { nome: 'pull', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'MUTA o array' },
    { nome: 'pullAll', categoria: 'Iterables', fase: 2, depende_de: ['pull'], nota: 'MUTA o array' },
    { nome: 'pullAt', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'MUTA; retorna removidos' },
    { nome: 'sortedIndex', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'busca binária' },
    { nome: 'sortedIndexOf', categoria: 'Iterables', fase: 2, depende_de: ['sortedIndex'] },
    { nome: 'sortedLastIndex', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'sortedLastIndexOf', categoria: 'Iterables', fase: 2, depende_de: ['sortedLastIndex'] },
    { nome: 'sortedUniq', categoria: 'Iterables', fase: 2, depende_de: [] },
    { nome: 'sampleSize', categoria: 'Iterables', fase: 2, depende_de: [], nota: 'n clampado ao tamanho' },

    // ─────────────────────────────────────────────────────────────
    // FASE 2 — Objects: acesso básico (necessários para iteratee)
    // ─────────────────────────────────────────────────────────────
    { nome: 'keys', categoria: 'Objects', fase: 2, depende_de: ['isArrayLike'], nota: 'só próprias enumeráveis; string => índices' },
    { nome: 'keysIn', categoria: 'Objects', fase: 2, depende_de: [], nota: 'inclui herdadas' },
    { nome: 'values', categoria: 'Objects', fase: 2, depende_de: ['keys'] },
    { nome: 'valuesIn', categoria: 'Objects', fase: 2, depende_de: ['keysIn'] },
    { nome: 'has', categoria: 'Objects', fase: 2, depende_de: ['toPath'], nota: 'só próprias; suporta path' },
    { nome: 'hasIn', categoria: 'Objects', fase: 2, depende_de: ['toPath'], nota: 'inclui herdadas' },
    { nome: 'toPairs', categoria: 'Objects', fase: 2, depende_de: ['keys'] },
    { nome: 'toPairsIn', categoria: 'Objects', fase: 2, depende_de: ['keysIn'] },
    { nome: 'at', categoria: 'Objects', fase: 2, depende_de: ['toPath'], nota: 'aceita múltiplos paths' },

    // ─────────────────────────────────────────────────────────────
    // FASE 3 — Utils: iteratee shorthand (base de todo o resto)
    // ─────────────────────────────────────────────────────────────
    { nome: 'property', categoria: 'Utils', fase: 3, depende_de: ['toPath'] },
    { nome: 'propertyOf', categoria: 'Utils', fase: 3, depende_de: ['toPath'] },
    { nome: 'matches', categoria: 'Utils', fase: 3, depende_de: ['isMatch'] },
    { nome: 'matchesProperty', categoria: 'Utils', fase: 3, depende_de: ['toPath'] },
    { nome: 'iteratee', categoria: 'Utils', fase: 3, depende_de: ['property', 'matches', 'matchesProperty'], nota: 'string=>property, array=>matchesProperty, objeto=>matches, fn=>fn' },
    { nome: 'method', categoria: 'Utils', fase: 3, depende_de: ['toPath'] },
    { nome: 'methodOf', categoria: 'Utils', fase: 3, depende_de: ['toPath'] },
    { nome: 'result', categoria: 'Utils', fase: 3, depende_de: ['toPath'], nota: 'invoca se o valor for função' },
    { nome: 'attempt', categoria: 'Utils', fase: 3, depende_de: [], nota: 'retorna o Error em vez de lançar' },
    { nome: 'cond', categoria: 'Utils', fase: 3, depende_de: ['iteratee'] },
    { nome: 'conforms', categoria: 'Utils', fase: 3, depende_de: [], nota: 'conformsTo curried' },
    { nome: 'conformsTo', categoria: 'Utils', fase: 3, depende_de: [] },
    { nome: 'over', categoria: 'Utils', fase: 3, depende_de: ['iteratee'] },
    { nome: 'overEvery', categoria: 'Utils', fase: 3, depende_de: ['iteratee'] },
    { nome: 'overSome', categoria: 'Utils', fase: 3, depende_de: ['iteratee'] },

    // ─────────────────────────────────────────────────────────────
    // FASE 3 — Iterables que dependem de iteratee
    // ─────────────────────────────────────────────────────────────
    { nome: 'map', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'], nota: 'funciona em objeto; shorthand de string' },
    { nome: 'forEach', categoria: 'Iterables', fase: 3, depende_de: [], nota: 'return false interrompe a iteração' },
    { nome: 'forEachRight', categoria: 'Iterables', fase: 3, depende_de: [] },
    { nome: 'each', categoria: 'Iterables', fase: 3, depende_de: ['forEach'], alias_de: 'forEach' },
    { nome: 'eachRight', categoria: 'Iterables', fase: 3, depende_de: ['forEachRight'], alias_de: 'forEachRight' },
    { nome: 'find', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'], nota: 'aceita fromIndex' },
    { nome: 'findIndex', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'findLastIndex', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'every', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'], nota: 'array vazio => true' },
    { nome: 'some', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'], nota: 'array vazio => false' },
    { nome: 'reject', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'partition', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'remove', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'], nota: 'MUTA; retorna removidos' },
    { nome: 'reduce', categoria: 'Iterables', fase: 3, depende_de: [], nota: 'sem acumulador usa 1º elemento' },
    { nome: 'reduceRight', categoria: 'Iterables', fase: 3, depende_de: [] },
    { nome: 'flatMap', categoria: 'Iterables', fase: 3, depende_de: ['map', 'flatten'] },
    { nome: 'flatMapDeep', categoria: 'Iterables', fase: 3, depende_de: ['map', 'flattenDeep'] },
    { nome: 'flatMapDepth', categoria: 'Iterables', fase: 3, depende_de: ['map', 'flattenDepth'] },
    { nome: 'max', categoria: 'Iterables', fase: 3, depende_de: [], nota: 'ignora não-numéricos; vazio => undefined' },
    { nome: 'min', categoria: 'Iterables', fase: 3, depende_de: [], nota: 'vazio => undefined' },
    { nome: 'maxBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'minBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'mean', categoria: 'Iterables', fase: 3, depende_de: [] },
    { nome: 'meanBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'uniqBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'uniqWith', categoria: 'Iterables', fase: 3, depende_de: [] },
    { nome: 'sortedUniqBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'sortedIndexBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'sortedLastIndexBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'differenceBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee', 'difference'] },
    { nome: 'differenceWith', categoria: 'Iterables', fase: 3, depende_de: ['difference'] },
    { nome: 'intersectionBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee', 'intersection'] },
    { nome: 'intersectionWith', categoria: 'Iterables', fase: 3, depende_de: ['intersection'] },
    { nome: 'unionBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee', 'union'] },
    { nome: 'unionWith', categoria: 'Iterables', fase: 3, depende_de: ['union'] },
    { nome: 'xorBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee', 'xor'] },
    { nome: 'xorWith', categoria: 'Iterables', fase: 3, depende_de: ['xor'] },
    { nome: 'pullAllBy', categoria: 'Iterables', fase: 3, depende_de: ['iteratee', 'pullAll'] },
    { nome: 'pullAllWith', categoria: 'Iterables', fase: 3, depende_de: ['pullAll'] },
    { nome: 'dropWhile', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'dropRightWhile', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'takeWhile', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'takeRightWhile', categoria: 'Iterables', fase: 3, depende_de: ['iteratee'] },
    { nome: 'zipWith', categoria: 'Iterables', fase: 3, depende_de: ['zip'] },
    { nome: 'unzipWith', categoria: 'Iterables', fase: 3, depende_de: ['unzip'] },
    { nome: 'zipObjectDeep', categoria: 'Iterables', fase: 3, depende_de: ['toPath'] },
    { nome: 'invokeMap', categoria: 'Iterables', fase: 3, depende_de: ['toPath', 'map'] },

    // ─────────────────────────────────────────────────────────────
    // FASE 3 — Objects derivados
    // ─────────────────────────────────────────────────────────────
    { nome: 'assign', categoria: 'Objects', fase: 3, depende_de: ['keys'], nota: 'só próprias enumeráveis' },
    { nome: 'assignIn', categoria: 'Objects', fase: 3, depende_de: ['keysIn'], nota: 'inclui herdadas' },
    { nome: 'extend', categoria: 'Objects', fase: 3, depende_de: ['assignIn'], alias_de: 'assignIn' },
    { nome: 'assignWith', categoria: 'Objects', fase: 3, depende_de: ['assign'] },
    { nome: 'assignInWith', categoria: 'Objects', fase: 3, depende_de: ['assignIn'] },
    { nome: 'extendWith', categoria: 'Objects', fase: 3, depende_de: ['assignInWith'], alias_de: 'assignInWith' },
    { nome: 'defaults', categoria: 'Objects', fase: 3, depende_de: ['keysIn'], nota: 'só preenche undefined' },
    { nome: 'defaultsDeep', categoria: 'Objects', fase: 3, depende_de: ['defaults', 'mergeWith'] },
    { nome: 'merge', categoria: 'Objects', fase: 3, depende_de: [], nota: 'recursivo; ignora source undefined' },
    { nome: 'mergeWith', categoria: 'Objects', fase: 3, depende_de: ['merge'] },
    { nome: 'create', categoria: 'Objects', fase: 3, depende_de: ['assign'] },
    { nome: 'entries', categoria: 'Objects', fase: 3, depende_de: ['toPairs'], alias_de: 'toPairs' },
    { nome: 'entriesIn', categoria: 'Objects', fase: 3, depende_de: ['toPairsIn'], alias_de: 'toPairsIn' },
    { nome: 'findKey', categoria: 'Objects', fase: 3, depende_de: ['iteratee'] },
    { nome: 'findLastKey', categoria: 'Objects', fase: 3, depende_de: ['iteratee'] },
    { nome: 'forIn', categoria: 'Objects', fase: 3, depende_de: ['keysIn'] },
    { nome: 'forInRight', categoria: 'Objects', fase: 3, depende_de: ['keysIn'] },
    { nome: 'forOwn', categoria: 'Objects', fase: 3, depende_de: ['keys'] },
    { nome: 'forOwnRight', categoria: 'Objects', fase: 3, depende_de: ['keys'] },
    { nome: 'functions', categoria: 'Objects', fase: 3, depende_de: ['keys', 'isFunction'] },
    { nome: 'functionsIn', categoria: 'Objects', fase: 3, depende_de: ['keysIn', 'isFunction'] },
    { nome: 'invert', categoria: 'Objects', fase: 3, depende_de: [] },
    { nome: 'invertBy', categoria: 'Objects', fase: 3, depende_de: ['iteratee'] },
    { nome: 'mapKeys', categoria: 'Objects', fase: 3, depende_de: ['iteratee'] },
    { nome: 'omitBy', categoria: 'Objects', fase: 3, depende_de: ['iteratee'] },
    { nome: 'pickBy', categoria: 'Objects', fase: 3, depende_de: ['iteratee'] },
    { nome: 'setWith', categoria: 'Objects', fase: 3, depende_de: ['toPath'] },
    { nome: 'update', categoria: 'Objects', fase: 3, depende_de: ['toPath'] },
    { nome: 'updateWith', categoria: 'Objects', fase: 3, depende_de: ['setWith'] },
    { nome: 'transform', categoria: 'Objects', fase: 3, depende_de: ['forOwn'], nota: 'accumulator inferido do tipo' },

    // ─────────────────────────────────────────────────────────────
    // FASE 3 — Strings que dependem de words
    // ─────────────────────────────────────────────────────────────
    { nome: 'lowerCase', categoria: 'Strings', fase: 3, depende_de: ['words', 'deburr'], nota: 'espaço como separador' },
    { nome: 'upperCase', categoria: 'Strings', fase: 3, depende_de: ['words', 'deburr'] },
    { nome: 'startCase', categoria: 'Strings', fase: 3, depende_de: ['words', 'upperFirst'] },

    // ─────────────────────────────────────────────────────────────
    // FASE 4 — Functions (FP)
    // ─────────────────────────────────────────────────────────────
    { nome: 'debounce', categoria: 'Functions', fase: 4, depende_de: [], nota: 'leading/trailing/maxWait + cancel/flush/pending' },
    { nome: 'throttle', categoria: 'Functions', fase: 4, depende_de: ['debounce'], nota: 'implementado sobre debounce com maxWait' },
    { nome: 'memoize', categoria: 'Functions', fase: 4, depende_de: [], nota: 'expõe .cache; resolver opcional' },
    { nome: 'once', categoria: 'Functions', fase: 4, depende_de: ['before'] },
    { nome: 'after', categoria: 'Functions', fase: 4, depende_de: ['toInteger'] },
    { nome: 'before', categoria: 'Functions', fase: 4, depende_de: ['toInteger'], nota: 'guarda o último resultado' },
    { nome: 'negate', categoria: 'Functions', fase: 4, depende_de: [] },
    { nome: 'defer', categoria: 'Functions', fase: 4, depende_de: [] },
    { nome: 'delay', categoria: 'Functions', fase: 4, depende_de: ['toNumber'] },
    { nome: 'ary', categoria: 'Functions', fase: 4, depende_de: ['toInteger'] },
    { nome: 'unary', categoria: 'Functions', fase: 4, depende_de: ['ary'] },
    { nome: 'flip', categoria: 'Functions', fase: 4, depende_de: [] },
    { nome: 'rest', categoria: 'Functions', fase: 4, depende_de: ['toInteger'] },
    { nome: 'spread', categoria: 'Functions', fase: 4, depende_de: ['toInteger'] },
    { nome: 'wrap', categoria: 'Functions', fase: 4, depende_de: ['partial'] },
    { nome: 'overArgs', categoria: 'Functions', fase: 4, depende_de: ['iteratee'] },
    { nome: 'rearg', categoria: 'Functions', fase: 4, depende_de: [] },
    { nome: 'partial', categoria: 'Functions', fase: 4, depende_de: [], nota: 'suporta placeholder _' },
    { nome: 'partialRight', categoria: 'Functions', fase: 4, depende_de: ['partial'] },
    { nome: 'bind', categoria: 'Functions', fase: 4, depende_de: ['partial'], nota: 'suporta placeholder' },
    { nome: 'bindKey', categoria: 'Functions', fase: 4, depende_de: ['bind'] },
    { nome: 'bindAll', categoria: 'Functions', fase: 4, depende_de: ['toPath'], nota: 'MUTA o objeto' },
    { nome: 'curry', categoria: 'Functions', fase: 4, depende_de: [], nota: 'aridade de fn.length; placeholder _' },
    { nome: 'curryRight', categoria: 'Functions', fase: 4, depende_de: ['curry'] },
    { nome: 'flow', categoria: 'Functions', fase: 4, depende_de: [] },
    { nome: 'flowRight', categoria: 'Functions', fase: 4, depende_de: ['flow'] },

    // ─────────────────────────────────────────────────────────────
    // FASE 4 — Utils restantes (template)
    // ─────────────────────────────────────────────────────────────
    { nome: 'templateSettings', categoria: 'Utils', fase: 4, depende_de: [], nota: 'objeto de config com escape/evaluate/interpolate' },
    { nome: 'template', categoria: 'Utils', fase: 4, depende_de: ['templateSettings', 'escape'], nota: 'usa new Function; RISCO CSP documentado' },
    { nome: 'mixin', categoria: 'Utils', fase: 4, depende_de: [], nota: 'adiciona métodos ao objeto/wrapper' },

    // ─────────────────────────────────────────────────────────────
    // FASE 5 — Seq (chaining) — depende do fechamento da fase 4
    // ─────────────────────────────────────────────────────────────
    { nome: 'chain', categoria: 'Seq', fase: 5, depende_de: [], nota: 'wrapper com chaining explícito' },
    { nome: 'tap', categoria: 'Seq', fase: 5, depende_de: [], nota: 'efeito colateral; retorna o valor' },
    { nome: 'thru', categoria: 'Seq', fase: 5, depende_de: [], nota: 'retorna o resultado do interceptor' },
    { nome: 'value', categoria: 'Seq', fase: 5, depende_de: ['chain', 'wrapperValue'], alias_de: 'wrapperValue' },
    { nome: 'commit', categoria: 'Seq', fase: 5, depende_de: ['chain', 'wrapperCommit'], alias_de: 'wrapperCommit' },
    { nome: 'plant', categoria: 'Seq', fase: 5, depende_de: ['chain', 'wrapperPlant'], alias_de: 'wrapperPlant' },
    { nome: 'next', categoria: 'Seq', fase: 5, depende_de: ['chain', 'wrapperNext'], alias_de: 'wrapperNext' },
    { nome: 'toIterator', categoria: 'Seq', fase: 5, depende_de: ['chain', 'wrapperToIterator'], alias_de: 'wrapperToIterator' },
    { nome: 'toJSON', categoria: 'Seq', fase: 5, depende_de: ['chain', 'wrapperValue'], alias_de: 'wrapperValue' },
    { nome: 'valueOf', categoria: 'Seq', fase: 5, depende_de: ['chain', 'wrapperValue'], alias_de: 'wrapperValue' },
    { nome: 'wrapperAt', categoria: 'Seq', fase: 5, depende_de: ['chain', 'at'] },
    { nome: 'wrapperChain', categoria: 'Seq', fase: 5, depende_de: ['chain'] },
    { nome: 'wrapperCommit', categoria: 'Seq', fase: 5, depende_de: ['chain'] },
    { nome: 'wrapperLodash', categoria: 'Seq', fase: 5, depende_de: ['chain'] },
    { nome: 'wrapperNext', categoria: 'Seq', fase: 5, depende_de: ['chain'] },
    { nome: 'wrapperPlant', categoria: 'Seq', fase: 5, depende_de: ['chain'] },
    { nome: 'wrapperReverse', categoria: 'Seq', fase: 5, depende_de: ['chain', 'reverse'] },
    { nome: 'wrapperToIterator', categoria: 'Seq', fase: 5, depende_de: ['chain'] },
    { nome: 'wrapperValue', categoria: 'Seq', fase: 5, depende_de: ['chain'] },
    { nome: 'lodash', categoria: 'Seq', fase: 5, depende_de: ['chain'], nota: 'a própria função _ chamável' },
    { nome: 'default', categoria: 'Seq', fase: 5, depende_de: ['lodash'], alias_de: 'lodash', nota: 'export default do lodash-es' }
];
