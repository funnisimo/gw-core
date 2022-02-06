import * as UTILS from '../utils';
import { Scene, SceneOpts } from './scene';
import { App } from './gw';
import * as EVENTS from './events';

export class Scenes {
    _app: App;
    _scenes: Record<string, Scene> = {};
    _active: Scene[] = [];

    constructor(gw: App) {
        this._app = gw;
    }

    install(id: string, opts: SceneOpts | EVENTS.CallbackFn | Scene) {
        let scene: Scene;
        if (opts instanceof Scene) {
            scene = opts;
        } else {
            if (typeof opts === 'function') {
                opts = { create: opts };
            }
            scene = new Scene(id, opts);
        }
        this._scenes[id] = scene;

        scene.create(this._app);

        scene.on('start', () => this._start(scene));
        scene.on('stop', () => this._stop(scene));
    }

    get(id?: string): Scene | null {
        if (id === undefined) {
            return this._active[this._active.length - 1] || null;
        }
        return this._scenes[id] || null;
    }

    start(id: string, data?: Record<string, any>) {
        const scene = this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        this._active.forEach((a) => a.stop());
        scene.start(data);
    }
    _start(scene: Scene) {
        this._active.push(scene);
    }

    push(id: string, data?: Record<string, any>) {
        const scene = this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        scene.start(data);
    }
    stop(id: string, data?: Record<string, any>) {
        const scene = this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        scene.stop(data);
    }
    _stop(_scene: Scene) {
        this._active = this._active.filter((s) => s.isActive());
    }

    pause(id: string, data?: Record<string, any>) {
        const scene = this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        scene.pause(data);
    }
    resume(id: string, data?: Record<string, any>) {
        const scene = this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        scene.resume(data);
    }

    sleep(id: string, data?: Record<string, any>) {
        const scene = this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        scene.sleep(data);
    }
    wake(id: string, data?: Record<string, any>) {
        const scene = this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        scene.wake(data);
    }

    // FRAME

    frameStart() {
        this._active.forEach((s) => s.frameStart());
    }
    input() {
        UTILS.arrayRevEach(this._active, (s) => s.input());
    }
    update() {
        this._active.forEach((s) => s.update());
    }
    draw() {
        this._active.forEach((s, i) => {
            if (i > 0) {
                s.buffer.copy(this._active[i - 1].buffer);
            }
            s.draw();
        });
    }
    frameEnd() {
        const last = this._active[this._active.length - 1];
        if (last) {
            this._active.forEach((s) => s.frameEnd());
            last.buffer.render();
        }
    }
    frameDebug() {
        const last = this._active[this._active.length - 1];
        if (last) {
            this._active.forEach((s) => s.frameDebug(last.buffer));
            last.buffer.render();
        }
    }
}
