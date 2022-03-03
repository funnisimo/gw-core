import * as UTILS from '../utils';
import * as BUFFER from '../buffer';
import { Scene, CreateOpts, StartOpts, SceneMakeFn } from './scene';
import { App } from './app';
import * as IO from '../app/io';
import { PauseOpts } from '.';

interface PendingInfo {
    action: 'start' | 'stop' | 'run';
    scene: Scene;
    data: any;
}

export class Scenes {
    _app: App;
    _config: Record<string, CreateOpts>;
    _scenes: Record<string, Scene> = {};
    _active: Scene[] = [];
    _busy = false;
    _pending: PendingInfo[] = [];

    constructor(gw: App) {
        this._app = gw;
        this._config = Object.assign({}, scenes);
    }

    get isBusy() {
        return this._busy;
    }

    add(id: string, opts: CreateOpts | SceneMakeFn) {
        const current = this._config[id] || {};
        if (typeof opts === 'function') {
            opts = { make: opts };
        }
        Object.assign(current, opts);
        this._config[id] = current;
    }

    load(scenes: Record<string, CreateOpts | SceneMakeFn>) {
        Object.entries(scenes).forEach(([id, fns]) => this.add(id, fns));
    }

    get(): Scene;
    get(id?: string): Scene | null;
    get(id?: string): Scene | null {
        if (id === undefined) {
            return this._active[this._active.length - 1];
        }
        return this._scenes[id] || null;
    }

    trigger(ev: string, ...args: any[]): void {
        this._active.forEach((a) => a.trigger(ev, ...args));
    }

    _create(id: string, opts: CreateOpts = {}): Scene {
        let cfg = this._config[id] || {};
        const used = Object.assign({}, cfg, opts);

        let scene: Scene;

        if (used.make) {
            scene = used.make(id, this._app);
        } else {
            scene = new Scene(id, this._app);
        }

        scene.on('start', () => this._start(scene));
        scene.on('stop', () => this._stop(scene));
        scene.create(used);

        return scene;
    }

    create(id: string, data: CreateOpts = {}): Scene {
        if (id in this._scenes) {
            console.log('Scene already created - ' + id);
            return this._scenes[id];
        }
        return this._create(id, data);
    }

    start(id: string, data?: StartOpts): Scene {
        let scene: Scene = this._scenes[id] || this._create(id, data);
        if (this.isBusy) {
            this._pending.push({ action: 'start', scene, data });
        } else {
            scene.start(data);
        }
        return scene;
    }

    run(id: string, data?: StartOpts): Scene {
        let scene: Scene = this._scenes[id] || this._create(id, data);
        if (this.isBusy) {
            this._pending.push({ action: 'run', scene, data });
        } else {
            scene.run(data);
        }

        return scene;
    }

    _start(scene: Scene) {
        this._active.push(scene);
    }

    stop(data?: any): void;
    stop(id: string, data?: any): void;
    stop(id?: string | any, data?: any): void {
        if (typeof id === 'string') {
            const scene = this._scenes[id];
            if (!scene) throw new Error('Unknown scene:' + id);
            id = scene;
        }

        if (id instanceof Scene) {
            if (this.isBusy) {
                this._pending.push({ action: 'stop', scene: id, data });
            } else {
                id.stop(data);
            }
        } else {
            this._active.forEach((s) => this.stop(s.id, id));
        }
    }
    _stop(_scene: Scene) {
        this._active = this._active.filter((s) => s.isActive());
    }

    destroy(id: string, data?: any) {
        const scene = this._scenes[id];
        if (!scene) return;
        if (scene.isActive()) {
            scene.stop(data);
        }
        scene.destroy(data);
        delete this._scenes[id];
    }

    pause(id: string, opts?: PauseOpts): void;
    pause(opts?: PauseOpts): void;
    pause(id?: string | PauseOpts, opts?: PauseOpts): void {
        if (typeof id === 'string') {
            const scene = this._scenes[id];
            if (!scene) throw new Error('Unknown scene:' + id);
            scene.pause(opts);
        } else {
            this._active.forEach((s) => s.pause(id));
        }
    }

    resume(opts?: PauseOpts): void;
    resume(id: string, opts?: PauseOpts): void;
    resume(id?: string | PauseOpts, opts?: PauseOpts): void {
        if (typeof id === 'string') {
            const scene = this._scenes[id];
            if (!scene) throw new Error('Unknown scene:' + id);
            scene.resume(opts);
        } else {
            this._active.forEach((s) => s.resume(id));
        }
    }

    // FRAME

    frameStart() {
        this._busy = true;
        this._active.forEach((s) => s.frameStart());
    }
    input(ev: IO.Event) {
        UTILS.arrayRevEach(this._active, (s) => {
            if (!ev.propagationStopped) s.input(ev);
        });
    }
    update(dt: number) {
        this._active.forEach((s) => s.update(dt));
    }
    draw(buffer: BUFFER.Buffer) {
        this._active.forEach((s) => {
            // if (i > 0) {
            //     s.buffer.copy(this._active[i - 1].buffer);
            // }
            s.draw(buffer);
        });
    }
    frameDebug(buffer: BUFFER.Buffer) {
        if (this._active.length) {
            this._active.forEach((s) => s.frameDebug(buffer));
        }
    }
    frameEnd(buffer: BUFFER.Buffer) {
        if (this._active.length) {
            this._active.forEach((s) => s.frameEnd(buffer));
        }
        this._busy = false;

        for (let i = 0; i < this._pending.length; ++i) {
            const todo = this._pending[i];
            todo.scene[todo.action](todo.data);
        }
        this._pending.length = 0;
    }
}

export const scenes: Record<string, CreateOpts> = {};

export function installScene(id: string, scene: CreateOpts | SceneMakeFn) {
    if (typeof scene === 'function') {
        scene = { make: scene };
    }
    scenes[id] = scene;
}
