import { unref, type MaybeRef } from 'vue';
import { baseClone } from './_baseClone';

/**
 * Cria uma cópia profunda (deep) de `value`, delegando o valor resultante a
 * `customizer` para cada nível visitado (valor de origem, valor original,
 * chave, objeto pai, pilha de rastreamento). Se o `customizer` retornar
 * `undefined` para um nível, a clonagem profunda padrão continua a partir
 * dali.
 * Semelhante ao _.cloneDeepWith do Lodash.
 *
 * Usa `unref` em vez de `toValue`: o próprio valor a clonar pode ser uma
 * função, e `toValue` a invocaria como getter em vez de preservá-la para
 * clonagem.
 *
 * @param value valor a clonar profundamente
 * @param customizer função que recebe cada valor visitado e pode retornar um clone customizado
 * @returns cópia profunda do valor, respeitando o customizer
 */
export function cloneDeepWith<T>(value: MaybeRef<T>, customizer?: (value: unknown, key?: string | symbol, object?: unknown, stack?: Map<unknown, unknown>) => unknown): T {
    const data = unref(value);
    const fn = typeof customizer === 'function' ? customizer : undefined;
    return baseClone(data, true, fn) as T;
}
