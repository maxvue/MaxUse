import { describe, it, expect } from 'vitest';
import { HELPERS } from './manifest';
import { maxUseItems } from '../src/Helpers/maxUseItems';

/**
 * Helpers-semente implementados na Task 2 desta migração. Fazem parte dos 281
 * e por isso precisam ser descontados ao reconstruir a linha de base
 * pré-migração a partir de maxUseItems().
 */
const SEMENTES = ['isNil', 'negate', 'stubTrue', 'tap'];

/**
 * Linha de base congelada: os 281 nomes do lodash-es que não existiam na MaxUse
 * nem no VueUse antes desta migração. Congelada de propósito — `maxUseItems()`
 * cresce conforme os helpers são implementados, então recalcular a linha de base
 * dinamicamente faria este teste falhar assim que a execução começasse (o helper
 * recém-implementado somaria a `maxUseItems()` e sumiria da lista de "faltantes",
 * disparando um falso "extra no manifesto").
 *
 * Gerada uma única vez, dentro do runtime real do Vitest, a partir de:
 *   Object.keys(lodash-es) que não estão em maxUseItems() (descontadas as
 *   SEMENTES) nem em @vueuse/core. Ver task-3-report.md para o comando exato.
 */
const LINHA_BASE_PRE_MIGRACAO = [
    'add', 'after', 'ary', 'assign', 'assignIn', 'assignInWith', 'assignWith', 'at',
    'attempt', 'before', 'bind', 'bindAll', 'bindKey', 'castArray', 'ceil', 'chain',
    'clone', 'cloneDeepWith', 'cloneWith', 'commit', 'compact', 'concat', 'cond', 'conforms',
    'conformsTo', 'constant', 'create', 'curry', 'curryRight', 'debounce', 'deburr', 'default',
    'defaultTo', 'defaults', 'defaultsDeep', 'defer', 'delay', 'difference', 'differenceBy', 'differenceWith',
    'divide', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'each', 'eachRight', 'endsWith',
    'entries', 'entriesIn', 'eq', 'escape', 'escapeRegExp', 'every', 'extend', 'extendWith',
    'fill', 'find', 'findIndex', 'findKey', 'findLastIndex', 'findLastKey', 'flatMap', 'flatMapDeep',
    'flatMapDepth', 'flatten', 'flattenDeep', 'flattenDepth', 'flip', 'floor', 'flow', 'flowRight',
    'forEach', 'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight', 'fromPairs', 'functions',
    'functionsIn', 'gt', 'gte', 'has', 'hasIn', 'head', 'inRange', 'includes',
    'indexOf', 'initial', 'intersection', 'intersectionBy', 'intersectionWith', 'invert', 'invertBy', 'invokeMap',
    'isArguments', 'isArrayBuffer', 'isArrayLike', 'isArrayLikeObject', 'isBoolean', 'isBuffer', 'isElement', 'isEqualWith',
    'isError', 'isFinite', 'isFunction', 'isInteger', 'isLength', 'isMap', 'isMatch', 'isMatchWith',
    'isNaN', 'isNative', 'isNil', 'isNull', 'isObjectLike', 'isPlainObject', 'isRegExp', 'isSafeInteger',
    'isSet', 'isString', 'isSymbol', 'isTypedArray', 'isUndefined', 'isWeakMap', 'isWeakSet', 'iteratee',
    'join', 'keys', 'keysIn', 'lastIndexOf', 'lodash', 'lowerCase', 'lowerFirst', 'lt',
    'lte', 'map', 'mapKeys', 'matches', 'matchesProperty', 'max', 'maxBy', 'mean',
    'meanBy', 'memoize', 'merge', 'mergeWith', 'method', 'methodOf', 'min', 'minBy',
    'mixin', 'multiply', 'negate', 'next', 'nth', 'nthArg', 'omitBy', 'once',
    'over', 'overArgs', 'overEvery', 'overSome', 'pad', 'padEnd', 'padStart', 'parseInt',
    'partial', 'partialRight', 'partition', 'pickBy', 'plant', 'property', 'propertyOf', 'pull',
    'pullAll', 'pullAllBy', 'pullAllWith', 'pullAt', 'random', 'range', 'rangeRight', 'rearg',
    'reduce', 'reduceRight', 'reject', 'remove', 'repeat', 'replace', 'rest', 'result',
    'reverse', 'round', 'sampleSize', 'setWith', 'slice', 'some', 'sortedIndex', 'sortedIndexBy',
    'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexBy', 'sortedLastIndexOf', 'sortedUniq', 'sortedUniqBy', 'split', 'spread',
    'startCase', 'startsWith', 'stubArray', 'stubFalse', 'stubObject', 'stubString', 'stubTrue', 'subtract',
    'tail', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'tap', 'template', 'templateSettings',
    'throttle', 'thru', 'times', 'toFinite', 'toInteger', 'toIterator', 'toJSON', 'toLength',
    'toLower', 'toPairs', 'toPairsIn', 'toPath', 'toPlainObject', 'toSafeInteger', 'toString', 'toUpper',
    'transform', 'trim', 'trimEnd', 'trimStart', 'unary', 'unescape', 'union', 'unionBy',
    'unionWith', 'uniqBy', 'uniqWith', 'uniqueId', 'unzip', 'unzipWith', 'update', 'updateWith',
    'upperCase', 'upperFirst', 'value', 'valueOf', 'values', 'valuesIn', 'without', 'words',
    'wrap', 'wrapperAt', 'wrapperChain', 'wrapperCommit', 'wrapperLodash', 'wrapperNext', 'wrapperPlant', 'wrapperReverse',
    'wrapperToIterator', 'wrapperValue', 'xor', 'xorBy', 'xorWith', 'zip', 'zipObject', 'zipObjectDeep',
    'zipWith'
];

describe('manifest', () => {
    it('a linha de base congelada inclui as sementes da Task 2 (fazem parte dos 281)', () => {
        expect(SEMENTES.every((s) => LINHA_BASE_PRE_MIGRACAO.includes(s))).toBe(true);
    });

    it('a linha de base congelada tem exatamente 281 entradas', () => {
        expect(LINHA_BASE_PRE_MIGRACAO.length).toBe(281);
    });

    it('cobre exatamente os helpers faltantes da linha de base pré-migração, sem lacunas nem extras', () => {
        const alvo = new Set(LINHA_BASE_PRE_MIGRACAO);
        const nomes = new Set(HELPERS.map((h) => h.nome));

        expect([...alvo].filter((k) => !nomes.has(k))).toEqual([]);
        expect([...nomes].filter((k) => !alvo.has(k))).toEqual([]);
    });

    it('não contém nomes duplicados', () => {
        const nomes = HELPERS.map((h) => h.nome);
        expect(nomes.length).toBe(new Set(nomes).size);
    });

    it('só declara dependências que existem no manifesto ou já na MaxUse', () => {
        const nomes = new Set(HELPERS.map((h) => h.nome));
        const proprios = new Set(maxUseItems());
        const invalidas = HELPERS.flatMap((h) =>
            h.depende_de.filter((d) => !nomes.has(d) && !proprios.has(d)).map((d) => `${h.nome} -> ${d}`)
        );

        expect(invalidas).toEqual([]);
    });

    it('nunca depende de um helper de fase posterior', () => {
        const fases = new Map(HELPERS.map((h) => [h.nome, h.fase]));
        const invertidas = HELPERS.flatMap((h) =>
            h.depende_de
                .filter((d) => fases.has(d) && (fases.get(d) as number) > h.fase)
                .map((d) => `${h.nome}(f${h.fase}) -> ${d}(f${fases.get(d)})`)
        );

        expect(invertidas).toEqual([]);
    });

    it('todo alias declara o original em depende_de', () => {
        const semDependencia = HELPERS
            .filter((h) => h.alias_de)
            .filter((h) => !h.depende_de.includes(h.alias_de as string))
            .map((h) => h.nome);

        expect(semDependencia).toEqual([]);
    });

    it('nenhum helper aparece antes de uma dependência sua no array', () => {
        const nomesNoManifesto = new Set(HELPERS.map((h) => h.nome));
        const vistos = new Set<string>();
        const foraDeOrdem: string[] = [];

        for (const h of HELPERS) {
            const pendentes = h.depende_de.filter((dep) => nomesNoManifesto.has(dep) && !vistos.has(dep));
            foraDeOrdem.push(...pendentes.map((dep) => `${h.nome} -> ${dep}`));
            vistos.add(h.nome);
        }

        expect(foraDeOrdem).toEqual([]);
    });
});
