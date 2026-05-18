import { O as dist_exports } from "./dist-CVecz8iT.js";
import { n as getColorFromVar, r as isTouchDevice, t as Browser_exports } from "./Browser-Ch4-GjXZ.js";
import { $ as validCnpj, A as cnpj, B as hasValidCpf, C as hasValidEmail, D as isValidEmail, E as isValidEMail, F as cpfIsValid, G as isCpf, H as hasValidCpfOrCnpj, I as cpfOrCnpj, J as isValidCnpj, K as isCpfCnpj, L as cpfcnpj, M as cnpjOrCpf, N as cpf, O as validEMail, P as cpfCnpjIsValid, Q as isValidCpfOrCnpj, R as hasValidCnpj, S as hasValidEMail, T as isEmail, U as isCnpj, V as hasValidCpfCnpj, W as isCnpjOrCpf, X as isValidCpf, Y as isValidCnpjOrCpf, Z as isValidCpfCnpj, _ as eMailIsValid, a as isNotEmpty, b as hasEMail, c as noEmpty, d as cep, et as validCnpjOrCpf, f as cepIsValid, g as eMail, h as isValidCep, i as isEmpty, j as cnpjIsValid, k as validEmail, l as notEmpty, m as isCepValid, n as validate, nt as validCpfCnpj, o as isNotValid, p as hasValidCep, q as isCpfOrCnpj, r as empty, rt as validCpfOrCnpj, s as isValid, t as Validations_exports, tt as validCpf, u as notHasValidContent, v as email, w as isEMail, x as hasEmail, y as emailIsValid, z as hasValidCnpjOrCpf } from "./Validations-DRaR7BG2.js";
import { n as isArray, t as isObject } from "./isObject-BPnkB1ef.js";
import { i as hasContentFn, n as isBlank, r as hasContent, t as blank } from "./isBlank-DrIS5hlK.js";
import { canIterate, isIterable, isNumber, isNumeric, numeric, t as Types_exports } from "./types.es.js";
import { chunk, countBy, filter, filterBy, filterByNot, findLast, first, groupBy, keyBy, last, orderBy, orderByWithKey, sample, shuffle, size, sortBy, sortByMulti, sum, sumBy, t as Iterables_exports, uniq, uniqueBy, valuesInKey } from "./iterables.es.js";
import { addTime, daysAgo, diffInDays, diffInHours, diffInMinutes, diffInMonths, diffInSeconds, diffInYears, hasPassedDays, hasPassedHours, hasPassedMinutes, hoursAgo, inDateInterval, isDate, isFuture, isInDateInterval, isPast, isSameDay, isWeekend, minutesAgo, monthsAgo, now, secondsAgo, t as Dates_exports, yearsAgo } from "./dates.es.js";
import { a as average, i as roundUp, n as median, r as roundDown, t as Math_exports } from "./Math-CrfIlrCG.js";
import { a as mapValues, c as renameKeys, d as unset, f as get, i as set, l as deepMerge, n as Objects_exports, o as omit, p as deepClone, r as diff, s as pick, t as Obj, u as isEqual } from "./Objects-BvjDI8RK.js";
import { a as formatPhone, i as formatCpfCnpj, n as formatCnpj, o as maskSensitive, r as formatCpf, t as formatCep } from "./masks-C4wTVhhL.js";
import { Random, Str, StrCase, StrFilter, camelCase, capitalize, initials, intervalRandom, kebabCase, noHtml as stripHtml, normalizeToSearch, onlyLetters, onlyLettersAndNumbers, onlyNumbers, onlySymbols, readingTime, removeSpaces, slugify, snakeCase, t as Strings_exports, toNumber, toSearchableString, truncate, ulid } from "./strings.es.js";
import { a as wireSize, i as calculaCabo, n as electric, r as electrical, t as Electrical_exports } from "./Electrical-C3m_VKWv.js";
import { format, formatBytes, formatCurrency, t as Format_exports } from "./format.es.js";
import { t as apiGetRoute } from "./apiGetRoute-Fr_1fuYK.js";
import { refAutoReset, t as Composables_exports, timeAgo, useCached, useCachedApi, useDefaultReset, useInCacheApi, useRefCached, useRefCachedApi, useRefStorage, useSharedCache, useSharedCacheApi, useStorage, useTimeAgo } from "./composables.es.js";
import { apiDeleteRoute, apiPostRoute, apiPutRoute, apiUploadRoute, getRoute, getRouteByName, goToRoute, goToRouteByName, setLibraryRouter, t as Routes_exports } from "./routes.es.js";
import { t as VueUse_exports } from "./vueuse.es.js";
import * as lodash from "lodash-es";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
//#region src/scripts/generateList.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function saveInJson(relative_path, data) {
	const outputFile = path.resolve(__dirname, relative_path);
	fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
}
//#endregion
//#region src/Helpers/maxUseItems.ts
/**
* Retorna a lista de todos os nomes de exports disponíveis na biblioteca MaxUse.
* Gera a lista dinamicamente a partir dos módulos fonte, sem depender do dist.
*/
var maxUseItems = () => {
	const allKeys = /* @__PURE__ */ new Set();
	const modules = [
		Composables_exports,
		Routes_exports,
		Browser_exports,
		Dates_exports,
		Iterables_exports,
		Math_exports,
		Objects_exports,
		Strings_exports,
		Types_exports,
		Validations_exports,
		Electrical_exports,
		Format_exports,
		VueUse_exports
	];
	for (const mod of modules) for (const key of Object.keys(mod)) {
		if (["vueUse"].includes(key)) continue;
		allKeys.add(key);
	}
	return Array.from(allKeys).sort();
};
var autoImport = () => {
	return { "@maxvue/max-use": [
		...maxUseItems(),
		"_",
		"vueUse"
	] };
};
var maxUseAutoImport = autoImport();
//#endregion
//#region src/index.ts
/**
* Helpers Próprios da MaxUse.
*/
var ownHelpers = {
	...Composables_exports,
	...Routes_exports,
	...Browser_exports,
	...Dates_exports,
	...Iterables_exports,
	...Math_exports,
	...Objects_exports,
	...Strings_exports,
	...Types_exports,
	...Validations_exports,
	...Electrical_exports,
	...Format_exports
};
/**
* Helpers do VueUse (filtrados para evitar duplicatas com os próprios).
*/
var filteredVueUse = {};
var vueUseKeys = Object.keys(dist_exports);
saveInJson("./vueuse-items.json", vueUseKeys);
for (const key of vueUseKeys) if (!(key in ownHelpers)) filteredVueUse[key] = dist_exports[key];
/**
* Helpers do Lodash (filtrados para evitar duplicatas com ownHelpers e filteredVueUse).
*/
var filteredLodash = {};
var lodashKeys = Object.keys(lodash);
for (const key of lodashKeys) filteredLodash[key] = lodash[key];
/**
* Objeto centralizado de helpers, semelhante ao Lodash (_).
* Contém os helpers próprios, os do VueUse e os do Lodash (sem duplicatas).
*/
var _ = {
	...ownHelpers,
	...filteredVueUse,
	...filteredLodash
};
//#endregion
export { Obj, Random, Str, StrCase, StrFilter, _, addTime, apiDeleteRoute, apiGetRoute, apiPostRoute, apiPutRoute, apiUploadRoute, average, blank, calculaCabo, camelCase, canIterate, capitalize, cep, cepIsValid, chunk, deepClone as cloneDeep, deepClone, cnpj, cnpjIsValid, cnpjOrCpf, countBy, cpf, cpfCnpjIsValid, cpfIsValid, cpfOrCnpj, cpfcnpj, daysAgo, deepMerge, diff, diffInDays, diffInHours, diffInMinutes, diffInMonths, diffInSeconds, diffInYears, eMail, eMailIsValid, electric, electrical, email, emailIsValid, empty, filter, filterBy, filterByNot, findLast, first, format, formatBytes, formatCep, formatCnpj, formatCpf, formatCpfCnpj, formatCurrency, formatPhone, get, getColorFromVar, getRoute, getRouteByName, goToRoute, goToRouteByName, groupBy, hasContent, hasContentFn, hasEMail, hasEmail, hasPassedDays, hasPassedHours, hasPassedMinutes, hasValidCep, hasValidCnpj, hasValidCnpjOrCpf, hasValidCpf, hasValidCpfCnpj, hasValidCpfOrCnpj, hasValidEMail, hasValidEmail, hoursAgo, inDateInterval, initials, intervalRandom, isArray, isBlank, isCepValid, isCnpj, isCnpjOrCpf, isCpf, isCpfCnpj, isCpfOrCnpj, isDate, isEMail, isEmail, isEmpty, isEqual, isFuture, isInDateInterval, isIterable, isNotEmpty, isNotValid, isNumber, isNumeric, isObject, isPast, isSameDay, isTouchDevice, isValid, isValidCep, isValidCnpj, isValidCnpjOrCpf, isValidCpf, isValidCpfCnpj, isValidCpfOrCnpj, isValidEMail, isValidEmail, isWeekend, kebabCase, keyBy, last, mapValues, maskSensitive, maxUseAutoImport, maxUseItems, median, minutesAgo, monthsAgo, noEmpty, stripHtml as noHtml, stripHtml, normalizeToSearch, notEmpty, notHasValidContent, now, numeric, omit, onlyLetters, onlyLettersAndNumbers, onlyNumbers, onlySymbols, orderBy, orderByWithKey, pick, readingTime, refAutoReset, removeSpaces, renameKeys, roundDown, roundUp, sample, secondsAgo, set, setLibraryRouter, shuffle, size, slugify, snakeCase, sortBy, sortByMulti, sum, sumBy, timeAgo, toNumber, toSearchableString, truncate, ulid, uniq, uniqueBy, unset, useCached, useCachedApi, useDefaultReset, useInCacheApi, useRefCached, useRefCachedApi, useRefStorage, useSharedCache, useSharedCacheApi, useStorage, useTimeAgo, validCnpj, validCnpjOrCpf, validCpf, validCpfCnpj, validCpfOrCnpj, validEMail, validEmail, validate, valuesInKey, wireSize, yearsAgo };

//# sourceMappingURL=index.es.js.map