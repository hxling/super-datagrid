/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-30 18:10:57
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { DatagridComponent } from './../../datagrid.component';
import { Component, OnInit, Input, ViewChild, ElementRef, Injector, Inject, forwardRef } from '@angular/core';
import { DatagridFacadeService } from './../../services/datagrid-facade.service';

@Component({
    selector: 'datagrid-checkbox',
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
export class DatagridCheckboxComponent implements OnInit {
    @Input() rowData: any;
    @Input() rowIndex: any;
    @Input() checked: boolean;
    @Input() disabled: boolean;

    @Input() indeterminate = false;
    @ViewChild('chk') chk: ElementRef;

    private dfs: DatagridFacadeService;
    constructor(private injector: Injector, @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent) {
        this.dfs = this.injector.get(DatagridFacadeService);
    }

    ngOnInit(): void {
        if (this.indeterminate) {
            this.chk.nativeElement.indeterminate = true;
        }
    }

    handleClick(event: MouseEvent) {
        if (!this.disabled) {
            if (!this.checked) {
                this.dg.beforeCheck(this.rowIndex, this.rowData).subscribe((canCheck: boolean) => {
                    if (canCheck) {
                        this.dfs.checkRow(this.rowIndex, this.rowData);
                    }
                });
            } else {
                this.dg.beforeUncheck(this.rowIndex, this.rowData).subscribe((canUncheck: boolean) => {
                    if (canUncheck) {
                        this.dfs.unCheckRow(this.rowIndex, this.rowData);
                    }
                });
            }
        }
        event.stopPropagation();
    }

}
