import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseAssignValue } from './_baseAssignValue';

/**
 * Altera os nomes das chaves de um objeto usando um mapa de "de/para".
 * Útil para adaptar dados da API para o seu padrão.
 *
 * @param object O objeto original.
 * @param map O mapa de renomeação { chaveAntiga: chaveNova }.
 * @returns Um novo objeto com as chaves renomeadas.
 */
export function renameKeys(
    object: MaybeRefOrGetter<Record<string, any>>,
    map: MaybeRefOrGetter<Record<string, string>>
): Record<string, any> {
    const rawObject = toValue(object);
    const rawMap = toValue(map);

    const renamedObject: Record<string, any> = {};

    Object.keys(rawObject).forEach((key) => {
        const newKey = rawMap[key] || key;
        baseAssignValue(renamedObject, newKey, rawObject[key]);
    });

    return renamedObject;
}
