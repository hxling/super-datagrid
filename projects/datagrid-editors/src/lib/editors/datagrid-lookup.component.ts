/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-15 20:14:23
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';
import { LookupDefaultOptions } from '../editor-default-options';
import { LookupGridComponent } from '@farris/ui-lookup';
@Component({
    selector: 'grid-editor-lookup',
    template: `
    <div [formGroup]="group">
        <farris-lookup-grid #lookup
            [formControlName]="column.field"
            [uri]="options.uri"
            [singleSelect]="options.singleSelect"
            [idField]="options.idField"
            [pageSize]="options.pageSize || 20"
            [pageIndex]="options.pageSize || 1"
            [pagination]="options.pageination"
            [textField]="options.textField"
            [title]="options.title"
            [dialogWidth]="options.dialogWidth"
            [dialogHeight]="options.dialogHeight"
            [showMaxButton]="options.showMaxButton"
            [showCloseButton]="options.showCloseButton"
            [resizable]="options.resizable"
            [buttonAlign]="options.buttonAlign"
            [searchOnServer]="options.searchOnServer"
            [nosearch]="options.nosearch"
            [mappingFn]="options.mappingFn"
            [mapFields]="options.mapFields"
            [dictPicking]="options.dictPicking"
            [dictPicked]="options.dictPicked"
            (dialogClosed)="onDialogClosed()"
            (dialogOpened)="onDialogOpen()"
        ></farris-lookup-grid>
    </div>
    `,
})
export class DatagridLookupComponent extends DatagridBaseEditorDirective implements OnInit {

    @ViewChild('lookup') lookup: LookupGridComponent;

    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputElement = this.lookup.inputGroup.inputGroup.nativeElement;
        this.options = Object.assign(LookupDefaultOptions, this.options);
    }

    onDialogClosed() {
        this.lookup.changeDetector.detectChanges();
    }

    onDialogOpen() {
        this.lookup.changeDetector.detectChanges();
    }
}
