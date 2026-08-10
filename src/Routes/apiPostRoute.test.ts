import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiPostRoute } from './apiPostRoute';
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

describe('apiPostRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/post'
        });

        (axios.post as any).mockResolvedValue({ data: { created: true } });
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('retorna false se apiRoute falhar', async () => {
        mockApiRoute.mockReturnValue(false);
        const result = await apiPostRoute('invalid.route');
        expect(result).toBe(false);
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('faz requisição POST com headers corretos', async () => {
        const result = await apiPostRoute('test.store', { title: 'Test' });

        expect(mockApiRoute).toHaveBeenCalledWith('test.store', { title: 'Test' }, null, 'POST');
        expect(axios.post).toHaveBeenCalledWith('https://api.example.com/post', { title: 'Test' }, expect.objectContaining({
            headers: expect.objectContaining({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }),
            withCredentials: true
        }));
        expect(result).toEqual({ created: true });
    });

    it('inclui headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ 'Authorization': 'Bearer token-123' });

        await apiPostRoute('test.store', {});

        const callArgs = (axios.post as any).mock.calls[0];
        expect(callArgs[2].headers['Authorization']).toBe('Bearer token-123');
    });

    it('retorna null e loga erro ao falhar', async () => {
        (axios.post as any).mockRejectedValue(new Error('Server error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await apiPostRoute('test.fail');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('executa onError e lança erro quando throw = true', async () => {
        const error: any = new Error('Unprocessable Entity');
        error.response = { status: 422, data: { message: 'Dados inválidos' } };
        (axios.post as any).mockRejectedValue(error);

        const onError = vi.fn();

        await expect(apiPostRoute('test.422', { name: '' }, { onError, throw: true })).rejects.toThrow('Unprocessable Entity');
        expect(onError).toHaveBeenCalledWith(error);
    });
});
