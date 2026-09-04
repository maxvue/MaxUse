import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiPutRoute } from './apiPutRoute';
import axios from 'axios';
import * as apiRouteModule from './apiRoute';
import * as config from './config';

vi.mock('axios');
vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn()
}));

describe('apiPutRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/put'
        });

        (axios.put as any).mockResolvedValue({ data: { updated: true } });
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('retorna false se apiRoute falhar', async () => {
        mockApiRoute.mockReturnValue(false);
        const result = await apiPutRoute('invalid.route');
        expect(result).toBe(false);
        expect(axios.put).not.toHaveBeenCalled();
    });

    it('faz requisição PUT com headers corretos', async () => {
        const result = await apiPutRoute('test.update', { title: 'New' });

        expect(mockApiRoute).toHaveBeenCalledWith('test.update', { title: 'New' }, null, 'PUT');
        expect(axios.put).toHaveBeenCalledWith('https://api.example.com/put', { title: 'New' }, expect.objectContaining({
            headers: expect.objectContaining({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }),
            withCredentials: true
        }));
        expect(result).toEqual({ updated: true });
    });

    it('inclui headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ 'Authorization': 'Bearer token-put' });

        await apiPutRoute('test.update', {});

        const callArgs = (axios.put as any).mock.calls[0];
        expect(callArgs[2].headers['Authorization']).toBe('Bearer token-put');
    });

    it('retorna null e loga erro ao falhar', async () => {
        (axios.put as any).mockRejectedValue(new Error('Server error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await apiPutRoute('test.fail');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('aceita RouteName como null/undefined e retorna false', async () => {
        mockApiRoute.mockReturnValue(null);
        const resNull = await apiPutRoute(null);
        expect(resNull).toBe(false);
    });

    it('executa onError e lança erro quando throw = true', async () => {
        const error: any = new Error('Put failed');
        (axios.put as any).mockRejectedValue(error);
        const onError = vi.fn();

        await expect(apiPutRoute('test.put.fail', {}, { onError, throw: true })).rejects.toThrow('Put failed');
        expect(onError).toHaveBeenCalledWith(error);
    });
});


describe('apiPutRoute - cancelamento (AbortSignal)', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/put'
        });

        (axios.put as any).mockResolvedValue({ data: { updated: true } });
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('propaga options.signal para o config do axios', async () => {
        const controller = new AbortController();

        await apiPutRoute('test.route', { id: 1 }, { signal: controller.signal });

        const received = (axios.put as any).mock.calls[0][2];
        expect(received.signal).toBe(controller.signal);
    });

    it('não envia signal quando não informado', async () => {
        await apiPutRoute('test.route', { id: 1 });

        const received = (axios.put as any).mock.calls[0][2];
        expect('signal' in received).toBe(false);
    });

    it('não loga nem chama onError quando a requisição é cancelada', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const onError = vi.fn();
        (axios.put as any).mockRejectedValue({ code: 'ERR_CANCELED', name: 'CanceledError', message: 'canceled' });

        const result = await apiPutRoute('test.route', { id: 1 }, { onError });

        expect(result).toBeNull();
        expect(onError).not.toHaveBeenCalled();
        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
