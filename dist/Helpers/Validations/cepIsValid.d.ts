import { MaybeRefOrGetter } from 'vue';
/**
 * Valida se uma string é um CEP válido.
 *
 * @param value O valor a ser validado (string, Ref ou Getter).
 * @returns True se for um CEP válido, false caso contrário.
 */
export declare function cepIsValid(value: MaybeRefOrGetter<string | number | null | undefined>): boolean;
export declare const cep: typeof cepIsValid;
export declare const isValidCep: typeof cepIsValid;
export declare const isCepValid: typeof cepIsValid;
export declare const hasValidCep: typeof cepIsValid;
//# sourceMappingURL=cepIsValid.d.ts.map