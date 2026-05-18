import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { n as isArray, t as isObject } from "./isObject-BPnkB1ef.js";
import { toValue } from "vue";
//#region src/Helpers/Objects/deepClone.ts
/**
* Cria uma cópia profunda de um valor, lidando com referências circulares e diversos tipos de dados.
* Semelhante ao _.cloneDeep do Lodash.
*
* @param value O valor a ser clonado.
* @param map Um WeakMap para rastrear referências circulares (uso interno).
* @returns Uma cópia profunda do valor.
*/
function deepClone(value, map = /* @__PURE__ */ new WeakMap()) {
	const data = toValue(value);
	if (data === null || typeof data !== "object") return data;
	if (map.has(data)) return map.get(data);
	let clone;
	if (data instanceof Date) return new Date(data.getTime());
	if (data instanceof RegExp) return new RegExp(data.source, data.flags);
	if (data instanceof Map) {
		clone = /* @__PURE__ */ new Map();
		map.set(data, clone);
		data.forEach((val, key) => {
			clone.set(deepClone(key, map), deepClone(val, map));
		});
		return clone;
	}
	if (data instanceof Set) {
		clone = /* @__PURE__ */ new Set();
		map.set(data, clone);
		data.forEach((val) => {
			clone.add(deepClone(val, map));
		});
		return clone;
	}
	clone = Array.isArray(data) ? [] : {};
	map.set(data, clone);
	const keys = [...Object.keys(data), ...Object.getOwnPropertySymbols(data)];
	for (const key of keys) clone[key] = deepClone(data[key], map);
	return clone;
}
//#endregion
//#region src/Helpers/Objects/get.ts
/**
* Obtém o valor no caminho específico de um objeto.
* Semelhante ao _.get do Lodash.
*
* @param object O objeto para consultar.
* @param path O caminho da propriedade a ser obtida (string ou array).
* @param defaultValue O valor retornado se o caminho resolvido for undefined.
* @returns Retorna o valor resolvido.
*/
function get(object, path, defaultValue) {
	const data = toValue(object);
	if (data === null || data === void 0) return defaultValue;
	const pathArray = Array.isArray(path) ? path : path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "").split(".");
	let result = data;
	for (const key of pathArray) {
		if (result === null || result === void 0) break;
		result = result[key];
	}
	return result === void 0 ? defaultValue : result;
}
//#endregion
//#region src/Helpers/Objects/unset.ts
/**
* Remove a propriedade em um caminho específico de um objeto.
* Semelhante ao _.unset do Lodash.
*
* @param object O objeto a ser modificado.
* @param path O caminho da propriedade a ser removida (string ou array).
* @returns Retorna true se a propriedade for removida com sucesso, caso contrário false.
*/
function unset(object, path) {
	const data = toValue(object);
	if (data === null || typeof data !== "object") return false;
	const pathArray = Array.isArray(path) ? path : path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "").split(".");
	let current = data;
	for (let i = 0; i < pathArray.length - 1; i++) {
		const key = pathArray[i];
		if (!(key in current)) return true;
		current = current[key];
		if (current === null || typeof current !== "object") return true;
	}
	const lastKey = pathArray[pathArray.length - 1];
	return delete current[lastKey];
}
//#endregion
//#region src/Helpers/Objects/isEqual.ts
/**
* Realiza uma comparação profunda entre dois valores para determinar se eles são equivalentes.
* Semelhante ao _.isEqual do Lodash.
*
* @param value O valor a ser comparado.
* @param other O outro valor a ser comparado.
* @returns Retorna true se os valores forem equivalentes, caso contrário false.
*/
function isEqual(value, other) {
	const a = toValue(value);
	const b = toValue(other);
	if (a === b) return true;
	if (Number.isNaN(a) && Number.isNaN(b)) return true;
	if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
	if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
	if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
	if (a instanceof Map && b instanceof Map) {
		if (a.size !== b.size) return false;
		for (const [key, val] of a) if (!b.has(key) || !isEqual(val, b.get(key))) return false;
		return true;
	}
	if (a instanceof Set && b instanceof Set) {
		if (a.size !== b.size) return false;
		const arrayB = Array.from(b);
		for (const valA of a) if (!arrayB.some((valB) => isEqual(valA, valB))) return false;
		return true;
	}
	const isArrayA = Array.isArray(a);
	const isArrayB = Array.isArray(b);
	if (isArrayA !== isArrayB) return false;
	if (isArrayA && isArrayB) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (!isEqual(a[i], b[i])) return false;
		return true;
	}
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if (keysA.length !== keysB.length) return false;
	for (const key of keysA) if (!Object.prototype.hasOwnProperty.call(b, key) || !isEqual(a[key], b[key])) return false;
	return true;
}
//#endregion
//#region src/Helpers/Objects/deepMerge.ts
/**
* Une dois ou mais objetos de forma profunda, mesclando inclusive propriedades aninhadas.
* Útil para lidar com configurações padrão que precisam ser sobrescritas parcialmente por configurações do usuário.
*
* @param target O objeto alvo que receberá as propriedades.
* @param sources Um ou mais objetos de origem para mesclar.
* @returns O objeto mesclado (modifica o primeiro objeto e o retorna).
*/
function deepMerge(target, ...sources) {
	const dataTarget = toValue(target);
	if (!sources.length) return dataTarget;
	const dataSource = toValue(sources.shift());
	if (isObject(dataTarget) && !isArray(dataTarget) && isObject(dataSource) && !isArray(dataSource)) Object.keys(dataSource).forEach((key) => {
		const targetValue = dataTarget[key];
		const sourceValue = dataSource[key];
		if (isObject(sourceValue) && !isArray(sourceValue)) {
			if (!targetValue || !isObject(targetValue) || isArray(targetValue)) dataTarget[key] = {};
			deepMerge(dataTarget[key], sourceValue);
		} else dataTarget[key] = sourceValue;
	});
	return deepMerge(dataTarget, ...sources);
}
//#endregion
//#region src/Helpers/Objects/renameKeys.ts
/**
* Altera os nomes das chaves de um objeto usando um mapa de "de/para".
* Útil para adaptar dados da API para o seu padrão.
*
* @param object O objeto original.
* @param map O mapa de renomeação { chaveAntiga: chaveNova }.
* @returns Um novo objeto com as chaves renomeadas.
*/
function renameKeys(object, map) {
	const rawObject = toValue(object);
	const rawMap = toValue(map);
	const renamedObject = {};
	Object.keys(rawObject).forEach((key) => {
		const newKey = rawMap[key] || key;
		renamedObject[newKey] = rawObject[key];
	});
	return renamedObject;
}
//#endregion
//#region src/Helpers/Objects/manipulations.ts
/**
* Cria um novo objeto contendo apenas as chaves que você especificar do objeto original.
*
* @param obj O objeto original (pode ser um Ref).
* @param keys As chaves a serem mantidas.
*/
function pick(obj, keys) {
	const data = toValue(obj);
	const result = {};
	if (!data) return result;
	keys.forEach((key) => {
		if (key in data) result[key] = data[key];
	});
	return result;
}
/**
* Cria um novo objeto removendo as chaves que você não deseja do objeto original.
*
* @param obj O objeto original (pode ser um Ref).
* @param keys As chaves a serem removidas.
*/
function omit(obj, keys) {
	const data = toValue(obj);
	const result = { ...data };
	if (!data) return result;
	keys.forEach((key) => {
		if (key in result) delete result[key];
	});
	return result;
}
//#endregion
//#region src/Helpers/Objects/mapValues.ts
/**
* Cria um novo objeto transformando apenas os valores, mas mantendo as chaves originais.
*
* @param obj O objeto original.
* @param fn A função de transformação que recebe (valor, chave, objeto).
* @returns Um novo objeto com os valores transformados.
*/
function mapValues(obj, fn) {
	const data = toValue(obj);
	const result = {};
	Object.keys(data).forEach((key) => {
		const k = key;
		result[k] = fn(data[k], k, data);
	});
	return result;
}
//#endregion
//#region src/Helpers/Objects/set.ts
/**
* Define o valor em um caminho específico de um objeto.
* Se o caminho não existir, ele será criado.
*
* @param object O objeto a ser modificado.
* @param path O caminho da propriedade a ser definida (string ou array).
* @param value O valor a ser definido.
* @returns Retorna o objeto modificado.
*/
function set(object, path, value) {
	const data = toValue(object);
	if (data === null || data === void 0) return object;
	const pathArray = Array.isArray(path) ? path : path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "").split(".");
	let current = data;
	const length = pathArray.length;
	for (let i = 0; i < length; i++) {
		const key = pathArray[i];
		if (i === length - 1) current[key] = value;
		else {
			if (current[key] === void 0 || current[key] === null || typeof current[key] !== "object") current[key] = {};
			current = current[key];
		}
	}
	return object;
}
//#endregion
//#region src/Helpers/Objects/diff.ts
/**
* Compara dois objetos e retorna um novo objeto contendo apenas as propriedades que foram alteradas.
* Útil para otimização de performance ao enviar apenas o que mudou para o backend (PATCH requests).
*
* @param oldObj O objeto original (estado anterior).
* @param newObj O objeto atualizado (estado novo).
* @param alwaysKeep Lista de chaves que devem ser obrigatoriamente mantidas no resultado, mesmo que não tenham mudado.
*/
function diff(oldObj, newObj, alwaysKeep = []) {
	const original = toValue(oldObj) || {};
	const updated = toValue(newObj) || {};
	const result = {};
	alwaysKeep.forEach((key) => {
		if (key in updated) result[key] = updated[key];
	});
	Object.keys(updated).forEach((key) => {
		const val1 = original[key];
		const val2 = updated[key];
		if (!isEqual(val1, val2)) result[key] = val2;
	});
	return result;
}
//#endregion
//#region src/Helpers/Objects/index.ts
var Objects_exports = /* @__PURE__ */ __exportAll({
	Obj: () => Obj,
	cloneDeep: () => deepClone,
	deepClone: () => deepClone,
	deepMerge: () => deepMerge,
	diff: () => diff,
	get: () => get,
	isEqual: () => isEqual,
	mapValues: () => mapValues,
	omit: () => omit,
	pick: () => pick,
	renameKeys: () => renameKeys,
	set: () => set,
	unset: () => unset
});
var Obj = {
	deepClone,
	cloneDeep: deepClone,
	get,
	set,
	unset,
	isEqual,
	deepMerge,
	renameKeys,
	pick,
	omit,
	mapValues,
	diff
};
//#endregion
export { mapValues as a, renameKeys as c, unset as d, get as f, set as i, deepMerge as l, Objects_exports as n, omit as o, deepClone as p, diff as r, pick as s, Obj as t, isEqual as u };

//# sourceMappingURL=Objects-BvjDI8RK.js.map