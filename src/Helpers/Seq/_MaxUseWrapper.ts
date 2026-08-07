/**
 * Wrapper de encadeamento (chaining) compartilhado pelos helpers de `Seq`.
 *
 * Este arquivo é **interno** (prefixo `_`, não é registrado em `index.ts`
 * nem exportado publicamente). Ele existe porque `chain`, `tap`, `thru`,
 * `value`, `commit`, `plant`, `next` e todos os `wrapper*` do Lodash não são
 * helpers independentes: eles giram em torno de uma única estrutura de
 * "valor encadeado" (o `LodashWrapper` interno do Lodash).
 *
 * Diferente do Lodash real, que usa `LazyWrapper` para permitir "shortcut
 * fusion" (fusão de iteratees para evitar arrays intermediários), esta
 * implementação **não** replica lazy evaluation elaborada — cada método
 * encadeável empilha uma ação em `__actions__` e o valor só é resolvido
 * quando `.value()` é chamado. O comportamento observável (`.value()`,
 * `.commit()`, `.plant()`, `.next()`, encadeamento de `.map().filter()...`)
 * é fiel ao Lodash; a otimização interna de fusão de loops não é replicada
 * porque nenhum comportamento observável documentado depende dela.
 *
 * ## Design
 *
 * - `__wrapped__`: valor original passado para `chain(value)`.
 * - `__actions__`: fila de ações pendentes, cada uma `{ func, args }`. Uma
 *   ação é aplicada como `func(resultadoAnterior, ...args)`.
 * - `__chain__`: sempre `true` para instâncias criadas via `chain()` — não
 *   existe caminho de encadeamento implícito nesta migração (o Lodash tem
 *   um caminho de encadeamento implícito via `_(value)`, mas isso pertence
 *   ao helper `lodash`/`wrapperLodash`, não ao wrapper em si).
 * - `__index__` / `__values__`: estado interno consumido por `.next()`
 *   (protocolo de iterador).
 *
 * ## Como os `wrapper*` se penduram nesta classe
 *
 * Cada arquivo `wrapper<Nome>.ts` (ex.: `wrapperAt.ts`, `wrapperReverse.ts`)
 * define seu método **no protótipo** de `MaxUseWrapper`, como mixin — o
 * mesmo padrão do Lodash real, onde métodos de instância vivem em arquivos
 * próprios e são anexados ao protótipo do wrapper. Isso mantém cada arquivo
 * de helper coeso com seu plano individual (`plans/Seq/<nome>.md`), sem
 * duplicar a definição da classe em cada um.
 *
 * Métodos encadeáveis (que retornam um novo wrapper, ex.: `.thru()`,
 * `.tap()` como métodos de instância) empilham uma ação e retornam uma nova
 * instância de `MaxUseWrapper` apontando para a mesma fila de ações mais a
 * nova. Métodos terminais (`.value()`, `.commit()`, `.plant()`, `.next()`)
 * resolvem ou transformam o encadeamento e não retornam necessariamente um
 * wrapper.
 */
export interface WrapperAction {
    func: (value: unknown, ...args: unknown[]) => unknown;
    args: unknown[];
}

export class MaxUseWrapper<T = unknown> {
    __wrapped__: T;
    __actions__: WrapperAction[];
    __chain__: boolean;
    __index__: number;
    __values__: unknown[] | undefined;

    constructor(value: T, chainAll: boolean = false, actions: WrapperAction[] = []) {
        this.__wrapped__ = value;
        this.__actions__ = actions;
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = undefined;
    }

    /**
     * Resolve a fila de ações sobre o valor encadeado e retorna o valor
     * plano (nunca um wrapper). Equivalente a `_baseWrapperValue` do Lodash.
     */
    value(): unknown {
        return this.__actions__.reduce((result, action) => action.func(result, ...action.args), this.__wrapped__ as unknown);
    }

    /**
     * Empilha uma ação na fila e retorna um **novo** wrapper — nunca muta
     * a instância atual. Usado pelos métodos de instância encadeáveis
     * (`.thru()`, `.tap()` etc.) definidos nos arquivos `wrapper*.ts`.
     */
    _pushAction(func: WrapperAction['func'], ...args: unknown[]): MaxUseWrapper<T> {
        return new MaxUseWrapper<T>(this.__wrapped__, this.__chain__, [...this.__actions__, { func, args }]);
    }
}

/**
 * Cria um wrapper de encadeamento explícito (equivalente a `_.chain`).
 * Função interna — o helper público `chain` (em `chain.ts`) delega para
 * esta função.
 *
 * @param value valor a encadear
 * @returns novo `MaxUseWrapper` com `__chain__` habilitado
 */
export function createWrapper<T>(value: T): MaxUseWrapper<T> {
    return new MaxUseWrapper<T>(value, true);
}
