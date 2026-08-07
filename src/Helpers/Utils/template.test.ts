import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { template } from './template';

describe('template', () => {
    it('interpola valores com <%= %>', () => {
        const compiled = template('hello <%= user %>!');
        expect(compiled({ user: 'fred' })).toBe('hello fred!');
    });

    it('escapa HTML com <%- %>', () => {
        const compiled = template('<%- value %>');
        expect(compiled({ value: '<script>' })).toBe('&lt;script&gt;');
    });

    it('avalia trechos de JavaScript com <% %>', () => {
        const compiled = template('<% if (user) { %>hi <%= user %><% } %>');
        expect(compiled({ user: 'fred' })).toBe('hi fred');
        expect(compiled({ user: null })).toBe('');
    });

    it('combina escape, interpolação e avaliação no mesmo template', () => {
        const compiled = template('<%- a %> <%= b %> <% if(c){ %>yes<% } %>');
        expect(compiled({ a: '<x>', b: 'B', c: true })).toBe('&lt;x&gt; B yes');
    });

    it('template sem delimitadores retorna a string original, com aspas escapadas', () => {
        const compiled = template('it\'s a test');
        expect(compiled({})).toBe('it\'s a test');
    });

    it('suporta delimitadores customizados via options.interpolate', () => {
        const compiled = template('hello {{ user }}!', { interpolate: /{{([\s\S]+?)}}/g });
        expect(compiled({ user: 'fred' })).toBe('hello fred!');
    });

    it('suporta options.variable para evitar with(obj)', () => {
        const compiled = template('<%= data.user %>', { variable: 'data' });
        expect(compiled({ user: 'fred' })).toBe('fred');
    });

    it('suporta options.imports para injetar valores extras no escopo', () => {
        const compiled = template('<%= _.upperCase(name) %>', { imports: { _: { upperCase: (s: string) => s.toUpperCase() } } });
        expect(compiled({ name: 'fred' })).toBe('FRED');
    });

    it('usa escape() da própria MaxUse por padrão (_.escape)', () => {
        const compiled = template('<%- val %>');
        expect(compiled({ val: '&' })).toBe('&amp;');
    });

    it('divergência intencional: o _ padrão só expõe escape, não um objeto lodash completo', () => {
        const compiled = template('<%= typeof _ %>');
        expect(compiled({})).toBe('object');
        const compiledOther = template('<%= _.upperCase("x") %>');
        expect(() => compiledOther({})).toThrow(TypeError);
    });

    it('.source expõe o corpo da função gerada', () => {
        const compiled = template('<%= user %>');
        expect(typeof compiled.source).toBe('string');
        expect(compiled.source).toContain('function');
    });

    it('template com sintaxe inválida em <% %> propaga erro (risco documentado de new Function/CSP)', () => {
        expect(() => template('<% if( %>')).toThrow();
    });

    it('funciona com Ref', () => {
        const compiled = template(ref('hello <%= user %>!'));
        expect(compiled({ user: 'fred' })).toBe('hello fred!');
    });

    it('trata null/undefined como string vazia', () => {
        const compiled = template(null as any);
        expect(compiled({})).toBe('');
    });
});
