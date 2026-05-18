import { MaybeRefOrGetter } from 'vue';
type RefString = MaybeRefOrGetter<string | number | null | undefined>;
/**
 * Valida se uma string é um CPF válido.
 */
export declare function isCpf(value: RefString): any;
/**
 * Valida se uma string é um CNPJ válido.
 */
export declare function isCnpj(value: RefString): any;
/**
 * Valida se uma string é um CPF ou CNPJ válido.
 */
export declare function isCpfCnpj(value: RefString): any;
export declare const cpf: typeof isCpf;
export declare const cnpj: typeof isCnpj;
export declare const cpfcnpj: typeof isCpfCnpj;
export declare const cpfIsValid: typeof isCpf;
export declare const cnpjIsValid: typeof isCnpj;
export declare const cpfCnpjIsValid: typeof isCpfCnpj;
export declare const isCpfOrCnpj: typeof isCpfCnpj;
export declare const cpfOrCnpj: typeof isCpfCnpj;
export declare const isCnpjOrCpf: typeof isCpfCnpj;
export declare const cnpjOrCpf: typeof isCpfCnpj;
export declare const isValidCpf: typeof isCpf;
export declare const isValidCnpj: typeof isCnpj;
export declare const isValidCpfCnpj: typeof isCpfCnpj;
export declare const isValidCpfOrCnpj: typeof isCpfCnpj;
export declare const isValidCnpjOrCpf: typeof isCpfCnpj;
export declare const validCpf: typeof isCpf;
export declare const validCnpj: typeof isCnpj;
export declare const validCpfCnpj: typeof isCpfCnpj;
export declare const validCpfOrCnpj: typeof isCpfCnpj;
export declare const validCnpjOrCpf: typeof isCpfCnpj;
export declare const hasValidCpf: typeof isCpf;
export declare const hasValidCnpj: typeof isCnpj;
export declare const hasValidCpfCnpj: typeof isCpfCnpj;
export declare const hasValidCpfOrCnpj: typeof isCpfCnpj;
export declare const hasValidCnpjOrCpf: typeof isCpfCnpj;
export {};
//# sourceMappingURL=documents.d.ts.map