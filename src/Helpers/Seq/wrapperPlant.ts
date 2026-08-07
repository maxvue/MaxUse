import { toValue, type MaybeRefOrGetter } from 'vue';
import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Método de instância `.plant()` do wrapper: cria um **clone** da
 * sequência de encadeamento, plantando `value` como o novo valor
 * envolvido (`__wrapped__`), preservando a fila de ações (`__actions__`) e
 * a flag `__chain__`. A instância original não é afetada.
 * Semelhante ao _.prototype.plant (wrapperPlant) do Lodash.
 *
 * @param value novo valor a plantar como raiz da cadeia
 * @returns novo wrapper com `value` plantado
 */
MaxUseWrapper.prototype.plant = function <T> (this: MaxUseWrapper<T>, value: MaybeRefOrGetter<T>): MaxUseWrapper<T> {
    const data = toValue(value);
    return new MaxUseWrapper<T>(data, this.__chain__, [...this.__actions__]);
};

declare module './_MaxUseWrapper' {
    interface MaxUseWrapper<T> {
        plant(value: MaybeRefOrGetter<T>): MaxUseWrapper<T>;
    }
}

/**
 * Versão funcional de `.plant()`, usada como implementação de base pelo
 * alias `plant` (`plant.ts`). Recebe o wrapper explicitamente em vez de
 * depender de `this`, mais idiomático ao restante da biblioteca.
 *
 * @param wrapper instância de wrapper a clonar
 * @param value novo valor a plantar como raiz da cadeia
 * @returns novo wrapper com `value` plantado
 */
export function wrapperPlant<T>(wrapper: MaxUseWrapper<T>, value: MaybeRefOrGetter<T>): MaxUseWrapper<T> {
    return wrapper.plant(value);
}
