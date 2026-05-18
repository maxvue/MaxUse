import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { n as isBlank } from "./isBlank-DrIS5hlK.js";
import { a as formatPhone, i as formatCpfCnpj, n as formatCnpj, o as maskSensitive, r as formatCpf, t as formatCep } from "./masks-C4wTVhhL.js";
import { toValue } from "vue";
//#region src/Helpers/Format/currency.ts
/**
* Formata um número para o padrão de moeda brasileira (R$).
*
* @param value O valor a ser formatado.
*/
function formatCurrency(value) {
	const data = toValue(value);
	if (isBlank(data)) return "R$ 0,00";
	const number = Number(data);
	if (isNaN(number)) return "R$ 0,00";
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL"
	}).format(number);
}
//#endregion
//#region src/Helpers/Format/bytes.ts
/**
* Converte um número bruto de bytes em uma string legível.
*
* @param bytes A quantidade de bytes.
* @param decimals O número de casas decimais.
*/
function formatBytes(bytes, decimals = 2) {
	const rawBytes = Number(toValue(bytes));
	const rawDecimals = toValue(decimals);
	if (isNaN(rawBytes) || rawBytes === 0) return "0 Bytes";
	const k = 1024;
	const dm = rawDecimals < 0 ? 0 : rawDecimals;
	const sizes = [
		"Bytes",
		"KB",
		"MB",
		"GB",
		"TB",
		"PB",
		"EB",
		"ZB",
		"YB"
	];
	const i = Math.floor(Math.log(rawBytes) / Math.log(k));
	return `${parseFloat((rawBytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
//#endregion
//#region src/Helpers/Format/index.ts
var Format_exports = /* @__PURE__ */ __exportAll({
	format: () => format,
	formatBytes: () => formatBytes,
	formatCep: () => formatCep,
	formatCnpj: () => formatCnpj,
	formatCpf: () => formatCpf,
	formatCpfCnpj: () => formatCpfCnpj,
	formatCurrency: () => formatCurrency,
	formatPhone: () => formatPhone,
	maskSensitive: () => maskSensitive
});
var format = {
	currency: formatCurrency,
	bytes: formatBytes,
	cep: formatCep,
	cpf: formatCpf,
	cnpj: formatCnpj,
	cpfCnpj: formatCpfCnpj,
	phone: formatPhone,
	sensitive: maskSensitive
};
//#endregion
export { format, formatBytes, formatCep, formatCnpj, formatCpf, formatCpfCnpj, formatCurrency, formatPhone, maskSensitive, Format_exports as t };

//# sourceMappingURL=format.es.js.map