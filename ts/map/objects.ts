import { GameObject } from '../gameObject';
import { Map } from './map';
import * as Layers from './layers';
import { ObjectListType, ObjectMatchFn, ObjectFn } from './types';

export class ObjectList implements ObjectListType {
    map: Map;

    constructor(map: Map) {
        this.map = map;
    }

    at(x: number, y: number, cb: ObjectMatchFn) {
        return this.map.cell(x, y).objects.find((item) => !cb || cb(item));
    }

    has(obj: GameObject) {
        return this.map.cells.some((c) => c.objects.has(obj));
    }

    add(x: number, y: number, obj: GameObject) {
        const depth = obj.depth;
        const layer = this.map.getLayer(depth) as Layers.ObjectLayer;
        return layer.add(x, y, obj);
    }
    remove(obj: GameObject) {
        const depth = obj.depth;
        const layer = this.map.getLayer(depth) as Layers.ObjectLayer;
        return layer.remove(obj);
    }

    move(obj: GameObject, x: number, y: number) {
        this.remove(obj);
        return this.add(x, y, obj);
    }

    forEach(cb: ObjectFn) {
        return this.map.cells.forEach((cell) => cell.objects.forEach(cb));
    }
    forEachAt(x: number, y: number, cb: ObjectFn) {
        return this.map.cell(x, y).objects.forEach(cb);
    }
}
