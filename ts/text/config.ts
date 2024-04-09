import * as OBJECT from '../object';

export var options = {
    colorStart: '#{', // alt-z
    colorEnd: '}', // alt-j
    field: '{{', // alt-6
    fieldEnd: '}}',
    defaultFg: null,
    defaultBg: null,
};

export type Align = 'left' | 'center' | 'right';
export type VAlign = 'top' | 'middle' | 'bottom';

// const RE_RGB = /^[a-fA-F0-9]*$/;
//
// export function parseColor(color:string) {
//   if (color.startsWith('#')) {
//     color = color.substring(1);
//   }
//   else if (color.startsWith('0x')) {
//     color = color.substring(2);
//   }
//   if (color.length == 3) {
//     if (RE_RGB.test(color)) {
//       return Number.parseInt(color, 16);
//     }
//   }
//   if (color.length == 6) {
//     if (RE_RGB.test(color)) {
//       const v = Number.parseInt(color, 16);
//       const r = Math.round( ((v & 0xFF0000) >> 16) / 17);
//       const g = Math.round( ((v & 0xFF00) >> 8) / 17);
//       const b = Math.round((v & 0xFF) / 17);
//       return (r << 8) + (g << 4) + b;
//     }
//   }
//   return 0xFFF;
// }

export type View = Record<string, any>;

export interface HelperObj {
    get: (view: View, pattern: string) => any;
}
export type HelperFn = (
    this: HelperObj,
    name: string,
    data: View,
    args: string[]
) => string;

export var helpers: Record<string, HelperFn> = {
    default: (name: string, view: View, args: string[]) => {
        if (args.length === 0) return name;
        if (args.length === 1) {
            return '' + OBJECT.getPath(view, args[0]);
        }
        return args.map((a) => OBJECT.getPath(view, a)).join(' ');
    },
    debug: (name: string, _view: View, args: string[]) => {
        if (args.length) {
            return `{{${name} ${args.join(' ')}}}`;
        }
        return `{{${name}}}`;
    },
};

export function addHelper(name: string, fn: HelperFn) {
    helpers[name] = fn;
}
