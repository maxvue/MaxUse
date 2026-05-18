import { c as dist_exports } from "./dist-D5gA03iC.js";
import { n as getColorFromVar, r as isTouchDevice, t as Browser_exports } from "./Browser-Ch4-GjXZ.js";
import { $ as validCnpj, A as cnpj, B as hasValidCpf, C as hasValidEmail, D as isValidEmail, E as isValidEMail, F as cpfIsValid, G as isCpf, H as hasValidCpfOrCnpj, I as cpfOrCnpj, J as isValidCnpj, K as isCpfCnpj, L as cpfcnpj, M as cnpjOrCpf, N as cpf, O as validEMail, P as cpfCnpjIsValid, Q as isValidCpfOrCnpj, R as hasValidCnpj, S as hasValidEMail, T as isEmail, U as isCnpj, V as hasValidCpfCnpj, W as isCnpjOrCpf, X as isValidCpf, Y as isValidCnpjOrCpf, Z as isValidCpfCnpj, _ as eMailIsValid, a as isNotEmpty, b as hasEMail, c as noEmpty, d as cep, et as validCnpjOrCpf, f as cepIsValid, g as eMail, h as isValidCep, i as isEmpty, j as cnpjIsValid, k as validEmail, l as notEmpty, m as isCepValid, n as validate, nt as validCpfCnpj, o as isNotValid, p as hasValidCep, q as isCpfOrCnpj, r as empty, rt as validCpfOrCnpj, s as isValid, t as Validations_exports, tt as validCpf, u as notHasValidContent, v as email, w as isEMail, x as hasEmail, y as emailIsValid, z as hasValidCnpjOrCpf } from "./Validations-DRaR7BG2.js";
import { n as isArray, t as isObject } from "./isObject-BPnkB1ef.js";
import { i as hasContentFn, n as isBlank, r as hasContent, t as blank } from "./isBlank-DrIS5hlK.js";
import { canIterate, isIterable, isNumber, isNumeric, numeric, t as Types_exports } from "./types.es.js";
import { chunk, countBy, filter, filterBy, filterByNot, findLast, first, groupBy, keyBy, last, orderBy, orderByWithKey, sample, shuffle, size, sortBy, sortByMulti, sum, sumBy, t as Iterables_exports, uniq, uniqueBy, valuesInKey } from "./iterables.es.js";
import { addTime, diffInDays, diffInHours, diffInMinutes, diffInMonths, diffInSeconds, diffInYears, hasPassedDays, hasPassedHours, hasPassedMinutes, inDateInterval, isDate, isFuture, isInDateInterval, isPast, isSameDay, isWeekend, now, t as Dates_exports } from "./dates.es.js";
import { a as average, i as roundUp, n as median, r as roundDown, t as Math_exports } from "./Math-CrfIlrCG.js";
import { a as mapValues, c as renameKeys, d as unset, f as get, i as set, l as deepMerge, n as Objects_exports, o as omit, p as deepClone, r as diff, s as pick, t as Obj, u as isEqual } from "./Objects-BvjDI8RK.js";
import { a as formatPhone, i as formatCpfCnpj, n as formatCnpj, o as maskSensitive, r as formatCpf, t as formatCep } from "./masks-C4wTVhhL.js";
import { Random, Str, StrCase, StrFilter, camelCase, capitalize, initials, intervalRandom, kebabCase, noHtml as stripHtml, normalizeToSearch, onlyLetters, onlyLettersAndNumbers, onlyNumbers, onlySymbols, readingTime, removeSpaces, slugify, snakeCase, t as Strings_exports, toNumber, toSearchableString, truncate, ulid } from "./strings.es.js";
import { a as wireSize, i as calculaCabo, n as electric, r as electrical, t as Electrical_exports } from "./Electrical-C3m_VKWv.js";
import { format, formatBytes, formatCurrency, t as Format_exports } from "./format.es.js";
import { t as apiGetRoute } from "./apiGetRoute-Fr_1fuYK.js";
import { refAutoReset, t as Composables_exports, timeAgo, useDefaultReset, useInCache, useRefCached, useRefStorage, useTimeAgo } from "./composables.es.js";
import { apiDeleteRoute, apiPostRoute, apiPutRoute, apiUploadRoute, getRoute, getRouteByName, goToRoute, goToRouteByName, setLibraryRouter, t as Routes_exports } from "./routes.es.js";
import { assert, bypassFilter, camelize, clamp, cloneFnJSON, computedAsync, computedInject, computedWithControl, containsProp, createEventHook, createFetch, createFilterWrapper, createGlobalState, createInjectionState, createRef, createReusableTemplate, createSharedComposable, createSingletonPromise, createTemplatePromise, createUnrefFn, debounceFilter, extendRef, formatDate, formatTimeAgo, formatTimeAgoIntl, formatTimeAgoIntlParts, getLifeCycleTarget, getSSRHandler, hasOwn, hyphenate, identity, increaseWithUnit, injectLocal, invoke, isDef, isDefined, makeDestructurable, mapGamepadToXbox360Controller, noop, normalizeDate, notNullish, objectEntries, objectOmit, objectPick, onClickOutside, onElementRemoval, onKeyDown, onKeyPressed, onKeyStroke, onKeyUp, onLongPress, onStartTyping, pausableFilter, promiseTimeout, provideLocal, provideSSRWidth, pxValue, rand, reactify, reactifyObject, reactiveComputed, reactiveOmit, reactivePick, refDebounced, refDefault, refManualReset, refThrottled, refWithControl, setSSRHandler, syncRef, syncRefs, t as VueUse_exports, throttleFilter, timestamp, toArray, toReactive, transition, tryOnBeforeMount, tryOnBeforeUnmount, tryOnMounted, tryOnScopeDispose, tryOnUnmounted, unrefElement, until, useActiveElement, useAnimate, useArrayDifference, useArrayEvery, useArrayFilter, useArrayFind, useArrayFindIndex, useArrayFindLast, useArrayIncludes, useArrayJoin, useArrayMap, useArrayReduce, useArraySome, useArrayUnique, useAsyncQueue, useAsyncState, useBase64, useBattery, useBluetooth, useBreakpoints, useBroadcastChannel, useBrowserLocation, useCached, useClipboard, useClipboardItems, useCloned, useColorMode, useConfirmDialog, useCountdown, useCounter, useCssSupports, useCssVar, useCurrentElement, useCycleList, useDark, useDateFormat, useDebounceFn, useDebouncedRefHistory, useDeviceMotion, useDeviceOrientation, useDevicePixelRatio, useDevicesList, useDisplayMedia, useDocumentVisibility, useDraggable, useDropZone, useElementBounding, useElementByPoint, useElementHover, useElementSize, useElementVisibility, useEventBus, useEventListener, useEventSource, useEyeDropper, useFavicon, useFetch, useFileDialog, useFileSystemAccess, useFocus, useFocusWithin, useFps, useFullscreen, useGamepad, useGeolocation, useIdle, useImage, useInfiniteScroll, useIntersectionObserver, useInterval, useIntervalFn, useKeyModifier, useLastChanged, useLocalStorage, useMagicKeys, useManualRefHistory, useMediaControls, useMediaQuery, useMemoize, useMemory, useMounted, useMouse, useMouseInElement, useMousePressed, useMutationObserver, useNavigatorLanguage, useNetwork, useNow, useObjectUrl, useOffsetPagination, useOnline, usePageLeave, useParallax, useParentElement, usePerformanceObserver, usePermission, usePointer, usePointerLock, usePointerSwipe, usePreferredColorScheme, usePreferredContrast, usePreferredDark, usePreferredLanguages, usePreferredReducedMotion, usePreferredReducedTransparency, usePrevious, useRafFn, useRefHistory, useResizeObserver, useSSRWidth, useScreenOrientation, useScreenSafeArea, useScriptTag, useScroll, useScrollLock, useSessionStorage, useShare, useSorted, useSpeechRecognition, useSpeechSynthesis, useStepper, useStorage, useStorageAsync, useStyleTag, useSupported, useSwipe, useTemplateRefsList, useTextDirection, useTextSelection, useTextareaAutosize, useThrottleFn, useThrottledRefHistory, useTimeAgoIntl, useTimeout, useTimeoutFn, useTimeoutPoll, useTimestamp, useTitle, useToNumber, useToString, useToggle, useTransition, useUrlSearchParams, useUserMedia, useVModel, useVModels, useVibrate, useVirtualList, useWakeLock, useWebNotification, useWebSocket, useWebWorker, useWebWorkerFn, useWindowFocus, useWindowScroll, useWindowSize, watchArray, watchAtMost, watchDebounced, watchDeep, watchIgnorable, watchImmediate, watchOnce, watchThrottled, watchTriggerable, watchWithFilter, whenever } from "./vueuse.es.js";
import * as lodash from "lodash-es";
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
* Exporta um objeto contendo todos os itens do VueUse sem exceção.
*/
var vueUse = dist_exports;
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
var vueUseKeys = Object.keys(dist_exports).filter((key) => key !== "vueUse");
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
export { Obj, Random, Str, StrCase, StrFilter, _, addTime, apiDeleteRoute, apiGetRoute, apiPostRoute, apiPutRoute, apiUploadRoute, assert, average, blank, bypassFilter, calculaCabo, camelCase, camelize, canIterate, capitalize, cep, cepIsValid, chunk, clamp, deepClone as cloneDeep, deepClone, cloneFnJSON, cnpj, cnpjIsValid, cnpjOrCpf, computedAsync, computedInject, computedWithControl, containsProp, countBy, cpf, cpfCnpjIsValid, cpfIsValid, cpfOrCnpj, cpfcnpj, createEventHook, createFetch, createFilterWrapper, createGlobalState, createInjectionState, createRef, createReusableTemplate, createSharedComposable, createSingletonPromise, createTemplatePromise, createUnrefFn, debounceFilter, deepMerge, diff, diffInDays, diffInHours, diffInMinutes, diffInMonths, diffInSeconds, diffInYears, eMail, eMailIsValid, electric, electrical, email, emailIsValid, empty, extendRef, filter, filterBy, filterByNot, findLast, first, format, formatBytes, formatCep, formatCnpj, formatCpf, formatCpfCnpj, formatCurrency, formatDate, formatPhone, formatTimeAgo, formatTimeAgoIntl, formatTimeAgoIntlParts, get, getColorFromVar, getLifeCycleTarget, getRoute, getRouteByName, getSSRHandler, goToRoute, goToRouteByName, groupBy, hasContent, hasContentFn, hasEMail, hasEmail, hasOwn, hasPassedDays, hasPassedHours, hasPassedMinutes, hasValidCep, hasValidCnpj, hasValidCnpjOrCpf, hasValidCpf, hasValidCpfCnpj, hasValidCpfOrCnpj, hasValidEMail, hasValidEmail, hyphenate, identity, inDateInterval, increaseWithUnit, initials, injectLocal, intervalRandom, invoke, isArray, isBlank, isCepValid, isCnpj, isCnpjOrCpf, isCpf, isCpfCnpj, isCpfOrCnpj, isDate, isDef, isDefined, isEMail, isEmail, isEmpty, isEqual, isFuture, isInDateInterval, isIterable, isNotEmpty, isNotValid, isNumber, isNumeric, isObject, isPast, isSameDay, isTouchDevice, isValid, isValidCep, isValidCnpj, isValidCnpjOrCpf, isValidCpf, isValidCpfCnpj, isValidCpfOrCnpj, isValidEMail, isValidEmail, isWeekend, kebabCase, keyBy, last, makeDestructurable, mapGamepadToXbox360Controller, mapValues, maskSensitive, maxUseAutoImport, maxUseItems, median, noEmpty, stripHtml as noHtml, stripHtml, noop, normalizeDate, normalizeToSearch, notEmpty, notHasValidContent, notNullish, now, numeric, objectEntries, objectOmit, objectPick, omit, onClickOutside, onElementRemoval, onKeyDown, onKeyPressed, onKeyStroke, onKeyUp, onLongPress, onStartTyping, onlyLetters, onlyLettersAndNumbers, onlyNumbers, onlySymbols, orderBy, orderByWithKey, pausableFilter, pick, promiseTimeout, provideLocal, provideSSRWidth, pxValue, rand, reactify, reactifyObject, reactiveComputed, reactiveOmit, reactivePick, readingTime, refAutoReset, refDebounced, refDefault, refManualReset, refThrottled, refWithControl, removeSpaces, renameKeys, roundDown, roundUp, sample, set, setLibraryRouter, setSSRHandler, shuffle, size, slugify, snakeCase, sortBy, sortByMulti, sum, sumBy, syncRef, syncRefs, throttleFilter, timeAgo, timestamp, toArray, toNumber, toReactive, toSearchableString, transition, truncate, tryOnBeforeMount, tryOnBeforeUnmount, tryOnMounted, tryOnScopeDispose, tryOnUnmounted, ulid, uniq, uniqueBy, unrefElement, unset, until, useActiveElement, useAnimate, useArrayDifference, useArrayEvery, useArrayFilter, useArrayFind, useArrayFindIndex, useArrayFindLast, useArrayIncludes, useArrayJoin, useArrayMap, useArrayReduce, useArraySome, useArrayUnique, useAsyncQueue, useAsyncState, useBase64, useBattery, useBluetooth, useBreakpoints, useBroadcastChannel, useBrowserLocation, useCached, useClipboard, useClipboardItems, useCloned, useColorMode, useConfirmDialog, useCountdown, useCounter, useCssSupports, useCssVar, useCurrentElement, useCycleList, useDark, useDateFormat, useDebounceFn, useDebouncedRefHistory, useDefaultReset, useDeviceMotion, useDeviceOrientation, useDevicePixelRatio, useDevicesList, useDisplayMedia, useDocumentVisibility, useDraggable, useDropZone, useElementBounding, useElementByPoint, useElementHover, useElementSize, useElementVisibility, useEventBus, useEventListener, useEventSource, useEyeDropper, useFavicon, useFetch, useFileDialog, useFileSystemAccess, useFocus, useFocusWithin, useFps, useFullscreen, useGamepad, useGeolocation, useIdle, useImage, useInCache, useInfiniteScroll, useIntersectionObserver, useInterval, useIntervalFn, useKeyModifier, useLastChanged, useLocalStorage, useMagicKeys, useManualRefHistory, useMediaControls, useMediaQuery, useMemoize, useMemory, useMounted, useMouse, useMouseInElement, useMousePressed, useMutationObserver, useNavigatorLanguage, useNetwork, useNow, useObjectUrl, useOffsetPagination, useOnline, usePageLeave, useParallax, useParentElement, usePerformanceObserver, usePermission, usePointer, usePointerLock, usePointerSwipe, usePreferredColorScheme, usePreferredContrast, usePreferredDark, usePreferredLanguages, usePreferredReducedMotion, usePreferredReducedTransparency, usePrevious, useRafFn, useRefCached, useRefHistory, useRefStorage, useResizeObserver, useSSRWidth, useScreenOrientation, useScreenSafeArea, useScriptTag, useScroll, useScrollLock, useSessionStorage, useShare, useSorted, useSpeechRecognition, useSpeechSynthesis, useStepper, useStorage, useStorageAsync, useStyleTag, useSupported, useSwipe, useTemplateRefsList, useTextDirection, useTextSelection, useTextareaAutosize, useThrottleFn, useThrottledRefHistory, useTimeAgo, useTimeAgoIntl, useTimeout, useTimeoutFn, useTimeoutPoll, useTimestamp, useTitle, useToNumber, useToString, useToggle, useTransition, useUrlSearchParams, useUserMedia, useVModel, useVModels, useVibrate, useVirtualList, useWakeLock, useWebNotification, useWebSocket, useWebWorker, useWebWorkerFn, useWindowFocus, useWindowScroll, useWindowSize, validCnpj, validCnpjOrCpf, validCpf, validCpfCnpj, validCpfOrCnpj, validEMail, validEmail, validate, valuesInKey, vueUse, watchArray, watchAtMost, watchDebounced, watchDeep, watchIgnorable, watchImmediate, watchOnce, watchThrottled, watchTriggerable, watchWithFilter, whenever, wireSize };

//# sourceMappingURL=index.es.js.map