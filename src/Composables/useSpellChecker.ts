import { ref, computed, watch, toValue, isRef, getCurrentScope, onScopeDispose, type Ref, type ComputedRef, type MaybeRefOrGetter } from 'vue';
import { escapeRegExp } from '../Helpers/Strings/escapeRegExp';

/**
 * Represents a spelling or terminology error identified in text.
 */
export interface SpellCheckError {
    /** The original word or term detected as having an error */
    word: string;
    /** Character start index in the source string */
    start: number;
    /** Character end index in the source string */
    end: number;
    /** List of correction suggestions */
    suggestions: string[];
}

/**
 * Configuration options for the `useSpellChecker` composable.
 */
export interface UseSpellCheckerOptions {
    /**
     * Debounce time in milliseconds before running the spell check.
     * @default 300
     */
    debounceMs?: number;
    /**
     * Whether to include the specialized solar and electrical engineering dictionary.
     * @default true
     */
    technicalTerms?: boolean;
    /**
     * Additional custom word substitutions (lowercase key -> replacement string or array).
     */
    customDictionary?: Record<string, string | string[]>;
    /**
     * Whether to run the check immediately upon initialization.
     * @default true
     */
    immediate?: boolean;
}

/**
 * Return interface for the `useSpellChecker` composable.
 */
export interface UseSpellCheckerReturn {
    /** Reactive list of errors detected in the current text */
    errors: Ref<SpellCheckError[]>;
    /** Reactive boolean indicating whether any error is present */
    hasErrors: ComputedRef<boolean>;
    /** Computed dictionary mapping misspelled words to replacement suggestions */
    suggestions: ComputedRef<Record<string, string[]>>;
    /** Runs spell check immediately and returns detected errors */
    checkNow: () => Promise<SpellCheckError[]>;
    /** Returns corrected text applying top suggestions */
    getCorrectedText: (input?: string) => string;
    /** Alias for getCorrectedText */
    correctText: (input?: string) => string;
    /** Replaces a specific misspelled word in reactive source */
    applySuggestion: (word: string, replacement: string) => string;
}

/**
 * Dicionário de termos técnicos de engenharia fotovoltaica e elétrica (pt-BR).
 */
const TECHNICAL_DICTIONARY: Record<string, string | string[]> = {
    // Termos de Homologação e Concessionárias
    homologacao: 'homologação',
    omologacao: 'homologação',
    homologacoes: 'homologações',
    consessionaria: 'concessionária',
    concesionaria: 'concessionária',
    concessionaria: 'concessionária',
    concessionarias: 'concessionárias',
    consessionarias: 'concessionárias',
    subestacao: 'subestação',
    subestacoes: 'subestações',
    solicitacao: 'solicitação',
    solicitacoes: 'solicitações',
    aprovacao: 'aprovação',
    aprovacoes: 'aprovações',
    reprovacao: 'reprovação',
    reprovacoes: 'reprovações',
    pendencia: 'pendência',
    pendencias: 'pendências',
    retificacao: 'retificação',
    retificacoes: 'retificações',

    // Componentes Solares e Elétricos
    fotovoutaico: 'fotovoltaico',
    fotovoutaica: 'fotovoltaica',
    fotovoutaicos: 'fotovoltaicos',
    fotovoutaicas: 'fotovoltaicas',
    fotovotaico: 'fotovoltaico',
    fotovotaica: 'fotovoltaica',
    fotovotaicos: 'fotovoltaicos',
    fotovotaicas: 'fotovoltaicas',
    fotovoltayco: 'fotovoltaico',
    fotovoltayca: 'fotovoltaica',
    enversor: 'inversor',
    enversores: 'inversores',
    microinversor: 'microinversor',
    'micro-inversor': 'microinversor',
    microinversores: 'microinversores',
    'micro-inversores': 'microinversores',
    stringbox: 'stringbox',
    'string-box': 'stringbox',
    ateramento: 'aterramento',
    ateramentos: 'aterramentos',
    disjutor: 'disjuntor',
    disjutores: 'disjuntores',
    modulo: 'módulo',
    modulos: 'módulos',
    paineis: 'painéis',
    padrao: 'padrão',
    padroes: 'padrões',
    fusivel: 'fusível',
    fusiveis: 'fusíveis',
    transformador: 'transformador',
    transformadores: 'transformadores',

    // Grandezas e Fenômenos
    tensao: 'tensão',
    tensoes: 'tensões',
    sobretensao: 'sobretensão',
    subtensao: 'subtensão',
    potencia: 'potência',
    potencias: 'potências',
    geracao: 'geração',
    geracoes: 'gerações',
    microgeracao: 'microgeração',
    minigeracao: 'minigeração',
    distribuicao: 'distribuição',
    distribuicoes: 'distribuições',
    compensacao: 'compensação',
    compensacoes: 'compensações',
    eletrica: 'elétrica',
    eletrico: 'elétrico',
    eletricas: 'elétricas',
    eletricos: 'elétricos',
    irradiancia: 'irradiância',
    inclinacao: 'inclinação',
    orientacao: 'orientação',
    conexao: 'conexão',
    conexoes: 'conexões',
    medicao: 'medição',
    eficiencia: 'eficiência',

    // Documentação Técnica
    instalacao: 'instalação',
    instalacoes: 'instalações',
    relatorio: 'relatório',
    relatorios: 'relatórios',
    orcamento: 'orçamento',
    orcamentos: 'orçamentos',
    servico: 'serviço',
    servicos: 'serviços',
    observacao: 'observação',
    observacoes: 'observações',
    descricao: 'descrição',
    descricoes: 'descrições',
    informacao: 'informação',
    informacoes: 'informações',
    documentacao: 'documentação',
    especificacao: 'especificação',
    especificacoes: 'especificações',
    configuracao: 'configuração',
    configuracoes: 'configurações',
    validacao: 'validação',
    validacoes: 'validações',

    // Siglas do Setor
    art: 'ART',
    rtd: 'RTD',
    trt: 'TRT',
    crea: 'CREA',
    cft: 'CFT',
    aneel: 'ANEEL',
    inmetro: 'INMETRO',
    kwp: 'kWp',
    kwh: 'kWh',
    mwh: 'MWh',
    kva: 'kVA',
    dps: 'DPS'
};

/**
 * Dicionário de palavras e erros ortográficos comuns em Português Brasileiro (pt-BR).
 */
const COMMON_PTBR_DICTIONARY: Record<string, string | string[]> = {
    nao: 'não',
    sao: 'são',
    estao: 'estão',
    estara: 'estará',
    sera: 'será',
    serao: 'serão',
    tambem: 'também',
    voce: 'você',
    voces: 'vocês',
    ja: 'já',
    ate: 'até',
    so: 'só',
    alem: 'além',
    atraves: 'através',
    apos: 'após',
    entao: 'então',
    acao: 'ação',
    acoes: 'ações',
    opcao: 'opção',
    opcoes: 'opções',
    situacao: 'situação',
    situacoes: 'situações',
    condicao: 'condição',
    condicoes: 'condições',
    funcao: 'função',
    funcoes: 'funções',
    producao: 'produção',
    alteracao: 'alteração',
    alteracoes: 'alterações',
    finalizacao: 'finalização',
    autorizacao: 'autorização',
    manutencao: 'manutenção',
    execucao: 'execução',
    conclusao: 'conclusão',
    precisao: 'precisão',
    decisao: 'decisão',
    emissao: 'emissão',
    transmissao: 'transmissão',
    avaliacao: 'avaliação',
    avaliacoes: 'avaliações',
    notificacao: 'notificação',
    notificacoes: 'notificações',
    publicacao: 'publicação',
    publicacoes: 'publicações',
    verificacao: 'verificação',
    verificacoes: 'verificações',
    otimizacao: 'otimização',
    comunicacao: 'comunicação',
    atencao: 'atenção',
    padronizacao: 'padronização',
    correcao: 'correção',
    correcoes: 'correções',
    infracao: 'infração',
    obrigacao: 'obrigação',
    obrigacoes: 'obrigações',
    duvida: 'dúvida',
    duvidas: 'dúvidas',
    facil: 'fácil',
    dificil: 'difícil',
    possivel: 'possível',
    possiveis: 'possíveis',
    necessario: 'necessário',
    necessaria: 'necessária',
    necessarios: 'necessários',
    necessarias: 'necessárias',
    proprio: 'próprio',
    propria: 'própria',
    proprios: 'próprios',
    proprias: 'próprias',
    horario: 'horário',
    horarios: 'horários',
    previo: 'prévio',
    previa: 'prévia',
    minimo: 'mínimo',
    maximo: 'máximo',
    periodo: 'período',
    historico: 'histórico',
    publico: 'público',
    tecnico: 'técnico',
    tecnica: 'técnica',
    tecnicos: 'técnicos',
    tecnicas: 'técnicas',
    basico: 'básico',
    basica: 'básica',
    pratico: 'prático',
    automatico: 'automático',
    automatica: 'automática',
    rapido: 'rápido',
    rapida: 'rápida',
    otimo: 'ótimo',
    otima: 'ótima',
    pagina: 'página',
    paginas: 'páginas',
    ultimo: 'último',
    ultima: 'última',
    ultimos: 'últimos',
    ultimas: 'últimas',
    unico: 'único',
    unica: 'única',
    unicos: 'únicos',
    unicas: 'únicas',
    indice: 'índice',
    indices: 'índices',
    analise: 'análise',
    analises: 'análises',
    calculo: 'cálculo',
    calculos: 'cálculos',
    grafico: 'gráfico',
    graficos: 'gráficos',
    area: 'área',
    areas: 'áreas',
    saida: 'saída',
    saidas: 'saídas',
    conteudo: 'conteúdo',
    conteudos: 'conteúdos',
    saude: 'saúde',
    bau: 'baú',
    pais: 'país',
    paises: 'países',
    mes: 'mês',
    tres: 'três',
    pos: 'pós',
    pre: 'pré',
    endereco: 'endereço',
    enderecos: 'endereços',
    municipio: 'município',
    municipios: 'municípios',
    numero: 'número',
    numeros: 'números',
    codigo: 'código',
    codigos: 'códigos',
    usuario: 'usuário',
    usuarios: 'usuários',
    relacao: 'relação'
};

/**
 * Matches the casing pattern of an original word onto a replacement word.
 *
 * @param original - The original source word to detect casing from.
 * @param replacement - The replacement word to format.
 * @returns The replacement word with matched casing (uppercase, capitalized, or lowercase).
 */
export function matchCasing(original: string, replacement: string): string {
    if (!original || !replacement) return replacement;

    // All uppercase (e.g. INSTALACAO -> INSTALAÇÃO)
    if (original === original.toUpperCase() && original !== original.toLowerCase()) return replacement.toUpperCase();

    // Capitalized (e.g. Instalacao -> Instalação)
    if (original[0] === original[0].toUpperCase() && original.slice(1) === original.slice(1).toLowerCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);

    return replacement;
}

/**
 * Reactive composable for real-time spell checking and terminology assistance.
 * Includes Brazilian Portuguese common misspellings and specialized solar/electrical engineering terminology.
 *
 * @param source - Text string or reactive Ref/getter to check.
 * @param options - Configuration options (debounce, custom dictionary, technical terms).
 * @returns An object containing reactive errors, suggestions, and auto-correction helpers.
 *
 * @example
 * ```typescript
 * const text = ref('homologacao na consessionaria');
 * const { errors, getCorrectedText, checkNow } = useSpellChecker(text, { debounceMs: 300 });
 *
 * // getCorrectedText() -> 'homologação na concessionária'
 * ```
 */
export function useSpellChecker(
    source: MaybeRefOrGetter<string | null | undefined>,
    options: UseSpellCheckerOptions = {}
): UseSpellCheckerReturn {
    const {
        debounceMs = 300,
        technicalTerms = true,
        customDictionary = {},
        immediate = true
    } = options;

    const errors = ref<SpellCheckError[]>([]);

    // Monta o dicionário consolidado
    const activeDictionary = computed(() => {
        const dict: Record<string, string | string[]> = {
            ...COMMON_PTBR_DICTIONARY
        };

        if (technicalTerms) Object.assign(dict, TECHNICAL_DICTIONARY);


        if (customDictionary) Object.assign(dict, customDictionary);


        return dict;
    });

    /**
     * Analisa uma string e identifica os erros ortográficos e termos corrigíveis.
     */
    const checkText = (text: string): SpellCheckError[] => {
        if (!text || typeof text !== 'string') return [];

        const dict = activeDictionary.value;
        const foundErrors: SpellCheckError[] = [];
        const regex = /[a-zA-ZÀ-ÖØ-öø-ÿ0-9]+(?:-[a-zA-ZÀ-ÖØ-öø-ÿ0-9]+)*/g;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
            const rawWord = match[0];
            const start = match.index;
            const end = start + rawWord.length;
            const lower = rawWord.toLowerCase();

            const target = dict[lower];
            if (target) {
                const primary = Array.isArray(target) ? target[0] : target;
                const formattedPrimary = matchCasing(rawWord, primary);

                // Se a palavra original for diferente da sugestão correta
                if (rawWord !== formattedPrimary) {
                    const rawSuggestions = Array.isArray(target) ? target : [target];
                    const suggestions = rawSuggestions.map((s) => matchCasing(rawWord, s));

                    foundErrors.push({
                        word: rawWord,
                        start,
                        end,
                        suggestions
                    });
                }
            }
        }

        return foundErrors;
    };

    /**
     * Executa a análise no texto atual e atualiza a ref de erros.
     */
    const runCheck = (): SpellCheckError[] => {
        const raw = toValue(source);
        const result = checkText(raw ?? '');
        errors.value = result;
        return result;
    };

    let timer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Força a execução imediata da verificação ortográfica.
     */
    const checkNow = async (): Promise<SpellCheckError[]> => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        return runCheck();
    };

    // Watcher reativo com suporte a debounce
    watch(
        () => toValue(source),
        () => {
            if (debounceMs <= 0) runCheck();
            else {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                    runCheck();
                    timer = null;
                }, debounceMs);
            }
        },
        { immediate }
    );

    if (getCurrentScope()) onScopeDispose(() => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    });


    const hasErrors = computed(() => errors.value.length > 0);

    const suggestions = computed(() => {
        const map: Record<string, string[]> = {};
        for (const err of errors.value) map[err.word] = err.suggestions;

        return map;
    });

    /**
     * Retorna o texto original com todas as correções sugeridas aplicadas.
     */
    const getCorrectedText = (input?: string): string => {
        const raw = input !== undefined ? input : toValue(source);
        if (!raw || typeof raw !== 'string') return raw ?? '';

        const foundErrors = checkText(raw);
        if (foundErrors.length === 0) return raw;

        // Substituição de trás para frente para preservar índices de corte da string
        let result = raw;
        const sorted = [...foundErrors].sort((a, b) => b.start - a.start);
        for (const err of sorted) if (err.suggestions.length > 0) {
            const bestSuggestion = err.suggestions[0];
            result = result.slice(0, err.start) + bestSuggestion + result.slice(err.end);
        }


        return result;
    };

    /**
     * Aplica uma substituição para uma palavra específica no texto.
     */
    const applySuggestion = (word: string, replacement: string): string => {
        const raw = toValue(source);
        if (!raw || typeof raw !== 'string') return raw ?? '';
        if (!word || typeof word !== 'string') return raw;

        const prefix = '(?<![\\p{L}\\p{N}])';
        const suffix = '(?![\\p{L}\\p{N}])';

        const regex = new RegExp(`${prefix}${escapeRegExp(word)}${suffix}`, 'gu');
        const updated = raw.replace(regex, () => replacement);

        if (isRef(source)) (source as Ref<string | null | undefined>).value = updated;

        runCheck();
        return updated;
    };

    return {
        errors,
        hasErrors,
        suggestions,
        checkNow,
        getCorrectedText,
        correctText: getCorrectedText,
        applySuggestion
    };
}
