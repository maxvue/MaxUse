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

/**
 * Abrevia um nome completo para caber em um limite máximo de caracteres (padrão: 18).
 * Abrevia os nomes do meio para iniciais (ex: "João Carlos da Silva Pereira" ➔ "João C. S. Pereira"),
 * descartando preposições ("de", "da", "do", "dos", "das", "e") e garantindo que o resultado
 * final não ultrapasse o limite de caracteres.
 *
 * @param value Nome a ser abreviado.
 * @param limit Limite máximo de caracteres (padrão: 18).
 */
export function abbrevName(value: RefString, limit: number = 18): string {
    const data = toValue(value);
    if (isBlank(data)) return '';

    const str = String(data).trim().replace(/\s+/g, ' ');
    if (str.length <= limit) return str;

    const prepositions = new Set(['de', 'da', 'do', 'dos', 'das', 'e', "d'"]);
    const rawParts = str.split(' ').filter(Boolean);

    if (rawParts.length <= 1) {
        if (str.length <= limit) return str;
        const maxChars = Math.max(1, limit - 3);
        return [...str].slice(0, maxChars).join('') + '...';
    }

    const firstName = rawParts[0];
    const lastName = rawParts[rawParts.length - 1];
    const middleParts = rawParts.slice(1, -1);

    // Mapeia nomes do meio para iniciais, pulando preposições
    const abbreviatedMiddles = middleParts
        .map((part) => {
            if (prepositions.has(part.toLowerCase())) return '';
            return part.charAt(0).toUpperCase() + '.';
        })
        .filter(Boolean);

    // 1. Tenta Primeiro + Todas as Iniciais + Último
    let candidate = [firstName, ...abbreviatedMiddles, lastName].filter(Boolean).join(' ');
    if (candidate.length <= limit) return candidate;

    // 2. Tenta remover iniciais intermediárias progressivamente da direita para a esquerda
    for (let i = abbreviatedMiddles.length - 1; i >= 0; i--) {
        const reduced = abbreviatedMiddles.slice(0, i);
        candidate = [firstName, ...reduced, lastName].filter(Boolean).join(' ');
        if (candidate.length <= limit) return candidate;
    }

    // 3. Tenta apenas Primeiro + Último Nome
    candidate = `${firstName} ${lastName}`;
    if (candidate.length <= limit) return candidate;

    // 4. Tenta Primeiro + Inicial do Último
    candidate = `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
    if (candidate.length <= limit) return candidate;

    // 5. Se nem o primeiro nome cabe ou excede, trunca o primeiro nome garantindo <= limit
    if (firstName.length <= limit) return firstName;
    const maxChars = Math.max(1, limit - 3);
    return [...firstName].slice(0, maxChars).join('') + '...';
}

