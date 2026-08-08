import { unref, type MaybeRef } from 'vue';
import { baseClone } from './_baseClone';

/**
 * Cria uma cópia rasa (shallow) de `value`, delegando o valor resultante a
 * `customizer` quando ele retorna algo diferente de `undefined`. Se o
 * `customizer` retornar `undefined`, cai de volta no comportamento padrão
 * de {@link import('./clone').clone} para aquele valor.
 *
 * Peculiaridade: `customizer` só é chamado uma vez, para o valor de
 * primeiro nível — clonagem rasa não recursa por chave (exceto o caso
 * especial de `Map`/`Set`, cujas entradas sempre passam pelo customizer).
 * Semelhante ao _.cloneWith do Lodash.
 *
 * Usa `unref` em vez de `toValue`: o próprio valor a clonar pode ser uma
 * função, e `toValue` a invocaria como getter em vez de preservá-la para
 * clonagem.
 *
 * @param value valor a clonar
 * @param customizer função que recebe o valor e pode retornar um clone customizado
 * @returns cópia rasa do valor, respeitando o customizer
 */
export function cloneWith<T>(value: MaybeRef<T>, customizer?: (value: unknown, key?: string | symbol, object?: unknown, stack?: Map<unknown, unknown>) => unknown): T {
    const data = unref(value);
    const fn = typeof customizer === 'function' ? customizer : undefined;
    return baseClone(data, false, fn) as T;
}
