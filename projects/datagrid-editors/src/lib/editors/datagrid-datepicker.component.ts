import { Component, OnInit, Renderer2, ElementRef, NgZone, Input, ViewChild } from '@angular/core';
import { DatagridBaseEditorDirective } from './../datagrid-base-editor.directive';
import { ShowType, FarrisDatepickerComponent } from '@farris/ui-datepicker';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:40:36
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 17:41:24
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

@Component({
    selector: 'grid-editor-datepicker',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup">
        <farris-datepicker
            #datepicker
            [formControlName]="column.field"
            [readonly]="readonly"
            [editable]="editable"
            [locale]="locale"
            [dateRange]="dateRange"
            [showTime]="showTime"
            [showType]="showType"
            [dateFormat]="dateFormat"
            [placeholder]="placeholder"
            [maxDate]="maxDate"
            [minDate]="minDate"
            [dateRangeDatesDelimiter]="dateRangeDatesDelimiter"
            [shortcuts]="[]"
        ></farris-datepicker>
    </div>


    `,
})
export class DatagridDatepickerComponent extends DatagridBaseEditorDirective implements OnInit {

    @Input() disabled = false;
    @Input() readonly = false;
    @Input() editable = true;
    @Input() locale = 'zh-cn';
    @Input() dateRange = false;
    @Input() dateRangeDatesDelimiter = '~';
    @Input() showTime = false;
    @Input() showType = ShowType.all;
    @Input() dateFormat: string;
    @Input() placeholder = '';
    @Input() maxDate = {
        year: 2030,
        month: 12,
        day: 31
    };
    @Input() minDate = {
        year: 1840,
        month: 1,
        day: 1
    };

    @ViewChild('datepicker') datepicker: FarrisDatepickerComponent;

    constructor(render: Renderer2, el: ElementRef, private ngzone: NgZone) {
        super(render, el);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputElement = this.datepicker.dateInput.nativeElement;
    }
}
