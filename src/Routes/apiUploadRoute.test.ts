import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiUploadRoute } from '../../src/Routes/apiUploadRoute';
import axios from 'axios';
import * as apiRouteModule from '../../src/Routes/apiRoute';

vi.mock('axios');

describe('apiUploadRoute', () => {
    let mockApiRoute: any;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockApiRoute = vi.spyOn(apiRouteModule, 'apiRoute').mockReturnValue({
            option_load_screen: null,
            routeURL: 'https://api.example.com/upload'
        });
        
        (axios.post as any).mockResolvedValue({ data: { uploaded: true } });

        document.head.innerHTML = '<meta name="csrf-token" content="fake-token-upload">';
        
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
        
        expect(args[2].headers['X-CSRF-TOKEN']).toBe('fake-token-upload');
        expect(result).toEqual({ uploaded: true });
    });

    it('trata files encapsulados num objeto { files: [...] }', async () => {
        const fakeFile = new File([''], 'teste2.png', { type: 'image/png' });
        
        await apiUploadRoute('test.upload', { files: [fakeFile] });
        
        const args = (axios.post as any).mock.calls[0];
        const formData: FormData = args[1];
        expect(formData.get('files[0]')).toBeInstanceOf(Blob);
    });

    it('funciona sem token csrf no header', async () => {
        document.head.innerHTML = '';
        const fakeFile = new File([''], 'teste2.png', { type: 'image/png' });
        await apiUploadRoute('test.upload', [fakeFile]);
        
        const args = (axios.post as any).mock.calls[0];
        expect(args[2].headers['X-CSRF-TOKEN']).toBe('');
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
