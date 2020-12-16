export declare type FrequencyFn = (danger: number) => number;
export declare type FrequencyConfig = FrequencyFn | number | string | Record<string, number> | null;
export declare function make(v?: FrequencyConfig): (level: number) => any;
