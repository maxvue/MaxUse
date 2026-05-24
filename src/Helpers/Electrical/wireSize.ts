import { toValue, MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type T = MaybeRefOrGetter<string | number | null>;

type Material = 'copper' | 'aluminum' | 'cobre' | 'aluminio' | 'alumínio' | 'cu' | 'al';
type Temperature = '90' | '70' | 90 | 70;
type Isolation = 'pvc' | 'epr' | 'xlpe';
type Phases = 1 | 2 |3 | '1' | '2' | '3';

/**
 * Opções de configuração para o cálculo de bitola de cabos elétricos.
 *
 * @property current - Corrente elétrica do circuito (A).
 * @property material - Material do condutor ('copper'/'cu' ou 'aluminum'/'al').
 * @property isolation - Tipo de isolação ou temperatura ('70', '90', 'pvc', 'epr', 'xlpe').
 * @property method - Método de instalação conforme NBR 5410 ('a1', 'a2', 'b1', 'b2', 'c', 'd', 'e', 'f', 'g').
 * @property length - Comprimento do circuito em metros.
 * @property voltage - Tensão do circuito em volts.
 * @property phases - Número de fases (1, 2 ou 3).
 * @property max_loss - Percentual máximo de queda de tensão permitido.
 * @property voltage_drop - Queda de tensão máxima permitida (V).
 * @property fca - Fator de correção de agrupamento.
 * @property fct - Fator de correção de temperatura.
 * @property circuit_type - Tipo do circuito ('lighting'/'iluminacao' ou 'power'/'tomada'/'forca').
 */
export type WireOptions = {
    current?: T;
    material?: Material;
    isolation?: Temperature | Isolation;
    method?: 'a1' | 'a2' | 'b1' | 'b2' | 'c' | 'd' | 'e' | 'f' | 'g' | string;
    length?: number | string;
    voltage?: 115 | 120 | 127 | 220 | 230 | 240 | 380 | 400 | 440 | 480 | number | string;
    phases?: Phases;
    max_loss?: number | string;
    voltage_drop?: number | string;
    fca?: number | string;
    fct?: number | string;
    circuit_type?: 'lighting' | 'power' | 'iluminacao' | 'tomada' | 'forca' | string;
};

/**
 * Converte tensão fase-neutro para tensão fase-fase, arredondando para o valor comercial mais próximo.
 *
 * @param phaseNeutralVoltage - Tensão fase-neutro em volts.
 * @returns Tensão fase-fase comercial mais próxima.
 */
function toPhasePhase(phaseNeutralVoltage: number): number {
    const array = [110, 120, 127, 210, 220, 240, 380, 440, 480];
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
export async function wireSize(current: T, options: WireOptions) {
    const data = toValue(current);
    if (isBlank(data)) return null;

    const currentVal = parseFloat(String(data));

    if (currentVal === 0) return { wire: 0, max_current: 0, voltage_drop: 0, loss_percent: 0 };

    const material = String(options.material ?? '').includes('al') ? 'al' : 'cu';
    const isolation = String(options.isolation ?? '').includes('xlpe') || String(options.isolation ?? '').includes('epr') || String(options.isolation ?? '').includes('90') ? '90' : '70';
    const method = String(options.method ?? '').toLowerCase() || null;
    const phase_name = Number(options?.phases) > 2 ? 'tri' : 'bi';

    const phases = Number(options?.phases) > 2 ? 3 : 2;
    const voltage = Number(options?.voltage ?? 220);
    const length = Number(options?.length ?? 10);
    const max_percent = Number(options?.max_loss ?? 5);

    const fca = Number(options?.fca ?? 1);
    const fct = Number(options?.fct ?? 1);
    const circuit_type = String(options?.circuit_type ?? '').toLowerCase();

    let min_section = 0.5;
    if (circuit_type.includes('lighting') || circuit_type.includes('ilumina')) min_section = 1.5;
    else if (circuit_type.includes('power') || circuit_type.includes('tomada') || circuit_type.includes('forca')) min_section = 2.5;

    const correctedCurrent = currentVal / (fca * fct);

    const resistivity = {
        'cu': { '70': 0.0225, '90': 0.0240 },
        'al':{ '70': 0.0360, '90': 0.0360 }
    };

    const safeMaterial = material as keyof typeof resistivity;
    const safeIsolation = isolation as keyof typeof resistivity[typeof safeMaterial];
    const rho = resistivity[safeMaterial][safeIsolation];
    const voltage_base = Number(phases === 3 ? toPhasePhase(Number(voltage)) : voltage);
    const voltage_drop_allowed = (phases === 3 ? voltage_base: voltage) * (max_percent / 100);

    const section = phases === 3
        ? (Math.sqrt(3) * currentVal * length * rho) / voltage_drop_allowed
        : (2 * currentVal * length * rho) / voltage_drop_allowed;

    const calc_section = Math.max(section, min_section);

    const all_wires = [0.5, 0.75, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000];
    const data_return: any = {
        wire: Number(all_wires.find((w) => w >= calc_section) || 1000),
        max_current: currentVal,
        voltage_drop: Number(voltage_drop_allowed.toFixed(2)),
        loss_percent: Number(max_percent.toFixed(2))
    };

    try {
        if (method) {
            const module = await import(`../../json/${material}-${isolation}-${phase_name}-${method}.json`);
            const dados = module.default || module;
            const item = dados.find((c: { wire: number; max_current: number }) => c.max_current >= correctedCurrent);
            if (item && item.wire >= data_return.wire) {
                data_return.wire = item.wire;
                data_return.max_current = Number((item.max_current * fca * fct).toFixed(2));
            } else if (item) {
                const wire_table = dados.find((c: { wire: number; max_current: number }) => c.wire === data_return.wire);
                if (wire_table) data_return.max_current = Number((wire_table.max_current * fca * fct).toFixed(2));
            }
        }
    } catch (e) {
        console.warn('Erro ao carregar dados da tabela de cabos', e);
    }

    const cosPhi = 0.95;
    const R_por_metro = rho / data_return.wire;
    const X_por_metro = 0.0001;
    const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));
    const Z_efetiva = (R_por_metro * cosPhi) + (X_por_metro * sinPhi);
    const k = (phases === 3) ? Math.sqrt(3) : 2;
    const voltage_drop = Number(k * currentVal * length * Z_efetiva);
    const percent_drop = Number((voltage_drop / voltage_base) * 100);

    data_return.voltage_drop = Number(voltage_drop.toFixed(2));
    data_return.loss_percent = Number(percent_drop.toFixed(2));

    return data_return;
}

/** Alias de {@link wireSize}. */
export const calculaCabo = wireSize;
