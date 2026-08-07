import type { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Executa a sequência de encadeamento e resolve o valor desembrulhado.
 * É o método `.value()` já definido em `MaxUseWrapper` (ver
 * `_MaxUseWrapper.ts`) — este arquivo o expõe como helper nomeado,
 * porque `value`, `toJSON` e `valueOf` são todos aliases dele.
 * Semelhante ao _.prototype.value (wrapperValue) do Lodash.
 *
 * @param wrapper instância de wrapper a resolver
 * @returns o valor desembrulhado (resultado de aplicar as ações pendentes)
 */
export function wrapperValue<T>(wrapper: MaxUseWrapper<T>): unknown {
    return wrapper.value();
}
