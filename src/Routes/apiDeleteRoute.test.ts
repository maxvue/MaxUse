import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiDeleteRoute } from '../../src/Routes/apiDeleteRoute';
import axios from 'axios';
import * as apiRouteModule from '../../src/Routes/apiRoute';

vi.mock('axios');

describe('apiDeleteRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/delete'
        });

        (axios.delete as any).mockResolvedValue({ data: { deleted: true } });

        document.head.innerHTML = '<meta name="csrf-token" content="fake-token-delete">';
    });

    it('retorna false se apiRoute falhar', async () => {
        mockApiRoute.mockReturnValue(false);
        const result = await apiDeleteRoute('invalid.route');
        expect(result).toBe(false);
        expect(axios.delete).not.toHaveBeenCalled();
    });

    it('faz requisição DELETE com CSRF token, headers corretos e payload em data', async () => {
        const result = await apiDeleteRoute('test.destroy', { id: 10 });

        expect(mockApiRoute).toHaveBeenCalledWith('test.destroy', { id: 10 }, null, 'DELETE');
        expect(axios.delete).toHaveBeenCalledWith('https://api.example.com/delete', {
            data: { id: 10 },
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': 'fake-token-delete',
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true
        });
        expect(result).toEqual({ deleted: true });
    });

    it('funciona mesmo se meta csrf-token não existir', async () => {
        document.head.innerHTML = '';
        await apiDeleteRoute('test.destroy', {});

        expect(axios.delete).toHaveBeenCalled();
        const callArgs = (axios.delete as any).mock.calls[0];
        expect(callArgs[1].headers['X-CSRF-TOKEN']).toBe('');
    });

    it('retorna null e loga erro ao falhar', async () => {
        (axios.delete as any).mockRejectedValue(new Error('Server error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await apiDeleteRoute('test.fail');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
    });
});
