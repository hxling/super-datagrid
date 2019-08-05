import { DatagridComponent } from './../../datagrid.component';
import { Component, OnInit, Input, DoCheck, ViewChild, ElementRef } from '@angular/core';
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
    constructor(private dfs: DatagridFacadeService, private dg: DatagridComponent) { }

    ngOnInit(): void {
        if (this.indeterminate) {
            this.chk.nativeElement.indeterminate = true;
        }
    }

    handleClick(event: MouseEvent) {
        if (!this.disabled) {
            this.checked = !this.checked;

            if (this.checked) {
                this.dfs.checkRow(this.rowIndex, this.rowData);
            } else {
                this.dfs.unCheckRow(this.rowIndex, this.rowData);
            }
        }
        event.stopPropagation();
    }

}
