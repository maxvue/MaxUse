import type { MaxUseWrapper } from './_MaxUseWrapper';
import { map } from '../Iterables/map';
import { filter } from '../Iterables/filter';
import { take } from '../Iterables/take';
import { drop } from '../Iterables/drop';
import { slice } from '../Iterables/slice';
import { reject } from '../Iterables/reject';
import { compact } from '../Iterables/compact';
import { chunk } from '../Iterables/chunk';
import { uniq } from '../Iterables/uniq';
import { uniqBy } from '../Iterables/uniqBy';
import { sortBy, orderBy } from '../Iterables/orderBy';
import { groupBy } from '../Iterables/groupBy';
import { keyBy } from '../Iterables/keyBy';
import { countBy } from '../Iterables/countBy';
import { countWhere } from '../Iterables/countWhere';
import { head } from '../Iterables/head';
import { last } from '../Iterables/last';
import { initial } from '../Iterables/initial';
import { tail } from '../Iterables/tail';
import { min } from '../Iterables/min';
import { max } from '../Iterables/max';
import { sum } from '../Iterables/sum';
import { mean } from '../Iterables/mean';
import { pick, omit } from '../Objects/manipulations';
import { get } from '../Objects/get';
import { mapValues } from '../Objects/mapValues';

const collectionHelpers: Record<string, Function> = {
    map,
    filter,
    take,
    drop,
    slice,
    reject,
    compact,
    chunk,
    uniq,
    uniqBy,
    sortBy,
    orderBy,
    groupBy,
    keyBy,
    countBy,
    countWhere,
    head,
    first: head,
    last,
    initial,
    tail,
    min,
    max,
    sum,
    mean,
    pick,
    omit,
    get,
    mapValues
};

export function registerCollectionMixins(WrapperClass: typeof MaxUseWrapper): void {
    for (const [name, fn] of Object.entries(collectionHelpers)) {
        const hasProp = name in WrapperClass.prototype;
        if (!hasProp) {
            const method = function (this: InstanceType<typeof WrapperClass>, ...args: unknown[]) {
                return (this as any)._pushAction((val: unknown) => (fn as any)(val, ...args));
            };
            (WrapperClass.prototype as any)[name] = method;
        }
    }
}
