
import { QueryList, Renderer2, Self, NgZone, SimpleChanges, OnChanges } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 07:47:12
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-03 10:32:28
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
import { DatagridRowHoverDirective } from './datagrid-row-hover.directive';
import { Utils } from '../../utils/utils';

@Directive({
    selector: '[grid-row]',
    exportAs: 'gridRow'
})
export class DatagridRowDirective implements OnInit, AfterViewInit, DatagridRow, OnChanges {
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
    private ngZone: NgZone;

    constructor(
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent,
        private injector: Injector, private fb: FormBuilder, public el: ElementRef,
        private render: Renderer2, @Self() public drHover: DatagridRowHoverDirective) {
        this.dfs = this.injector.get(DatagridFacadeService);
        this.ngZone = this.injector.get(NgZone);
    }

    ngOnInit() {
        this.form = this.createControl();
        this.form['bindingData'] = this.rowData;
        // if (this.editable) {
        // }
        this.renderCustomStyle();

        if (this.ngZone) {
            this.ngZone.runOutsideAngular( () => {
                this.render.listen(this.el.nativeElement, 'click', this.onRowClick.bind(this));
                this.render.listen(this.el.nativeElement, 'mouseenter', this.onMouseEnter.bind(this));
                this.render.listen(this.el.nativeElement, 'mouseleave', this.onMouseLeave.bind(this));
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // if (changes.editable !== undefined && !changes.editable.isFirstChange()) {
        //     if (this.editable) {
        //         this.form = this.createControl();
        //     }
        // }
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

    onRowClick(event: MouseEvent) {

        if (this.dg.disabled) {
            return;
        }

        const rowId = this.dfs.primaryId(this.rowData);

        if (!this.dfs.isRowSelected(rowId)) {
            const canendedit = this.dg.endRowEdit();

            if (!canendedit || canendedit.canEnd) {
                this.dg.beforeSelect(this.rowIndex, this.rowData).subscribe( (canSelect: boolean) => {
                    if (canSelect) {
                        this.dfs.selectRow(this.rowIndex, this.rowData);
                        this.dg.selectedRow.dr = this;
                        this.drHover.setRowHoverCls(false);
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

    onMouseEnter($event: MouseEvent) {
        if (this.dg.editMode === 'row') {
            this.bindRowDblClickEvent();
        }
    }

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
                Utils.getValue(col.field, this.rowData),
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
                    case 'pattern':
                        validation = Validators.pattern(v.value);
                        break;
                }
                if (validation) {
                    validations.push(validation);
                } else {
                    if (this.dg.validators && this.dg.validators.length) {
                        const vfn = this.dg.validators.find(vr => vr.name === v.type);
                        if (vfn) {
                            validation = vfn.value(this.rowData);
                            validations.push(validation);
                        }
                    }
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
