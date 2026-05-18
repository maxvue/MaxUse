import { MaybeRefOrGetter } from 'vue';
type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;
export declare function secondsAgo(value: RefDate): number | null;
export declare function minutesAgo(value: RefDate): number | null;
export declare function hoursAgo(value: RefDate): number | null;
export declare function daysAgo(value: RefDate): number | null;
export declare function monthsAgo(value: RefDate): number | null;
export declare function yearsAgo(value: RefDate): number | null;
export {};
//# sourceMappingURL=minutesAgo.d.ts.map