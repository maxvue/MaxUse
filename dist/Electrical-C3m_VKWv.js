import { t as __exportAll } from "./chunk-pbuEa-1d.js";
import { n as isBlank } from "./isBlank-DrIS5hlK.js";
import { toValue } from "vue";
//#region \0rolldown_dynamic_import_helper.js
var _rolldown_dynamic_import_helper_default = (glob, path, segments) => {
	const query = path.lastIndexOf("?");
	const v = glob[query === -1 || query < path.lastIndexOf("/") ? path : path.slice(0, query)];
	if (v) return typeof v === "function" ? v() : Promise.resolve(v);
	return new Promise((_, reject) => {
		(typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, /* @__PURE__ */ new Error("Unknown variable dynamic import: " + path + (path.split("/").length !== segments ? ". Note that variables only represent file names one level deep." : ""))));
	});
};
//#endregion
//#region src/Helpers/Electrical/wireSize.ts
function toPhasePhase(phaseNeutralVoltage) {
	const array = [
		110,
		120,
		127,
		210,
		220,
		240,
		380,
		440,
		480
	];
	const valor = phaseNeutralVoltage * Math.sqrt(3);
	return array.reduce((anterior, atual) => Math.abs(atual - valor) < Math.abs(anterior - valor) ? atual : anterior);
}
/**
* Calcula a seção nominal de um cabo elétrico com base na corrente, opções de material, isolação, entre outros.
*
* @param current A corrente elétrica do circuito.
* @param options Opções do cálculo, como material, tensão, método de instalação e distância.
* @returns Um objeto com a bitola do cabo, a corrente máxima, a queda de tensão e a porcentagem de perda.
*/
async function wireSize(current, options) {
	const data = toValue(current);
	if (isBlank(data)) return null;
	const currentVal = parseFloat(String(data));
	if (currentVal === 0) return {
		wire: 0,
		max_current: 0,
		voltage_drop: 0,
		loss_percent: 0
	};
	const material = String(options.material ?? "").includes("al") ? "al" : "cu";
	const isolation = String(options.isolation ?? "").includes("xlpe") || String(options.isolation ?? "").includes("epr") || String(options.isolation ?? "").includes("90") ? "90" : "70";
	const method = String(options.method ?? "").toLowerCase() || null;
	const phase_name = Number(options?.phases) > 2 ? "tri" : "bi";
	const phases = Number(options?.phases) > 2 ? 3 : 2;
	const voltage = Number(options?.voltage ?? 220);
	const length = Number(options?.length ?? 10);
	const max_percent = Number(options?.max_loss ?? 5);
	const fca = Number(options?.fca ?? 1);
	const fct = Number(options?.fct ?? 1);
	const circuit_type = String(options?.circuit_type ?? "").toLowerCase();
	let min_section = .5;
	if (circuit_type.includes("lighting") || circuit_type.includes("ilumina")) min_section = 1.5;
	else if (circuit_type.includes("power") || circuit_type.includes("tomada") || circuit_type.includes("forca")) min_section = 2.5;
	const correctedCurrent = currentVal / (fca * fct);
	const resistivity = {
		"cu": {
			"70": .0225,
			"90": .024
		},
		"al": {
			"70": .036,
			"90": .036
		}
	};
	const safeMaterial = material;
	const safeIsolation = isolation;
	const rho = resistivity[safeMaterial][safeIsolation];
	const voltage_base = Number(phases === 3 ? toPhasePhase(Number(voltage)) : voltage);
	const voltage_drop_allowed = (phases === 3 ? voltage_base : voltage) * (max_percent / 100);
	const section = phases === 3 ? Math.sqrt(3) * currentVal * length * rho / voltage_drop_allowed : 2 * currentVal * length * rho / voltage_drop_allowed;
	const calc_section = Math.max(section, min_section);
	const data_return = {
		wire: Number([
			.5,
			.75,
			1,
			1.5,
			2.5,
			4,
			6,
			10,
			16,
			25,
			35,
			50,
			70,
			95,
			120,
			150,
			185,
			240,
			300,
			400,
			500,
			630,
			800,
			1e3
		].find((w) => w >= calc_section) || 1e3),
		max_current: currentVal,
		voltage_drop: Number(voltage_drop_allowed.toFixed(2)),
		loss_percent: Number(max_percent.toFixed(2))
	};
	try {
		if (method) {
			const module = await _rolldown_dynamic_import_helper_default(/* @__PURE__ */ Object.assign({
				"../../json/al-70-bi-a1.json": () => import("./al-70-bi-a1-BstN-cPl.js"),
				"../../json/al-70-bi-a2.json": () => import("./al-70-bi-a2-4HfqiPDn.js"),
				"../../json/al-70-bi-b1.json": () => import("./al-70-bi-b1-Besk0kAS.js"),
				"../../json/al-70-bi-b2.json": () => import("./al-70-bi-b2-BzQddNSt.js"),
				"../../json/al-70-bi-c.json": () => import("./al-70-bi-c-CBeys6_G.js"),
				"../../json/al-70-bi-d.json": () => import("./al-70-bi-d-DBx24o8Z.js"),
				"../../json/al-70-bi-e.json": () => import("./al-70-bi-e-BL-WjwLr.js"),
				"../../json/al-70-bi-f.json": () => import("./al-70-bi-f-bxq1jfcx.js"),
				"../../json/al-70-tri-a1.json": () => import("./al-70-tri-a1-DpvNwgUd.js"),
				"../../json/al-70-tri-a2.json": () => import("./al-70-tri-a2-pM3zJCkI.js"),
				"../../json/al-70-tri-b1.json": () => import("./al-70-tri-b1-B0Uf6xFJ.js"),
				"../../json/al-70-tri-b2.json": () => import("./al-70-tri-b2-BdEPYJUt.js"),
				"../../json/al-70-tri-c.json": () => import("./al-70-tri-c-0vXBO_st.js"),
				"../../json/al-70-tri-d.json": () => import("./al-70-tri-d-Clfk7pso.js"),
				"../../json/al-70-tri-e.json": () => import("./al-70-tri-e-cLdNN4_v.js"),
				"../../json/al-70-tri-f.json": () => import("./al-70-tri-f-BHj_EGWE.js"),
				"../../json/al-70-tri-g.json": () => import("./al-70-tri-g-CbUHbZyy.js"),
				"../../json/al-90-bi-a1.json": () => import("./al-90-bi-a1-CENAFJwV.js"),
				"../../json/al-90-bi-a2.json": () => import("./al-90-bi-a2-CDSPQag6.js"),
				"../../json/al-90-bi-b1.json": () => import("./al-90-bi-b1-C0_umlq-.js"),
				"../../json/al-90-bi-b2.json": () => import("./al-90-bi-b2-CrI-iTve.js"),
				"../../json/al-90-bi-c.json": () => import("./al-90-bi-c-B_y32y3Z.js"),
				"../../json/al-90-bi-d.json": () => import("./al-90-bi-d-DFFRPG7Q.js"),
				"../../json/al-90-bi-e.json": () => import("./al-90-bi-e-7SQsSAwU.js"),
				"../../json/al-90-bi-f.json": () => import("./al-90-bi-f-Ctc9_BlM.js"),
				"../../json/al-90-tri-a1.json": () => import("./al-90-tri-a1-D_A_bERa.js"),
				"../../json/al-90-tri-a2.json": () => import("./al-90-tri-a2-DEqY5hcS.js"),
				"../../json/al-90-tri-b1.json": () => import("./al-90-tri-b1-Cck3sgzP.js"),
				"../../json/al-90-tri-b2.json": () => import("./al-90-tri-b2-BuhtGf8m.js"),
				"../../json/al-90-tri-c.json": () => import("./al-90-tri-c-ZMm7_ogl.js"),
				"../../json/al-90-tri-d.json": () => import("./al-90-tri-d-I-FrO06v.js"),
				"../../json/al-90-tri-e.json": () => import("./al-90-tri-e-Dan_eBM8.js"),
				"../../json/al-90-tri-f.json": () => import("./al-90-tri-f-C5_kDXvE.js"),
				"../../json/al-90-tri-g.json": () => import("./al-90-tri-g-BmE-gFII.js"),
				"../../json/cu-70-bi-a1.json": () => import("./cu-70-bi-a1-BwlD4cKY.js"),
				"../../json/cu-70-bi-a2.json": () => import("./cu-70-bi-a2-BOonyYUw.js"),
				"../../json/cu-70-bi-b1.json": () => import("./cu-70-bi-b1-DkXfCO6S.js"),
				"../../json/cu-70-bi-b2.json": () => import("./cu-70-bi-b2-BEd1G29u.js"),
				"../../json/cu-70-bi-c.json": () => import("./cu-70-bi-c-CPhmpfw-.js"),
				"../../json/cu-70-bi-d.json": () => import("./cu-70-bi-d-iQG2dXcI.js"),
				"../../json/cu-70-bi-e.json": () => import("./cu-70-bi-e-APWsdkBW.js"),
				"../../json/cu-70-bi-f.json": () => import("./cu-70-bi-f-DSyzuyYu.js"),
				"../../json/cu-70-tri-a1.json": () => import("./cu-70-tri-a1-BnMf_VzQ.js"),
				"../../json/cu-70-tri-a2.json": () => import("./cu-70-tri-a2-Wvpf95iC.js"),
				"../../json/cu-70-tri-b1.json": () => import("./cu-70-tri-b1-CpuAYIRG.js"),
				"../../json/cu-70-tri-b2.json": () => import("./cu-70-tri-b2-DdN6DI6R.js"),
				"../../json/cu-70-tri-c.json": () => import("./cu-70-tri-c-B6lKrL0Y.js"),
				"../../json/cu-70-tri-d.json": () => import("./cu-70-tri-d-9HsKq1Ct.js"),
				"../../json/cu-70-tri-e.json": () => import("./cu-70-tri-e-BVSq-OGd.js"),
				"../../json/cu-70-tri-f.json": () => import("./cu-70-tri-f-Bgk8gVdM.js"),
				"../../json/cu-70-tri-g.json": () => import("./cu-70-tri-g-CR2EML1o.js"),
				"../../json/cu-90-bi-a1.json": () => import("./cu-90-bi-a1-CadMB51K.js"),
				"../../json/cu-90-bi-a2.json": () => import("./cu-90-bi-a2-B-ZFbmS9.js"),
				"../../json/cu-90-bi-b1.json": () => import("./cu-90-bi-b1-ByrYOTj3.js"),
				"../../json/cu-90-bi-b2.json": () => import("./cu-90-bi-b2-CapZQEHt.js"),
				"../../json/cu-90-bi-c.json": () => import("./cu-90-bi-c-BGnsMcyA.js"),
				"../../json/cu-90-bi-d.json": () => import("./cu-90-bi-d-GZ9jn0pP.js"),
				"../../json/cu-90-bi-e.json": () => import("./cu-90-bi-e-BiFWaWhX.js"),
				"../../json/cu-90-bi-f.json": () => import("./cu-90-bi-f-7WwJMYIc.js"),
				"../../json/cu-90-tri-a1.json": () => import("./cu-90-tri-a1-CUBqWFPp.js"),
				"../../json/cu-90-tri-a2.json": () => import("./cu-90-tri-a2-C6W_FjQV.js"),
				"../../json/cu-90-tri-b1.json": () => import("./cu-90-tri-b1-pWHmBrs9.js"),
				"../../json/cu-90-tri-b2.json": () => import("./cu-90-tri-b2-B8-BH00T.js"),
				"../../json/cu-90-tri-c.json": () => import("./cu-90-tri-c-BrAImsB_.js"),
				"../../json/cu-90-tri-d.json": () => import("./cu-90-tri-d-CCfXVnTX.js"),
				"../../json/cu-90-tri-e.json": () => import("./cu-90-tri-e-5gJQCv5M.js"),
				"../../json/cu-90-tri-f.json": () => import("./cu-90-tri-f-B81HO-QQ.js"),
				"../../json/cu-90-tri-g.json": () => import("./cu-90-tri-g-BamU9at-.js")
			}), `../../json/${material}-${isolation}-${phase_name}-${method}.json`, 4);
			const dados = module.default || module;
			const item = dados.find((c) => c.max_current >= correctedCurrent);
			if (item && item.wire >= data_return.wire) {
				data_return.wire = item.wire;
				data_return.max_current = Number((item.max_current * fca * fct).toFixed(2));
			} else if (item) {
				const wire_table = dados.find((c) => c.wire === data_return.wire);
				if (wire_table) data_return.max_current = Number((wire_table.max_current * fca * fct).toFixed(2));
			}
		}
	} catch (e) {
		console.warn("Erro ao carregar dados da tabela de cabos", e);
	}
	const cosPhi = .95;
	const R_por_metro = rho / data_return.wire;
	const X_por_metro = 1e-4;
	const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));
	const Z_efetiva = R_por_metro * cosPhi + X_por_metro * sinPhi;
	const voltage_drop = Number((phases === 3 ? Math.sqrt(3) : 2) * currentVal * length * Z_efetiva);
	const percent_drop = Number(voltage_drop / voltage_base * 100);
	data_return.voltage_drop = Number(voltage_drop.toFixed(2));
	data_return.loss_percent = Number(percent_drop.toFixed(2));
	return data_return;
}
var calculaCabo = wireSize;
//#endregion
//#region src/Helpers/Electrical/index.ts
var Electrical_exports = /* @__PURE__ */ __exportAll({
	calculaCabo: () => calculaCabo,
	electric: () => electric,
	electrical: () => electrical,
	wireSize: () => wireSize
});
var electrical = {
	wireSize,
	calculaCabo
};
var electric = electrical;
//#endregion
export { wireSize as a, calculaCabo as i, electric as n, electrical as r, Electrical_exports as t };

//# sourceMappingURL=Electrical-C3m_VKWv.js.map