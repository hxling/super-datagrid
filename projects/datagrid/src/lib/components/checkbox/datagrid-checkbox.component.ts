import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'datagrid-checkbox',
    template: ` <div class="custom-control custom-checkbox  custom-control-inline tt-checkbox">
        <input type="checkbox" #chk class="custom-control-input" [disabled]="disabled" [checked]="checked">
        <label class="custom-control-label" (click)="handleClick($event)"></label>
    </div>`,
    styles: [
        `
        :host {
            vertical-align: middle;
        }
        :host .custom-checkbox {
            opacity: 1;
            float: none;
        }
        `
    ]
})
export class DatagridCheckboxComponent implements OnInit {

    @Input() checked: boolean;
    @Input() disabled: boolean;

    constructor() { }

    ngOnInit(): void { }

    handleClick(evevnt: any) {}
}
