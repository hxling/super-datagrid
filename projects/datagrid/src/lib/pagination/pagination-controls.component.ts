import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import {DEFAULT_TEMPLATE, DEFAULT_STYLES} from './template';

function coerceToBoolean(input: string | boolean): boolean {
    return !!input && input !== 'false';
}

/**
 * The default pagination controls component. Actually just a default implementation of a custom template.
 */
@Component({
    selector: 'pagination-controls',
    template: DEFAULT_TEMPLATE,
    styles: [DEFAULT_STYLES],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PaginationControlsComponent {

    private _directionLinks = true;
    private _autoHide = false;
    private _responsive = false;

    @Input() id: string;
    @Input() maxSize = 7;
    @Input()
    get directionLinks(): boolean {
        return this._directionLinks;
    }
    set directionLinks(value: boolean) {
        this._directionLinks = coerceToBoolean(value);
    }
    @Input()
    get autoHide(): boolean {
        return this._autoHide;
    }
    set autoHide(value: boolean) {
        this._autoHide = coerceToBoolean(value);
    }
    @Input()
    get responsive(): boolean {
        return this._responsive;
    }
    set responsive(value: boolean) {
        this._responsive = coerceToBoolean(value);
    }
    @Input() previousLabel = 'Previous';
    @Input() nextLabel = 'Next';
    @Input() screenReaderPaginationLabel = 'Pagination';
    @Input() screenReaderPageLabel = 'page';
    @Input() screenReaderCurrentLabel = `You're on page`;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

}
