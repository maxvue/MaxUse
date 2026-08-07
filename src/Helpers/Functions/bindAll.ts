import { bind } from './bind';

/**
 * Vincula os métodos de `object` especificados por `methodNames` ao
 * próprio `object` (como `this`), substituindo cada método por sua
 * versão vinculada. **Muta `object`** e o retorna. Útil para pré-vincular
 * métodos de eventos que serão desanexados de seu objeto original (ex.:
 * handlers de evento). `methodNames` aceita nomes individuais ou arrays
 * (aninhados são achatados).
 * Semelhante ao _.bindAll do Lodash.
 *
 * @param object objeto a mutar, cujos métodos serão vinculados
 * @param methodNames nomes dos métodos (strings ou arrays de strings)
 * @returns o próprio `object`, mutado
 */
export function bindAll<T extends Record<PropertyKey, any>>(object: T, ...methodNames: Array<PropertyKey | PropertyKey[]>): T {
    const names = methodNames.flat(Infinity) as PropertyKey[];
    for (const name of names) {
        const key = String(name);
        (object as Record<string, unknown>)[key] = bind((object as Record<string, unknown>)[key] as (...args: any[]) => unknown, object);
    }
    return object;
}
