import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { size } from "./iterables.es.js";
import { toValue } from "vue";
import { validateBr } from "js-brasil";
import * as PhoneLib from "libphonenumber-js";
//#region src/Helpers/Validations/documents.ts
var documents_exports = /* @__PURE__ */ __exportAll({
	cnpj: () => cnpj,
	cnpjIsValid: () => cnpjIsValid,
	cnpjOrCpf: () => cnpjOrCpf,
	cpf: () => cpf,
	cpfCnpjIsValid: () => cpfCnpjIsValid,
	cpfIsValid: () => cpfIsValid,
	cpfOrCnpj: () => cpfOrCnpj,
	cpfcnpj: () => cpfcnpj,
	hasValidCnpj: () => hasValidCnpj,
	hasValidCnpjOrCpf: () => hasValidCnpjOrCpf,
	hasValidCpf: () => hasValidCpf,
	hasValidCpfCnpj: () => hasValidCpfCnpj,
	hasValidCpfOrCnpj: () => hasValidCpfOrCnpj,
	isCnpj: () => isCnpj,
	isCnpjOrCpf: () => isCnpjOrCpf,
	isCpf: () => isCpf,
	isCpfCnpj: () => isCpfCnpj,
	isCpfOrCnpj: () => isCpfOrCnpj,
	isValidCnpj: () => isValidCnpj,
	isValidCnpjOrCpf: () => isValidCnpjOrCpf,
	isValidCpf: () => isValidCpf,
	isValidCpfCnpj: () => isValidCpfCnpj,
	isValidCpfOrCnpj: () => isValidCpfOrCnpj,
	validCnpj: () => validCnpj,
	validCnpjOrCpf: () => validCnpjOrCpf,
	validCpf: () => validCpf,
	validCpfCnpj: () => validCpfCnpj,
	validCpfOrCnpj: () => validCpfOrCnpj
});
/**
* Valida se uma string é um CPF válido.
*/
function isCpf(value) {
	const data = toValue(value);
	return validateBr.cpf(data);
}
/**
* Valida se uma string é um CNPJ válido.
*/
function isCnpj(value) {
	const data = toValue(value);
	return validateBr.cnpj(data);
}
/**
* Valida se uma string é um CPF ou CNPJ válido.
*/
function isCpfCnpj(value) {
	const data = toValue(value);
	return validateBr.cpfcnpj(data);
}
var cpf = isCpf;
var cnpj = isCnpj;
var cpfcnpj = isCpfCnpj;
var cpfIsValid = isCpf;
var cnpjIsValid = isCnpj;
var cpfCnpjIsValid = isCpfCnpj;
var isCpfOrCnpj = isCpfCnpj;
var cpfOrCnpj = isCpfCnpj;
var isCnpjOrCpf = isCpfCnpj;
var cnpjOrCpf = isCpfCnpj;
var isValidCpf = isCpf;
var isValidCnpj = isCnpj;
var isValidCpfCnpj = isCpfCnpj;
var isValidCpfOrCnpj = isCpfCnpj;
var isValidCnpjOrCpf = isCpfCnpj;
var validCpf = isCpf;
var validCnpj = isCnpj;
var validCpfCnpj = isCpfCnpj;
var validCpfOrCnpj = isCpfCnpj;
var validCnpjOrCpf = isCpfCnpj;
var hasValidCpf = isCpf;
var hasValidCnpj = isCnpj;
var hasValidCpfCnpj = isCpfCnpj;
var hasValidCpfOrCnpj = isCpfCnpj;
var hasValidCnpjOrCpf = isCpfCnpj;
//#endregion
//#region src/Helpers/Validations/isEmail.ts
var isEmail_exports = /* @__PURE__ */ __exportAll({
	eMail: () => eMail,
	eMailIsValid: () => eMailIsValid,
	email: () => email,
	emailIsValid: () => emailIsValid,
	hasEMail: () => hasEMail,
	hasEmail: () => hasEmail,
	hasValidEMail: () => hasValidEMail,
	hasValidEmail: () => hasValidEmail,
	isEMail: () => isEMail,
	isEmail: () => isEmail,
	isValidEMail: () => isValidEMail,
	isValidEmail: () => isValidEmail,
	validEMail: () => validEMail,
	validEmail: () => validEmail
});
/**
* Valida se uma string é um endereço de e-mail com formato válido.
*
* @param value O valor a ser validado (string, Ref ou Getter).
* @returns True se for um e-mail válido, false caso contrário.
*/
function isEmail(value) {
	const data = toValue(value);
	if (!data || typeof data !== "string") return false;
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data);
}
var email = isEmail;
var emailIsValid = isEmail;
var isValidEmail = isEmail;
var hasValidEmail = isEmail;
var validEmail = isEmail;
var hasEmail = isEmail;
var isEMail = isEmail;
var eMail = isEmail;
var eMailIsValid = isEmail;
var isValidEMail = isEmail;
var hasValidEMail = isEmail;
var validEMail = isEmail;
var hasEMail = isEmail;
//#endregion
//#region src/Helpers/Validations/cepIsValid.ts
var cepIsValid_exports = /* @__PURE__ */ __exportAll({
	cep: () => cep,
	cepIsValid: () => cepIsValid,
	hasValidCep: () => hasValidCep,
	isCepValid: () => isCepValid,
	isValidCep: () => isValidCep
});
/**
* Valida se uma string é um CEP válido.
*
* @param value O valor a ser validado (string, Ref ou Getter).
* @returns True se for um CEP válido, false caso contrário.
*/
function cepIsValid(value) {
	const data = toValue(value);
	return validateBr.cep(data);
}
var cep = cepIsValid;
var isValidCep = cepIsValid;
var isCepValid = cepIsValid;
var hasValidCep = cepIsValid;
//#endregion
//#region src/Helpers/Validations/isValid.ts
var isValid_exports = /* @__PURE__ */ __exportAll({
	empty: () => empty,
	isEmpty: () => isEmpty,
	isNotEmpty: () => isNotEmpty,
	isNotValid: () => isNotValid,
	isValid: () => isValid,
	noEmpty: () => noEmpty,
	notEmpty: () => notEmpty,
	notHasValidContent: () => notHasValidContent
});
function notEmpty(value) {
	return size(value) > 0;
}
function isNotEmpty(value) {
	return size(value) > 0;
}
function noEmpty(value) {
	return size(value) > 0;
}
function isEmpty(value) {
	return size(value) === 0;
}
function empty(value) {
	return size(value) === 0;
}
function isValid(value) {
	return value !== null && value !== void 0;
}
function isNotValid(value) {
	return !isValid(value);
}
function notHasValidContent(value) {
	return !isValid(value);
}
//#endregion
//#region src/Helpers/Validations/phone.ts
var phone_exports = /* @__PURE__ */ __exportAll({
	hasPhone: () => hasPhone,
	hasValidPhone: () => hasValidPhone,
	isPhone: () => isPhone,
	isPhoneValid: () => isPhoneValid,
	isValidPhone: () => isValidPhone,
	phone: () => phone,
	phoneIsValid: () => phoneIsValid,
	validPhone: () => validPhone
});
function phone(value) {
	const data = toValue(value);
	if (!data) return false;
	return PhoneLib.isValidPhoneNumber(String(data));
}
var isValidPhone = phone;
var isPhoneValid = phone;
var hasValidPhone = phone;
var validPhone = phone;
var isPhone = phone;
var hasPhone = phone;
var phoneIsValid = phone;
//#endregion
//#region src/Helpers/Validations/index.ts
var Validations_exports = /* @__PURE__ */ __exportAll({
	cep: () => cep,
	cepIsValid: () => cepIsValid,
	cnpj: () => cnpj,
	cnpjIsValid: () => cnpjIsValid,
	cnpjOrCpf: () => cnpjOrCpf,
	cpf: () => cpf,
	cpfCnpjIsValid: () => cpfCnpjIsValid,
	cpfIsValid: () => cpfIsValid,
	cpfOrCnpj: () => cpfOrCnpj,
	cpfcnpj: () => cpfcnpj,
	eMail: () => eMail,
	eMailIsValid: () => eMailIsValid,
	email: () => email,
	emailIsValid: () => emailIsValid,
	empty: () => empty,
	hasEMail: () => hasEMail,
	hasEmail: () => hasEmail,
	hasValidCep: () => hasValidCep,
	hasValidCnpj: () => hasValidCnpj,
	hasValidCnpjOrCpf: () => hasValidCnpjOrCpf,
	hasValidCpf: () => hasValidCpf,
	hasValidCpfCnpj: () => hasValidCpfCnpj,
	hasValidCpfOrCnpj: () => hasValidCpfOrCnpj,
	hasValidEMail: () => hasValidEMail,
	hasValidEmail: () => hasValidEmail,
	isCepValid: () => isCepValid,
	isCnpj: () => isCnpj,
	isCnpjOrCpf: () => isCnpjOrCpf,
	isCpf: () => isCpf,
	isCpfCnpj: () => isCpfCnpj,
	isCpfOrCnpj: () => isCpfOrCnpj,
	isEMail: () => isEMail,
	isEmail: () => isEmail,
	isEmpty: () => isEmpty,
	isNotEmpty: () => isNotEmpty,
	isNotValid: () => isNotValid,
	isValid: () => isValid,
	isValidCep: () => isValidCep,
	isValidCnpj: () => isValidCnpj,
	isValidCnpjOrCpf: () => isValidCnpjOrCpf,
	isValidCpf: () => isValidCpf,
	isValidCpfCnpj: () => isValidCpfCnpj,
	isValidCpfOrCnpj: () => isValidCpfOrCnpj,
	isValidEMail: () => isValidEMail,
	isValidEmail: () => isValidEmail,
	noEmpty: () => noEmpty,
	notEmpty: () => notEmpty,
	notHasValidContent: () => notHasValidContent,
	validCnpj: () => validCnpj,
	validCnpjOrCpf: () => validCnpjOrCpf,
	validCpf: () => validCpf,
	validCpfCnpj: () => validCpfCnpj,
	validCpfOrCnpj: () => validCpfOrCnpj,
	validEMail: () => validEMail,
	validEmail: () => validEmail,
	validate: () => validate
});
var validate = {
	...documents_exports,
	...isEmail_exports,
	...cepIsValid_exports,
	...phone_exports,
	...isValid_exports
};
//#endregion
export { validCnpj as $, cnpj as A, hasValidCpf as B, hasValidEmail as C, isValidEmail as D, isValidEMail as E, cpfIsValid as F, isCpf as G, hasValidCpfOrCnpj as H, cpfOrCnpj as I, isValidCnpj as J, isCpfCnpj as K, cpfcnpj as L, cnpjOrCpf as M, cpf as N, validEMail as O, cpfCnpjIsValid as P, isValidCpfOrCnpj as Q, hasValidCnpj as R, hasValidEMail as S, isEmail as T, isCnpj as U, hasValidCpfCnpj as V, isCnpjOrCpf as W, isValidCpf as X, isValidCnpjOrCpf as Y, isValidCpfCnpj as Z, eMailIsValid as _, isNotEmpty as a, hasEMail as b, noEmpty as c, cep as d, validCnpjOrCpf as et, cepIsValid as f, eMail as g, isValidCep as h, isEmpty as i, cnpjIsValid as j, validEmail as k, notEmpty as l, isCepValid as m, validate as n, validCpfCnpj as nt, isNotValid as o, hasValidCep as p, isCpfOrCnpj as q, empty as r, validCpfOrCnpj as rt, isValid as s, Validations_exports as t, validCpf as tt, notHasValidContent as u, email as v, isEMail as w, hasEmail as x, emailIsValid as y, hasValidCnpjOrCpf as z };

//# sourceMappingURL=Validations-DRaR7BG2.js.map