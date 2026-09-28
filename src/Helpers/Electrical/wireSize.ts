import { toValue, MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type T = MaybeRefOrGetter<string | number | null>;

type Material = 'copper' | 'aluminum' | 'cobre' | 'aluminio' | 'alumínio' | 'cu' | 'al';
type Temperature = '90' | '70' | 90 | 70;
type Isolation = 'pvc' | 'epr' | 'xlpe';
type Phases = 1 | 2 | 3 | '1' | '2' | '3';

/**
 * Configuration options for sizing electrical cables (NBR 5410).
 *
 * @property current - Circuit electric current in Amperes (A).
 * @property material - Conductor material ('copper'/'cu' or 'aluminum'/'al'). Default: 'copper'.
 * @property isolation - Insulation temperature rating or type ('70', '90', 'pvc', 'epr', 'xlpe'). Default: '70'.
 * @property method - Installation method per NBR 5410 ('a1', 'a2', 'b1', 'b2', 'c', 'd', 'e', 'f', 'g'). Default: 'b1'.
 * @property length - Circuit length in meters (m). Default: 10.
 * @property voltage - Circuit nominal voltage in Volts (V). Default: 220.
 * @property voltage_type - Voltage type ('fn' for phase-neutral, 'ff' for phase-phase).
 * @property phases - Number of phases (1, 2, or 3). Default: 2.
 * @property max_loss - Maximum allowable voltage drop percentage (%). Default: 4.
 * @property voltage_drop - Maximum allowable voltage drop in Volts (V).
 * @property fca - Grouping correction factor. Default: 1.
 * @property fct - Temperature correction factor. Default: 1.
 * @property circuit_type - Circuit application type ('lighting' or 'power').
 * @property cos_phi - Power factor cos(φ). Default: 0.95.
 */
export type WireOptions = {
    current?: T;
    material?: Material;
    isolation?: Temperature | Isolation;
    method?: 'a1' | 'a2' | 'b1' | 'b2' | 'c' | 'd' | 'e' | 'f' | 'g' | string;
    length?: number | string;
    voltage?: 115 | 120 | 127 | 220 | 230 | 240 | 380 | 400 | 440 | 480 | number | string;
    voltage_type?: 'fn' | 'ff';
    phases?: Phases;
    max_loss?: number | string;
    voltage_drop?: number | string;
    fca?: number | string;
    fct?: number | string;
    circuit_type?: 'lighting' | 'power' | 'iluminacao' | 'tomada' | 'forca' | string;
    cos_phi?: number | string;
};

/**
 * Result of the electrical wire size calculation.
 *
 * @property wire - Recommended nominal cross-section in mm².
 * @property max_current - Ampacity rating of the selected conductor under specified conditions.
 * @property voltage_drop - Calculated voltage drop in Volts (V).
 * @property loss_percent - Calculated percentage voltage drop (%).
 * @property exceeded - Indicates whether circuit requirements exceed standard table limits.
 * @property table_loaded - Indicates whether installation table was dynamically loaded.
 */
export type WireSizeResult = {
    wire: number;
    max_current: number;
    voltage_drop: number;
    loss_percent: number;
    exceeded?: boolean;
    table_loaded?: boolean;
};

/**
 * Converts phase-neutral voltage to phase-phase voltage, rounding to the closest standard commercial voltage.
 *
 * @param phaseNeutralVoltage - Phase-neutral voltage in Volts.
 * @returns Closest commercial phase-phase voltage.
 */
function toPhasePhase(phaseNeutralVoltage: number): number {
    const array = [110, 120, 127, 210, 220, 240, 380, 440, 480];
    const valor = phaseNeutralVoltage * Math.sqrt(3);
    return array.reduce((anterior, atual) => Math.abs(atual - valor) < Math.abs(anterior - valor) ? atual : anterior);
}

/**
 * Calculates the nominal cross-section of an electrical cable based on ampacity and maximum allowable voltage drop according to Brazilian standard NBR 5410.
 *
 * @param current - Electric current in Amperes (accepts number, numeric string, or reactive Ref/getter).
 * @param options - Sizing options including material, voltage, distance, grouping factor, and installation method.
 * @returns A Promise resolving to `WireSizeResult` with recommended wire gauge in mm², or `null` if current is invalid.
 * @example
 * const result = await wireSize(32, { voltage: 220, length: 25, max_loss: 2 });
 * console.log(result?.wire); // 6 (mm²)
 */
export async function wireSize(current: T, options: WireOptions = {}): Promise<WireSizeResult | null> {
    const data = toValue(current);
    if (isBlank(data)) return null;

    const currentVal = parseFloat(String(data));

    if (!Number.isFinite(currentVal) || currentVal < 0) return null;
    if (currentVal === 0) return { wire: 0, max_current: 0, voltage_drop: 0, loss_percent: 0 };

    const material = String(options.material ?? '').includes('al') ? 'al' : 'cu';
    const isolation = String(options.isolation ?? '').includes('xlpe') || String(options.isolation ?? '').includes('epr') || String(options.isolation ?? '').includes('90') ? '90' : '70';
    const method = String(options.method ?? '').toLowerCase() || null;
    const phase_name = Number(options?.phases) > 2 ? 'tri' : 'bi';

    const phases = Number(options?.phases) > 2 ? 3 : 2;
    const rawVoltage = Number(options?.voltage ?? 220);
    const voltage_type = options?.voltage_type;
    const length = Number(options?.length ?? 10);

    const fca = Number(options?.fca ?? 1);
    const fct = Number(options?.fct ?? 1);
    const circuit_type = String(options?.circuit_type ?? '').toLowerCase();

    // Seção mínima padrão conforme NBR 5410 Tabela 47:
    // 1.5mm² para iluminação, 2.5mm² para tomadas/força
    let min_section = 1.5;
    if (circuit_type.includes('lighting') || circuit_type.includes('ilumina')) min_section = 1.5;
    else if (circuit_type.includes('power') || circuit_type.includes('tomada') || circuit_type.includes('forca')) min_section = 2.5;

    const correctedCurrent = currentVal / (fca * fct);

    const resistivity = {
        'cu': { '70': 0.0225, '90': 0.0240 },
        'al': { '70': 0.0360, '90': 0.0384 }
    };

    const safeMaterial = material as keyof typeof resistivity;
    const safeIsolation = isolation as keyof typeof resistivity[typeof safeMaterial];
    const rho = resistivity[safeMaterial][safeIsolation];

    // Trata tensão fase-fase vs fase-neutro em trifásico
    const voltage_base = phases === 3
        ? (voltage_type === 'ff' || rawVoltage > 254 ? rawVoltage : toPhasePhase(rawVoltage))
        : rawVoltage;

    const hasVoltageDrop = options?.voltage_drop !== undefined && !isBlank(options?.voltage_drop) && Number(options?.voltage_drop) > 0;
    const hasMaxLoss = options?.max_loss !== undefined && !isBlank(options?.max_loss) && Number(options?.max_loss) > 0;

    let voltage_drop_allowed: number;
    let max_percent: number;

    if (hasVoltageDrop && hasMaxLoss) {
        const dropFromVolt = Number(options.voltage_drop);
        const dropFromLoss = voltage_base * (Number(options.max_loss) / 100);
        voltage_drop_allowed = Math.min(dropFromVolt, dropFromLoss);
        max_percent = (voltage_drop_allowed / voltage_base) * 100;
    } else if (hasVoltageDrop) {
        voltage_drop_allowed = Number(options.voltage_drop);
        max_percent = (voltage_drop_allowed / voltage_base) * 100;
    } else if (hasMaxLoss) {
        max_percent = Number(options.max_loss);
        voltage_drop_allowed = voltage_base * (max_percent / 100);
    } else {
        max_percent = 5;
        voltage_drop_allowed = voltage_base * (max_percent / 100);
    }

    const section = phases === 3
        ? (Math.sqrt(3) * currentVal * length * rho) / voltage_drop_allowed
        : (2 * currentVal * length * rho) / voltage_drop_allowed;

    const calc_section = Math.max(section, min_section);

    const all_wires = [0.5, 0.75, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000];
    const initialWire = Number(all_wires.find((w) => w >= calc_section) || 1000);

    const data_return: WireSizeResult = {
        wire: initialWire,
        max_current: currentVal,
        voltage_drop: Number(voltage_drop_allowed.toFixed(2)),
        loss_percent: Number(max_percent.toFixed(2))
    };

    let table_loaded: boolean | undefined = undefined;

    // Se method não foi especificado mas houve derating ou consulta de ampacidade, usar 'b1' como referência
    let targetMethod = method;
    if (!targetMethod && (options.fca !== undefined || options.fct !== undefined)) targetMethod = 'b1';

    if (targetMethod) try {
        const module = await import(`../../json/${material}-${isolation}-${phase_name}-${targetMethod}.json`);
        const rawDados = module.default || module;
        if (Array.isArray(rawDados) && rawDados.length > 0) {
            table_loaded = true;
            const dados = [...rawDados].sort((a: { max_current: number }, b: { max_current: number }) => a.max_current - b.max_current);
            const item = dados.find((c: { wire: number; max_current: number }) => c.max_current >= correctedCurrent);
            if (item) if (item.wire >= data_return.wire) {
                data_return.wire = item.wire;
                data_return.max_current = Number((item.max_current * fca * fct).toFixed(2));
            } else {
                // Busca a menor bitola tabelada capaz de acomodar a seção calculada.
                // A busca exata acerta com as tabelas atuais (todas cobrem uma faixa
                // contígua de seções nominais); o recuo para a maior entrada é rede de
                // segurança para uma tabela futura com piso ou lacuna diferente, que
                // deixaria max_current com a corrente de entrada em vez da ampacidade.
                const wire_table = dados.find((c: { wire: number; max_current: number }) => c.wire >= data_return.wire) ?? dados[dados.length - 1];
                if (wire_table) data_return.max_current = Number((wire_table.max_current * fca * fct).toFixed(2));
            }
            else if (dados.length > 0) {
                const maxItem = dados[dados.length - 1];
                data_return.wire = Math.max(data_return.wire, maxItem.wire);
                data_return.max_current = Number((maxItem.max_current * fca * fct).toFixed(2));
                data_return.exceeded = true;
            }
        } else table_loaded = false;
    } catch {
        table_loaded = false;
    }

    if (method && table_loaded === false) data_return.table_loaded = false;

    // Aplica garantia de seção mínima NBR 5410
    if (data_return.wire < min_section) data_return.wire = min_section;

    const matchedWire = all_wires.find((w) => w >= data_return.wire);
    if (matchedWire !== undefined) data_return.wire = matchedWire;

    // Verificação da Queda de Tensão com impedância (resiste a assimetria)
    const cosPhi = Number(options?.cos_phi ?? 0.95);
    const sinPhi = Math.sqrt(Math.max(0, 1 - Math.pow(cosPhi, 2)));
    const X_por_metro = 0.0001;
    const k = (phases === 3) ? Math.sqrt(3) : 2;

    let wireIdx = all_wires.findIndex((w) => w >= data_return.wire);
    if (wireIdx === -1) wireIdx = all_wires.length - 1;

    let voltage_drop = 0;
    let percent_drop = 0;

    while (wireIdx < all_wires.length) {
        const candidateWire = all_wires[wireIdx];
        const R_por_metro = rho / candidateWire;
        const Z_efetiva = (R_por_metro * cosPhi) + (X_por_metro * sinPhi);
        voltage_drop = k * currentVal * length * Z_efetiva;
        percent_drop = (voltage_drop / voltage_base) * 100;

        if (percent_drop <= max_percent || voltage_drop <= voltage_drop_allowed || wireIdx === all_wires.length - 1) {
            data_return.wire = candidateWire;
            if (percent_drop > max_percent && voltage_drop > voltage_drop_allowed && wireIdx === all_wires.length - 1) data_return.exceeded = true;
            break;
        }
        wireIdx++;
    }

    data_return.voltage_drop = Number(voltage_drop.toFixed(2));
    data_return.loss_percent = Number(percent_drop.toFixed(2));

    return data_return;
}

/** Alias de {@link wireSize}. */
export const calculaCabo = wireSize;
