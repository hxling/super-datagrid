/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-17 13:38:38
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-17 13:40:46
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { OnInit, OnDestroy, Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[doubleClick]'
})
export class DoubleClickDirective implements OnInit, OnDestroy {
    @Input() debounceTime = 200;
    @Output() debounceClick = new EventEmitter();
    private clicks = new Subject();
    private subscription: Subscription;

    constructor() { }

    ngOnInit() {
        this.subscription = this.clicks.pipe(
            debounceTime(this.debounceTime)
        ).subscribe(e => this.debounceClick.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}
