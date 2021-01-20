declare type FlagSource = number | string;
export declare type FlagBase = number | string | FlagSource[] | null;
export declare function fl(N: number): number;
export declare function toString(flagObj: any, value: number): string;
export declare function from(obj: any, ...args: (FlagBase | undefined)[]): number;
export {};
