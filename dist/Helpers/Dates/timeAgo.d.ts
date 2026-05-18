import { MaybeRefOrGetter } from 'vue';
type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;
export declare function secondsAgo(value: RefDate): number;
export declare function minutesAgo(value: RefDate): number;
export declare function hoursAgo(value: RefDate): number;
export declare function daysAgo(value: RefDate): number;
export declare function monthsAgo(value: RefDate): number;
export declare function yearsAgo(value: RefDate): number;
export {};
//# sourceMappingURL=timeAgo.d.ts.map