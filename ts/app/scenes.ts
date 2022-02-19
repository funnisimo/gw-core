import * as UTILS from '../utils';
import * as CANVAS from '../canvas';
import { Scene, SceneOpts } from './scene';
import { App } from './app';
import * as EVENTS from './events';
import * as IO from '../app/io';
import { PauseOpts } from '.';
import { AlertScene } from '../ui/alert';
import { ConfirmScene } from '../ui/confirm';
import { PromptScene } from '../ui/prompt';
import { MenuScene } from '../ui/menu';

export class Scenes {
    _app: App;
    _scenes: Record<string, Scene> = {};
    _active: Scene[] = [];

    constructor(gw: App) {
        this._app = gw;
        this.install('alert', AlertScene);
        this.install('confirm', ConfirmScene);
        this.install('prompt', PromptScene);
        this.install('menu', MenuScene);
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

    load(scenes: Record<string, SceneOpts>) {
        Object.entries(scenes).forEach(([id, fns]) => this.install(id, fns));
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

    start(id: string | Scene, data?: any): Scene {
        const scene = id instanceof Scene ? id : this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        scene.start(data);
        return scene;
    }

    run(id: string | Scene, data?: any): Promise<any> {
        const scene = id instanceof Scene ? id : this._scenes[id];
        if (!scene) throw new Error('Unknown scene:' + id);
        return scene.run(data);
    }

    _start(scene: Scene) {
        this._active.push(scene);
    }

    stop(data?: any): void;
    stop(id: string | Scene, data?: any): void;
    stop(id?: string | Scene | any, data?: any): void {
        if (typeof id === 'string') {
            const scene = this._scenes[id];
            if (!scene) throw new Error('Unknown scene:' + id);
            scene.stop(data);
        } else if (id instanceof Scene) {
            id.stop(data);
        } else {
            this._active.forEach((s) => s.stop(id));
        }
    }
    _stop(_scene: Scene) {
        this._active = this._active.filter((s) => s.isActive());
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
    draw(buffer: CANVAS.Buffer) {
        this._active.forEach((s) => {
            // if (i > 0) {
            //     s.buffer.copy(this._active[i - 1].buffer);
            // }
            s.draw(buffer);
        });
    }
    frameEnd(buffer: CANVAS.Buffer) {
        if (this._active.length) {
            this._active.forEach((s) => s.frameEnd(buffer));
        }
    }
    frameDebug(buffer: CANVAS.Buffer) {
        if (this._active.length) {
            this._active.forEach((s) => s.frameDebug(buffer));
        }
    }
}
