import { DatagridComponent } from './../../datagrid.component';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-09-18 10:30:21
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, ViewChild, ElementRef, Injector } from '@angular/core';
import { DatagridFacadeService } from './../../services/datagrid-facade.service';

@Component({
    selector: 'datagrid-header-checkbox',
    template: ` <div class="custom-control custom-checkbox f-checkradio-single">
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
            top: 2px;
        }
        `
    ]
})
export class DatagridHeaderCheckboxComponent implements OnInit {
    @Input() checked: boolean;
    @Input() disabled: boolean;

    @Input() indeterminate = false;

    @ViewChild('chk') chk: ElementRef;
    private dfs: DatagridFacadeService;
    private dg: DatagridComponent;
    constructor(private injector: Injector) {
        this.dfs = this.injector.get(DatagridFacadeService);
        this.dg = this.injector.get(DatagridComponent);
    }

    ngOnInit(): void {
        if (this.indeterminate) {
            this.chk.nativeElement.indeterminate = true;
        }
    }

    handleClick(event: MouseEvent) {
        if (!this.disabled) {
            this.checked = !this.checked;

            this.indeterminate = false;
            this.chk.nativeElement.indeterminate = false;
            if (this.checked) {
                this.dfs.checkAll();
                this.dg.checkAll.emit();
            } else {
                this.dfs.clearCheckeds();
                this.dg.unCheckAll.emit();
            }

        }
        event.stopPropagation();
    }

}
