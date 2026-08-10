import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { truncate, slugify, stripHtml, initials, readingTime } from './manipulations';

describe('truncate', () => {
    it('trunca string longa com reticências', () => {
        expect(truncate('Hello World, this is a test', 10)).toBe('Hello Worl...');
    });

    it('não trunca string menor que o limite', () => {
        expect(truncate('Hello', 20)).toBe('Hello');
    });

    it('suporta sufixo customizado', () => {
        expect(truncate('Hello World', 5, '---')).toBe('Hello---');
    });

    it('retorna vazio para null', () => {
        expect(truncate(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(truncate(ref('Texto longo'), 5)).toBe('Texto...');
    });
});

describe('slugify', () => {
    it('converte texto para slug', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    });

    it('remove acentos', () => {
        expect(slugify('Café com Leite')).toBe('cafe-com-leite');
    });

    it('remove caracteres especiais', () => {
        expect(slugify('Hello! @World#')).toBe('hello-world');
    });

    it('colapsa múltiplos hífens', () => {
        expect(slugify('hello   world')).toBe('hello-world');
    });

    it('retorna vazio para null', () => {
        expect(slugify(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(slugify(ref('Meu Post'))).toBe('meu-post');
    });
});

describe('stripHtml', () => {
    it('remove tags HTML simples', () => {
        expect(stripHtml('<p>Hello</p>')).toBe('Hello');
    });

    it('remove tags aninhadas', () => {
        expect(stripHtml('<div><span>Test</span></div>')).toBe('Test');
    });

    it('substitui &nbsp; por espaço', () => {
        expect(stripHtml('Hello&nbsp;World')).toBe('Hello World');
    });

    it('retorna vazio para null', () => {
        expect(stripHtml(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(stripHtml(ref('<b>bold</b>'))).toBe('bold');
    });
});

describe('initials', () => {
    it('extrai iniciais de nome completo (primeira e última inicial)', () => {
        expect(initials('João Victor Silva')).toBe('JS');
    });

    it('ignora preposições ao gerar iniciais', () => {
        expect(initials('João da Silva')).toBe('JS');
    });

    it('retorna uma inicial para nome simples', () => {
        expect(initials('João')).toBe('J');
    });

    it('respeita limite customizado', () => {
        expect(initials('João Victor Silva', 3)).toBe('JVS');
    });

    it('retorna vazio para null', () => {
        expect(initials(null)).toBe('');
    });

    it('retorna vazio para string vazia', () => {
        expect(initials('')).toBe('');
    });

    it('funciona com Ref', () => {
        expect(initials(ref('Maria Clara'))).toBe('MC');
    });
});

describe('readingTime', () => {
    it('calcula tempo de leitura para texto curto', () => {
        const text = Array(100).fill('word').join(' '); // 100 palavras
        expect(readingTime(text)).toBe('1 min de leitura');
    });

    it('calcula tempo de leitura para texto longo', () => {
        const text = Array(600).fill('word').join(' '); // 600 palavras → 3 min
        expect(readingTime(text)).toBe('3 min de leitura');
    });

    it('remove HTML antes de contar palavras', () => {
        const text = '<p>' + Array(200).fill('word').join(' ') + '</p>';
        expect(readingTime(text)).toBe('1 min de leitura');
    });

    it('retorna "0 min de leitura" para null', () => {
        expect(readingTime(null)).toBe('0 min de leitura');
    });

    it('retorna "0 min de leitura" para HTML vazio (cobre words === 0)', () => {
        expect(readingTime('<p></p>')).toBe('0 min de leitura');
    });

    it('retorna "0 min de leitura" para string vazia', () => {
        expect(readingTime('')).toBe('0 min de leitura');
    });

    it('funciona com Ref', () => {
        const text = Array(400).fill('word').join(' ');
        expect(readingTime(ref(text))).toBe('2 min de leitura');
    });
});
