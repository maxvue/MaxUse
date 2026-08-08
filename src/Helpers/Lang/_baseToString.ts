/**
 * Implementação interna compartilhada por `toString`, `toPath`, `add`,
 * `subtract`, `multiply` e `divide`. Não é exportada no barrel da
 * categoria — é um detalhe de implementação, não um helper público do
 * manifesto de migração.
 *
 * Conversão para string aplicada a um valor já resolvido (não
 * `MaybeRefOrGetter`). Diferente da função pública `toString`, **não**
 * trata `null`/`undefined` como string vazia — vira o literal
 * `'null'`/`'undefined'`, que é o comportamento observável do Lodash ao
 * converter arrays (`_.toString([null])` → `'null'`, mas `_.toString(null)`
 * → `''`) e ao concatenar em `add`/`subtract`/`multiply`/`divide`
 * (`_.add(null, '3')` → `'null3'`).
 *
 * @param data valor já resolvido (não `MaybeRefOrGetter`)
 * @returns representação em string do valor
 */
export function baseToString(data: unknown): string {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.map((item) => baseToString(item)).join(',');
    if (typeof data === 'symbol') return data.toString();
    // `value + ''` usa o hint "default" da coerção (chama `valueOf` antes de
    // `toString`), igual ao Lodash — diferente de template literals
    // (`` `${value}` ``), que usam o hint "string" (`toString` antes de
    // `valueOf`) e divergiriam para objetos com `valueOf` customizado.
    const result = (data as unknown as string) + '';
    // Preserva o sinal de `-0`, inclusive quando `data` é um objeto Number
    // envolvido (`Object(-0)`) cujo `valueOf` produz `-0` na coerção acima.
    return result === '0' && 1 / (data as unknown as number) === -Infinity ? '-0' : result;
}
