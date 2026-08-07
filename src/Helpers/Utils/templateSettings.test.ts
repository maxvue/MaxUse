import { describe, it, expect } from 'vitest';
import { templateSettings } from './templateSettings';

describe('templateSettings', () => {
    it('expõe as regex de escape, evaluate e interpolate', () => {
        expect(templateSettings.escape).toBeInstanceOf(RegExp);
        expect(templateSettings.evaluate).toBeInstanceOf(RegExp);
        expect(templateSettings.interpolate).toBeInstanceOf(RegExp);
    });

    it('reconhece o delimitador de escape <%- %>', () => {
        expect('<%- value %>').toMatch(templateSettings.escape);
    });

    it('reconhece o delimitador de interpolação <%= %>', () => {
        expect('<%= value %>').toMatch(templateSettings.interpolate);
    });

    it('reconhece o delimitador de avaliação <% %>', () => {
        expect('<% if (x) { %>').toMatch(templateSettings.evaluate);
    });

    it('variable começa vazia', () => {
        expect(templateSettings.variable).toBe('');
    });

    it('imports começa como objeto vazio', () => {
        expect(templateSettings.imports).toEqual({});
    });

    it('é mutável — pode ser customizado globalmente', () => {
        const original = templateSettings.interpolate;
        templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;
        expect(templateSettings.interpolate.source).toContain('\\{\\{');
        templateSettings.interpolate = original;
    });
});
