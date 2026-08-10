export interface MemoizedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>;
    cache: Map<unknown, ReturnType<T>>;
}

/**
 * Cria uma função que memoriza o resultado de `func`. Por padrão, usa o
 * primeiro argumento como chave do cache (`Map`); `resolver`, se informado,
 * é chamado com os mesmos argumentos para calcular a chave. O cache
 * memorizado fica exposto em `.cache` e pode ser manipulado diretamente
 * (`.cache.clear()`, `.cache.delete(key)`, etc.).
 * Semelhante ao _.memoize do Lodash.
 *
 * @param func função a memorizar
 * @param resolver função opcional que calcula a chave do cache
 * @returns função memorizada, com `.cache`
 */
export function memoize<T extends (...args: any[]) => any>(func: T, resolver?: (...args: Parameters<T>) => unknown): MemoizedFunction<T> {
    if (typeof func !== 'function' || (resolver != null && typeof resolver !== 'function')) throw new TypeError('Expected a function');

    const CacheConstructor = memoize.Cache || Map;

    function memoized(this: unknown, ...args: Parameters<T>): ReturnType<T> {
        const key = resolver ? resolver.apply(this, args) : args[0];
        const cache = memoized.cache;

        if (cache.has(key)) return cache.get(key) as ReturnType<T>;

        const result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
    }

    memoized.cache = new CacheConstructor<unknown, ReturnType<T>>();
    return memoized;
}

memoize.Cache = Map;
