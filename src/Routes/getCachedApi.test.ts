import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedApi, clearCachedApi } from './getCachedApi';
import axios from 'axios';
import * as config from './config';

vi.mock('axios');
vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getClientIdHeader: vi.fn(() => ({})),
    getClientId: vi.fn(() => null),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn(),
    onResetConfig: vi.fn()
}));

describe('getCachedApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        (config.resolveRoute as any).mockImplementation((name: string, params: any) =>
            `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`
        );
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getClientIdHeader as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('retorna null se routeName for vazio', async () => {
        const result = await getCachedApi('');
        expect(result).toBeNull();
    });

    it('funciona com dados da rota sendo nulos', async () => {
        (axios.get as any).mockResolvedValue({ data: { success: true } });
        const result = await getCachedApi('test.route', null);
        expect(result).toEqual({ success: true });
        expect(config.resolveRoute).toHaveBeenCalledWith('test.route', {});
    });

    it('faz requisição se cache estiver vazio e salva no localStorage', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 1, name: 'Test' } });

        const result = await getCachedApi('test.route', { id: 1 });

        expect(config.resolveRoute).toHaveBeenCalledWith('test.route', { id: 1 });
        expect(axios.get).toHaveBeenCalledWith('https://example.com/test.route/1', expect.objectContaining({ responseType: 'json', withCredentials: true }));
        expect(result).toEqual({ id: 1, name: 'Test' });

        const cached = localStorage.getItem('max_cache:test.route_{"id":1}');
        expect(cached).toBe('{"id":1,"name":"Test"}');
    });

    it('retorna do cache e não faz requisição (cache eterno)', async () => {
        localStorage.setItem('max_cache:test.route_{"id":1}', JSON.stringify({ id: 1, name: 'Cached' }));

        const result = await getCachedApi('test.route', { id: 1 });

        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual({ id: 1, name: 'Cached' });
    });

    it('reutiliza a mesma entrada de cache com parâmetros em ordem de chaves diferente', async () => {
        localStorage.setItem('max_cache:test.route_{"a":1,"b":2}', JSON.stringify({ ok: true }));

        const result = await getCachedApi('test.route', { b: 2, a: 1 });
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual({ ok: true });
    });

    it('trata JSON corrompido no localStorage removendo a chave e refazendo a requisição', async () => {
        const key = 'max_cache:test.corrupted_{}';
        localStorage.setItem(key, '{json_invalido');
        (axios.get as any).mockResolvedValue({ data: { fresh: true } });

        const result = await getCachedApi('test.corrupted');

        expect(localStorage.getItem(key)).toBe('{"fresh":true}');
        expect(result).toEqual({ fresh: true });
    });

    it('tolera QuotaExceededError ao tentar salvar no localStorage sem rejeitar', async () => {
        (axios.get as any).mockResolvedValue({ data: { bigData: 'ok' } });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('QuotaExceededError');
        });

        const result = await getCachedApi('test.quota');
        expect(result).toEqual({ bigData: 'ok' });
    });

    it('propaga rejeição em caso de erro de rede no axios.get', async () => {
        (axios.get as any).mockRejectedValue(new Error('Network failure'));

        await expect(getCachedApi('test.netfail')).rejects.toThrow('Network failure');
    });

    it('usa keyCache personalizado', async () => {
        localStorage.setItem('custom_key', JSON.stringify({ custom: true }));

        const result = await getCachedApi('test.route', {}, 'custom_key');

        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual({ custom: true });
    });

    it('permite limpar o cache de localStorage com clearCachedApi especificando chave ou tudo', async () => {
        (axios.get as any).mockResolvedValue({ data: { a: 1 } });
        await getCachedApi('rota', {}, 'k');
        expect(localStorage.getItem('k')).not.toBeNull();

        clearCachedApi('k');
        expect(localStorage.getItem('k')).toBeNull();

        await getCachedApi('rota2', {});
        expect(localStorage.length).toBeGreaterThan(0);

        clearCachedApi();
        expect(localStorage.length).toBe(0);
    });

    it('clearCachedApi() sem chave remove apenas o cache prefixado com max_cache:', async () => {
        localStorage.setItem('max_cache:rota', 'dado da lib');
        localStorage.setItem('app_user_session', 'TOKEN DO APP HOSPEDEIRO');
        localStorage.setItem('pinia_state', 'estado de outra lib');

        clearCachedApi();

        expect(localStorage.getItem('max_cache:rota')).toBeNull();
        expect(localStorage.getItem('app_user_session')).toBe('TOKEN DO APP HOSPEDEIRO');
        expect(localStorage.getItem('pinia_state')).toBe('estado de outra lib');
    });

    it('clearCachedApi(key) remove a chave crua e a variante prefixada, sem tocar em outras', async () => {
        localStorage.setItem('custom_key', 'cache customizado');
        localStorage.setItem('max_cache:custom_key', 'cache prefixado');
        localStorage.setItem('outra_chave', 'do app');

        clearCachedApi('custom_key');

        expect(localStorage.getItem('custom_key')).toBeNull();
        expect(localStorage.getItem('max_cache:custom_key')).toBeNull();
        expect(localStorage.getItem('outra_chave')).toBe('do app');
    });

    it('respeita TTL opcional no getCachedApi expirando dados antigos', async () => {
        (axios.get as any).mockResolvedValue({ data: { v: 1 } });
        await getCachedApi('rota.ttl', {}, 'k_ttl', 1000);

        (axios.get as any).mockResolvedValue({ data: { v: 2 } });
        const res1 = await getCachedApi('rota.ttl', {}, 'k_ttl', 1000);
        expect(res1).toEqual({ v: 1 });

        const raw = JSON.parse(localStorage.getItem('k_ttl')!);
        raw.timestamp = Date.now() - 5000;
        localStorage.setItem('k_ttl', JSON.stringify(raw));

        const res2 = await getCachedApi('rota.ttl', {}, 'k_ttl', 1000);
        expect(res2).toEqual({ v: 2 });
    });
});
