import { Component, OnInit, Renderer2, ElementRef, NgZone, Input, ViewChild, Injector } from '@angular/core';
import { DatagridBaseEditorDirective } from './../datagrid-base-editor.directive';
import { FarrisDatepickerComponent } from '@farris/ui-datepicker';
import { DatePickerDefaultOptions } from '../editor-default-options';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:40:36
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-14 12:58:14
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

@Component({
    selector: 'grid-editor-datepicker',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <farris-datepicker
            #datepicker
            style="width: 100%"
            [formControlName]="column.field"
            [readonly]="options.readonly"
            [editable]="options.editable"
            [locale]="options.locale"
            [dateRange]="options.dateRange"
            [showTime]="options.showTime"
            [showType]="options.showType"
            [dateFormat]="options.dateFormat"
            [placeholder]="options.placeholder"
            [maxDate]="options.maxDate"
            [minDate]="options.minDate"
            [dateRangeDatesDelimiter]="options.dateRangeDatesDelimiter"
            [shortcuts]="[]"
        ></farris-datepicker>
    </div>


    `,
})
export class DatagridDatepickerComponent extends DatagridBaseEditorDirective implements OnInit {

    @ViewChild('datepicker') instance: FarrisDatepickerComponent;

    constructor(
        render: Renderer2, el: ElementRef, private ngzone: NgZone, public injector: Injector
       ) {
    super(render, el, injector);
}

    ngOnInit(): void {
        super.ngOnInit();
        this.options = Object.assign( {} , DatePickerDefaultOptions, this.options);
        this.inputElement = this.instance.dateInput.nativeElement;
    }
}
