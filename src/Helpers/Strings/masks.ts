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

    const cep = (typeof data === 'number' ? String(data).padStart(8, '0') : String(data))
        .replace(/\D/g, '');
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
    const numbers = String(data).replace(/\D/g, '');
    if (numbers.length !== 11) return String(data);
    return maskBr.cpf(numbers);
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
    const numbers = String(data).replace(/\D/g, '');
    if (numbers.length !== 14) return String(data);
    return maskBr.cnpj(numbers);
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
    const numbers = String(data).replace(/\D/g, '');
    if (numbers.length !== 11 && numbers.length !== 14) return String(data);
    return maskBr.cpfcnpj(numbers);
}

const VALID_DDD = new Set([
    '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '21', '22', '24', '27', '28',
    '31', '32', '33', '34', '35', '37', '38',
    '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '51', '53', '54', '55',
    '61', '62', '63', '64', '65', '66', '67', '68', '69',
    '71', '73', '74', '75', '77', '79',
    '81', '82', '83', '84', '85', '86', '87', '88', '89',
    '91', '92', '93', '94', '95', '96', '97', '98', '99'
]);

/**
 * Aplica a máscara de telefone brasileiro em uma string.
 *
 * @param phone_number O número de telefone.
 * @returns O telefone formatado.
 */
export function formatPhone(phone_number: RefString): string {
    const data = toValue(phone_number);

    if (data == null || isBlank(data)) return '';

    const only_numbers = String(data).replace(/\D/g, '');

    if (/^0(800|300|500|900)/.test(only_numbers)) {
        if (only_numbers.length === 11) {
            const prefix = only_numbers.slice(0, 4);
            return `${prefix} ${only_numbers.slice(4, 7)} ${only_numbers.slice(7)}`;
        }
        return String(data);
    }

    let ddd = '';
    if (only_numbers.length === 10 || only_numbers.length === 11) {
        const code = only_numbers.slice(0, 2);
        ddd = code;
    } else if ((only_numbers.length === 12 || only_numbers.length === 13) && only_numbers.startsWith('55')) {
        const code = only_numbers.slice(2, 4);
        ddd = code;
    }

    if (!ddd || !VALID_DDD.has(ddd)) return String(data);

    if (only_numbers.length === 10) return only_numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    if (only_numbers.length === 11) return only_numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

    if (only_numbers.length === 12 && only_numbers.startsWith('55')) return only_numbers.replace(/^55(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');

    if (only_numbers.length === 13 && only_numbers.startsWith('55')) return only_numbers.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

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
