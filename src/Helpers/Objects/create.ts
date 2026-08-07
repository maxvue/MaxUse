import { toValue, type MaybeRefOrGetter } from 'vue';
import { assign } from './assign';

function isObjectValue(value: unknown): value is object {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}

/**
 * Cria um objeto que herda de `prototype`. Se `properties` for informado,
 * suas propriedades próprias são atribuídas ao objeto criado (via
 * `assign`). Quando `prototype` não é um objeto/função válido (`null`,
 * `undefined`, primitivo), o objeto criado herda de `Object.prototype`
 * (o mesmo que um objeto criado por `{}`) — o Lodash nunca produz um
 * objeto sem protótipo nesse caso.
 * Semelhante ao _.create do Lodash.
 *
 * @param prototype protótipo do objeto a criar
 * @param properties propriedades próprias a atribuir ao objeto criado
 * @returns o novo objeto
 */
export function create<T extends object>(prototype: MaybeRefOrGetter<object | null | undefined>, properties?: MaybeRefOrGetter<Partial<T> | null | undefined>): T {
    const proto = toValue(prototype);
    const base = (isObjectValue(proto) ? Object.create(proto) : {}) as T;
    const props = toValue(properties);
    return props ? assign(base, props) : base;
}
