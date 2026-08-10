import { describe, it, expect, vi, beforeEach } from 'vitest';
import { goToRoute, goToRouteByName, setLibraryRouter } from './goToRoute';
import * as config from './config';
import { ref } from 'vue';
import type { Router } from 'vue-router';

vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn(),
    onResetConfig: vi.fn()
}));

describe('goToRoute', () => {
    let mockRouter: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockRouter = {
            push: vi.fn()
        };

        (config.resolveRoute as any).mockImplementation((name: string, params: any) =>
            `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`
        );

        setLibraryRouter(mockRouter as unknown as Router);
    });

    it('dispara erro se router não configurado', () => {
        setLibraryRouter(null as any);
        expect(() => goToRoute('test')).toThrow('Router não configurado na biblioteca.');
        setLibraryRouter(mockRouter);
    });

    it('retorna false se route for vazio ou nulo', () => {
        expect(goToRoute(null)).toBe(false);
        expect(goToRoute('')).toBe(false);
        expect(goToRoute('  ')).toBe(false);
        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('funciona com dados nulos (fallback para objeto vazio)', () => {
        (config.hasRoute as any).mockReturnValue(true);
        (config.resolveRoute as any).mockReturnValue('/home');
        expect(goToRoute('home', null)).toBe(true);
        expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });

    it('navega via resolver se a rota existir e converte URL absoluta em pathname + search', () => {
        (config.hasRoute as any).mockReturnValue(true);
        (config.resolveRoute as any).mockReturnValue('https://example.com/users/1?query=test#hash');

        const result = goToRoute('users.show', { id: 1 });
        expect(result).toBe(true);
        expect(config.hasRoute).toHaveBeenCalledWith('users.show', { id: 1 });
        expect(mockRouter.push).toHaveBeenCalledWith('/users/1?query=test#hash');
    });

    it('faz fallback para vue-router se a rota não existir no resolver', () => {
        (config.hasRoute as any).mockReturnValue(false);
        const result = goToRoute('admin', { page: 2 });
        expect(result).toBe(true);
        expect(mockRouter.push).toHaveBeenCalledWith({
            name: 'admin',
            params: { page: 2 },
            query: { page: 2 }
        });
    });

    it('aceita refs para rota', () => {
        (config.hasRoute as any).mockReturnValue(true);
        (config.resolveRoute as any).mockReturnValue('/home');
        const routeRef = ref('home');
        goToRoute(routeRef);
        expect(config.hasRoute).toHaveBeenCalledWith('home', {});
        expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });

    it('goToRouteByName é alias de goToRoute', () => {
        expect(goToRouteByName).toBe(goToRoute);
    });
});
