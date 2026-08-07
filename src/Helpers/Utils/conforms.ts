import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from '../Objects/keys';
import { conformsTo } from './conformsTo';

/**
 * Cria uma função que verifica se o objeto recebido "conforma" com
 * `source`: para cada chave de `source` cujo valor é uma função, essa
 * função precisa retornar valor verdadeiro quando chamada com o valor
 * correspondente do objeto recebido. `source` é copiado (chaves de nível
 * superior) no momento da criação — os predicados (funções) são
 * preservados por referência, não deep-clonados: o Lodash real também não
 * clona funções em profundidade (`cloneDeep` de uma função nua vira
 * `{}` — perderia a capacidade de invocar), então `conforms` copia apenas
 * a lista de chaves/predicados de `source`, sem tentar clonar cada
 * predicado.
 * Semelhante ao _.conforms do Lodash.
 *
 * @param source objeto com predicados por chave
 * @returns função `(object) => boolean`
 */
export function conforms(source: MaybeRefOrGetter<Record<PropertyKey, (value: unknown) => boolean>>): (object: unknown) => boolean {
    const data = toValue(source);
    const src: Record<PropertyKey, (value: unknown) => boolean> = {};
    for (const key of keys(data)) src[key] = data[key];
    return (object: unknown) => conformsTo(object, src);
}
