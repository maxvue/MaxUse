import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiDeleteRoute } from './apiDeleteRoute';
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

describe('apiDeleteRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/delete'
        });

        (axios.delete as any).mockResolvedValue({ data: { deleted: true } });
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('retorna false se apiRoute falhar', async () => {
        mockApiRoute.mockReturnValue(false);
        const result = await apiDeleteRoute('invalid.route');
        expect(result).toBe(false);
        expect(axios.delete).not.toHaveBeenCalled();
    });

    it('faz requisição DELETE com headers corretos e payload em data', async () => {
        const result = await apiDeleteRoute('test.destroy', { id: 10 });

        expect(mockApiRoute).toHaveBeenCalledWith('test.destroy', { id: 10 }, null, 'DELETE');
        expect(axios.delete).toHaveBeenCalledWith('https://api.example.com/delete', expect.objectContaining({
            data: { id: 10 },
            headers: expect.objectContaining({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }),
            withCredentials: true
        }));
        expect(result).toEqual({ deleted: true });
    });

    it('inclui headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ 'Authorization': 'Bearer token-delete' });

        await apiDeleteRoute('test.destroy', {});

        const callArgs = (axios.delete as any).mock.calls[0];
        expect(callArgs[1].headers['Authorization']).toBe('Bearer token-delete');
    });

    it('retorna null e loga erro ao falhar', async () => {
        (axios.delete as any).mockRejectedValue(new Error('Server error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await apiDeleteRoute('test.fail');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
    });
});
