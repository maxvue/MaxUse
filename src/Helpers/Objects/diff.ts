import { toValue, type MaybeRefOrGetter } from 'vue';
import { isEqual } from './isEqual';

/**
 * Compara dois objetos e retorna um novo objeto contendo apenas as propriedades que foram alteradas.
 * Útil para otimização de performance ao enviar apenas o que mudou para o backend (PATCH requests).
 *
 * @param oldObj O objeto original (estado anterior).
 * @param newObj O objeto atualizado (estado novo).
 * @param alwaysKeep Lista de chaves que devem ser obrigatoriamente mantidas no resultado, mesmo que não tenham mudado.
 */
export function diff<T extends Record<string, any>>(
    oldObj: MaybeRefOrGetter<T | null | undefined>,
    newObj: MaybeRefOrGetter<T | null | undefined>,
    alwaysKeep: string[] = []
): Partial<T> {
    const original = (toValue(oldObj) || {}) as T;
    const updated = (toValue(newObj) || {}) as T;
    const result: Partial<T> = {};

    // Adiciona as chaves que devem ser mantidas obrigatoriamente
    alwaysKeep.forEach((key) => {
        if (key in updated) (result as any)[key] = updated[key];

    });

    // Compara as chaves do novo objeto com o original
    Object.keys(updated).forEach((key) => {
        const val1 = original[key];
        const val2 = updated[key];

        // Se os valores são diferentes, adiciona ao resultado
        if (!isEqual(val1, val2)) (result as any)[key] = val2;

    });

    return result;
}
