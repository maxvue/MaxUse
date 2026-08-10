import { type MaybeRefOrGetter, toValue } from 'vue';
import Color from 'color';
import type { ColorInstance } from 'color';

function safeColor(colorStr: string): ColorInstance {
    try {
        return Color(colorStr || 'transparent');
    } catch {
        return Color('transparent');
    }
}

/**
 * Obtém a instância do Color a partir de uma variável CSS ou valor de cor, com suporte a reatividade e compatibilidade SSR.
 *
 * @param color_var_value - O valor da cor, nome da variável (ex: '--primary-color') ou chamada var() (ex: 'var(--primary-color)').
 * @returns Instância do Color.
 */
export function getColorFromVar(color_var_value: MaybeRefOrGetter<string>): ColorInstance {
    const value = toValue(color_var_value);
    const cleaned_value = String(value || '').trim().replace(/\s*!important\s*$/, '');

    if (!cleaned_value) return safeColor('transparent');

    if (cleaned_value.startsWith('rgb') || cleaned_value.startsWith('#') || cleaned_value.startsWith('hsl')) return safeColor(cleaned_value);


    if (!cleaned_value.startsWith('--') && !cleaned_value.includes('var')) return safeColor(cleaned_value);


    // SSR Guard
    if (typeof window === 'undefined' || typeof document === 'undefined') return safeColor('transparent');


    try {
        const color_var_name = cleaned_value.replace(/^var\((--.*?)\)$/, '$1').trim();
        const root: HTMLElement = document.documentElement;
        const style: CSSStyleDeclaration = window.getComputedStyle(root);
        const resolved_value = style.getPropertyValue(color_var_name).trim();

        return safeColor(resolved_value);
    } catch {
        return safeColor('transparent');
    }
}

/**
 * Obtém uma cor contrastante a partir de uma variável CSS ou valor de cor, com suporte a reatividade.
 *
 * @param color_var_value - O valor da cor ou variável CSS.
 * @returns A cor contrastante em formato hexadecimal.
 */
export const contrastColor = (color_var_value: MaybeRefOrGetter<string>): string => {
    const colorInstance = getColorFromVar(color_var_value);
    if (colorInstance.isLight()) return colorInstance.darken(0.5).hexa();

    return colorInstance.lighten(0.9).hexa();
};

export const getContrastColor = contrastColor;
export const getColorOpposite = contrastColor;
export const getOppositeColor = contrastColor;