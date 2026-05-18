import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { toValue } from "vue";
//#region src/Helpers/Math/average.ts
/**
* Calcula a média aritmética de um array de números.
*
* @param numbers - Array de números.
* @returns A média aritmética.
*/
function average(numbers) {
	const data = toValue(numbers);
	if (data.length === 0) return 0;
	return data.reduce((acc, val) => acc + val, 0) / data.length;
}
//#endregion
//#region src/Helpers/Math/roundUp.ts
/**
* Arredonda um número para cima com uma quantidade específica de casas decimais.
*
* @param value - O número a ser arredondado.
* @param decimals - O número de casas decimais (padrão 0).
* @returns O número arredondado para cima.
*/
function roundUp(value, decimals = 0) {
	const rawValue = toValue(value);
	const rawDecimals = toValue(decimals);
	const factor = Math.pow(10, rawDecimals);
	return Math.ceil(rawValue * factor) / factor;
}
//#endregion
//#region src/Helpers/Math/roundDown.ts
/**
* Arredonda um número para baixo com uma quantidade específica de casas decimais.
*
* @param value - O número a ser arredondado.
* @param decimals - O número de casas decimais (padrão 0).
* @returns O número arredondado para baixo.
*/
function roundDown(value, decimals = 0) {
	const rawValue = toValue(value);
	const rawDecimals = toValue(decimals);
	const factor = Math.pow(10, rawDecimals);
	return Math.floor(rawValue * factor) / factor;
}
//#endregion
//#region src/Helpers/Math/median.ts
/**
* Calcula a mediana de uma lista de números.
* A mediana é excelente para estatísticas onde existem valores discrepantes (outliers)
* que distorceriam a média aritmética.
*
* @param numbers - Array de números.
* @returns A mediana dos números.
*/
function median(numbers) {
	const data = toValue(numbers);
	if (data.length === 0) return 0;
	const sorted = [...data].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);
	if (sorted.length % 2 === 0) return (sorted[middle - 1] + sorted[middle]) / 2;
	return sorted[middle];
}
//#endregion
//#region src/Helpers/Math/index.ts
var Math_exports = /* @__PURE__ */ __exportAll({
	average: () => average,
	median: () => median,
	roundDown: () => roundDown,
	roundUp: () => roundUp
});
//#endregion
export { average as a, roundUp as i, median as n, roundDown as r, Math_exports as t };

//# sourceMappingURL=Math-CrfIlrCG.js.map