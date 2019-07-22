import { Directive, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[cell-editable]',
    exportAs: 'cellEditable'
})
export class CellEditableDirective {
    @Input('cell-editable') rowData: any;

    @HostListener('keydown:arrowup', ['$event'])
    onArrowUpKeyDown(event: KeyboardEvent) {
        console.log('cell-editable-↑', event);
    }

    @HostListener('keydown:arrowdown', ['$event'])
    onArrowDownKeyDown(event: KeyboardEvent) {
        console.log('cell-editable-↓', event);
    }

    @HostListener('keydown:arrowleft', ['$event'])
    onArrowLeftKeyDown(event: KeyboardEvent) {
        console.log('cell-editable- ←', event);
    }

    @HostListener('keydown:arrowright', ['$event'])
    onArrowRightKeyDown(event: KeyboardEvent) {
        console.log('cell-editable- →', event);
    }

    @HostListener('keydown:enter', ['$event'])
    onEnterKeyDown(event: KeyboardEvent) {
        console.log('cell-editable-Enter', event);
    }

    @HostListener('keydown:esc', ['$event'])
    onEscKeyDown(event: KeyboardEvent) {
        console.log('cell-editable-ESC', event);
    }
}
