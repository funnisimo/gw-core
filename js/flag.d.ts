export declare function fl(N: number): number;
export declare function toString(flagObj: any, value: number): string;
export declare function from(obj: any, ...args: any[]): number;
export declare const flags: Record<string, Record<string, number>>;
export declare function install(flagName: string, flag: Record<string, number>): Record<string, number>;
