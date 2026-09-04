import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Encurta uma string até um limite de caracteres, adicionando reticências (...) ao final se necessário.
 *
 * @param value A string a ser encurtada.
 * @param limit O limite máximo de caracteres.
 * @param suffix O sufixo a ser adicionado (padrão: '...').
 */
export function truncate(value: RefString, limit: number = 20, suffix: string = '...'): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    const str = String(data);
    const chars = [...str];
    if (chars.length <= limit) return str;

    return chars.slice(0, limit).join('') + suffix;
}

/**
 * Converte uma string para um formato amigável para URLs (slug).
 * Remove acentos, caracteres especiais e substitui espaços por hífens.
 *
 * @param value A string a ser convertida.
 */
export function slugify(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    return String(data)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Remove todas as tags HTML de uma string, mantendo apenas o texto puro.
 * Útil para exibir prévias de conteúdos vindos de editores de texto (Rich Text) em notificações ou listas simplificadas.
 *
 * @param value A string contendo HTML.
 */
export function stripHtml(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    return String(data)
        .replace(/<[^>]*>?/gm, '') // Remove tags HTML
        .replace(/&nbsp;/g, ' ') // Substitui &nbsp; por espaço
        .trim();
}

/**
 * Extrai as iniciais de um nome completo (ex: "João Victor Silva" ➔ "JS", "João da Silva" ➔ "JS").
 * Perfeito para gerar placeholders de avatares quando o usuário não tem uma foto de perfil.
 *
 * @param value O nome completo.
 * @param limit O número máximo de iniciais (padrão: 2).
 */
export function initials(value: RefString, limit: number = 2): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    const prepositions = new Set(['de', 'da', 'do', 'dos', 'das', 'e']);
    const rawNames = String(data).trim().split(/\s+/).filter(Boolean);

    const names = rawNames.filter((name) => !prepositions.has(name.toLowerCase()));
    const targetNames = names.length > 0 ? names : rawNames;

    if (targetNames.length === 1) return targetNames[0].charAt(0).toUpperCase();


    if (limit === 2 && targetNames.length > 2) {
        const first = targetNames[0].charAt(0).toUpperCase();
        const last = targetNames[targetNames.length - 1].charAt(0).toUpperCase();
        return `${first}${last}`;
    }

    return targetNames
        .slice(0, limit)
        .map((name) => name.charAt(0).toUpperCase())
        .join('');
}

/**
 * Calcula o tempo estimado de leitura de um texto.
 * Ótimo para blogs ou áreas de documentação, dando ao usuário uma ideia de quanto tempo ele levará para ler um conteúdo.
 *
 * @param value O texto a ser analisado (pode conter HTML).
 * @param wordsPerMinute A média de palavras lidas por minuto (padrão: 200).
 */
export function readingTime(value: RefString, wordsPerMinute: number = 200): string {
    const data = toValue(value);
    if (isBlank(data)) return '0 min de leitura';

    // Remove HTML para contar apenas palavras reais
    const text = stripHtml(data);
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0).length;

    if (words === 0) return '0 min de leitura';

    const minutes = Math.ceil(words / wordsPerMinute);

    return `${minutes} min de leitura`;
}

