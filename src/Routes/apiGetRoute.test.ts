import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiGetRoute } from './apiGetRoute';
import axios from 'axios';
import * as apiRouteModule from './apiRoute';

vi.mock('axios');

describe('apiGetRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/data'
        });

        (axios.get as any).mockResolvedValue({ data: { success: true } });
    });

    it('faz requisição GET com apiRoute e retorna dados', async () => {
        const result = await apiGetRoute('test.route', { id: 1 });

        expect(mockApiRoute).toHaveBeenCalledWith('test.route', { id: 1 }, null, 'GET');
        expect(axios.get).toHaveBeenCalledWith('https://api.example.com/data', { responseType: 'json' });
        expect(result).toEqual({ success: true });
    });

    it('adiciona responseType blob quando options.file = true', async () => {
        await apiGetRoute('test.file', {}, { file: true });

        expect(axios.get).toHaveBeenCalledWith('https://api.example.com/data', { responseType: 'blob' });
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
});
