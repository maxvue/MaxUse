import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { pickBy } from './pickBy';

describe('pickBy', () => {
    it('mantém as propriedades cujo predicado retorna verdadeiro', () => {
        expect(pickBy({ a: 1, b: 2, c: 3 }, (value: unknown) => (value as number) > 1)).toEqual({ b: 2, c: 3 });
    });

    it('array vira objeto indexado só com os índices que casaram', () => {
        expect(pickBy([10, 20, 30], (value: unknown) => (value as number) > 10)).toEqual({ 1: 20, 2: 30 });
    });

    it('string vira objeto indexado por posição', () => {
        // A assinatura é `T extends object` (igual à do irmão `omitBy`), mas
        // em runtime o helper aceita string como o Lodash — daí o cast.
        expect(pickBy('abc' as unknown as object, (value: unknown) => value !== 'b')).toEqual({ 0: 'a', 2: 'c' });
    });

    it('invoca o predicado com (value, key)', () => {
        expect(pickBy({ a: 1, b: 2 }, (_value: unknown, key: unknown) => key === 'a')).toEqual({ a: 1 });
    });

    it('sem predicado usa identidade e mantém só os valores truthy', () => {
        expect(pickBy({ a: 1, b: 0, c: 2 })).toEqual({ a: 1, c: 2 });
    });

    it('aceita shorthand de string como predicado (property)', () => {
        expect(pickBy({ a: { x: 1 }, b: { x: 0 } }, 'x')).toEqual({ a: { x: 1 } });
    });

    it('aceita shorthand de objeto como predicado (matches)', () => {
        expect(pickBy({ a: { x: 1 }, b: { x: 2 } }, { x: 1 })).toEqual({ a: { x: 1 } });
    });

    it('inclui chaves herdadas, não só as próprias', () => {
        function Foo(this: any) {
            this.a = 1;
        }
        Foo.prototype.b = 2;
        expect(pickBy(new (Foo as any)(), () => true)).toEqual({ a: 1, b: 2 });
    });

    it('retorna objeto vazio para null e undefined', () => {
        expect(pickBy(null, () => true)).toEqual({});
        expect(pickBy(undefined, () => true)).toEqual({});
    });

    it('retorna objeto vazio para objeto vazio', () => {
        expect(pickBy({}, () => true)).toEqual({});
    });

    it('retorna objeto vazio para primitivos', () => {
        expect(pickBy(42 as unknown as object, () => true)).toEqual({});
    });

    it('retorna objeto vazio quando nada casa o predicado', () => {
        expect(pickBy({ a: 1, b: 2 }, () => false)).toEqual({});
    });

    it('não altera o objeto de origem', () => {
        const source = { a: 1, b: 2 };
        pickBy(source, (value: unknown) => (value as number) > 1);
        expect(source).toEqual({ a: 1, b: 2 });
    });

    it('funciona com Ref', () => {
        expect(pickBy(ref({ a: 1, b: 2 }), (value: unknown) => (value as number) > 1)).toEqual({ b: 2 });
    });

    it('reproduz o call site real de getListPlannerListsStore.ts:126 (_.values(_.pickBy(...)))', () => {
        // Formato real: cards_filtered.value é um array de "cards" do planner,
        // cada um com client/solar_company/concessionaire/project aninhados.
        // O predicado é o filtro de busca textual do consumidor, copiado do
        // call site linha a linha.
        const cards_filtered = [
            {
                id: 1,
                client: { name: 'João Silva' },
                solar_company: { company_name: 'Sol Ltda' },
                concessionaire: { name: 'CPFL' },
                project: { consumer_code: '123', installation_code: 'A1' }
            },
            {
                id: 2,
                client: { name: 'Maria Souza' },
                solar_company: { company_name: 'Energia SA' },
                concessionaire: { name: 'Cemig' },
                project: { consumer_code: '456', installation_code: 'B2' }
            },
            {
                id: 3,
                client: { name: 'Pedro Alves' },
                solar_company: { company_name: 'Sol Ltda' },
                concessionaire: { name: 'CPFL' },
                project: { consumer_code: '789', installation_code: 'C3' }
            }
        ];

        const search_lower = 'sol ltda';

        const picked = pickBy(cards_filtered, (card: any) => {
            const client = card.client?.name?.toLowerCase().includes(search_lower);
            const solar_company = card.solar_company?.company_name?.toLowerCase().includes(search_lower);
            const concessionaire = card.concessionaire?.name?.toLowerCase().includes(search_lower);
            const consumer_code = card.project?.consumer_code?.toLowerCase().includes(search_lower);
            const installation_code = card.project?.installation_code?.toLowerCase().includes(search_lower);
            return client || solar_company || concessionaire || consumer_code || installation_code;
        });

        // pickBy sobre um array devolve objeto de chaves numéricas esparsas,
        // preservando os índices originais (0 e 2 casam 'Sol Ltda').
        expect(picked).toEqual({ 0: cards_filtered[0], 2: cards_filtered[2] });
        expect(Array.isArray(picked)).toBe(false);
    });
});
