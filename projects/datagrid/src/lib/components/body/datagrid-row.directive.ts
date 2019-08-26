
import { QueryList, Renderer2 } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 07:47:12
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-26 14:11:46
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Directive, Input, Output, EventEmitter, HostListener,
    OnInit, ElementRef, AfterViewInit, Injector, Inject, forwardRef, ContentChildren } from '@angular/core';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridCellComponent } from './datagrid-cell.component';
import { DatagridRow } from '../../types/datagrid-row';
import { DatagridValidator } from '../../types/datagrid-validator';

@Directive({
    selector: '[grid-row]',
    exportAs: 'gridRow'
})
export class DatagridRowDirective implements OnInit, AfterViewInit, DatagridRow {
    @Input() editable = false;
    @Input('grid-row') rowData: any;
    @Input() rowIndex: number;
    @Output() clickHandler = new EventEmitter();

    @ContentChildren(forwardRef(() => DatagridCellComponent),  { descendants: true }) cells: QueryList<DatagridCellComponent>;

    get rowId() {
        if (this.rowData) {
            return this.dfs.primaryId(this.rowData);
        }
        return null;
    }
    form = new FormGroup({});
    private dfs: DatagridFacadeService;
    private documentRowDblclickEvent: any = null;

    constructor(
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent,
        private injector: Injector, private fb: FormBuilder, public el: ElementRef,
        private render: Renderer2) {
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
            const canendedit = this.dg.endRowEdit();

            if (!canendedit || canendedit.canEnd) {
                this.dg.beforeSelect(this.rowIndex, this.rowData).subscribe( (canSelect: boolean) => {
                    if (canSelect) {
                        this.dfs.selectRow(this.rowIndex, this.rowData);
                        this.dg.selectedRow.dr = this;
                        this.clickHandler.emit();
                    }
                });
            }
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

    @HostListener('mouseenter', ['$event'])
    onMouseEnter($event: MouseEvent) {
        if (this.dg.editMode === 'row') {
            this.bindRowDblClickEvent();
        }
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave($event: MouseEvent) {
        if (this.dg.editMode === 'row') {
            this.unbindRowDblclickEvent();
        }
    }

    createControl() {
        const group = this.fb.group({});
        this.dg.flatColumns.forEach(col => {
            if (!col.editor) {return; }
            const control = this.fb.control(
                this.rowData[col.field],
                {
                    validators: this.bindValidations(col.editor.validators)
                }
            );
            group.addControl(col.field, control);
        });
        return group;
    }

    private bindValidations(validators: DatagridValidator[]) {
        const validations = [];
        if (validators && validators.length) {

            validators.forEach((v: DatagridValidator) => {
                let validation = null;
                switch (v.type) {
                    case 'required':
                        validation = Validators.required;
                        break;
                    case 'min':
                        validation = Validators.min(v.value);
                        break;
                    case 'max':
                        validation = Validators.max(v.value);
                        break;
                    case 'minLength':
                        validation = Validators.minLength(v.value);
                        break;
                    case 'maxLength':
                        validation = Validators.maxLength(v.value);
                        break;
                    case 'email':
                        validation = Validators.email;
                        break;
                    case 'requiredTrue':
                        validation = Validators.requiredTrue;
                        break;
                }
                if (validation) {
                    validations.push(validation);
                }
            });
        }
        return validations;
    }

    private bindRowDblClickEvent() {
        if (!this.documentRowDblclickEvent) {
            this.unbindRowDblclickEvent();
            this.documentRowDblclickEvent = this.render.listen(document, 'dblclick', this.dblclickRowEvent.bind(this));
        }
    }

    private unbindRowDblclickEvent() {
        if (this.documentRowDblclickEvent) {
            this.documentRowDblclickEvent();
            this.documentRowDblclickEvent = null;
        }
    }

    private dblclickRowEvent(evnet: MouseEvent) {
        const rowid = this.dg.selectedRow.id;
        this.dg.editRow(rowid);
        event.stopPropagation();
        event.preventDefault();
    }
}
