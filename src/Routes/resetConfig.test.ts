import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resetConfig, setRouteResolver } from './config';
import { goToRoute, setLibraryRouter } from './goToRoute';

/**
 * Integração real entre config.ts e goToRoute.ts — sem mock de './config',
 * para exercitar a implementação de resetConfig() de verdade.
 */
describe('resetConfig — regressão auditoria (achado 027)', () => {
    beforeEach(() => {
        resetConfig();
    });

    it('limpa o router registrado, evitando vazamento entre testes', () => {
        setLibraryRouter({ push: vi.fn() } as any);

        resetConfig();

        expect(() => goToRoute('qualquer.rota')).toThrow('Router não configurado na biblioteca.');
    });

    it('permite registrar um novo router após o reset', () => {
        setLibraryRouter({ push: vi.fn() } as any);
        resetConfig();

        const novoRouter = { push: vi.fn() } as any;
        setRouteResolver(() => '/url-resolvida');
        setLibraryRouter(novoRouter);

        expect(goToRoute('qualquer.rota')).toBe(true);
        expect(novoRouter.push).toHaveBeenCalledWith('/url-resolvida');
    });

    it('limpa também o resolver e as opções de requisição', () => {
        setRouteResolver(() => '/x');

        resetConfig();

        // Sem resolver configurado, goToRoute cai no fallback do Vue Router
        setLibraryRouter({ push: vi.fn() } as any);
        expect(() => goToRoute('rota')).not.toThrow();
    });
});
