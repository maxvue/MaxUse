import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRoute, getRouteByName } from './getRoute';
import * as config from './config';
import { ref } from 'vue';

vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn()
}));

describe('getRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (config.resolveRoute as any).mockImplementation((name: string, params: any) =>
            `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`
        );
    });

    it('retorna null se routeName for nulo ou vazio', () => {
        expect(getRoute(null)).toBeNull();
        expect(getRoute('')).toBeNull();
        expect(getRoute('   ')).toBeNull();
    });

    it('funciona com dados nulos (fallback para objeto vazio)', () => {
        (config.hasRoute as any).mockReturnValue(true);
        expect(getRoute('users.index', null)).toBe('https://example.com/users.index');
    });

    it('retorna a rota se ela existir', () => {
        (config.hasRoute as any).mockReturnValue(true);
        const result = getRoute('users.show', { id: 1 });
        expect(config.hasRoute).toHaveBeenCalledWith('users.show');
        expect(result).toBe('https://example.com/users.show/1');
    });

    it('retorna null se a rota não existir', () => {
        (config.hasRoute as any).mockReturnValue(false);
        const result = getRoute('users.show', { id: 1 });
        expect(config.hasRoute).toHaveBeenCalledWith('users.show');
        expect(result).toBeNull();
    });

    it('suporta Ref para routeName', () => {
        (config.hasRoute as any).mockReturnValue(true);
        const routeRef = ref('users.edit');
        const result = getRoute(routeRef, { id: 42 });
        expect(config.hasRoute).toHaveBeenCalledWith('users.edit');
        expect(result).toBe('https://example.com/users.edit/42');
    });

    it('suporta função getter para routeName', () => {
        (config.hasRoute as any).mockReturnValue(true);
        const result = getRoute(() => 'users.index');
        expect(config.hasRoute).toHaveBeenCalledWith('users.index');
        expect(result).toBe('https://example.com/users.index');
    });

    it('getRouteByName é alias de getRoute', () => {
        expect(getRouteByName).toBe(getRoute);
    });
});
