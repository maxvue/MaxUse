import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { values } from './values';
import { pickBy } from './pickBy';

describe('values', () => {
    it('retorna os valores de um objeto', () => {
        expect(values({ a: 1, b: 2 })).toEqual([1, 2]);
    });

    it('retorna os valores de um array', () => {
        expect(values([10, 20, 30])).toEqual([10, 20, 30]);
    });

    it('string vira array de caracteres', () => {
        expect(values('abc')).toEqual(['a', 'b', 'c']);
    });

    it('só considera chaves próprias, não herdadas', () => {
        function Foo(this: any) {
            this.a = 1;
        }
        Foo.prototype.b = 2;
        expect(values(new (Foo as any)())).toEqual([1]);
    });

    it('retorna vazio para null', () => {
        expect(values(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(values(undefined)).toEqual([]);
    });

    it('retorna vazio para primitivos (número, booleano)', () => {
        expect(values(1)).toEqual([]);
        expect(values(true)).toEqual([]);
    });

    it('retorna vazio para objeto vazio ou array vazio', () => {
        expect(values({})).toEqual([]);
        expect(values([])).toEqual([]);
    });

    it('array com buracos retorna undefined nas posições vazias', () => {

        expect(values([1, , 3])).toEqual([1, undefined, 3]);
    });

    it('objeto array-like (com length numérico) segue a mesma leitura de índices do keys()', () => {
        // keys() trata objetos com "length" numérico como array-like e lê só
        // os índices 0..length-1 (aqui, não inclui a própria chave "length"
        // no resultado) — values() precisa ser consistente com esse keys(),
        // não com o Object.keys() puro do Lodash.
        expect(values({ 0: 'x', 1: 'y', length: 2 })).toEqual(['x', 'y']);
    });

    it('objeto com chaves numéricas esparsas (resultado típico de pickBy) mantém a ordem das chaves', () => {
        expect(values({ 0: { a: 1 }, 2: { a: 3 } })).toEqual([{ a: 1 }, { a: 3 }]);
    });

    it('funciona com Ref', () => {
        expect(values(ref({ x: 1, y: 2 }))).toEqual([1, 2]);
    });

    it('reproduz o call site real de getListPlannerListsStore.ts:126 (_.values(_.pickBy(...)))', () => {
        // Formato real: cards_filtered.value é um array de "cards" do planner,
        // cada um com client/solar_company/concessionaire/project aninhados.
        // `pickBy` já foi migrado (src/Helpers/Objects/pickBy.ts) — a chamada
        // abaixo usa a implementação própria da MaxUse, encadeada exatamente
        // como o call site real: values(pickBy(cards_filtered, predicado)).
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

        const matches = (card: any) => {
            const client = card.client?.name?.toLowerCase().includes(search_lower);
            const solar_company = card.solar_company?.company_name?.toLowerCase().includes(search_lower);
            const concessionaire = card.concessionaire?.name?.toLowerCase().includes(search_lower);
            const consumer_code = card.project?.consumer_code?.toLowerCase().includes(search_lower);
            const installation_code = card.project?.installation_code?.toLowerCase().includes(search_lower);
            return client || solar_company || concessionaire || consumer_code || installation_code;
        };

        const filtered = values(pickBy(cards_filtered as unknown as Record<string, unknown>, matches));

        // values() precisa devolver um array denso, na ordem das chaves do
        // objeto pickBy-shaped ({0: card1, 2: card3} → [card1, card3]).
        expect(filtered).toEqual([cards_filtered[0], cards_filtered[2]]);
        expect(Array.isArray(filtered)).toBe(true);
    });
});
