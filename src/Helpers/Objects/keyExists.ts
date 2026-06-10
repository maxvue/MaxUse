import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se a chave existe em um determinado segmento de caminho (dot notation).
 */
function checkSingleKey(key: string, item: Record<string, any>): boolean {
    const pathArray = key.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');

    let current: any = item;

    for (let i = 0; i < pathArray.length; i++) {
        const segment = pathArray[i];

        if (current === null || current === undefined || typeof current !== 'object') return false;


        if (!(segment in current)) return false;


        // Avança para o próximo nível apenas se não for o último segmento
        if (i < pathArray.length - 1) current = current[segment];

    }

    return true;
}

/**
 * Verifica se uma ou mais chaves existem em um objeto.
 * Suporta dot notation (ex: 'client.name') para verificar chaves aninhadas.
 * Ambos os parâmetros aceitam valores reativos (Ref, Getter).
 *
 * @param keys Uma chave ou array de chaves a serem verificadas (suporta dot notation).
 * @param item O objeto onde as chaves serão buscadas.
 * @param mode `'some'` (padrão) retorna `true` se pelo menos uma chave existir.
 *             `'every'` retorna `true` somente se todas as chaves existirem.
 * @returns `true` ou `false` conforme o modo selecionado.
 */
export function keyExists( keys: MaybeRefOrGetter<string | string[]>, item: MaybeRefOrGetter<any>, mode: 'some' | 'every' = 'some' ): boolean {
    const resolvedKeys = toValue(keys);
    const resolvedItem = toValue(item);

    if (resolvedItem === null || resolvedItem === undefined || typeof resolvedItem !== 'object' || Array.isArray(resolvedItem)) return false;


    const keyArray = Array.isArray(resolvedKeys) ? resolvedKeys : [resolvedKeys];

    if (keyArray.length === 0) return false;


    return mode === 'every'
        ? keyArray.every((k) => checkSingleKey(k, resolvedItem))
        : keyArray.some((k) => checkSingleKey(k, resolvedItem));
}
