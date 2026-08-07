import { maskBr } from 'js-brasil';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Aplica a máscara de CEP brasileiro em uma string.
 *
 * @param value A string com o CEP.
 * @returns O CEP formatado ou a string original se não for possível.
 */
export function formatCep(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    const cep = String(data).replace(/\D/g, '');
    if (cep.length === 8) return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    return String(data);
}

/**
 * Aplica a máscara de CPF em uma string.
 *
 * @param value A string com o CPF.
 * @returns O CPF formatado.
 */
export function formatCpf(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';
    return maskBr.cpf(data);
}

/**
 * Aplica a máscara de CNPJ em uma string.
 *
 * @param value A string com o CNPJ.
 * @returns O CNPJ formatado.
 */
export function formatCnpj(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';
    return maskBr.cnpj(data);
}

/**
 * Aplica a máscara de CPF ou CNPJ dependendo do tamanho da string.
 *
 * @param value A string com o CPF ou CNPJ.
 * @returns O documento formatado.
 */
export function formatCpfCnpj(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';
    return maskBr.cpfcnpj(data);
}

/**
 * Aplica a máscara de telefone brasileiro em uma string.
 *
 * @param phone_number O número de telefone.
 * @returns O telefone formatado.
 */
export function formatPhone(phone_number: RefString): string {
    const data = toValue(phone_number);

    if (!data || isBlank(data)) return '';

    const only_numbers = String(data).replace(/\D/g, '');

    if (only_numbers.startsWith('0800')) return only_numbers.replace(/^0800(\d{3})(\d{4})$/, '0800 $1 $2');

    if (only_numbers.length === 10) return only_numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    if (only_numbers.length === 11) return only_numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

    if (only_numbers.length === 12) return only_numbers.replace(/^55(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    if (only_numbers.length === 13) return only_numbers.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

    return String(data);
}

/**
 * Ofusca parte de uma informação sensível.
 * Privacidade (LGPD) ao exibir dados do usuário em telas de confirmação ou perfis públicos.
 *
 * @param value A informação a ser ofuscada.
 * @param type O tipo de informação ('email', 'card' ou 'text').
 */
export function maskSensitive(value: RefString, type: 'email' | 'card' | 'text' = 'text'): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    const str = String(data).trim();

    if (type === 'card') {
        const onlyNumbers = str.replace(/\D/g, '');
        // Só revela os 4 últimos se sobrar o que ocultar; caso contrário, mascara tudo
        if (onlyNumbers.length < 8) return '**** **** **** ****';
        return `**** **** **** ${onlyNumbers.slice(-4)}`;
    }

    if (type === 'email') {
        const atIndex = str.lastIndexOf('@');
        if (atIndex < 1) return '****';

        const user = str.slice(0, atIndex);
        const domain = str.slice(atIndex + 1);

        // Revela no máximo 1/3 do trecho, nunca mais que 3 caracteres
        const mask = (s: string) => {
            const reveal = Math.min(3, Math.floor(s.length / 3));
            return reveal < 1 ? '***' : s.slice(0, reveal) + '***';
        };

        const dotIndex = domain.lastIndexOf('.');
        if (dotIndex < 1) return `${mask(user)}@${mask(domain)}`;

        return `${mask(user)}@${mask(domain.slice(0, dotIndex))}${domain.slice(dotIndex)}`;
    }

    // Default: revela no máximo os 2 primeiros e 2 últimos, e só se houver o que ocultar
    if (str.length <= 6) return '****';
    return str.slice(0, 2) + '***' + str.slice(-2);
}
