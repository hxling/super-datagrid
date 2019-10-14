/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:44:30
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-14 13:15:49
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2, NgZone, OnDestroy, Injector } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-textarea',
    template: `
    <div [formGroup]="group" class="f-datagrid-cell-formgroup farris-group-auto">
        <datagrid-tooltip [control]="formControl" [tooltipPosition]="'top-left'" [message]="errorMessage">
            <textarea #input class="form-control" style="height: 100%" [formControlName]="column.field"></textarea>
        </datagrid-tooltip>
    </div>
    `
})
export class DatagridTextareaComponent extends DatagridBaseEditorDirective implements OnInit, OnDestroy {
    @ViewChild('input') instance: ElementRef;

    private inputClickHandler: any;
    constructor(
            render: Renderer2, el: ElementRef, private ngzone: NgZone, public injector: Injector
           ) {
        super(render, el, injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.inputElement = this.instance.nativeElement;
        this.ngzone.runOutsideAngular( () => {
            this.inputClickHandler = this.render.listen(this.instance.nativeElement, 'click', (e: MouseEvent) => {
                e.stopPropagation();
                return false;
            });
        });
    }

    ngOnDestroy() {
        if (this.instance) {
            this.inputClickHandler();
        }
    }

}
