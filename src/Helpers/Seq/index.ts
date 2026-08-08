export * from './tap';
export * from './chain';
export * from './thru';
export * from './wrapperAt';
export * from './wrapperChain';
export * from './wrapperCommit';
export * from './wrapperLodash';
export * from './wrapperNext';
export * from './wrapperPlant';
export * from './wrapperReverse';
export * from './wrapperToIterator';
export * from './wrapperValue';
export * from './value';
export * from './commit';
export * from './plant';
export * from './next';
export * from './toIterator';
export * from './toJSON';
export * from './valueOf';
export * from './lodash';

import * as tap from './tap';
import * as chain from './chain';
import * as thru from './thru';
import * as wrapperAt from './wrapperAt';
import * as wrapperChain from './wrapperChain';
import * as wrapperCommit from './wrapperCommit';
import * as wrapperLodash from './wrapperLodash';
import * as wrapperNext from './wrapperNext';
import * as wrapperPlant from './wrapperPlant';
import * as wrapperReverse from './wrapperReverse';
import * as wrapperToIterator from './wrapperToIterator';
import * as wrapperValue from './wrapperValue';
import * as value from './value';
import * as commit from './commit';
import * as plant from './plant';
import * as next from './next';
import * as toIterator from './toIterator';
import * as toJSON from './toJSON';
import * as valueOf from './valueOf';
import * as lodash from './lodash';
export const seq = {
    ...tap,
    ...chain,
    ...thru,
    ...wrapperAt,
    ...wrapperChain,
    ...wrapperCommit,
    ...wrapperLodash,
    ...wrapperNext,
    ...wrapperPlant,
    ...wrapperReverse,
    ...wrapperToIterator,
    ...wrapperValue,
    ...value,
    ...commit,
    ...plant,
    ...next,
    ...toIterator,
    ...toJSON,
    ...valueOf,
    ...lodash
};
