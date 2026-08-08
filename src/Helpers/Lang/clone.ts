import { unref, type MaybeRef } from 'vue';
import { baseClone } from './_baseClone';

/**
 * Cria uma cópia rasa (shallow) de `value`, preservando o tipo original
 * (`Date`, `RegExp`, `Map`, `Set`, `TypedArray`, instância de classe...).
 *
 * Peculiaridade: `Map`/`Set` sempre recursam nas próprias entradas mesmo em
 * clonagem rasa — os valores dentro de um `Map`/`Set` clonado não
 * compartilham identidade com os originais, diferente de objetos/arrays
 * comuns (que copiam só o primeiro nível).
 * Semelhante ao _.clone do Lodash.
 *
 * Usa `unref` em vez de `toValue`: o próprio valor a clonar pode ser uma
 * função, e `toValue` a invocaria como getter em vez de preservá-la para
 * clonagem (o Lodash clona funções como objeto comum, sem executá-las).
 *
 * @param value valor a clonar
 * @returns cópia rasa do valor
 */
export function clone<T>(value: MaybeRef<T>): T {
    const data = unref(value);
    return baseClone(data, false) as T;
}
