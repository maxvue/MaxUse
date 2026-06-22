import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedApi } from './getCachedApi';
import axios from 'axios';
import * as ziggy from 'ziggy-js';

vi.mock('axios');
vi.mock('ziggy-js', () => ({
    useRoute: vi.fn()
}));

describe('getCachedApi', () => {
    let mockRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        mockRoute = vi.fn((name, params) => `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`);
        (ziggy.useRoute as any).mockReturnValue(mockRoute);
    });

    it('retorna null se routeName for vazio', async () => {
        const result = await getCachedApi('');
        expect(result).toBeNull();
    });

    it('funciona com dados da rota sendo nulos', async () => {
        (axios.get as any).mockResolvedValue({ data: { success: true } });
        const result = await getCachedApi('test.route', null);
        expect(result).toEqual({ success: true });
        expect(mockRoute).toHaveBeenCalledWith('test.route', {});
    });

    it('faz requisição se cache estiver vazio e salva no localStorage', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 1, name: 'Test' } });

        const result = await getCachedApi('test.route', { id: 1 });

        expect(mockRoute).toHaveBeenCalledWith('test.route', { id: 1 });
        expect(axios.get).toHaveBeenCalledWith('https://example.com/test.route/1', { responseType: 'json', withCredentials: true });
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
