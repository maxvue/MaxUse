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
});
