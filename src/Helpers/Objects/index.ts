import { deepClone } from './deepClone';
import { get } from './get';
import { unset } from './unset';
import { isEqual } from './isEqual';
import { deepMerge } from './deepMerge';
import { renameKeys } from './renameKeys';
import { pick, omit } from './manipulations';
import { mapValues } from './mapValues';
import { set } from './set';
import { diff } from './diff';
import { keyExists } from './keyExists';
import { keys } from './keys';
import { keysIn } from './keysIn';
import { valuesIn } from './valuesIn';
import { has } from './has';
import { hasIn } from './hasIn';
import { toPairs } from './toPairs';
import { toPairsIn } from './toPairsIn';
import { at } from './at';

export { deepClone, get, set, unset, isEqual, deepMerge, renameKeys, pick, omit, mapValues, diff, keyExists };
export { keys, keysIn, valuesIn, has, hasIn, toPairs, toPairsIn, at };
export { deepClone as cloneDeep };

export const Obj = {
    deepClone,
    cloneDeep: deepClone,
    get,
    set,
    unset,
    isEqual,
    deepMerge,
    renameKeys,
    pick,
    omit,
    mapValues,
    diff,
    keyExists
};
