import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiPostRoute } from './apiPostRoute';
import axios from 'axios';
import * as apiRouteModule from './apiRoute';

vi.mock('axios');

describe('apiPostRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/post'
        });

        (axios.post as any).mockResolvedValue({ data: { created: true } });

        document.head.innerHTML = '<meta name="csrf-token" content="fake-token-123">';
    });

    it('retorna false se apiRoute falhar', async () => {
        mockApiRoute.mockReturnValue(false);
        const result = await apiPostRoute('invalid.route');
        expect(result).toBe(false);
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('faz requisição POST com CSRF token e headers corretos', async () => {
        const result = await apiPostRoute('test.store', { title: 'Test' });

        expect(mockApiRoute).toHaveBeenCalledWith('test.store', { title: 'Test' }, null, 'POST');
        expect(axios.post).toHaveBeenCalledWith('https://api.example.com/post', { title: 'Test' }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': 'fake-token-123',
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true
        });
        expect(result).toEqual({ created: true });
    });

    it('funciona mesmo se meta csrf-token não existir', async () => {
        document.head.innerHTML = '';
        await apiPostRoute('test.store', {});

        expect(axios.post).toHaveBeenCalled();
        const callArgs = (axios.post as any).mock.calls[0];
        expect(callArgs[2].headers['X-CSRF-TOKEN']).toBe('');
    });

    it('retorna null e loga erro ao falhar', async () => {
        (axios.post as any).mockRejectedValue(new Error('Server error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await apiPostRoute('test.fail');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
    });
});
