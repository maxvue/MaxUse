import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Cria uma função que retorna o argumento de índice `n` recebido em sua
 * chamada. `n` negativo conta a partir do último argumento.
 * Semelhante ao _.nthArg do Lodash.
 *
 * @param n índice do argumento a retornar (padrão `0`)
 * @returns função que extrai o n-ésimo argumento recebido
 */
export function nthArg(n?: MaybeRefOrGetter<number>): (...args: unknown[]) => unknown {
    const index = n === undefined ? 0 : toInteger(toValue(n));
    return (...args: unknown[]) => {
        const pos = index < 0 ? args.length + index : index;
        return pos > -1 && pos < args.length ? args[pos] : undefined;
    };
}
