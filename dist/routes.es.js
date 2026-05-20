import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { o as isNotValid } from "./Validations-DRaR7BG2.js";
import { n as isBlank } from "./isBlank-DrIS5hlK.js";
import { n as apiRoute, r as u, t as apiGetRoute } from "./apiGetRoute-OanlNAmJ.js";
import { toValue } from "vue";
import axios from "axios";
//#region src/Routes/apiPostRoute.ts
async function apiPostRoute(RouteName, data = null, options = null) {
	const system_options = apiRoute(RouteName, data, options, "POST");
	if (!system_options) return false;
	try {
		const token = document.head.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "";
		return (await axios.post(system_options.routeURL, data, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": token,
				"X-Requested-With": "XMLHttpRequest"
			},
			withCredentials: true
		})).data;
	} catch (error) {
		console.error(">> Erro ao fazer a requisição - Rota: " + RouteName, error);
		return null;
	}
}
//#endregion
//#region src/Routes/apiPutRoute.ts
async function apiPutRoute(RouteName, data = null, options = null) {
	const system_options = apiRoute(RouteName, data, options, "PUT");
	if (!system_options) return false;
	try {
		const token = document.head.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "";
		return (await axios.put(system_options.routeURL, data, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": token,
				"X-Requested-With": "XMLHttpRequest"
			},
			withCredentials: true
		})).data;
	} catch (error) {
		console.error(">> Erro ao fazer a requisição:", error);
		return null;
	}
}
//#endregion
//#region src/Routes/apiDeleteRoute.ts
async function apiDeleteRoute(RouteName, data = null, options = null) {
	const system_options = apiRoute(RouteName, data, options, "DELETE");
	if (!system_options) return false;
	try {
		const token = document.head.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "";
		return (await axios.delete(system_options.routeURL, {
			data,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": token,
				"X-Requested-With": "XMLHttpRequest"
			},
			withCredentials: true
		})).data;
	} catch (error) {
		console.error(">> Erro ao fazer a requisição:", error);
		return null;
	}
}
//#endregion
//#region src/Routes/apiUploadRoute.ts
async function apiUploadRoute(RouteName, files = null, data = {}, options = null) {
	const system_options = apiRoute(RouteName, data, options, "POST");
	if (!system_options) return false;
	const formData = new FormData();
	for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) {
		const value = data[key];
		if (typeof value === "object" && value !== null) formData.append(key, JSON.stringify(value));
		else formData.append(key, value);
	}
	files = { files: files["files"] ?? files };
	files["files"].forEach((fileItem, index) => {
		const file = fileItem;
		file["target"] = null;
		file["blob"] = new Blob([file], { type: file.type });
		file["objectURL"] = URL.createObjectURL(file.blob);
		formData.append(`files[${index}]`, file.blob, file.name);
	});
	try {
		const token = document.head.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "";
		return (await axios.post(system_options.routeURL, formData, {
			headers: {
				Accept: "application/json",
				"X-CSRF-TOKEN": token,
				"X-Requested-With": "XMLHttpRequest"
			},
			withCredentials: true
		})).data;
	} catch (error) {
		error.value = true;
		return false;
	}
}
//#endregion
//#region src/Routes/getRoute.ts
var getRoute = (routeName = null, data = {}) => {
	const route_value = toValue(routeName);
	if (!route_value || isBlank(route_value)) return null;
	const data_value = toValue(data) ?? {};
	const route = u();
	if (route().has(route_value)) return route(route_value, data_value);
	return null;
};
var getRouteByName = getRoute;
//#endregion
//#region src/Routes/goToRoute.ts
var activeRouter = null;
var setLibraryRouter = (router) => {
	activeRouter = router;
};
var goToRoute = (route = null, data = {}) => {
	if (!activeRouter) throw new Error("Router não configurado na biblioteca.");
	const route_value = toValue(route);
	if (!route_value || isBlank(route_value)) return false;
	const data_value = toValue(data) ?? {};
	const ziggy_route = u();
	if (ziggy_route().has(route_value)) {
		activeRouter.push(ziggy_route(route_value, data_value));
		return true;
	}
	console.log("router", activeRouter);
	activeRouter.push({
		name: route_value,
		params: data_value,
		query: data_value
	});
	return true;
};
var goToRouteByName = goToRoute;
//#endregion
//#region src/Routes/getCachedApi.ts
async function getCachedApi(routeName, dataToRequest = null, keyCache = null) {
	const route_name = toValue(routeName);
	if (isNotValid(route_name)) return null;
	const data_request = toValue(dataToRequest) ?? {};
	const key = toValue(keyCache) ?? route_name + "_" + JSON.stringify(data_request);
	const data = localStorage.getItem(key);
	if (data) return JSON.parse(data);
	const routeUrl = u()(route_name, data_request);
	const config = { responseType: "json" };
	axios.defaults.withCredentials = true;
	const data_return = (await axios.get(routeUrl, config)).data;
	localStorage.setItem(key, JSON.stringify(data_return));
	return data_return;
}
//#endregion
//#region src/Routes/index.ts
var Routes_exports = /* @__PURE__ */ __exportAll({
	apiDeleteRoute: () => apiDeleteRoute,
	apiGetRoute: () => apiGetRoute,
	apiPostRoute: () => apiPostRoute,
	apiPutRoute: () => apiPutRoute,
	apiUploadRoute: () => apiUploadRoute,
	getCachedApi: () => getCachedApi,
	getRoute: () => getRoute,
	getRouteByName: () => getRouteByName,
	goToRoute: () => goToRoute,
	goToRouteByName: () => goToRouteByName,
	setLibraryRouter: () => setLibraryRouter
});
//#endregion
export { apiDeleteRoute, apiGetRoute, apiPostRoute, apiPutRoute, apiUploadRoute, getCachedApi, getRoute, getRouteByName, goToRoute, goToRouteByName, setLibraryRouter, Routes_exports as t };

//# sourceMappingURL=routes.es.js.map