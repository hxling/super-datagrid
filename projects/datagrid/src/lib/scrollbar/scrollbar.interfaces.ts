import { InjectionToken } from '@angular/core';

export const SCROLLBAR_CONFIG = new InjectionToken(
    'PERFECT_SCROLLBAR_CONFIG'
);

export class Geometry {
    public x: number;
    public y: number;

    public w: number;
    public h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

export class Position {
    public x: number | 'start' | 'end';
    public y: number | 'start' | 'end';

    constructor(x: number | 'start' | 'end', y: number | 'start' | 'end') {
        this.x = x;
        this.y = y;
    }
}

export type ScrollbarEvent =
    | 'psScrollY'
    | 'psScrollX'
    | 'psScrollUp'
    | 'psScrollDown'
    | 'psScrollLeft'
    | 'psScrollRight'
    | 'psYReachEnd'
    | 'psYReachStart'
    | 'psXReachEnd'
    | 'psXReachStart';

export const ScrollbarEvents: ScrollbarEvent[] = [
    'psScrollY',
    'psScrollX',

    'psScrollUp',
    'psScrollDown',
    'psScrollLeft',
    'psScrollRight',

    'psYReachEnd',
    'psYReachStart',
    'psXReachEnd',
    'psXReachStart'
];

export interface ScrollbarConfigInterface {
    handlers?: string[];

    wheelSpeed?: number;
    swipeEasing?: boolean;

    suppressScrollX?: boolean;
    suppressScrollY?: boolean;

    wheelPropagation?: boolean;
    useBothWheelAxes?: boolean;

    scrollingThreshold?: number;

    minScrollbarLength?: number;
    maxScrollbarLength?: number;

    scrollXMarginOffset?: number;
    scrollYMarginOffset?: number;
}

export class ScrollbarConfig implements ScrollbarConfigInterface {
    public handlers?: string[];

    public wheelSpeed?: number;
    public swipeEasing?: boolean;

    public suppressScrollX?: boolean;
    public suppressScrollY?: boolean;

    public wheelPropagation?: boolean;
    public useBothWheelAxes?: boolean;

    public scrollingThreshold?: number;

    public minScrollbarLength?: number;
    public maxScrollbarLength?: number;

    public scrollXMarginOffset?: number;
    public scrollYMarginOffset?: number;

    constructor(config: ScrollbarConfigInterface = {}) {
        this.assign(config);
    }

    public assign(config: ScrollbarConfigInterface = {}) {
        for (const key in config) {
            this[key as keyof ScrollbarConfig] =
                config[key as keyof ScrollbarConfigInterface];
        }
    }
}
