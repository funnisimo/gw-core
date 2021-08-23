import { EffectInfo, EffectConfig } from './types';
import { EffectHandler } from './handler';
import { Effect as Flags } from './flags';

import { make } from './make';

// resetMessageDisplayed
export function reset(effect: EffectInfo) {
    effect.flags &= ~Flags.E_FIRED;
}

export function resetAll() {
    Object.values(effects).forEach((e) => reset(e));
}

export const effects: Record<string, EffectInfo> = {};

export function install(id: string, config: Partial<EffectConfig>): EffectInfo {
    const effect = make(config);
    effects[id] = effect;
    effect.id = id;
    return effect;
}

export function installAll(effects: Record<string, Partial<EffectConfig>>) {
    Object.entries(effects).forEach(([id, config]) => {
        install(id, config);
    });
}

export const handlers: Record<string, EffectHandler> = {};

export function installHandler(id: string, handler: EffectHandler) {
    handlers[id] = handler;
}
