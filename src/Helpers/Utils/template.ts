import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';
import { escape } from '../Strings/escape';
import { templateSettings, type TemplateSettings } from './templateSettings';

export interface TemplateOptions {
    escape?: RegExp;
    evaluate?: RegExp;
    interpolate?: RegExp;
    variable?: string;
    imports?: Record<string, unknown>;
}

export interface CompiledTemplate {
    (data?: Record<string, unknown>): string;
    source: string;
}

const reNoMatch = /($^)/;
const reUnescapedString = /['\n\r\u2028\u2029\\]/g;
const escapes: Record<string, string> = {
    '\\': '\\',
    '\'': '\'',
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};

/**
 * Compila uma string de template em uma função reutilizável que injeta
 * dados nas posições marcadas por delimitadores de interpolação (`<%= %>`,
 * por padrão), escape HTML (`<%- %>`) ou trechos de JavaScript "cru"
 * avaliados dentro do template (`<% %>`). **Usa `new Function` para
 * compilar** — não use esta função com conteúdo de template vindo de
 * entrada do usuário sem sanitização; sob uma Content-Security-Policy que
 * bloqueia `unsafe-eval`, a compilação falha.
 * Semelhante ao _.template do Lodash.
 *
 * **Divergência intencional do `_` injetado por padrão:** no Lodash
 * clássico, o identificador `_` disponível dentro do template (quando não
 * sobrescrito por `options.imports`) é o próprio objeto `lodash` completo
 * (chamável, com todos os métodos). Na MaxUse, `_` é `{ escape }` — apenas
 * o `escape` desta biblioteca. Importar o `_` completo de `src/index.ts`
 * aqui criaria uma dependência circular (`src/index.ts` → `Utils/index.ts`
 * → `template.ts` → `src/index.ts`), já que `_` é montado a partir de
 * todas as categorias, incluindo `Utils`. Para usar outros helpers dentro
 * do template, repasse-os explicitamente via `options.imports`.
 *
 * @param string string de template a compilar
 * @param options `escape`, `evaluate`, `interpolate`, `variable`, `imports` (mescla com `templateSettings`)
 * @returns função compilada, com `.source` contendo o corpo gerado
 */
export function template(string: MaybeRefOrGetter<unknown>, options?: TemplateOptions): CompiledTemplate {
    const str = toString(toValue(string));
    const settings: TemplateSettings = {
        escape: options?.escape ?? templateSettings.escape,
        evaluate: options?.evaluate ?? templateSettings.evaluate,
        interpolate: options?.interpolate ?? templateSettings.interpolate,
        variable: options?.variable ?? templateSettings.variable,
        imports: { ...templateSettings.imports, ...options?.imports }
    };

    let isEscaping = settings.escape !== reNoMatch;
    const importsKeys = Object.keys({ _: escape, ...settings.imports });
    const importsValues: unknown[] = importsKeys.map((key) => (key === '_' && !('_' in settings.imports) ? { escape } : settings.imports[key]));

    const reDelimiters = new RegExp(
        [
            (settings.escape || reNoMatch).source,
            (settings.interpolate || reNoMatch).source,
            (settings.interpolate === settings.evaluate ? reNoMatch : (settings.evaluate || reNoMatch)).source
        ].join('|') + '|$',
        'g'
    );

    let index = 0;
    let source = '__p += \'';
    let isEvaluating = false;

    str.replace(reDelimiters, (match: string, escapeValue: string, interpolateValue: string, evaluateValue: string, offset: number): string => {
        source += str.slice(index, offset).replace(reUnescapedString, (char) => '\\' + escapes[char]);

        if (escapeValue) {
            isEscaping = true;
            source += `' +\n__e(${escapeValue}) +\n'`;
        } else if (evaluateValue) {
            isEvaluating = true;
            source += `';\n${evaluateValue};\n__p += '`;
        } else if (interpolateValue) source += `' +\n((__t = (${interpolateValue})) == null ? '' : __t) +\n'`;


        index = offset + match.length;
        return match;
    });

    source += '\';\n';

    const variable = settings.variable;
    if (variable) source = source.replace(/^\s*__p \+= '';\n/gm, '');
    else source = 'with (obj) {\n' + source + '\n}\n';


    source = 'function(' + (variable || 'obj') + ') {\n'
        + (variable ? '' : 'obj || (obj = {});\n')
        + 'var __t, __p = \'\'' + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, \'\') }\n' : ';\n')
        + source
        + 'return __p\n}';

    let result: CompiledTemplate;
    try {

        const compiledFn = new Function(...importsKeys, 'return ' + source) as (...args: unknown[]) => (data?: Record<string, unknown>) => string;
        result = compiledFn(...importsValues) as CompiledTemplate;
    } catch (error) {
        (error as Error).message = source;
        throw error;
    }

    result.source = source;
    return result;
}
