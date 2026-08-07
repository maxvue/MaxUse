import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedApi } from './getCachedApi';
import axios from 'axios';
import * as config from './config';

vi.mock('axios');
vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn()
}));

describe('getCachedApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        (config.resolveRoute as any).mockImplementation((name: string, params: any) =>
            `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`
        );
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

        const cached = localStorage.getItem('test.route_{"id":1}');
        expect(cached).toBe('{"id":1,"name":"Test"}');
    });

    it('retorna do cache e não faz requisição', async () => {
        localStorage.setItem('test.route_{"id":1}', JSON.stringify({ id: 1, name: 'Cached' }));

        const result = await getCachedApi('test.route', { id: 1 });

        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual({ id: 1, name: 'Cached' });
    });

    it('usa keyCache personalizado', async () => {
        localStorage.setItem('custom_key', JSON.stringify({ custom: true }));

        const result = await getCachedApi('test.route', {}, 'custom_key');

        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual({ custom: true });
    });
});

describe('getCachedApi — regressão auditoria (achado 004)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        (config.resolveRoute as any).mockReturnValue('https://example.com/rota');
        (axios.get as any).mockResolvedValue({ data: { ok: true } });
    });

    it('envia os headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ Authorization: 'Bearer abc' });

        await getCachedApi('api.rota');

        const callArgs = (axios.get as any).mock.calls[0];
        expect(callArgs[1].headers.Authorization).toBe('Bearer abc');
    });

    it('respeita withCredentials configurado como false', async () => {
        (config.getWithCredentials as any).mockReturnValue(false);

        await getCachedApi('api.rota');

        const callArgs = (axios.get as any).mock.calls[0];
        expect(callArgs[1].withCredentials).toBe(false);
    });
});
