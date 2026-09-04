import { describe, expect, it } from 'vitest';
import { ref, computed } from 'vue';
import { abbrevName } from './abbrevName';

describe('abbrevName', () => {
    const FULL_NAME = 'Joaquim Pereira das Graças Gomes de Melo Sousa e Silva';

    describe('progressão determinística em 17 etapas', () => {
        it('etapa 0: retorna nome original se couber no target ou sem target', () => {
            expect(abbrevName(FULL_NAME)).toBe(FULL_NAME);
            expect(abbrevName(FULL_NAME, 100)).toBe(FULL_NAME);
            expect(abbrevName(FULL_NAME, 55)).toBe(FULL_NAME);
        });

        it('etapa 1: supressão do primeiro conectivo/preposição ("das")', () => {
            const expected = 'Joaquim Pereira Graças Gomes de Melo Sousa e Silva';
            expect(abbrevName(FULL_NAME, 51)).toBe(expected);
        });

        it('etapa 2: supressão do segundo conectivo/preposição ("de")', () => {
            const expected = 'Joaquim Pereira Graças Gomes Melo Sousa e Silva';
            expect(abbrevName(FULL_NAME, 48)).toBe(expected);
        });

        it('etapa 3: supressão do terceiro conectivo/conjunção ("e")', () => {
            const expected = 'Joaquim Pereira Graças Gomes Melo Sousa Silva';
            expect(abbrevName(FULL_NAME, 46)).toBe(expected);
        });

        it('etapa 4: abreviação do primeiro sobrenome intermediário ("Pereira" -> "P.")', () => {
            const expected = 'Joaquim P. Graças Gomes Melo Sousa Silva';
            expect(abbrevName(FULL_NAME, 41)).toBe(expected);
        });

        it('etapa 5: abreviação do segundo sobrenome intermediário ("Graças" -> "G.")', () => {
            const expected = 'Joaquim P. G. Gomes Melo Sousa Silva';
            expect(abbrevName(FULL_NAME, 37)).toBe(expected);
        });

        it('etapa 6: abreviação do terceiro sobrenome intermediário ("Gomes" -> "G.")', () => {
            const expected = 'Joaquim P. G. G. Melo Sousa Silva';
            expect(abbrevName(FULL_NAME, 34)).toBe(expected);
        });

        it('etapa 7: abreviação do quarto sobrenome intermediário ("Melo" -> "M.")', () => {
            const expected = 'Joaquim P. G. G. M. Sousa Silva';
            expect(abbrevName(FULL_NAME, 32)).toBe(expected);
        });

        it('etapa 8: abreviação do quinto sobrenome intermediário ("Sousa" -> "S.")', () => {
            const expected = 'Joaquim P. G. G. M. S. Silva';
            expect(abbrevName(FULL_NAME, 29)).toBe(expected);
        });

        it('etapa 9: supressão da primeira inicial intermediária ("P.")', () => {
            const expected = 'Joaquim G. G. M. S. Silva';
            expect(abbrevName(FULL_NAME, 26)).toBe(expected);
        });

        it('etapa 10: supressão da segunda inicial intermediária ("G.")', () => {
            const expected = 'Joaquim G. M. S. Silva';
            expect(abbrevName(FULL_NAME, 23)).toBe(expected);
        });

        it('etapa 11: supressão da terceira inicial intermediária ("G.")', () => {
            const expected = 'Joaquim M. S. Silva';
            expect(abbrevName(FULL_NAME, 20)).toBe(expected);
        });

        it('etapa 12: supressão da quarta inicial intermediária ("M.")', () => {
            const expected = 'Joaquim S. Silva';
            expect(abbrevName(FULL_NAME, 17)).toBe(expected);
        });

        it('etapa 13: supressão da última inicial intermediária ("S.")', () => {
            const expected = 'Joaquim Silva';
            expect(abbrevName(FULL_NAME, 13)).toBe(expected);
        });

        it('etapa 14: abreviação do sobrenome terminal ("Silva" -> "S.")', () => {
            const expected = 'Joaquim S.';
            expect(abbrevName(FULL_NAME, 10)).toBe(expected);
        });

        it('etapa 15: supressão do sobrenome terminal abreviado ("S.")', () => {
            const expected = 'Joaquim';
            expect(abbrevName(FULL_NAME, 7)).toBe(expected);
        });

        it('etapa 16: abreviação do prenome isolado ("Joaquim" -> "J.")', () => {
            const expected = 'J.';
            expect(abbrevName(FULL_NAME, 2)).toBe(expected);
        });

        it('etapa 17: redução a monograma bruto sem ponto ("J")', () => {
            const expected = 'J';
            expect(abbrevName(FULL_NAME, 1, true)).toBe(expected);
            expect(abbrevName(FULL_NAME, 1)).toBe(expected);
        });
    });

    describe('casos comuns e regras de nomes variados', () => {
        it('abrevia nome simples de duas palavras', () => {
            const name = 'João Silva';
            expect(abbrevName(name, 10)).toBe('João Silva');
            expect(abbrevName(name, 8)).toBe('João S.');
            expect(abbrevName(name, 5)).toBe('João');
            expect(abbrevName(name, 2)).toBe('J.');
            expect(abbrevName(name, 1)).toBe('J');
        });

        it('abrevia nome com conectivos simples ("da", "de", "do")', () => {
            const name = 'Carlos Eduardo de Souza';
            expect(abbrevName(name, 23)).toBe('Carlos Eduardo de Souza');
            expect(abbrevName(name, 20)).toBe('Carlos Eduardo Souza');
            expect(abbrevName(name, 15)).toBe('Carlos E. Souza');
            expect(abbrevName(name, 12)).toBe('Carlos Souza');
            expect(abbrevName(name, 9)).toBe('Carlos S.');
            expect(abbrevName(name, 6)).toBe('Carlos');
            expect(abbrevName(name, 2)).toBe('C.');
            expect(abbrevName(name, 1)).toBe('C');
        });

        it('lida com nome único (monônimo)', () => {
            const name = 'Maria';
            expect(abbrevName(name, 10)).toBe('Maria');
            expect(abbrevName(name, 5)).toBe('Maria');
            expect(abbrevName(name, 4)).toBe('M.');
            expect(abbrevName(name, 2)).toBe('M.');
            expect(abbrevName(name, 1)).toBe('M');
        });

        it('lida com acentuação e caracteres especiais', () => {
            expect(abbrevName('Álvaro das Graças', 10)).toBe('Álvaro G.');
            expect(abbrevName('Érica Silva', 2)).toBe('É.');
            expect(abbrevName('Ícaro Gomes', 1)).toBe('Í');
        });

        it('lida com múltiplos espaços no texto', () => {
            expect(abbrevName('  João   da   Silva  ', 10)).toBe('João Silva');
        });
    });

    describe('parâmetro force e valores extremos', () => {
        it('com force = true corta estritamente quando target for 0', () => {
            expect(abbrevName('João Silva', 0, true)).toBe('');
        });

        it('com force = false mantém a unidade mínima quando target for 0', () => {
            expect(abbrevName('João Silva', 0, false)).toBe('J');
        });

        it('aceita target como string numérica', () => {
            expect(abbrevName('João Silva', '8')).toBe('João S.');
        });
    });

    describe('valores vazios e tipos inválidos', () => {
        it('retorna string vazia para valores nulos ou vazios', () => {
            expect(abbrevName('')).toBe('');
            expect(abbrevName(null)).toBe('');
            expect(abbrevName(undefined)).toBe('');
            expect(abbrevName('   ')).toBe('');
        });
    });

    describe('reatividade Vue (MaybeRefOrGetter)', () => {
        it('suporta Ref e Computed', () => {
            const nameRef = ref('Joaquim Pereira das Graças Gomes de Melo Sousa e Silva');
            const targetRef = ref(10);
            const forceRef = ref(false);

            const result = computed(() => abbrevName(nameRef, targetRef, forceRef));
            expect(result.value).toBe('Joaquim S.');

            targetRef.value = 13;
            expect(result.value).toBe('Joaquim Silva');

            targetRef.value = 1;
            expect(result.value).toBe('J');

            nameRef.value = 'Maria Santos';
            expect(result.value).toBe('M');
        });
    });
});
