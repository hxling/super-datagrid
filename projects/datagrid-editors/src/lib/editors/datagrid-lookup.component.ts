import { AfterViewInit, ApplicationRef, Inject, forwardRef, Injector } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-22 19:07:00
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';
import { LookupDefaultOptions } from '../editor-default-options';
import { LookupGridComponent } from '@farris/ui-lookup';
import { RuntimeStateService } from '@farris/ui-common';
import { DatagridComponent } from 'projects/datagrid/src/public-api';
@Component({
    selector: 'grid-editor-lookup',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <farris-lookup-grid #lookup style="width: 100%"
            [formControlName]="column.field"
            [uri]="options.uri"
            [displayType]="'List'"
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
            (clear)="onClear($event)"
            (loadSuccess)="onLoadSuccess()"
        ></farris-lookup-grid>
    </div>
    `,
})
export class DatagridLookupComponent extends DatagridBaseEditorDirective implements OnInit, AfterViewInit {

    @ViewChild('lookup') lookup: LookupGridComponent;

    constructor(render: Renderer2, el: ElementRef, private rts: RuntimeStateService,
                injector: Injector) {
        super(render, el, injector);
        this.rts.state$.subscribe(state => {
            if (state && state.form && state.form.lookup) {
                this.pending = state.form.lookup.pending;
                this.dg.pending = this.pending;
            }
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputElement = this.lookup.inputGroup.textbox.nativeElement;
        this.options = Object.assign(LookupDefaultOptions, this.options);

        if (this.options.loader) {
            this.lookup['http'] =  this.lookup['http'] || { getData: this.options.loader };
        }
    }

    ngAfterViewInit() {
        this.lookup.changeDetector.detectChanges();
        super.ngAfterViewInit();
    }

    onDialogClosed() {
        // this.lookup.changeDetector.detectChanges();
    }

    onDialogOpen() {
        this.lookup.changeDetector.detectChanges();
    }

    onLoadSuccess() {
        this.lookup.changeDetector.detectChanges();
    }

    onClear(event: MouseEvent) {
        this.lookup.changeDetector.detectChanges();
    }
}