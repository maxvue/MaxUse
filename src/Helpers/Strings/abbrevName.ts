import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;
type RefNumber = MaybeRefOrGetter<number | string | null | undefined>;
type RefBoolean = MaybeRefOrGetter<boolean | null | undefined>;

const CONNECTIVES = new Set(['de', 'da', 'do', 'dos', 'das', 'e', 'd\'', 'du', 'del', 'di']);

const isAbbreviated = (token: string): boolean => token.length === 2 && token.endsWith('.');

/**
 * Abreviador progressivo de nomes de pessoas em até 17 etapas determinísticas.
 *
 * Executa as seguintes fases sequenciais até atingir o comprimento alvo (`target`):
 * 1. Supressão de conectivos e preposições ('de', 'da', 'dos', 'das', 'e', etc.)
 * 2. Abreviação de sobrenomes intermediários para inicial com ponto ('Pereira' -> 'P.')
 * 3. Supressão de iniciais intermediárias já abreviadas ('P.' -> removido)
 * 4. Abreviação e posterior supressão do sobrenome terminal ('Silva' -> 'S.' -> removido)
 * 5. Abreviação do prenome isolado e redução a monograma bruto ('Joaquim' -> 'J.' -> 'J')
 *
 * @param name Nome a ser abreviado.
 * @param target Quantidade máxima de caracteres desejada.
 * @param force Se true, reduz o nome até a unidade mínima (1 caractere ou corte estrito) para atingir o target a todo custo.
 * @returns Nome abreviado formatado.
 */
export function abbrevName(
    name: RefString,
    target?: RefNumber,
    force: RefBoolean = false
): string {
    const data = toValue(name);
    if (isBlank(data)) return '';

    const rawTarget = toValue(target);
    const targetLen = rawTarget !== undefined && rawTarget !== null && rawTarget !== ''
        ? Number(rawTarget)
        : Number.POSITIVE_INFINITY;

    const isForce = Boolean(toValue(force));

    // Normaliza espaços múltiplos e remove espaços nas pontas
    const normalized = String(data).trim().replace(/\s+/g, ' ');
    if (!normalized) return '';

    let tokens = normalized.split(' ');
    let current = tokens.join(' ');

    if (current.length <= targetLen) return current;

    // ─── FASE 1: Supressão de conectivos / preposições ────────────────────────
    // Remove conectivos de ligação (da esquerda para a direita)
    let connectiveIndex = tokens.findIndex((t, idx) => idx > 0 && idx < tokens.length - 1 && CONNECTIVES.has(t.toLowerCase()));
    while (connectiveIndex !== -1) {
        tokens.splice(connectiveIndex, 1);
        current = tokens.join(' ');
        if (current.length <= targetLen) return current;
        connectiveIndex = tokens.findIndex((t, idx) => idx > 0 && idx < tokens.length - 1 && CONNECTIVES.has(t.toLowerCase()));
    }

    // ─── FASE 2: Abreviação de sobrenomes intermediários ──────────────────────
    // Abreviar cada sobrenome intermediário (índices 1 até N-2) de forma progressiva
    if (tokens.length >= 3) for (let i = 1; i < tokens.length - 1; i++) if (!isAbbreviated(tokens[i])) {
        tokens[i] = `${tokens[i].charAt(0).toUpperCase()}.`;
        current = tokens.join(' ');
        if (current.length <= targetLen) return current;
    }


    // ─── FASE 3: Supressão de iniciais intermediárias ─────────────────────────
    // Omitir iniciais intermediárias da esquerda para a direita até restar apenas Prenome + Sobrenome final
    while (tokens.length > 2) {
        tokens.splice(1, 1);
        current = tokens.join(' ');
        if (current.length <= targetLen) return current;
    }

    // ─── FASE 4: Abreviação e supressão do sobrenome terminal ─────────────────
    if (tokens.length === 2) {
        // Etapa 14: Abreviar sobrenome terminal
        if (!isAbbreviated(tokens[1])) {
            tokens[1] = `${tokens[1].charAt(0).toUpperCase()}.`;
            current = tokens.join(' ');
            if (current.length <= targetLen) return current;
        }

        // Etapa 15: Suprimir sobrenome terminal
        tokens.splice(1, 1);
        current = tokens[0];
        if (current.length <= targetLen) return current;
    }

    // ─── FASE 5: Abreviação do prenome isolado e monograma bruto ──────────────
    if (tokens.length === 1) {
        const initial = tokens[0].charAt(0).toUpperCase();

        // Etapa 16: Abreviar prenome com ponto (ex: 'Joaquim' -> 'J.')
        current = `${initial}.`;
        if (current.length <= targetLen) return current;

        // Etapa 17: Redução a caractere único / monograma bruto (ex: 'J.' -> 'J')
        current = initial;
        if (current.length <= targetLen) return current;
    }

    if (isForce && targetLen >= 0) return current.slice(0, targetLen);

    return current;
}
