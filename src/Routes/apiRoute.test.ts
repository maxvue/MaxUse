import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiRoute } from './apiRoute';
import * as config from './config';

vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn()
}));

describe('apiRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (config.resolveRoute as any).mockImplementation((name: string, params: any) =>
            `https://example.com/${name}${params && Object.keys(params).length ? '/' + params.id : ''}`
        );
    });

    it('retorna null se RouteName for nulo', () => {
        const result = apiRoute(null);
        expect(result).toBeNull();
    });

    it('resolve a rota GET com data incluída', () => {
        const result = apiRoute('test.get', { id: 1 }, null, 'GET');
        expect(config.resolveRoute).toHaveBeenCalledWith('test.get', { id: 1 });
        expect(result).toEqual({
            option_load_screen: null,
            routeURL: 'https://example.com/test.get/1'
        });
    });

    it('resolve a rota POST usando data como fallback para route_params quando aplicável', () => {
        const result = apiRoute('test.post', { id: 1 }, null, 'POST');
        expect(config.resolveRoute).toHaveBeenCalledWith('test.post', { id: 1 });
        expect(result).toEqual({
            option_load_screen: null,
            routeURL: 'https://example.com/test.post/1'
        });
    });

    it('passa load_screen do options se existir', () => {
        const result = apiRoute('test.get', {}, { load_screen: true }, 'GET');
        expect(result).toEqual({
            option_load_screen: true,
            routeURL: 'https://example.com/test.get'
        });
    });

    it('faz fallback para GET se method não for especificado', () => {
        apiRoute('test.default', { id: 42 });
        expect(config.resolveRoute).toHaveBeenCalledWith('test.default', { id: 42 });
    });

    it('suporta route_params nas options para métodos não-GET', () => {
        const result = apiRoute('users.update', { name: 'João' }, { route_params: { id: 10 } }, 'PUT');
        expect(config.resolveRoute).toHaveBeenCalledWith('users.update', { id: 10 });
        expect(result?.routeURL).toBe('https://example.com/users.update/10');
    });
});
