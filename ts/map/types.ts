import { Chain } from '../utils/chain';
import { GameObject } from '../gameObject/gameObject';

export interface CellFlags {
    cell: number;
}

export interface CellType {
    flags: CellFlags;
    tileFlags: () => number;
    tileMechFlags: () => number;
    objects: Chain<GameObject>;

    storeMemory: () => void;

    // isAnyKindOfVisible: () => boolean;
    // isVisible: () => boolean;
}

export interface MapType {
    readonly width: number;
    readonly height: number;
    // cell: (x: number, y: number) => CellType;
    isVisible: (x: number, y: number) => boolean;
    // actorAt: (x: number, y: number) => ActorType | null;
    // itemAt: (x: number, y: number) => ItemType | null;
}
