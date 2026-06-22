import { describe, it, expect, vi, beforeEach } from 'vitest';
import { goToRoute, goToRouteByName, setLibraryRouter } from './goToRoute';
import * as ziggy from 'ziggy-js';
import { ref } from 'vue';
import type { Router } from 'vue-router';

vi.mock('ziggy-js', () => ({
    useRoute: vi.fn()
}));

describe('goToRoute', () => {
    let mockRouter: any;
    let mockZiggyRoute: any;
    let mockHas: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockRouter = {
            push: vi.fn()
        };

        mockHas = vi.fn();
        mockZiggyRoute = vi.fn((name, params) => {
            if (!name) return { has: mockHas };
            return `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`;
        });

        (ziggy.useRoute as any).mockReturnValue(mockZiggyRoute);

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
        mockHas.mockReturnValue(true);
        expect(goToRoute('home', null)).toBe(true);
        expect(mockRouter.push).toHaveBeenCalledWith('https://example.com/home');
    });

    it('navega via Ziggy se a rota existir', () => {
        mockHas.mockReturnValue(true);
        const result = goToRoute('users.show', { id: 1 });
        expect(result).toBe(true);
        expect(mockHas).toHaveBeenCalledWith('users.show');
        expect(mockRouter.push).toHaveBeenCalledWith('https://example.com/users.show/1');
    });

    it('faz fallback para vue-router se a rota não existir no Ziggy', () => {
        mockHas.mockReturnValue(false);
        const result = goToRoute('admin', { page: 2 });
        expect(result).toBe(true);
        expect(mockRouter.push).toHaveBeenCalledWith({
            name: 'admin',
            params: { page: 2 },
            query: { page: 2 }
        });
    });

    it('aceita refs para rota', () => {
        mockHas.mockReturnValue(true);
        const routeRef = ref('home');
        goToRoute(routeRef);
        expect(mockHas).toHaveBeenCalledWith('home');
        expect(mockRouter.push).toHaveBeenCalledWith('https://example.com/home');
    });

    it('goToRouteByName é alias de goToRoute', () => {
        expect(goToRouteByName).toBe(goToRoute);
    });
});
