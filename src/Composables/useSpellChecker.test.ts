import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ref, effectScope } from 'vue';
import { useSpellChecker, matchCasing } from './useSpellChecker';

describe('useSpellChecker Composable', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
    });

    it('identifica erros ortográficos e sugere correções', async () => {
        await scope.run(async () => {
            const text = ref('instalacao de painel fotovoutaico');
            const { errors, checkNow, hasErrors } = useSpellChecker(text, { debounceMs: 0 });
            await checkNow();

            expect(hasErrors.value).toBe(true);
            expect(errors.value.length).toBe(2);
            expect(errors.value[0].word).toBe('instalacao');
            expect(errors.value[0].suggestions).toContain('instalação');
            expect(errors.value[1].word).toBe('fotovoutaico');
            expect(errors.value[1].suggestions).toContain('fotovoltaico');
        });
    });

    it('corrige automaticamente termos técnicos conhecidos', async () => {
        await scope.run(async () => {
            const text = ref('homologacao na consessionaria');
            const { getCorrectedText, checkNow } = useSpellChecker(text, { debounceMs: 0 });
            await checkNow();
            const corrected = getCorrectedText();
            expect(corrected).toBe('homologação na concessionária');
        });
    });

    it('preserva a capitalização das palavras corrigidas', () => {
        expect(matchCasing('INSTALACAO', 'instalação')).toBe('INSTALAÇÃO');
        expect(matchCasing('Homologacao', 'homologação')).toBe('Homologação');
        expect(matchCasing('fotovoutaico', 'fotovoltaico')).toBe('fotovoltaico');
    });

    it('permite aplicar sugestão diretamente', async () => {
        await scope.run(async () => {
            const text = ref('troca de disjutor');
            const { applySuggestion, checkNow, errors } = useSpellChecker(text, { debounceMs: 0 });
            await checkNow();

            expect(errors.value.length).toBe(1);
            const updated = applySuggestion('disjutor', 'disjuntor');

            expect(updated).toBe('troca de disjuntor');
            expect(text.value).toBe('troca de disjuntor');
            expect(errors.value.length).toBe(0);
        });
    });

    it('suporta dicionário customizado e opções de termos técnicos', async () => {
        await scope.run(async () => {
            const text = ref('customterm test');
            const { errors, getCorrectedText, checkNow } = useSpellChecker(text, {
                debounceMs: 0,
                customDictionary: {
                    customterm: 'CustomTerm'
                }
            });
            await checkNow();

            expect(errors.value.length).toBe(1);
            expect(getCorrectedText()).toBe('CustomTerm test');
        });
    });

    it('aplica sugestão com caracteres especiais de regex sem lançar SyntaxError', async () => {
        await scope.run(async () => {
            const text = ref('Termo C++ inválido e biblioteca A+');
            const { applySuggestion, checkNow } = useSpellChecker(text, { debounceMs: 0 });
            await checkNow();

            expect(() => {
                applySuggestion('C++', 'C#');
            }).not.toThrow();

            expect(text.value).toBe('Termo C# inválido e biblioteca A+');

            // Teste com outros caracteres reservados de regex
            const textSymbols = ref('teste [tag] e valor (calc) com a*b');
            const sc = useSpellChecker(textSymbols, { debounceMs: 0 });
            sc.applySuggestion('[tag]', '[label]');
            sc.applySuggestion('(calc)', '(resultado)');
            sc.applySuggestion('a*b', 'a_b');
            expect(textSymbols.value).toBe('teste [label] e valor (resultado) com a_b');

            // Guard clause para word vazio ou inválido
            sc.applySuggestion('', 'algo');
            // @ts-expect-error teste defensivo com tipo inválido
            sc.applySuggestion(null, 'algo');
            expect(textSymbols.value).toBe('teste [label] e valor (resultado) com a_b');
        });
    });

    it('aplica sugestão em palavras com caracteres acentuados no início, meio e fim', async () => {
        await scope.run(async () => {
            const text = ref('órgão regulador comprou maçã e café na feira');
            const { applySuggestion } = useSpellChecker(text, { debounceMs: 0 });

            // Palavra iniciando com acento
            applySuggestion('órgão', 'entidade');
            expect(text.value).toBe('entidade regulador comprou maçã e café na feira');

            // Palavra terminando com acento
            applySuggestion('maçã', 'banana');
            expect(text.value).toBe('entidade regulador comprou banana e café na feira');

            applySuggestion('café', 'chá');
            expect(text.value).toBe('entidade regulador comprou banana e chá na feira');
        });
    });

    it('respeita limites de palavra para termos acentuados e caracteres especiais', async () => {
        await scope.run(async () => {
            const text = ref('uma maçã e duas maçãs; versão C++ e C++20');
            const { applySuggestion } = useSpellChecker(text, { debounceMs: 0 });

            applySuggestion('maçã', 'pera');
            expect(text.value).toBe('uma pera e duas maçãs; versão C++ e C++20');

            applySuggestion('C++', 'Rust');
            expect(text.value).toBe('uma pera e duas maçãs; versão Rust e C++20');
        });
    });

    it('substitui com segurança quando replacement contém padrões de cifrão', async () => {
        await scope.run(async () => {
            const text = ref('o preco total era valor');
            const { applySuggestion } = useSpellChecker(text, { debounceMs: 0 });

            applySuggestion('valor', '$100 e $& bônus');
            expect(text.value).toBe('o preco total era $100 e $& bônus');
        });
    });
});
