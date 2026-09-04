import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiGetRoute } from './apiGetRoute';
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

describe('apiGetRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/data'
        });

        (axios.get as any).mockResolvedValue({ data: { success: true } });
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('faz requisição GET com apiRoute e retorna dados', async () => {
        const result = await apiGetRoute('test.route', { id: 1 });

        expect(mockApiRoute).toHaveBeenCalledWith('test.route', { id: 1 }, null, 'GET');
        expect(axios.get).toHaveBeenCalledWith('https://api.example.com/data', expect.objectContaining({ responseType: 'json' }));
        expect(result).toEqual({ success: true });
    });

    it('adiciona responseType blob quando options.file = true', async () => {
        await apiGetRoute('test.file', {}, { file: true });

        expect(axios.get).toHaveBeenCalledWith('https://api.example.com/data', expect.objectContaining({ responseType: 'blob' }));
    });

    it('retorna null e loga erro ao falhar (quando error !== false)', async () => {
        const error = new Error('Network error');
        (axios.get as any).mockRejectedValue(error);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await apiGetRoute('test.fail');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(
            '>> Request ERRO - URL: "https://api.example.com/data"',
            'Network error'
        );
    });

    it('retorna null silenciosamente quando options.error = false', async () => {
        const error = new Error('Network error');
        (axios.get as any).mockRejectedValue(error);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await apiGetRoute('test.silent', {}, { error: false });

        expect(result).toBeNull();
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('inclui headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ 'Authorization': 'Bearer abc' });

        await apiGetRoute('test.route');

        const callArgs = (axios.get as any).mock.calls[0];
        expect(callArgs[1].headers['Authorization']).toBe('Bearer abc');
    });

    it('chama onError e repropaga se throw = true', async () => {
        const error: any = new Error('Validation failed');
        error.response = { status: 422, data: { errors: { email: ['Invalido'] } } };
        (axios.get as any).mockRejectedValue(error);

        const onError = vi.fn();

        await expect(apiGetRoute('test.422', {}, { onError, throw: true })).rejects.toThrow('Validation failed');
        expect(onError).toHaveBeenCalledWith(error);
    });
});

describe('apiGetRoute — regressão auditoria (achado 006)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it.each([null, ''])('retorna null sem lançar quando RouteName é %p', async (routeName) => {
        vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue(null);

        await expect(apiGetRoute(routeName as any)).resolves.toBeNull();
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('não lança segundo TypeError dentro do catch quando a rota é inválida', async () => {
        vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue(null);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await expect(apiGetRoute(null)).resolves.toBeNull();
        expect(consoleSpy).not.toHaveBeenCalled();
    });
});


describe('apiGetRoute - cancelamento (AbortSignal)', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/data'
        });

        (axios.get as any).mockResolvedValue({ data: { success: true } });
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('propaga options.signal para o config do axios', async () => {
        const controller = new AbortController();

        await apiGetRoute('test.route', {}, { signal: controller.signal });

        expect(axios.get).toHaveBeenCalledWith(
            'https://api.example.com/data',
            expect.objectContaining({ signal: controller.signal })
        );
    });

    it('não envia signal quando não informado', async () => {
        await apiGetRoute('test.route', {});

        const received = (axios.get as any).mock.calls[0][1];
        expect('signal' in received).toBe(false);
    });

    it('não loga nem chama onError quando a requisição é cancelada', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const onError = vi.fn();
        (axios.get as any).mockRejectedValue({ code: 'ERR_CANCELED', name: 'CanceledError', message: 'canceled' });

        const result = await apiGetRoute('test.route', {}, { onError });

        expect(result).toBeNull();
        expect(onError).not.toHaveBeenCalled();
        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
