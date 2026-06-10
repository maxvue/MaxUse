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

export { deepClone, get, set, unset, isEqual, deepMerge, renameKeys, pick, omit, mapValues, diff, keyExists };
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
