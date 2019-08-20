import { QueryList } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 07:47:12
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-20 19:21:51
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Directive, Input, Output, EventEmitter, HostListener,
    OnInit, ElementRef, AfterViewInit, Injector, Inject, forwardRef, ContentChildren } from '@angular/core';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridCellComponent } from './datagrid-cell.component';

@Directive({
    selector: '[grid-row]',
    exportAs: 'gridRow'
})
export class DatagridRowDirective implements OnInit, AfterViewInit {
    @Input() editable = false;
    @Input('grid-row') rowData: any;
    @Input() rowIndex: number;
    @Output() clickHandler = new EventEmitter();

    @ContentChildren(forwardRef(() => DatagridCellComponent),  { descendants: true }) cells: QueryList<DatagridCellComponent>;

    form = new FormGroup({});
    private dfs: DatagridFacadeService;
    constructor(
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent,
        private injector: Injector, private fb: FormBuilder, public el: ElementRef) {
        this.dfs = this.injector.get(DatagridFacadeService);
    }

    ngOnInit() {
        if (this.editable) {
            this.form = this.createControl();
        }
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
            this.dg.endRowEdit();
            this.dg.beforeSelect(this.rowIndex, this.rowData).subscribe( (canSelect: boolean) => {
                if (canSelect) {
                    this.dfs.selectRow(this.rowIndex, this.rowData);
                    this.dg.selectedRow.dr = this;
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
                    validators: this.bindValidations(col)
                }
            );
            // control.setValue(, { emitModelToViewChange: true });
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
