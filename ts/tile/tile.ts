import {
    Layer,
    GameObject as ObjectFlags,
    LayerString,
} from '../gameObject/flags';
import * as Light from '../light';
import { TileFlags, TileType, NameConfig } from './types';
import * as Sprite from '../sprite';
import * as Flag from '../flag';
import * as Effect from '../effect';
import * as Flags from './flags';
import * as Color from '../color';

export interface TileConfig extends Sprite.SpriteConfig {
    id: string;
    flags: TileFlags;
    dissipate: number;
    effects: Record<string, Effect.EffectInfo | string>;
    priority: number;
    layer: number;
    light: Light.LightType | null;
    // groundTile: string | null;

    name: string;
    description: string;
    flavor: string;
    article: string | null;
}

export class Tile implements TileType {
    id: string;
    index = -1;
    flags: TileFlags;
    dissipate = 20 * 100; // 0%
    effects: Record<string, string | Effect.EffectInfo> = {};
    sprite: Sprite.Sprite;
    priority = 50;
    layer = Layer.GROUND;
    light: Light.LightType | null = null;
    // groundTile: string | null;

    name: string;
    description: string;
    flavor: string;
    article: string | null;

    constructor(config: Partial<TileConfig>) {
        this.id = config.id || 'n/a';
        this.dissipate = config.dissipate ?? this.dissipate;
        this.priority = config.priority ?? this.priority;
        this.layer = config.layer ?? this.layer;
        this.light = config.light || null;
        // this.groundTile = config.groundTile || null; // Huh?

        this.sprite = Sprite.make(config);
        this.name = config.name || 'tile';
        this.description = config.description || this.name;
        this.flavor = config.flavor || this.name;
        this.article = config.article ?? null;

        this.flags = config.flags || { object: 0, tile: 0, tileMech: 0 };

        if (config.effects) {
            Object.assign(this.effects, config.effects);
        }
    }

    hasObjectFlag(flag: number): boolean {
        return !!(this.flags.object & flag);
    }
    hasTileFlag(flag: number): boolean {
        return !!(this.flags.tile & flag);
    }
    hasTileMechFlag(flag: number): boolean {
        return !!(this.flags.tileMech & flag);
    }

    hasAllObjectFlags(flag: number): boolean {
        return (this.flags.object & flag) === flag;
    }
    hasAllTileFlags(flag: number): boolean {
        return (this.flags.tile & flag) === flag;
    }
    hasAllTileMechFlags(flag: number): boolean {
        return (this.flags.tileMech & flag) === flag;
    }

    hasEffect(name: string): boolean {
        return name in this.effects;
    }

    getName(): string;
    getName(config: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getName(arg?: any): string {
        let opts: NameConfig = {};
        if (arg === true || arg === false) {
            opts.article = arg;
        } else if (typeof arg === 'string') {
            opts.article = arg;
        } else if (arg) {
            opts = arg;
        }

        if (!opts.article && !opts.color) return this.name;

        let result = this.name;
        if (opts.color) {
            let color: Color.ColorBase = opts.color as Color.ColorBase;
            if (opts.color === true) {
                color = this.sprite.fg || 'white';
            }
            if (typeof color !== 'string') {
                color = Color.from(color).toString();
            }
            result = `Ω${color}Ω${this.name}∆`;
        }

        if (opts.article) {
            let article =
                typeof opts.article === 'string'
                    ? opts.article
                    : this.article || 'a';
            result = article + ' ' + result;
        }
        return result;
    }
    getDescription(): string {
        return this.description || this.getName();
    }
    getFlavor(): string {
        return this.flavor || this.getName();
    }
}

export interface TileOptions extends Sprite.SpriteConfig {
    extends: string;

    id: string;
    name: string;
    description: string;
    flavor: string;
    article: string;

    flags: Flag.FlagBase;
    priority: number;
    dissipate: number;
    layer: Layer | LayerString;

    effects: Record<string, Partial<Effect.EffectConfig> | string | null>;
    // groundTile: string;

    light: Light.LightBase | null;
}

export function make(options: Partial<TileOptions>) {
    let base = { effects: {}, flags: {}, sprite: {} } as Tile;
    if (options.extends) {
        base = tiles[options.extends];
        if (!base)
            throw new Error('Failed to find base tile: ' + options.extends);
    }

    const effects: Record<string, Effect.EffectInfo | string> = {};
    Object.assign(effects, base.effects);
    if (options.effects) {
        Object.entries(options.effects).forEach(([key, value]) => {
            if (value === null) {
                delete effects[key];
                return;
            }

            if (typeof value === 'string') {
                effects[key] = value;
                return;
            }

            effects[key] = Effect.make(value);
        });
    }

    const flags: TileFlags = {
        object: Flag.from(ObjectFlags, base.flags.object, options.flags),
        tile: Flag.from(Flags.Tile, base.flags.tile, options.flags),
        tileMech: Flag.from(Flags.TileMech, base.flags.tileMech, options.flags),
    };

    let layer: Layer = base.layer || 0;
    if (options.layer) {
        if (typeof options.layer === 'string') {
            layer = Layer[options.layer];
        } else {
            layer = options.layer;
        }
    }
    let light = base.light;
    if (options.light) {
        light = Light.make(options.light);
    } else if (options.light === null) {
        light = null;
    }

    const config: Partial<TileConfig> = {
        id: options.id,
        flags,
        dissipate: options.dissipate ?? base.dissipate,
        effects,
        priority: options.priority ?? base.priority,
        layer,
        light,
        // groundTile: string | null;

        ch: options.ch ?? base.sprite.ch,
        fg: options.fg ?? base.sprite.fg,
        bg: options.bg ?? base.sprite.bg,
        opacity: options.opacity ?? base.sprite.opacity,

        name: options.name || base.name,
        description: options.description || base.description,
        flavor: options.flavor || base.flavor,
        article: options.article ?? base.article,
    };

    const tile = new Tile(config);
    return tile;
}

export const tiles: Record<string, Tile> = {};
export const all: Tile[] = [];

export function get(id: string | number): Tile {
    if (typeof id === 'string') return tiles[id];
    return all[id];
}

export function install(id: string, options: Partial<TileOptions>): Tile;
export function install(
    id: string,
    base: string,
    options: Partial<TileOptions>
): Tile;
export function install(id: string, ...args: any[]): Tile {
    let options: Partial<TileOptions> = args[0];
    if (args.length == 2) {
        options = args[1];
        options.extends = args[0];
    }
    options.id = id;
    const tile = make(options);
    tile.index = all.length;
    all.push(tile);
    tiles[id] = tile;
    return tile;
}

export function installAll(tiles: Record<string, Partial<TileOptions>>): void {
    Object.entries(tiles).forEach(([id, config]) => {
        install(id, config);
    });
}
