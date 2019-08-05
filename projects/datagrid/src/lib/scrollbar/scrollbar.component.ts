import { Subject, merge, fromEvent } from 'rxjs';
import { mapTo, takeUntil, distinctUntilChanged } from 'rxjs/operators';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
    NgZone, Inject, Component,
    OnInit, OnDestroy, DoCheck, Input, Output, EventEmitter, HostBinding,
    ViewChild, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';

import { ScrollbarDirective } from './scrollbar.directive';

import {
    ScrollbarEvent, ScrollbarEvents,
    ScrollbarConfigInterface
} from './scrollbar.interfaces';

// styleUrls: [
//     './scrollbar.component.css'
// ],

@Component({
    selector: 'scrollbar',
    exportAs: 'ngxScrollbar',
    templateUrl: './scrollbar.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ScrollbarComponent implements OnInit, OnDestroy, DoCheck {
    public states: any = {};

    public indicatorX = false;
    public indicatorY = false;

    public interaction = false;

    private scrollPositionX = 0;
    private scrollPositionY = 0;

    private scrollDirectionX = 0;
    private scrollDirectionY = 0;

    private usePropagationX = false;
    private usePropagationY = false;

    private allowPropagationX = false;
    private allowPropagationY = false;

    private stateTimeout: number | null = null;

    private readonly ngDestroy: Subject<void> = new Subject();

    private readonly stateUpdate: Subject<string> = new Subject();

    @Input() disabled = false;

    @Input() usePSClass = true;

    @HostBinding('class.ps-show-limits')
    @Input() autoPropagation = false;

    @HostBinding('class.ps-show-active')
    @Input() scrollIndicators = false;

    @Input() config?: ScrollbarConfigInterface;

    @Output() psScrollY: EventEmitter<any> = new EventEmitter<any>();
    @Output() psScrollX: EventEmitter<any> = new EventEmitter<any>();

    @Output() psScrollUp: EventEmitter<any> = new EventEmitter<any>();
    @Output() psScrollDown: EventEmitter<any> = new EventEmitter<any>();
    @Output() psScrollLeft: EventEmitter<any> = new EventEmitter<any>();
    @Output() psScrollRight: EventEmitter<any> = new EventEmitter<any>();

    @Output() psYReachEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output() psYReachStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() psXReachEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output() psXReachStart: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

    constructor(private zone: NgZone, private cdRef: ChangeDetectorRef,
                @Inject(PLATFORM_ID) private platformId: any) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.stateUpdate
                .pipe(
                    takeUntil(this.ngDestroy),
                    distinctUntilChanged((a, b) => (a === b && !this.stateTimeout))
                )
                .subscribe((state: string) => {
                    if (this.stateTimeout && typeof window !== 'undefined') {
                        window.clearTimeout(this.stateTimeout);

                        this.stateTimeout = null;
                    }

                    if (state === 'x' || state === 'y') {
                        this.interaction = false;

                        if (state === 'x') {
                            this.indicatorX = false;

                            this.states.left = false;
                            this.states.right = false;

                            if (this.autoPropagation && this.usePropagationX) {
                                this.allowPropagationX = false;
                            }
                        } else if (state === 'y') {
                            this.indicatorY = false;

                            this.states.top = false;
                            this.states.bottom = false;

                            if (this.autoPropagation && this.usePropagationY) {
                                this.allowPropagationY = false;
                            }
                        }
                    } else {
                        if (state === 'left' || state === 'right') {
                            this.states.left = false;
                            this.states.right = false;

                            this.states[state] = true;

                            if (this.autoPropagation && this.usePropagationX) {
                                this.indicatorX = true;
                            }
                        } else if (state === 'top' || state === 'bottom') {
                            this.states.top = false;
                            this.states.bottom = false;

                            this.states[state] = true;

                            if (this.autoPropagation && this.usePropagationY) {
                                this.indicatorY = true;
                            }
                        }

                        if (this.autoPropagation && typeof window !== 'undefined') {
                            this.stateTimeout = window.setTimeout(() => {
                                this.indicatorX = false;
                                this.indicatorY = false;

                                this.stateTimeout = null;

                                if (this.interaction && (this.states.left || this.states.right)) {
                                    this.allowPropagationX = true;
                                }

                                if (this.interaction && (this.states.top || this.states.bottom)) {
                                    this.allowPropagationY = true;
                                }

                                this.cdRef.markForCheck();
                            }, 500);
                        }
                    }

                    this.cdRef.markForCheck();
                    this.cdRef.detectChanges();
                });

            this.zone.runOutsideAngular(() => {
                if (this.directiveRef) {
                    const element = this.directiveRef.elementRef.nativeElement;

                    fromEvent<WheelEvent>(element, 'wheel')
                        .pipe(
                            takeUntil(this.ngDestroy)
                        )
                        .subscribe((event: WheelEvent) => {
                            if (!this.disabled && this.autoPropagation) {
                                const scrollDeltaX = event.deltaX;
                                const scrollDeltaY = event.deltaY;

                                this.checkPropagation(event, scrollDeltaX, scrollDeltaY);
                            }
                        });

                    fromEvent<TouchEvent>(element, 'touchmove')
                        .pipe(
                            takeUntil(this.ngDestroy)
                        )
                        .subscribe((event: TouchEvent) => {
                            if (!this.disabled && this.autoPropagation) {
                                const scrollPositionX = event.touches[0].clientX;
                                const scrollPositionY = event.touches[0].clientY;

                                const scrollDeltaX = scrollPositionX - this.scrollPositionX;
                                const scrollDeltaY = scrollPositionY - this.scrollPositionY;

                                this.checkPropagation(event, scrollDeltaX, scrollDeltaY);

                                this.scrollPositionX = scrollPositionX;
                                this.scrollPositionY = scrollPositionY;
                            }
                        });

                    merge(
                        fromEvent(element, 'ps-scroll-x')
                            .pipe(mapTo('x')),
                        fromEvent(element, 'ps-scroll-y')
                            .pipe(mapTo('y')),
                        fromEvent(element, 'ps-x-reach-end')
                            .pipe(mapTo('right')),
                        fromEvent(element, 'ps-y-reach-end')
                            .pipe(mapTo('bottom')),
                        fromEvent(element, 'ps-x-reach-start')
                            .pipe(mapTo('left')),
                        fromEvent(element, 'ps-y-reach-start')
                            .pipe(mapTo('top')),
                    )
                        .pipe(
                            takeUntil(this.ngDestroy)
                        )
                        .subscribe((state: string) => {
                            if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
                                this.stateUpdate.next(state);
                            }
                        });
                }
            });

            window.setTimeout(() => {
                ScrollbarEvents.forEach((eventName: ScrollbarEvent) => {
                    if (this.directiveRef) {
                        this.directiveRef[eventName] = this[eventName];
                    }
                });
            }, 0);
        }
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.ngDestroy.next();
            this.ngDestroy.unsubscribe();

            if (this.stateTimeout && typeof window !== 'undefined') {
                window.clearTimeout(this.stateTimeout);
            }
        }
    }

    ngDoCheck(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.disabled && this.autoPropagation && this.directiveRef) {
                const element = this.directiveRef.elementRef.nativeElement;

                this.usePropagationX = element.classList.contains('ps--active-x');

                this.usePropagationY = element.classList.contains('ps--active-y');
            }
        }
    }

    private checkPropagation(event: any, deltaX: number, deltaY: number): void {
        this.interaction = true;

        const scrollDirectionX = (deltaX < 0) ? -1 : 1;
        const scrollDirectionY = (deltaY < 0) ? -1 : 1;

        if ((this.usePropagationX && this.usePropagationY) ||
            (this.usePropagationX && (!this.allowPropagationX ||
                (this.scrollDirectionX !== scrollDirectionX))) ||
            (this.usePropagationY && (!this.allowPropagationY ||
                (this.scrollDirectionY !== scrollDirectionY)))) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!!deltaX) {
            this.scrollDirectionX = scrollDirectionX;
        }

        if (!!deltaY) {
            this.scrollDirectionY = scrollDirectionY;
        }

        this.stateUpdate.next('interaction');

        this.cdRef.detectChanges();
    }
}
