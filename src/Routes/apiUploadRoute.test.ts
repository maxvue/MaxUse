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

    it('ignora campos null e undefined em data e preserva Blobs soltos', async () => {
        const fakeFile = new File(['conteudo'], 'teste.txt', { type: 'text/plain' });
        const blobData = new Blob(['outros dados'], { type: 'text/plain' });

        await apiUploadRoute('test.upload', [fakeFile], { a: null, b: undefined, anexoBlob: blobData });

        const args = (axios.post as any).mock.calls.pop();
        const formData: FormData = args[1];

        expect(formData.has('a')).toBe(false);
        expect(formData.has('b')).toBe(false);
        expect(formData.get('anexoBlob')).toBeInstanceOf(Blob);
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


describe('apiUploadRoute - cancelamento (AbortSignal)', () => {
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

    it('propaga options.signal para o config do axios', async () => {
        const controller = new AbortController();

        await apiUploadRoute('test.upload', null, {}, { signal: controller.signal });

        const received = (axios.post as any).mock.calls[0][2];
        expect(received.signal).toBe(controller.signal);
    });

    it('não envia signal quando não informado', async () => {
        await apiUploadRoute('test.upload', null, {});

        const received = (axios.post as any).mock.calls[0][2];
        expect('signal' in received).toBe(false);
    });

    it('deixa de invocar onUploadProgress após o abort (desmontagem do componente)', async () => {
        const controller = new AbortController();
        const onUploadProgress = vi.fn();

        await apiUploadRoute('test.upload', null, {}, { signal: controller.signal, onUploadProgress });

        const wrapper = (axios.post as any).mock.calls[0][2].onUploadProgress;
        expect(typeof wrapper).toBe('function');

        // Antes do abort o callback do consumidor é chamado normalmente
        wrapper({ loaded: 10, total: 100 });
        expect(onUploadProgress).toHaveBeenCalledTimes(1);

        // Depois do abort nenhum evento em trânsito escreve no consumidor
        controller.abort();
        wrapper({ loaded: 50, total: 100 });
        expect(onUploadProgress).toHaveBeenCalledTimes(1);
    });

    it('não loga nem chama onError quando o upload é cancelado', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const onError = vi.fn();
        (axios.post as any).mockRejectedValue({ code: 'ERR_CANCELED', name: 'CanceledError', message: 'canceled' });

        const result = await apiUploadRoute('test.upload', null, {}, { onError });

        expect(result).toBeNull();
        expect(onError).not.toHaveBeenCalled();
        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
