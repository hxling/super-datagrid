/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 07:47:12
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-13 19:21:24
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Directive, Input, Output, EventEmitter, HostListener,
    OnInit, ElementRef, AfterViewInit, Injector, Inject, forwardRef } from '@angular/core';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';

@Directive({
    selector: '[grid-row]',
    exportAs: 'gridRow'
})
export class DatagridRowDirective implements OnInit, AfterViewInit {
    @Input('grid-row') rowData: any;
    @Input() rowIndex: number;
    @Output() clickHandler = new EventEmitter();

    form = new FormGroup({});
    private dfs: DatagridFacadeService;
    constructor(
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent,
        private injector: Injector, private fb: FormBuilder, private el: ElementRef) {
        this.dfs = this.injector.get(DatagridFacadeService);
    }

    ngOnInit() {
        this.form = this.createControl();
        this.renderCustomStyle();
    }

    ngAfterViewInit() {
    }

    renderCustomStyle() {
        if (this.dg.rowStyler) {
            const trStyle = this.dg.rowStyler(this.rowData, this.rowIndex);
            if (trStyle && Object.keys(trStyle).length) {
                this.dg.renderCustomStyle(trStyle, this.el.nativeElement);
            }
        }
    }

    @HostListener('click', ['$event'])
    onRowClick(event: MouseEvent) {
        const rowId = this.dfs.primaryId(this.rowData);
        if (!this.dfs.isRowSelected(rowId)) {

            this.dg.beforeSelect(this.rowIndex, this.rowData).subscribe( (canSelect: boolean) => {
                if (canSelect) {
                    // if (!this.dg.multiSelect || (this.dg.multiSelect && this.dg.onlySelectSelf)) {
                    //     if (this.dg.selectedRow) {
                    //         const rowid = this.dg.selectedRow.id;
                    //         this.dfs.selectRecord(rowid, false);
                    //     }
                    // }
                    this.dfs.selectRow(this.rowIndex, this.rowData);
                    this.clickHandler.emit();
                }
            });
        } else {
            if (!this.dg.keepSelect) {
                this.dg.beforeUnselect(this.rowIndex, this.rowData).subscribe((canUnselect: boolean) => {
                    if (canUnselect) {
                        this.dfs.unSelectRow(this.rowIndex, this.rowData);
                    }
                });
            }
        }
    }

    createControl() {
        const group = this.fb.group({});
        this.dg.flatColumns.forEach(col => {
            if (!col.editor) {return; }
            const control = this.fb.control(
                this.rowData[col.field],
                {
                    validators: this.bindValidations(col),
                    updateOn: 'change'
                }
            );
            group.addControl(col.field, control);
        });
        return group;
    }

    private bindValidations(col) {
        return [
            Validators.required,
            Validators.maxLength(10),
            Validators.minLength(3)
        ];
    }
}
