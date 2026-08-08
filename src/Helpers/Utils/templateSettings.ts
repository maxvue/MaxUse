/**
 * Configuração usada por `template()` para reconhecer os delimitadores de
 * interpolação (`<%= %>`), escape (`<%- %>`) e avaliação (`<% %>`), além de
 * `variable` (nome da variável de dados dentro do template) e `imports`
 * (valores extras disponíveis no escopo do template compilado, por padrão
 * `{ _: <objeto com utilidades básicas> }`).
 * Semelhante ao _.templateSettings do Lodash.
 */
export interface TemplateSettings {
    escape: RegExp;
    evaluate: RegExp;
    interpolate: RegExp;
    variable: string;
    imports: Record<string, unknown>;
}

export const templateSettings: TemplateSettings = {
    escape: /<%-([\s\S]+?)%>/g,
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    variable: '',
    imports: {}
};
