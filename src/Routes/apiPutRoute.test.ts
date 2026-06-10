import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiPutRoute } from './apiPutRoute';
import axios from 'axios';
import * as apiRouteModule from './apiRoute';

vi.mock('axios');

describe('apiPutRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/put'
        });

        (axios.put as any).mockResolvedValue({ data: { updated: true } });

        document.head.innerHTML = '<meta name="csrf-token" content="fake-token-put">';
    });

    it('retorna false se apiRoute falhar', async () => {
        mockApiRoute.mockReturnValue(false);
        const result = await apiPutRoute('invalid.route');
        expect(result).toBe(false);
        expect(axios.put).not.toHaveBeenCalled();
    });

    it('faz requisição PUT com CSRF token e headers corretos', async () => {
        const result = await apiPutRoute('test.update', { title: 'New' });

        expect(mockApiRoute).toHaveBeenCalledWith('test.update', { title: 'New' }, null, 'PUT');
        expect(axios.put).toHaveBeenCalledWith('https://api.example.com/put', { title: 'New' }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': 'fake-token-put',
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true
        });
        expect(result).toEqual({ updated: true });
    });

    it('funciona mesmo se meta csrf-token não existir', async () => {
        document.head.innerHTML = '';
        await apiPutRoute('test.update', {});

        expect(axios.put).toHaveBeenCalled();
        const callArgs = (axios.put as any).mock.calls[0];
        expect(callArgs[2].headers['X-CSRF-TOKEN']).toBe('');
    });

    it('retorna null e loga erro ao falhar', async () => {
        (axios.put as any).mockRejectedValue(new Error('Server error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await apiPutRoute('test.fail');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
    });
});
