import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRoute, getRouteByName } from './getRoute';
import * as ziggy from 'ziggy-js';
import { ref } from 'vue';

vi.mock('ziggy-js', () => ({
    useRoute: vi.fn()
}));

describe('getRoute', () => {
    let mockRoute: any;
    let mockHas: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockHas = vi.fn();
        mockRoute = vi.fn((name, params) => {
            if (!name) return { has: mockHas };
            return `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`;
        });

        (ziggy.useRoute as any).mockReturnValue(mockRoute);
    });

    it('retorna null se routeName for nulo ou vazio', () => {
        expect(getRoute(null)).toBeNull();
        expect(getRoute('')).toBeNull();
        expect(getRoute('   ')).toBeNull();
    });

    it('funciona com dados nulos (fallback para objeto vazio)', () => {
        mockHas.mockReturnValue(true);
        expect(getRoute('users.index', null)).toBe('https://example.com/users.index');
    });

    it('retorna a rota se ela existir', () => {
        mockHas.mockReturnValue(true);
        const result = getRoute('users.show', { id: 1 });
        expect(mockHas).toHaveBeenCalledWith('users.show');
        expect(result).toBe('https://example.com/users.show/1');
    });

    it('retorna null se a rota não existir', () => {
        mockHas.mockReturnValue(false);
        const result = getRoute('users.show', { id: 1 });
        expect(mockHas).toHaveBeenCalledWith('users.show');
        expect(result).toBeNull();
    });

    it('suporta Ref para routeName', () => {
        mockHas.mockReturnValue(true);
        const routeRef = ref('users.edit');
        const result = getRoute(routeRef, { id: 42 });
        expect(mockHas).toHaveBeenCalledWith('users.edit');
        expect(result).toBe('https://example.com/users.edit/42');
    });

    it('suporta função getter para routeName', () => {
        mockHas.mockReturnValue(true);
        const result = getRoute(() => 'users.index');
        expect(mockHas).toHaveBeenCalledWith('users.index');
        expect(result).toBe('https://example.com/users.index');
    });

    it('getRouteByName é alias de getRoute', () => {
        expect(getRouteByName).toBe(getRoute);
    });
});
