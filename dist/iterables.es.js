import { t as __exportAll } from "./chunk-DDJX3-wc.js";
import { n as isBlank } from "./isBlank-DrIS5hlK.js";
import { toValue } from "vue";
//#region src/Helpers/Iterables/countBy.ts
/**
* Conta o número de elementos em uma coleção que possuem um determinado valor para uma chave.
*
* @param collection A coleção de objetos.
* @param key A chave a ser verificada.
* @param value O valor a ser comparado (padrão é true).
* @returns O número de elementos correspondentes.
*/
function countBy(collection, key, value = true) {
	const data = toValue(collection);
	if (!data || typeof data !== "object") return 0;
	return (Array.isArray(data) ? data : Object.values(data)).reduce((acc, item) => acc + (item[key] === value ? 1 : 0), 0);
}
//#endregion
//#region src/Helpers/Iterables/filter.ts
/**
* Filtra uma coleção com base em uma função de callback.
*
* @param collection A coleção de objetos.
* @param callback A função de callback para avaliar cada item.
* @returns A coleção filtrada.
*/
function filter(collection, callback) {
	const data = toValue(collection);
	if (!data || typeof data !== "object") return Array.isArray(data) ? [] : {};
	if (Array.isArray(data)) return data.filter((item) => callback(item));
	return Object.fromEntries(Object.entries(data).filter(([, item]) => callback(item)));
}
//#endregion
//#region src/Helpers/Iterables/filterBy.ts
/**
* Filtra uma coleção mantendo apenas os elementos que possuem um determinado valor para uma chave.
*
* @param collection A coleção de objetos.
* @param key A chave a ser verificada.
* @param value O valor a ser comparado (padrão é true).
* @returns A coleção filtrada.
*/
function filterBy(collection, key, value = true) {
	const data = toValue(collection);
	if (!data || typeof data !== "object") return [];
	if (Array.isArray(data)) return data.filter((item) => item[key] === value);
	return Object.fromEntries(Object.entries(data).filter(([, item]) => item[key] === value));
}
//#endregion
//#region src/Helpers/Iterables/filterByNot.ts
/**
* Filtra uma coleção removendo os elementos que possuem um determinado valor para uma chave.
*
* @param collection A coleção de objetos.
* @param key A chave a ser verificada.
* @param value O valor ou array de valores a serem excluídos (padrão é true).
* @returns A coleção filtrada.
*/
function filterByNot(collection, key, value = true) {
	const data = toValue(collection);
	if (!data || typeof data !== "object") return Array.isArray(data) ? [] : {};
	const isExcluded = (item) => {
		const itemValue = item?.[key];
		if (Array.isArray(value)) return value.includes(itemValue);
		return itemValue === value;
	};
	if (Array.isArray(data)) return data.filter((item) => !isExcluded(item));
	return Object.fromEntries(Object.entries(data).filter(([, item]) => !isExcluded(item)));
}
//#endregion
//#region src/Helpers/Iterables/groupBy.ts
/**
* Agrupa os elementos de uma coleção de acordo com o resultado de um iteratee.
* Semelhante ao _.groupBy do Lodash.
*
* @param collection A coleção para iterar.
* @param iteratee O iteratee para transformar as chaves.
* @returns Retorna o objeto agrupado.
*/
function groupBy(collection, iteratee) {
	const data = toValue(collection);
	if (!data) return {};
	const items = Array.isArray(data) ? data : Object.values(data);
	const result = {};
	for (const item of items) {
		let key;
		if (typeof iteratee === "function") key = iteratee(item);
		else key = item[iteratee];
		const groupKey = String(key);
		if (!result[groupKey]) result[groupKey] = [];
		result[groupKey].push(item);
	}
	return result;
}
//#endregion
//#region src/Helpers/Iterables/keyBy.ts
/**
* Cria um objeto composto por chaves geradas a partir dos resultados da execução de cada elemento de uma coleção através de uma chave especificada.
*
* @param collection A coleção de objetos.
* @param key A chave a ser usada como índice do novo objeto.
* @returns Um objeto mapeado pela chave especificada.
*/
function keyBy(collection, key) {
	const data = toValue(collection);
	if (!data || typeof data !== "object") return {};
	const items = Array.isArray(data) ? data : Object.values(data);
	return Object.fromEntries(items.map((item) => {
		const k = item[key];
		return [k !== null && k !== "" && !isNaN(Number(k)) ? String(k) + " " : String(k), item];
	}));
}
//#endregion
//#region src/Helpers/Iterables/orderBy.ts
/**
* Ordena uma coleção de objetos com base em um ou mais critérios.
*
* @param collection A coleção de objetos a ser ordenada.
* @param criteria O(s) critério(s) de ordenação (string, array de strings ou objeto com chaves e direções).
* @param defaultOrder A direção de ordenação padrão se não for especificada (padrão é 'desc').
* @returns Um novo array contendo a coleção ordenada.
*/
function orderBy(collection, criteria, defaultOrder = "desc") {
	const data = toValue(collection);
	if (!data || typeof data !== "object") return [];
	const items = Array.isArray(data) ? data : Object.values(data);
	const rules = [];
	if (typeof criteria === "string") rules.push({
		key: criteria,
		order: defaultOrder
	});
	else if (Array.isArray(criteria)) criteria.forEach((k) => rules.push({
		key: k,
		order: defaultOrder
	}));
	else if (typeof criteria === "object" && criteria !== null) for (const key in criteria) rules.push({
		key,
		order: criteria[key]
	});
	return [...items].sort((a, b) => {
		for (const rule of rules) {
			const valA = a[rule.key];
			const valB = b[rule.key];
			if (valA < valB) return rule.order === "asc" ? -1 : 1;
			if (valA > valB) return rule.order === "asc" ? 1 : -1;
		}
		return 0;
	});
}
//#endregion
//#region src/Helpers/Iterables/orderByWithKey.ts
/**
* Ordena uma coleção de objetos com base em critérios e, em seguida, mapeia os resultados para um objeto indexado por uma chave específica.
*
* @param collection A coleção de objetos a ser ordenada e indexada.
* @param criteria O(s) critério(s) de ordenação.
* @param object_keyBy A chave a ser usada como índice do objeto retornado.
* @param order A direção de ordenação (padrão é 'asc').
* @param defaultOrder A direção de ordenação padrão.
* @returns Um objeto mapeado pela chave e ordenado de acordo com os critérios.
*/
function orderByWithKey(collection, criteria, object_keyBy, order = "asc", defaultOrder = "asc") {
	return keyBy(orderBy(collection, criteria, defaultOrder), object_keyBy);
}
//#endregion
//#region src/Helpers/Iterables/sortBy.ts
/**
* Cria um array de elementos, ordenados em ordem crescente pelos resultados da execução de cada iteratee.
* Semelhante ao _.sortBy do Lodash.
*
* @param collection A coleção para iterar.
* @param iteratees Os iteratees para ordenar.
* @returns Retorna o novo array ordenado.
*/
function sortBy(collection, iteratees = [(x) => x]) {
	const data = toValue(collection);
	if (!data) return [];
	const items = Array.isArray(data) ? [...data] : Object.values(data);
	const iters = Array.isArray(iteratees) ? iteratees : [iteratees];
	return items.sort((a, b) => {
		for (const iteratee of iters) {
			let valA;
			let valB;
			if (typeof iteratee === "function") {
				valA = iteratee(a);
				valB = iteratee(b);
			} else if (typeof iteratee === "string") {
				valA = a[iteratee];
				valB = b[iteratee];
			} else {
				valA = a;
				valB = b;
			}
			if (valA !== valB) {
				if (valA === void 0) return 1;
				if (valB === void 0) return -1;
				if (valA === null) return 1;
				if (valB === null) return -1;
				return valA < valB ? -1 : 1;
			}
		}
		return 0;
	});
}
//#endregion
//#region src/Helpers/Iterables/sum.ts
/**
* Calcula a soma dos valores em uma coleção.
* Semelhante ao _.sum do Lodash.
*
* @param collection A coleção para iterar.
* @returns Retorna a soma.
*/
function sum(collection) {
	const data = toValue(collection);
	if (!data) return 0;
	return (Array.isArray(data) ? data : Object.values(data)).reduce((acc, val) => {
		const num = parseFloat(val);
		return acc + (isNaN(num) ? 0 : num);
	}, 0);
}
//#endregion
//#region src/Helpers/Iterables/sumBy.ts
/**
* Soma os valores de uma propriedade específica em uma coleção de objetos.
*
* @param collection A coleção de objetos.
* @param key A chave que contém o valor numérico a ser somado.
* @returns A soma total dos valores numéricos da chave especificada.
*/
function sumBy(collection, key) {
	const data = toValue(collection);
	if (!data || typeof data !== "object") return 0;
	return (Array.isArray(data) ? data : Object.values(data)).reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
}
//#endregion
//#region src/Helpers/Iterables/uniq.ts
/**
* Cria uma versão sem duplicatas de um array.
* Semelhante ao _.uniq do Lodash.
*
* @param array O array a ser processado.
* @returns Retorna o novo array de valores únicos.
*/
function uniq(array) {
	const data = toValue(array);
	if (!Array.isArray(data)) return [];
	return Array.from(new Set(data));
}
//#endregion
//#region src/Helpers/Iterables/valuesInKey.ts
/**
* Extrai e retorna um array plano (flat) contendo os valores de uma chave específica de todos os objetos em uma coleção.
*
* @param collection A coleção de objetos.
* @param key A chave a ser extraída de cada objeto.
* @param default_value O valor padrão a ser usado caso a chave não exista ou seja nula (padrão é false).
* @returns Um array contendo os valores extraídos.
*/
function valuesInKey(collection, key, default_value = false) {
	const data = toValue(collection);
	if (!data || typeof data !== "object") return [];
	return (Array.isArray(data) ? data : Object.values(data)).flatMap((list) => {
		const value = list[key] ?? default_value;
		if (Array.isArray(value)) return value;
		if (typeof value === "object") return Object.values(value);
		return [value];
	});
}
//#endregion
//#region src/Helpers/Iterables/size.ts
/**
* Retorna o tamanho (comprimento) de uma coleção, string, objeto, Map ou Set.
*
* @param value O valor a ter seu tamanho calculado.
* @param allow_number Se verdadeiro, retorna o próprio valor numérico caso o tipo seja número (padrão é true).
* @returns O tamanho do valor especificado.
*/
function size(value, allow_number = true) {
	if (!value) return 0;
	const data = toValue(value);
	if (!data) return 0;
	if (isBlank(data, false)) return 0;
	if (typeof data === "number" && allow_number) return data;
	if (Array.isArray(data) || typeof data === "string") return data.length;
	if (data instanceof Map || data instanceof Set) return data.size;
	if (typeof data === "object") return Object.keys(data).length;
	return data.length;
}
//#endregion
//#region src/Helpers/Iterables/sample.ts
/**
* Obtém um elemento aleatório de uma coleção.
* Semelhante ao _.sample do Lodash.
*
* @param collection A coleção de onde extrair o elemento.
* @returns Retorna o elemento aleatório.
*/
function sample(collection) {
	const data = toValue(collection);
	if (!data) return void 0;
	const items = Array.isArray(data) ? data : Object.values(data);
	if (items.length === 0) return void 0;
	return items[Math.floor(Math.random() * items.length)];
}
//#endregion
//#region src/Helpers/Iterables/shuffle.ts
/**
* Embaralha os elementos de um array de forma aleatória.
* Algoritmo de Fisher-Yates.
*
* @param array O array a ser embaralhado.
*/
function shuffle(array) {
	const data = [...toValue(array)];
	for (let i = data.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[data[i], data[j]] = [data[j], data[i]];
	}
	return data;
}
//#endregion
//#region src/Helpers/Iterables/chunk.ts
/**
* Divide um array em sub-arrays de um tamanho específicado.
*
* @param array O array a ser dividido.
* @param size O tamanho de cada pedaço.
*/
function chunk(array, size = 1) {
	const data = toValue(array);
	if (!data || data.length === 0 || size <= 0) return [];
	const result = [];
	for (let i = 0; i < data.length; i += size) result.push(data.slice(i, i + size));
	return result;
}
//#endregion
//#region src/Helpers/Iterables/uniqueBy.ts
/**
* Retorna itens únicos de um array de objetos com base em uma propriedade específica.
* Útil para limpar listas de dados vindas de múltiplas fontes ou após junções de arrays.
*
* @param array O array a ser processado (pode ser um Ref).
* @param key A chave usada para identificar a unicidade ou uma função seletora.
* @returns Retorna o novo array de valores únicos.
*/
function uniqueBy(array, key) {
	const data = toValue(array);
	if (!Array.isArray(data)) return [];
	const seen = /* @__PURE__ */ new Set();
	return data.filter((item) => {
		const k = typeof key === "function" ? key(item) : item[key];
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}
//#endregion
//#region src/Helpers/Iterables/findLast.ts
/**
* Encontra o último item de uma lista que satisfaça uma condição.
*
* @param collection A coleção para pesquisar.
* @param predicate A função executada por iteração.
* @returns Retorna o elemento correspondente encontrado, ou undefined.
*/
function findLast(collection, predicate) {
	const data = toValue(collection);
	if (!data || !Array.isArray(data)) return void 0;
	for (let i = data.length - 1; i >= 0; i--) if (predicate(data[i], i, data)) return data[i];
}
//#endregion
//#region src/Helpers/Iterables/sortByMulti.ts
/**
* Ordena um array por múltiplos critérios.
*
* @param collection A coleção para ordenar.
* @param criteria Lista de critérios (string de chave ou função de extração de valor).
* @param orders Lista de ordens ('asc' ou 'desc') correspondente aos critérios.
* @returns Retorna o novo array ordenado.
*/
function sortByMulti(collection, criteria, orders = []) {
	const data = toValue(collection);
	if (!data || !Array.isArray(data)) return [];
	return [...data].sort((a, b) => {
		for (let i = 0; i < criteria.length; i++) {
			const criterion = criteria[i];
			const order = orders[i] || "asc";
			let valA;
			let valB;
			if (typeof criterion === "function") {
				valA = criterion(a);
				valB = criterion(b);
			} else {
				valA = a[criterion];
				valB = b[criterion];
			}
			if (valA !== valB) {
				if (valA === void 0 || valA === null) return 1;
				if (valB === void 0 || valB === null) return -1;
				if (order === "asc") return valA < valB ? -1 : 1;
				else return valA < valB ? 1 : -1;
			}
		}
		return 0;
	});
}
//#endregion
//#region src/Helpers/Iterables/first.ts
/**
* Retorna o primeiro elemento de um array de forma segura.
*
* @param array O array para obter o elemento.
* @returns O primeiro elemento do array ou undefined se o array estiver vazio.
*/
function first(array) {
	const data = toValue(array);
	if (!Array.isArray(data) || data.length === 0) return void 0;
	return data[0];
}
//#endregion
//#region src/Helpers/Iterables/last.ts
/**
* Retorna o último elemento de um array de forma segura.
*
* @param array O array para obter o elemento.
* @returns O último elemento do array ou undefined se o array estiver vazio.
*/
function last(array) {
	const data = toValue(array);
	if (!Array.isArray(data) || data.length === 0) return void 0;
	return data[data.length - 1];
}
//#endregion
//#region src/Helpers/Iterables/index.ts
var Iterables_exports = /* @__PURE__ */ __exportAll({
	chunk: () => chunk,
	countBy: () => countBy,
	filter: () => filter,
	filterBy: () => filterBy,
	filterByNot: () => filterByNot,
	findLast: () => findLast,
	first: () => first,
	groupBy: () => groupBy,
	keyBy: () => keyBy,
	last: () => last,
	orderBy: () => orderBy,
	orderByWithKey: () => orderByWithKey,
	sample: () => sample,
	shuffle: () => shuffle,
	size: () => size,
	sortBy: () => sortBy,
	sortByMulti: () => sortByMulti,
	sum: () => sum,
	sumBy: () => sumBy,
	uniq: () => uniq,
	uniqueBy: () => uniqueBy,
	valuesInKey: () => valuesInKey
});
//#endregion
export { chunk, countBy, filter, filterBy, filterByNot, findLast, first, groupBy, keyBy, last, orderBy, orderByWithKey, sample, shuffle, size, sortBy, sortByMulti, sum, sumBy, Iterables_exports as t, uniq, uniqueBy, valuesInKey };

//# sourceMappingURL=iterables.es.js.map