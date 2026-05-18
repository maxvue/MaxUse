import { MaybeRefOrGetter } from 'vue';
type T = Record<string, any> | string | number | null | undefined;
/**
 * Retorna o tamanho (comprimento) de uma coleção, string, objeto, Map ou Set.
 *
 * @param value O valor a ter seu tamanho calculado.
 * @param allow_number Se verdadeiro, retorna o próprio valor numérico caso o tipo seja número (padrão é true).
 * @returns O tamanho do valor especificado.
 */
export declare function size(value: MaybeRefOrGetter<T>, allow_number?: boolean): number;
export {};
//# sourceMappingURL=size.d.ts.map