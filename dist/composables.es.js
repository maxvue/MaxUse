import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { $n as useTimeAgo$1, Un as useStorage$1, xa as watchDebounced } from "./dist-CVecz8iT.js";
import { t as apiGetRoute } from "./apiGetRoute-Fr_1fuYK.js";
import { computed, ref, watch } from "vue";
import { ulid } from "ulid";
import localforage from "localforage";
//#region src/Composables/useDefaultReset.ts
function useDefaultReset(initialData, timer = null) {
	const state = ref();
	state.initialData = JSON.parse(JSON.stringify(initialData));
	state.reset = () => {
		const new_data = JSON.parse(JSON.stringify(state.initialData));
		if (typeof state.initialData === "object") {
			if (state.initialData?.id === "ulid") new_data.id = ulid().toLowerCase();
			if (state.initialData?.created_at === "now") new_data.created_at = (/* @__PURE__ */ new Date()).toISOString();
		}
		state.value = new_data;
	};
	state.reset();
	state.timer = timer;
	if (timer) watchDebounced(state, () => {
		setTimeout(() => {
			state.reset();
		}, timer);
	}, { debounce: timer });
	return state;
}
var refAutoReset = useDefaultReset;
//#endregion
//#region src/Composables/useRefCachedApi.ts
function useCachedApi(route_name, options = {}) {
	const state = ref(options.defaultValue ?? null);
	const key = options.key ?? route_name;
	const data = localStorage.getItem(key);
	if (data) state.value = JSON.parse(data);
	if (options.watch !== false) watch(computed(() => JSON.stringify(state.value)), (value) => {
		localStorage.setItem(key, value);
	});
	if (options.sync !== false) apiGetRoute(route_name, options.data_get ?? options.data ?? {}).then((value) => {
		if (value) {
			state.value = value;
			const cleanData = JSON.parse(JSON.stringify(value));
			localStorage.setItem(key, JSON.stringify(cleanData));
		}
	});
	return state;
}
var useRefCachedApi = useCachedApi;
var useSharedCacheApi = useCachedApi;
var useInCacheApi = useCachedApi;
//#endregion
//#region src/Composables/useRefCached.ts
function useRefCached(key, default_value = null) {
	localforage.config({
		name: "caches",
		storeName: "use-ref-storages"
	});
	const state = useStorage$1(key, default_value);
	localforage.getItem(key).then((value) => state.value = value ? value : default_value);
	watchDebounced(state, () => localforage.setItem(key, JSON.parse(JSON.stringify(state.value))), { debounce: 600 });
	return state;
}
var useRefStorage = useRefCached;
var useCached = useRefCached;
var useSharedCache = useRefCached;
var useStorage = useRefCached;
//#endregion
//#region src/Composables/useTimeAgo.ts
var ptBr = {
	justNow: "agora",
	past: (n) => n.toString().match(/\d/) ? `${n}` : n,
	future: (n) => n.toString().match(/\d/) ? `Em ${n}` : n,
	month: (n, past) => n === 1 ? past ? "Mês passado" : "Próximo mês" : `${n} M${n > 1 ? "eses" : "ês"}`,
	year: (n, past) => n === 1 ? past ? "Ano passado" : "Próximo ano" : `${n} year${n > 1 ? "s" : ""}`,
	day: (n, past) => n === 1 ? past ? "Ontem" : "Amanhã" : `${n} dia${n > 1 ? "s" : ""}`,
	week: (n, past) => n === 1 ? past ? "Semana passada" : "Próxima semana" : `${n} semana${n > 1 ? "s" : ""}`,
	hour: (n) => `${n}h${n > 1 ? "s" : ""}`,
	minute: (n) => `${n}m${n > 1 ? "" : ""}`,
	second: (n) => `${n}s${n > 1 ? "s" : ""}`
};
var timeAgoAbbrev = {
	justNow: "Agora",
	past: (n) => n.toString().match(/\d/) ? `${n}` : n,
	future: (n) => n.toString().match(/\d/) ? `Em ${n}` : n,
	month: (n, past) => n === 1 ? past ? "1 mês" : "Próx. mês" : `${n} M${n > 1 ? "eses" : "ês"}`,
	year: (n, past) => n === 1 ? past ? "1 ano" : "Próx. ano" : `${n} year${n > 1 ? "s" : ""}`,
	day: (n, past) => n === 1 ? past ? "Ontem" : "Amanhã" : `${n} dia${n > 1 ? "s" : ""}`,
	week: (n, past) => n === 1 ? past ? "1 Sem" : "Próx. sem." : `${n} sem.${n > 1 ? "" : ""}`,
	hour: (n) => `${n}h${n > 1 ? "s" : ""}`,
	minute: (n) => `${n}m${n > 1 ? "m" : ""}`,
	second: (n) => `${n}s${n > 1 ? "s" : ""}`
};
var timeAgoAction = {
	justNow: "Realizar Hoje",
	past: (n) => n.toString().match(/\d/) ? `Atrasado: ${n}` : n,
	future: (n) => n.toString().match(/\d/) ? `Realizar em ${n}` : n,
	month: (n, past) => n === 1 ? past ? "Atrasado (1 Mês)" : "Próximo mês" : `${n} M${n > 1 ? "eses" : "ês"}`,
	year: (n, past) => n === 1 ? past ? "Ano passado" : "Próximo ano" : `${n} year${n > 1 ? "s" : ""}`,
	day: (n, past) => n === 1 ? past ? "Atrasado (Ontem)" : "Realizar até amanhã" : `${n} dia${n > 1 ? "s" : ""}`,
	week: (n, past) => n === 1 ? past ? "1 semana" : "1 semana" : `${n} semana${n > 1 ? "s" : ""}`,
	hour: (n) => `${n}h${n > 1 ? "s" : ""}`,
	minute: (n) => `${n}m${n > 1 ? "" : ""}`,
	second: (n) => `${n}s${n > 1 ? "s" : ""}`
};
var timeAgoLimitAbrev = {
	justNow: "Hoje",
	past: (n) => n.toString().match(/\d/) ? `Atrasado: ${n}` : n,
	future: (n) => n.toString().match(/\d/) ? `Em ${n}` : n,
	month: (n, past) => n === 1 ? past ? "Mês passado" : "Próximo mês" : `${n} M${n > 1 ? "eses" : "ês"}`,
	year: (n, past) => n === 1 ? past ? "Ano passado" : "Próximo ano" : `${n} year${n > 1 ? "s" : ""}`,
	day: (n, past) => n === 1 ? past ? "Ontem" : "Amanhã" : `${n} dia${n > 1 ? "s" : ""}`,
	week: (n, past) => n === 1 ? past ? "1 semana" : "1 semana" : `${n} semana${n > 1 ? "s" : ""}`,
	hour: (n) => `${n}h${n > 1 ? "s" : ""}`,
	minute: (n) => `${n}m${n > 1 ? "" : ""}`,
	second: (n) => `${n}s${n > 1 ? "s" : ""}`
};
var FORMAT_MAP = {
	br: ptBr,
	abbrev: timeAgoAbbrev,
	action: timeAgoAction,
	limit: {
		justNow: "Realizar Hoje",
		past: (n) => n.toString().match(/\d/) ? `Atrasado: ${n}` : n,
		future: (n) => n.toString().match(/\d/) ? `Realizar em ${n}` : n,
		month: (n, past) => n === 1 ? past ? "Atrasado (1 Mês)" : "Próximo mês" : `${n} M${n > 1 ? "eses" : "ês"}`,
		year: (n, past) => n === 1 ? past ? "Ano passado" : "Próximo ano" : `${n} year${n > 1 ? "s" : ""}`,
		day: (n, past) => n === 1 ? past ? "Atrasado (Ontem)" : "Realizar até amanhã" : `${n} dia${n > 1 ? "s" : ""}`,
		week: (n, past) => n === 1 ? past ? "1 semana" : "1 semana" : `${n} semana${n > 1 ? "s" : ""}`,
		hour: (n) => `${n}h${n > 1 ? "s" : ""}`,
		minute: (n) => `${n}m${n > 1 ? "" : ""}`,
		second: (n) => `${n}s${n > 1 ? "s" : ""}`
	},
	limitAbbrev: timeAgoLimitAbrev,
	limit_abbrev: timeAgoLimitAbrev,
	future: timeAgoLimitAbrev
};
var timeAgo = (initialDate, format = "br") => useTimeAgo$1(initialDate, { messages: FORMAT_MAP[format] ?? ptBr });
var useTimeAgo = (initialDate, format = "br") => timeAgo(initialDate, format);
//#endregion
//#region src/Composables/index.ts
var Composables_exports = /* @__PURE__ */ __exportAll({
	refAutoReset: () => refAutoReset,
	timeAgo: () => timeAgo,
	useCached: () => useCached,
	useCachedApi: () => useCachedApi,
	useDefaultReset: () => useDefaultReset,
	useInCacheApi: () => useInCacheApi,
	useRefCached: () => useRefCached,
	useRefCachedApi: () => useRefCachedApi,
	useRefStorage: () => useRefStorage,
	useSharedCache: () => useSharedCache,
	useSharedCacheApi: () => useSharedCacheApi,
	useStorage: () => useStorage,
	useTimeAgo: () => useTimeAgo
});
//#endregion
export { refAutoReset, Composables_exports as t, timeAgo, useCached, useCachedApi, useDefaultReset, useInCacheApi, useRefCached, useRefCachedApi, useRefStorage, useSharedCache, useSharedCacheApi, useStorage, useTimeAgo };

//# sourceMappingURL=composables.es.js.map