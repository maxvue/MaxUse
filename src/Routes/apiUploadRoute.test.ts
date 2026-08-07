import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiUploadRoute } from './apiUploadRoute';
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

describe('apiUploadRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/upload'
        });

        (axios.post as any).mockResolvedValue({ data: { uploaded: true } });
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);

        // Mock window.URL.createObjectURL since it's not present in basic JSDOM without polyfill
        global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/mock');
    });

    it('retorna false se apiRoute falhar', async () => {
        mockApiRoute.mockReturnValue(false);
        const result = await apiUploadRoute('invalid.route', []);
        expect(result).toBe(false);
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('faz upload enviando FormData com arquivos e dados', async () => {
        const fakeFile = new File(['conteudo'], 'teste.txt', { type: 'text/plain' });

        const result = await apiUploadRoute('test.upload', [fakeFile], { config: { id: 1 }, extra: 'valor' });

        expect(mockApiRoute).toHaveBeenCalledWith('test.upload', { config: { id: 1 }, extra: 'valor' }, null, 'POST');

        expect(axios.post).toHaveBeenCalled();
        const args = (axios.post as any).mock.calls[0];

        expect(args[0]).toBe('https://api.example.com/upload');
        const formData: FormData = args[1];

        // Dados adicionados (o objeto vira JSON.stringify)
        expect(formData.get('config')).toBe('{"id":1}');
        expect(formData.get('extra')).toBe('valor');

        // Arquivos
        expect(formData.get('files[0]')).toBeInstanceOf(Blob);

        expect(result).toEqual({ uploaded: true });
    });

    it('trata files encapsulados num objeto { files: [...] }', async () => {
        const fakeFile = new File([''], 'teste2.png', { type: 'image/png' });

        await apiUploadRoute('test.upload', { files: [fakeFile] });

        const args = (axios.post as any).mock.calls[0];
        const formData: FormData = args[1];
        expect(formData.get('files[0]')).toBeInstanceOf(Blob);
    });

    it('inclui headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ 'Authorization': 'Bearer upload-token' });
        const fakeFile = new File([''], 'teste2.png', { type: 'image/png' });
        await apiUploadRoute('test.upload', [fakeFile]);

        const args = (axios.post as any).mock.calls[0];
        expect(args[2].headers['Authorization']).toBe('Bearer upload-token');
    });

    it('ignora propriedades herdadas no prototype', async () => {
        const fakeFile = new File(['conteudo'], 'teste.txt', { type: 'text/plain' });

        const MyClass = function(this: any) {
            this.ownProp = 'proprio';
        } as any;
        MyClass.prototype.inheritedProp = 'herdado';
        const dataObj = new MyClass();

        await apiUploadRoute('test.upload', [fakeFile], dataObj);

        const args = (axios.post as any).mock.calls.pop();
        const formData: FormData = args[1];

        expect(formData.has('inheritedProp')).toBe(false);
        expect(formData.get('ownProp')).toBe('proprio');
    });
});

describe('apiUploadRoute — regressão auditoria (achado 008)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/upload'
        });
        (axios.post as any).mockResolvedValue({ data: { uploaded: true } });
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('não lança quando files é null (valor padrão do parâmetro)', async () => {
        await expect(apiUploadRoute('test.upload')).resolves.toEqual({ uploaded: true });
    });

    it('aceita um File único fora de array', async () => {
        const fakeFile = new File(['x'], 'unico.txt', { type: 'text/plain' });

        await expect(apiUploadRoute('test.upload', fakeFile)).resolves.toEqual({ uploaded: true });

        const formData = (axios.post as any).mock.calls[0][1] as FormData;
        expect(formData.get('files[0]')).toBeTruthy();
    });

    it('retorna null e loga em caso de erro de rede, em vez de propagar', async () => {
        (axios.post as any).mockRejectedValue(new Error('Network error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const fakeFile = new File(['x'], 'a.txt');

        await expect(apiUploadRoute('test.upload', [fakeFile])).resolves.toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
    });
});
