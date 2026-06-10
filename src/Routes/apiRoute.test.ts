import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiRoute } from './apiRoute';
import * as ziggy from 'ziggy-js';

vi.mock('ziggy-js', () => ({
    useRoute: vi.fn()
}));

describe('apiRoute', () => {
    let mockRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockRoute = vi.fn((name, params) => `https://example.com/${name}${params && Object.keys(params).length ? '/' + params.id : ''}`);
        (ziggy.useRoute as any).mockReturnValue(mockRoute);
    });

    it('retorna null se RouteName for nulo', () => {
        const result = apiRoute(null);
        expect(result).toBeNull();
    });

    it('resolve a rota GET com data incluída', () => {
        const result = apiRoute('test.get', { id: 1 }, null, 'GET');
        expect(mockRoute).toHaveBeenCalledWith('test.get', { id: 1 });
        expect(result).toEqual({
            option_load_screen: null,
            routeURL: 'https://example.com/test.get/1'
        });
    });

    it('resolve a rota POST ignorando data no useRoute', () => {
        const result = apiRoute('test.post', { id: 1 }, null, 'POST');
        expect(mockRoute).toHaveBeenCalledWith('test.post');
        expect(result).toEqual({
            option_load_screen: null,
            routeURL: 'https://example.com/test.post'
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
        expect(mockRoute).toHaveBeenCalledWith('test.default', { id: 42 });
    });
});
