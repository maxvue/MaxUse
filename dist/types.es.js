import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { n as isArray, t as isObject } from "./isObject-BPnkB1ef.js";
import { i as hasContentFn, n as isBlank, r as hasContent, t as blank } from "./isBlank-DrIS5hlK.js";
import { toValue } from "vue";
//#region src/Helpers/Types/isNumber.ts
/**
* Verifica se um valor é um número válido.
*
* @param value O valor a ser verificado.
* @returns Retorna true se for um número.
*/
function isNumber(value) {
	const data = toValue(value);
	if (isBlank(data, true)) return false;
	if (typeof data === "string" && String(data).trim() === "") return false;
	if (typeof data === "boolean") return false;
	return !Number.isNaN(Number(data));
}
var isNumeric = isNumber;
var numeric = isNumber;
//#endregion
//#region src/Helpers/Types/canIterate.ts
/**
* Verifica se um objeto é iterável.
* 
* @param obj O objeto a ser verificado.
* @returns Retorna true se for iterável.
*/
function canIterate(obj) {
	return typeof toValue(obj)?.[Symbol.iterator] === "function";
}
var isIterable = canIterate;
//#endregion
//#region src/Helpers/Types/index.ts
var Types_exports = /* @__PURE__ */ __exportAll({
	blank: () => blank,
	canIterate: () => canIterate,
	hasContent: () => hasContent,
	hasContentFn: () => hasContentFn,
	isArray: () => isArray,
	isBlank: () => isBlank,
	isIterable: () => isIterable,
	isNumber: () => isNumber,
	isNumeric: () => isNumeric,
	isObject: () => isObject,
	numeric: () => numeric
});
//#endregion
export { blank, canIterate, hasContent, hasContentFn, isArray, isBlank, isIterable, isNumber, isNumeric, isObject, numeric, Types_exports as t };

//# sourceMappingURL=types.es.js.map