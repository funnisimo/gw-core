import * as EFFECT from './effect';
import * as TYPES from './types';
import { EffectHandler } from './handler';
import { MapType } from '../map/types';

//////////////////////////////////////////////
// ActivateMachine

export class ActivateMachineEffect implements EffectHandler {
    make(src: Partial<TYPES.EffectConfig>, dest: TYPES.EffectInfo): boolean {
        if (!src.activateMachine) return true;

        dest.activateMachine = true;
        return true;
    }

    async fire(
        config: any,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<TYPES.EffectCtx>
    ) {
        if (config.activateMachine) {
            const cell = map.cell(x, y);
            const machine = cell.machineId;
            if (!machine) return false;

            return await map.activateMachine(machine, x, y, ctx);
        }
        return false;
    }

    fireSync(
        config: any,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<TYPES.EffectCtx>
    ) {
        if (config.activateMachine) {
            const cell = map.cell(x, y);
            const machine = cell.machineId;
            if (!machine) return false;

            return map.activateMachineSync(machine, x, y, ctx);
        }
        return false;
    }
}

EFFECT.installHandler('activateMachine', new ActivateMachineEffect());
