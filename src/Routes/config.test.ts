import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    setRouteResolver,
    setApiRequestConfig,
    resolveRoute,
    hasRoute,
    getConfiguredHeaders,
    getWithCredentials,
    resetConfig
} from './config';

describe('config', () => {
    beforeEach(() => resetConfig());
    afterEach(() => resetConfig());

    describe('resolveRoute', () => {
        it('lança erro quando o resolver não está configurado', () => {
            expect(() => resolveRoute('qualquer.rota')).toThrow(
                'Route resolver não configurado. Chame setRouteResolver() na inicialização da aplicação.'
            );
        });

        it('resolve a URL usando o resolver configurado', () => {
            setRouteResolver((name) => name === 'usuarios.index' ? '/api/usuarios' : null);

            expect(resolveRoute('usuarios.index')).toBe('/api/usuarios');
        });

        it('repassa os params para o resolver', () => {
            setRouteResolver((name, params) => `/api/${name}/${params?.id}`);

            expect(resolveRoute('usuarios.show', { id: 42 })).toBe('/api/usuarios.show/42');
        });

        it('lança erro quando o resolver retorna null (rota não encontrada)', () => {
            setRouteResolver(() => null);

            expect(() => resolveRoute('rota.inexistente')).toThrow(
                'Rota "rota.inexistente" não encontrada pelo resolver.'
            );
        });
    });

    describe('hasRoute', () => {
        it('retorna false quando o resolver não está configurado', () => {
            expect(hasRoute('qualquer.rota')).toBe(false);
        });

        it('retorna true quando o resolver resolve a rota', () => {
            setRouteResolver(() => '/api/usuarios');

            expect(hasRoute('usuarios.index')).toBe(true);
        });

        it('retorna false quando o resolver retorna null', () => {
            setRouteResolver(() => null);

            expect(hasRoute('rota.inexistente')).toBe(false);
        });

        it('retorna false em vez de lançar quando o resolver lança um erro', () => {
            setRouteResolver(() => { throw new Error('falha no resolver'); });

            expect(hasRoute('rota.problematica')).toBe(false);
        });
    });

    describe('getConfiguredHeaders', () => {
        it('retorna objeto vazio quando nenhum header foi configurado', () => {
            expect(getConfiguredHeaders()).toEqual({});
        });

        it('retorna headers estáticos configurados', () => {
            setApiRequestConfig({ headers: { 'X-Custom': 'valor-fixo' } });

            expect(getConfiguredHeaders()).toEqual({ 'X-Custom': 'valor-fixo' });
        });

        it('resolve headers dinâmicos (funções) a cada chamada', () => {
            let token = 'token-1';
            setApiRequestConfig({ headers: { 'Authorization': () => `Bearer ${token}` } });

            expect(getConfiguredHeaders()).toEqual({ 'Authorization': 'Bearer token-1' });

            token = 'token-2';
            expect(getConfiguredHeaders()).toEqual({ 'Authorization': 'Bearer token-2' });
        });

        it('mescla headers estáticos e dinâmicos', () => {
            setApiRequestConfig({
                headers: {
                    'X-Custom': 'valor-fixo',
                    'Authorization': () => 'Bearer abc'
                }
            });

            expect(getConfiguredHeaders()).toEqual({
                'X-Custom': 'valor-fixo',
                'Authorization': 'Bearer abc'
            });
        });
    });

    describe('getWithCredentials', () => {
        it('retorna true por padrão', () => {
            expect(getWithCredentials()).toBe(true);
        });

        it('retorna false quando configurado explicitamente', () => {
            setApiRequestConfig({ withCredentials: false });

            expect(getWithCredentials()).toBe(false);
        });

        it('volta a true quando resetConfig é chamado', () => {
            setApiRequestConfig({ withCredentials: false });
            resetConfig();

            expect(getWithCredentials()).toBe(true);
        });
    });

    describe('setApiRequestConfig', () => {
        it('mescla com a configuração existente em vez de substituí-la', () => {
            setApiRequestConfig({ headers: { 'X-A': 'a' } });
            setApiRequestConfig({ withCredentials: false });

            expect(getConfiguredHeaders()).toEqual({ 'X-A': 'a' });
            expect(getWithCredentials()).toBe(false);
        });

        it('sobrescreve a chave headers inteira em vez de mesclar chave a chave', () => {
            setApiRequestConfig({ headers: { 'X-A': 'a', 'X-B': 'b' } });
            setApiRequestConfig({ headers: { 'X-C': 'c' } });

            expect(getConfiguredHeaders()).toEqual({ 'X-C': 'c' });
        });
    });

    describe('resetConfig', () => {
        it('limpa o resolver de rotas configurado', () => {
            setRouteResolver(() => '/api/qualquer');
            resetConfig();

            expect(() => resolveRoute('qualquer')).toThrow();
        });

        it('restaura apiConfig para o padrão { withCredentials: true }, não para vazio', () => {
            setApiRequestConfig({ headers: { 'X-Custom': 'valor' }, withCredentials: false });
            resetConfig();

            expect(getConfiguredHeaders()).toEqual({});
            expect(getWithCredentials()).toBe(true);
        });
    });
});
