import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { o as isNotValid } from "./Validations-DRaR7BG2.js";
import { toValue } from "vue";
//#region src/Helpers/Dates/now.ts
/**
* Obtém o timestamp em milissegundos que se passaram desde a Era Unix.
* Semelhante ao _.now do Lodash.
*
* @returns Retorna o timestamp.
*/
function now() {
	return Date.now();
}
//#endregion
//#region src/Helpers/Dates/isDate.ts
/**
* Verifica se um valor é uma data válida.
*
* @param valor O valor a ser verificado.
* @returns Retorna true se for uma data válida.
*/
function isDate(valor) {
	const data = toValue(valor);
	if (data instanceof Date) return !isNaN(data.getTime());
	if (typeof data === "string" || typeof data === "number") {
		const parsed = new Date(data);
		return !isNaN(parsed.getTime());
	}
	return false;
}
//#endregion
//#region src/Helpers/Dates/inDateInterval.ts
/**
* Verifica se uma data está dentro de um intervalo.
*
* @param value A data a ser verificada.
* @param interval O intervalo (início e fim).
* @returns Retorna true se estiver no intervalo.
*/
function inDateInterval(value, interval) {
	const targetDate = toValue(value);
	const rawInterval = toValue(interval);
	if (!targetDate || !rawInterval) return true;
	const target = new Date(targetDate).getTime();
	const start = new Date(rawInterval.start).getTime();
	const end = rawInterval.end ? new Date(rawInterval.end).getTime() : false;
	return target >= start && (!end || target <= end);
}
/**
* Alias para inDateInterval. Verifica se uma data está dentro de um intervalo.
*
* @param value A data a ser verificada.
* @param interval O intervalo (início e fim).
* @returns Retorna true se estiver no intervalo.
*/
function isInDateInterval(value, interval) {
	return inDateInterval(value, interval);
}
//#endregion
//#region src/Helpers/Dates/isSameDay.ts
/**
* Verifica se as datas fornecidas são do mesmo dia.
*
* @param dates Array de datas.
* @param operator Operador de comparação ('and' ou 'or').
* @returns Retorna true conforme o operador.
*/
function isSameDay(dates, operator = "or") {
	const values = toValue(dates);
	if (!values || values.length <= 1) return true;
	const days = values.map((date) => {
		const d = new Date(date);
		return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
	});
	if (operator === "and") return days.every((day) => day === days[0]);
	return new Set(days).size < days.length;
}
//#endregion
//#region src/Helpers/Dates/hasPassedHours.ts
/**
* Verifica se um determinado número de horas se passou desde a data fornecida.
*
* @param dateValue A data inicial.
* @param hours Quantidade de horas.
* @returns Retorna true se o tempo já passou.
*/
function hasPassedHours(dateValue, hours = 1) {
	const rawValue = toValue(dateValue);
	if (!rawValue) return true;
	const date = new Date(rawValue);
	if (isNaN(date.getTime())) return true;
	const timeInMs = hours * 60 * 60 * 1e3;
	return Date.now() - date.getTime() > timeInMs;
}
//#endregion
//#region src/Helpers/Dates/hasPassedMinutes.ts
/**
* Verifica se um determinado número de minutos se passou desde a data fornecida.
*
* @param dateValue A data inicial.
* @param minutes Quantidade de minutos.
* @returns Retorna true se o tempo já passou.
*/
function hasPassedMinutes(dateValue, minutes = 1) {
	const rawValue = toValue(dateValue);
	if (!rawValue) return true;
	const date = new Date(rawValue);
	if (isNaN(date.getTime())) return true;
	const timeInMs = minutes * 60 * 1e3;
	return Date.now() - date.getTime() > timeInMs;
}
//#endregion
//#region src/Helpers/Dates/hasPassedDays.ts
/**
* Verifica se um determinado número de dias se passou desde a data fornecida.
*
* @param dateValue A data inicial.
* @param days Quantidade de dias.
* @returns Retorna true se o tempo já passou.
*/
function hasPassedDays(dateValue, days = 1) {
	const rawValue = toValue(dateValue);
	if (!rawValue) return true;
	const date = new Date(rawValue);
	if (isNaN(date.getTime())) return true;
	const timeInMs = days * 24 * 60 * 60 * 1e3;
	return Date.now() - date.getTime() > timeInMs;
}
//#endregion
//#region src/Helpers/Dates/isPast.ts
/**
* Verifica se uma determinada data já passou.
*
* @param dateValue A data a ser verificada.
* @returns Retorna true se a data estiver no passado.
*/
function isPast(dateValue) {
	const rawValue = toValue(dateValue);
	if (!rawValue) return false;
	const date = new Date(rawValue);
	if (isNaN(date.getTime())) return false;
	return date.getTime() < Date.now();
}
//#endregion
//#region src/Helpers/Dates/isFuture.ts
/**
* Verifica se uma determinada data ainda está no futuro.
*
* @param dateValue A data a ser verificada.
* @returns Retorna true se a data estiver no futuro.
*/
function isFuture(dateValue) {
	const rawValue = toValue(dateValue);
	if (!rawValue) return false;
	const date = new Date(rawValue);
	if (isNaN(date.getTime())) return false;
	return date.getTime() > Date.now();
}
//#endregion
//#region src/Helpers/Dates/addTime.ts
/**
* Adiciona ou subtrai uma quantidade específica de tempo a uma data.
*
* @param dateValue A data base.
* @param amount A quantidade de tempo a adicionar (ou subtrair se negativo).
* @param unit A unidade de tempo.
* @returns Retorna o objeto Date resultante.
*/
function addTime(dateValue, amount, unit = "days") {
	const rawDate = toValue(dateValue);
	const rawAmount = toValue(amount);
	const rawUnit = toValue(unit).toLowerCase();
	if (!rawDate) return null;
	const date = new Date(rawDate);
	if (isNaN(date.getTime())) return null;
	switch (rawUnit) {
		case "day":
		case "days":
			date.setDate(date.getDate() + rawAmount);
			break;
		case "month":
		case "months":
			date.setMonth(date.getMonth() + rawAmount);
			break;
		case "year":
		case "years":
			date.setFullYear(date.getFullYear() + rawAmount);
			break;
		case "hour":
		case "hours":
			date.setHours(date.getHours() + rawAmount);
			break;
		case "minute":
		case "minutes":
			date.setMinutes(date.getMinutes() + rawAmount);
			break;
		case "second":
		case "seconds":
			date.setSeconds(date.getSeconds() + rawAmount);
			break;
	}
	return date;
}
//#endregion
//#region src/Helpers/Dates/isWeekend.ts
/**
* Retorna true se a data informada cair em um sábado ou domingo.
* Utilidade: Regras de negócio para cálculo de prazos, agendamentos e bloqueios de interface em dias não úteis.
*
* @param dateValue A data a ser verificada.
* @returns Retorna true se a data cair em um sábado ou domingo.
*/
function isWeekend(dateValue) {
	const rawValue = toValue(dateValue);
	if (!rawValue) return false;
	const date = new Date(rawValue);
	if (isNaN(date.getTime())) return false;
	const day = date.getDay();
	return day === 0 || day === 6;
}
//#endregion
//#region src/Helpers/Dates/differences.ts
function parseDate(value) {
	const data = toValue(value);
	if (isNotValid(data)) return null;
	const date = new Date(data);
	return isNaN(date.getTime()) ? null : date;
}
/**
* Calcula a diferença absoluta em segundos entre duas datas.
*/
function diffInSeconds(date1, date2) {
	const d1 = parseDate(date1);
	const d2 = parseDate(date2);
	if (!d1 || !d2) return 0;
	return Math.abs(Math.floor((d1.getTime() - d2.getTime()) / 1e3));
}
/**
* Calcula a diferença absoluta em minutos entre duas datas.
*/
function diffInMinutes(date1, date2) {
	return Math.abs(Math.floor(diffInSeconds(date1, date2) / 60));
}
/**
* Calcula a diferença absoluta em horas entre duas datas.
*/
function diffInHours(date1, date2) {
	return Math.abs(Math.floor(diffInMinutes(date1, date2) / 60));
}
/**
* Calcula a diferença absoluta em dias entre duas datas.
*/
function diffInDays(date1, date2) {
	return Math.abs(Math.floor(diffInHours(date1, date2) / 24));
}
/**
* Calcula a diferença absoluta em meses entre duas datas.
*/
function diffInMonths(date1, date2) {
	const d1 = parseDate(date1);
	const d2 = parseDate(date2);
	if (!d1 || !d2) return 0;
	const years = d1.getFullYear() - d2.getFullYear();
	const months = d1.getMonth() - d2.getMonth();
	return Math.abs(years * 12 + months);
}
/**
* Calcula a diferença absoluta em anos entre duas datas.
*/
function diffInYears(date1, date2) {
	const d1 = parseDate(date1);
	const d2 = parseDate(date2);
	if (!d1 || !d2) return 0;
	return Math.abs(d1.getFullYear() - d2.getFullYear());
}
//#endregion
//#region src/Helpers/Dates/timeAgo.ts
function secondsAgo(value) {
	const data = toValue(value);
	if (!data) return null;
	if (isNotValid(data)) return null;
	const date = new Date(data);
	const dataPassada = new Date(date);
	const diferencaMs = (/* @__PURE__ */ new Date()).getTime() - dataPassada.getTime();
	return parseInt(Math.floor(diferencaMs / 1e3) + "");
}
function minutesAgo(value) {
	return parseInt((secondsAgo(value) || 0) / 60 + "");
}
function hoursAgo(value) {
	return parseInt((secondsAgo(value) || 0) / 60 / 60 + "");
}
function daysAgo(value) {
	return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 + "");
}
function monthsAgo(value) {
	return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 / 30 + "");
}
function yearsAgo(value) {
	return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 / 30 / 12 + "");
}
//#endregion
//#region src/Helpers/Dates/index.ts
var Dates_exports = /* @__PURE__ */ __exportAll({
	addTime: () => addTime,
	daysAgo: () => daysAgo,
	diffInDays: () => diffInDays,
	diffInHours: () => diffInHours,
	diffInMinutes: () => diffInMinutes,
	diffInMonths: () => diffInMonths,
	diffInSeconds: () => diffInSeconds,
	diffInYears: () => diffInYears,
	hasPassedDays: () => hasPassedDays,
	hasPassedHours: () => hasPassedHours,
	hasPassedMinutes: () => hasPassedMinutes,
	hoursAgo: () => hoursAgo,
	inDateInterval: () => inDateInterval,
	isDate: () => isDate,
	isFuture: () => isFuture,
	isInDateInterval: () => isInDateInterval,
	isPast: () => isPast,
	isSameDay: () => isSameDay,
	isWeekend: () => isWeekend,
	minutesAgo: () => minutesAgo,
	monthsAgo: () => monthsAgo,
	now: () => now,
	secondsAgo: () => secondsAgo,
	yearsAgo: () => yearsAgo
});
//#endregion
export { addTime, daysAgo, diffInDays, diffInHours, diffInMinutes, diffInMonths, diffInSeconds, diffInYears, hasPassedDays, hasPassedHours, hasPassedMinutes, hoursAgo, inDateInterval, isDate, isFuture, isInDateInterval, isPast, isSameDay, isWeekend, minutesAgo, monthsAgo, now, secondsAgo, Dates_exports as t, yearsAgo };

//# sourceMappingURL=dates.es.js.map