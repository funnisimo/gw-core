import * as Text from "./text/index";
import * as Types from "./types";
export declare const templates: Record<string, Text.Template>;
export declare function install(id: string, msg: string): void;
export declare function installAll(config: Record<string, string>): void;
export declare function needsUpdate(needs?: boolean): boolean;
export interface MessageOptions {
    length: number;
    width: number;
}
export declare function configure(opts: Partial<MessageOptions>): void;
export declare function add(msg: string, args?: any): void;
export declare function fromActor(actor: Types.ActorType, msg: string, args?: any): void;
export declare function addCombat(actor: Types.ActorType, msg: string, args?: any): void;
export declare function confirmAll(): void;
export declare type EachMsgFn = (msg: string, confirmed: boolean, i: number) => boolean;
export declare function forEach(fn: EachMsgFn): void;
