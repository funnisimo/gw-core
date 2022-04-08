import get from 'lodash/get';
import set from 'lodash/set';

export class Data implements Record<string, any> {
    constructor(config: Record<string, any> = {}) {
        Object.assign(this, config);
    }

    get(path: string): any {
        return get(this, path);
    }

    set(path: string, value: any) {
        return set(this, path, value);
    }
}
