import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { keyExists } from './keyExists';

describe('keyExists', () => {
    const obj = { a: { b: { c: 42 } }, name: 'test', arr: [1, 2, 3], empty: null };

    // === Chave única (string) ===
    it('retorna true para chave simples existente', () => {
        expect(keyExists('name', obj)).toBe(true);
    });

    it('retorna false para chave simples inexistente', () => {
        expect(keyExists('inexistente', obj)).toBe(false);
    });

    // Dot notation
    it('retorna true para chave aninhada existente (dot notation)', () => {
        expect(keyExists('a.b.c', obj)).toBe(true);
    });

    it('retorna true para chave intermediária existente', () => {
        expect(keyExists('a.b', obj)).toBe(true);
    });

    it('retorna false quando nível intermediário não existe', () => {
        expect(keyExists('a.x.c', obj)).toBe(false);
    });

    it('retorna false quando nível intermediário é null', () => {
        expect(keyExists('empty.something', obj)).toBe(false);
    });

    // Notação de colchetes
    it('suporta notação de colchetes', () => {
        expect(keyExists('arr[0]', obj)).toBe(true);
    });

    // Não-objetos retornam false
    it('retorna false para item null', () => {
        expect(keyExists('key', null)).toBe(false);
    });

    it('retorna false para item undefined', () => {
        expect(keyExists('key', undefined)).toBe(false);
    });

    it('retorna false para item string', () => {
        expect(keyExists('key', 'texto')).toBe(false);
    });

    it('retorna false para item number', () => {
        expect(keyExists('key', 123)).toBe(false);
    });

    it('retorna false para item array', () => {
        expect(keyExists('key', [1, 2, 3])).toBe(false);
    });

    // Reatividade
    it('funciona com item como Ref', () => {
        expect(keyExists('a.b.c', ref(obj))).toBe(true);
    });

    it('funciona com key como Ref', () => {
        expect(keyExists(ref('a.b.c'), obj)).toBe(true);
    });

    it('funciona com ambos como Ref', () => {
        expect(keyExists(ref('name'), ref(obj))).toBe(true);
    });

    it('funciona com item como Getter', () => {
        expect(keyExists('a.b.c', () => obj)).toBe(true);
    });

    it('funciona com key como Getter', () => {
        expect(keyExists(() => 'a.b.c', obj)).toBe(true);
    });

    // Valores com valor undefined/null devem retornar true (a chave existe)
    it('retorna true quando a chave existe mas o valor é null', () => {
        expect(keyExists('empty', obj)).toBe(true);
    });

    it('retorna true quando a chave existe mas o valor é undefined', () => {
        const data = { key: undefined };
        expect(keyExists('key', data)).toBe(true);
    });

    // === Array de keys — mode: 'some' (padrão) ===
    describe('mode some (padrão)', () => {
        it('retorna true quando pelo menos uma key existe', () => {
            expect(keyExists(['name', 'inexistente'], obj)).toBe(true);
        });

        it('retorna false quando nenhuma key existe', () => {
            expect(keyExists(['x', 'y', 'z'], obj)).toBe(false);
        });

        it('retorna false para array vazio', () => {
            expect(keyExists([], obj)).toBe(false);
        });

        it('suporta dot notation no array', () => {
            expect(keyExists(['a.b.c', 'x.y'], obj)).toBe(true);
        });

        it('funciona com array como Ref', () => {
            expect(keyExists(ref(['name', 'inexistente']), obj)).toBe(true);
        });

        it('funciona com array como Getter', () => {
            expect(keyExists(() => ['name', 'inexistente'], obj)).toBe(true);
        });
    });

    // === Array de keys — mode: 'every' ===
    describe('mode every', () => {
        it('retorna true quando todas as keys existem', () => {
            expect(keyExists(['name', 'a', 'arr'], obj, 'every')).toBe(true);
        });

        it('retorna false quando uma key não existe', () => {
            expect(keyExists(['name', 'inexistente'], obj, 'every')).toBe(false);
        });

        it('retorna false para array vazio', () => {
            expect(keyExists([], obj, 'every')).toBe(false);
        });

        it('suporta dot notation no array', () => {
            expect(keyExists(['a.b.c', 'a.b'], obj, 'every')).toBe(true);
        });

        it('retorna false com dot notation quando uma não existe', () => {
            expect(keyExists(['a.b.c', 'a.x.z'], obj, 'every')).toBe(false);
        });

        it('funciona com array como Ref', () => {
            expect(keyExists(ref(['name', 'a']), obj, 'every')).toBe(true);
        });
    });
});
