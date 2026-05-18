import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { toValue } from "vue";
//#region src/Helpers/Browser/isTouchDevice.ts
/**
* Detecta se o dispositivo atual possui suporte a interações via toque (touch).
*
* @returns true se o dispositivo suportar toque, caso contrário false.
*/
function isTouchDevice() {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
//#endregion
//#region src/Helpers/Browser/getColorFromVar.ts
/**
* Obtém o valor de uma variável CSS (CSS Variable) definida no :root.
*
* @param colorVar - O nome da variável (ex: '--primary-color') ou a chamada var() (ex: 'var(--primary-color)').
* @returns O valor da variável CSS (ex: '#ffffff').
*/
function getColorFromVar(colorVar) {
	const value = toValue(colorVar);
	if (!value) return "";
	const color_var_name = value.replace(/^var\((--.*?)\)$/, "$1").trim();
	const root = document.documentElement;
	return window.getComputedStyle(root).getPropertyValue(color_var_name).trim();
}
//#endregion
//#region src/Helpers/Browser/index.ts
var Browser_exports = /* @__PURE__ */ __exportAll({
	getColorFromVar: () => getColorFromVar,
	isTouchDevice: () => isTouchDevice
});
//#endregion
export { getColorFromVar as n, isTouchDevice as r, Browser_exports as t };

//# sourceMappingURL=Browser-Ch4-GjXZ.js.map