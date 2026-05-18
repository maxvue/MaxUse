export declare function notEmpty<V>(value: V): value is NonNullable<V>;
export declare function isNotEmpty<V>(value: V): value is NonNullable<V>;
export declare function noEmpty<V>(value: V): value is NonNullable<V>;
export declare function isEmpty<V>(value: V): value is NonNullable<V>;
export declare function empty<V>(value: V): boolean;
export declare function isValid<V>(value: V): value is NonNullable<V>;
export declare function isNotValid<V>(value: V): value is Extract<V, null | undefined>;
export declare function notHasValidContent<V>(value: V): value is Extract<V, null | undefined>;
//# sourceMappingURL=isValid.d.ts.map