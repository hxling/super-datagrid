import { FormControl } from '@angular/forms';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-09-26 15:18:58
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Directive, Input, ElementRef, Renderer2, OnInit, ContentChild, OnDestroy, Injector, forwardRef, Inject } from '@angular/core';
import { filter, switchMap } from 'rxjs/operators';
import { DatagridService } from './../../services/datagrid.service';
import { DatagridCellComponent } from './datagrid-cell.component';
import { DatagridBodyComponent } from './datagrid-body.component';
import { DatagridRowDirective } from './datagrid-row.directive';
import { DataColumn } from './../../types/data-column';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';
import { CELL_SELECTED_CLS } from '../../types/constant';
import { DomHandler } from '../../services/domhandler';
import { of, Subscription } from 'rxjs';
import { Utils } from '../../utils/utils';


@Directive({
    selector: '[cell-editable]',
    exportAs: 'cellEditable'
})
export class DatagridCellEditableDirective implements OnInit, OnDestroy {
    @Input('cell-editable') rowData: any;
    @Input() column: DataColumn;
    private clickTimer: any;


    private cellclick: any;
    private celldblclick: any;
    private bindCellEventSubscription: Subscription;

    private editorInputKeydownEvent: any;

    get editor() {
        if (this.dc.cellEditor) {
            const _editor = this.dc.cellEditor.componentRef.instance;
            this.dg.pending = _editor.pending;
            return _editor;
        }
        return null;
    }

    get formControl() {
        if (this.editor) {
            return this.editor.formControl as FormControl;
        }
        return null;
    }

    @ContentChild(DatagridCellComponent) dc: DatagridCellComponent;
    private dgb: DatagridBodyComponent;
    private dr: DatagridRowDirective;
    private dfs: DatagridFacadeService;
    private dgs: DatagridService;
    private isDifferentCell = () => {
        if (!this.dg.currentCell) {
            return true;
        } else {
            return  this.dg.currentCell.rowIndex !== this.dr.rowIndex || this.dg.currentCell.field !== this.column.field;
        }
    }

    constructor(
        private injector: Injector, public el: ElementRef, private render: Renderer2,
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent) {
        this.dgb = this.injector.get(DatagridBodyComponent);
        this.dr = this.injector.get(DatagridRowDirective);
        this.dfs = this.injector.get(DatagridFacadeService);
        this.dgs = this.injector.get(DatagridService);
    }

    ngOnInit() {
        if (this.dg.editable) {
            this.cellclick = this.render.listen(this.el.nativeElement, 'click', (e) => this.onClickCell(e));
            if (this.column.editor) {
                if (!this.dg.clickToEdit) {
                    this.celldblclick = this.render.listen(this.el.nativeElement, 'dblclick', (e) => {
                        this.onDblClickCell(e);
                    });
                }
                this.el.nativeElement.selectCell = () => this.selectCell(this.column.field);
                this.el.nativeElement.editCell = () => this.openCellEditor();
                this.el.nativeElement.closeEdit = () => this.closeEditingCell();
            } else {
                this.clickTimer = 0;
            }
        }

        this.bindCellEventSubscription = this.dgs.cellEdit$.pipe(
            filter(() => {
                const cell = this.dg.currentCell;
                return cell.rowIndex === this.dr.rowIndex && cell.field === this.column.field;
            } )
        ).subscribe( td => {
            this.bindEditorInputEvent();
        });
    }

    ngOnDestroy() {
        if (this.cellclick) {
            this.cellclick();
        }

        if (this.celldblclick) {
            this.celldblclick();
        }

        this.unBindEditorInputEvent();

        if (this.bindCellEventSubscription) {
            this.bindCellEventSubscription.unsubscribe();
            this.bindCellEventSubscription = null;
        }
    }

    private onClickCell(event: any) {
        if (this.dg.disabled || !this.dg.editable || (this.dg.editable && this.dg.editMode === 'row')) {
            return;
        }
        event.stopPropagation();
        if (event.target['nodeName'] === 'INPUT') {
            return;
        }

        if (this.dg.clickToEdit) {
            this.dg.clickDelay = 0;
        }

        this.render.addClass(this.dg.el.nativeElement, 'f-datagrid-unselect');

        if (!this.dg.isSingleClick && this.dg.editMode) {
            this.dg.isSingleClick = true;
            this.clickTimer = setTimeout(() => {
                if (this.dg.isSingleClick && this.dg.editable && this.dg.editMode === 'cell') {
                    this.dg.isSingleClick = false;
                    clearTimeout(this.clickTimer);
                    if (!this.closeEditingCell()) {
                        return;
                    }
                    if (this.dg.clickToEdit) {
                        this.openCellEditor();
                    } else {
                        this.selectCell(this.column.field);
                    }
                    this.render.removeClass(this.dg.el.nativeElement, 'f-datagrid-unselect');
                    event.preventDefault();
                }
            }, this.dg.clickDelay);
        }
    }

    private onDblClickCell(event: MouseEvent) {
        if (this.dg.disabled) {
            return;
        }

        if (event.target['nodeName'] === 'INPUT' || event.target['nodeName'] === 'TEXTAREA') {
            return;
        }
        if (this.dg.editable && this.dg.editMode === 'cell') {
            if (!this.closeEditingCell()) {
                return;
            }
            setTimeout(() => {
                this.openCellEditor();
            });
        }
        if (this.clickTimer) {
            this.dg.isSingleClick = false;
            clearTimeout(this.clickTimer);
            this.clickTimer = null;
        }
    }

    openCellEditor() {
        if (!this.column.editor || !this.dg.editable) {
            return;
        }

        const beforeEditEvent = this.dg.beforeEdit(this.dr.rowIndex, this.rowData, this.column);
        if (!beforeEditEvent || !beforeEditEvent.subscribe) {
            console.warn('please return an Observable Type.');
            return;
        }

        beforeEditEvent.pipe(
            switchMap( (flag: boolean) => {
                if (flag) {
                    if (this.isDifferentCell()) {
                        this.selectCell(this.column.field);
                    }
                    this.dfs.editCell();
                }
                return of(flag);
            })
        ).subscribe( (flag) => {
            if (flag) {
                this.bindEditorInputEvent();
                this.render.removeClass(this.dg.el.nativeElement, 'f-datagrid-unselect');
                this.dg.selectedRow.editors = [this.editor];
                this.formControl.setValue(this.dc.value);
                this.dg.beginEdit.emit({ editor: this.dc.cellEditor, column: this.column, rowData: this.rowData });
            }
        });
    }

    closeEditingCell() {
        if (!this.dg.isCellEditing()) {
            return true;
        }

        let currentCell = null;
        if (this.dg.currentCell) {
            currentCell = this.dg.currentCell.cellRef as DatagridCellComponent;
            if (currentCell && currentCell.cellEditor) {
                const editor = currentCell.cellEditor.componentRef.instance;
                editor.inputElement.blur();

                if (editor.pending) {
                    return false;
                }

                if (editor.formControl.pending) {
                    return false;
                }

                if (editor.formControl && editor.formControl.invalid && !this.dg.endEditByInvalid) {
                    return false;
                }
            }
        }

        this.dg.isSingleClick = false;

        const afterEditEvent = this.dg.afterEdit(this.dr.rowIndex, this.rowData, this.column );
        if (!afterEditEvent || !afterEditEvent.subscribe) {
            console.warn('please return an Observable Type.');
            return;
        }

        afterEditEvent.subscribe( (flag: boolean) => {
            if (flag) {
                if (currentCell) {
                    currentCell.updateValue();
                }
                this.dfs.endEditCell();
                this.dgs.onEndCellEdit(this.dfs.getCurrentCell());
                this.unBindEditorInputEvent();
                this.dg.selectedRow.editors = [];

                this.dg.endEdit.emit({rowIndex: this.dr.rowIndex, rowData: this.rowData, column: this.column});
            }
        });

        return true;
    }

    cancelCellEditing() {
        if (this.editor && this.dg.selectedRow.index > -1) {
            if (this.formControl) {
                this.dfs.resetRow(this.dg.selectedRow.id);
                this.dc.rowData = this.dg.selectedRow.data;
                this.formControl.reset(Utils.getValue(this.column.field, this.dc.rowData));
                this.closeEditingCell();
            }
        }
    }


    bindEditorInputEvent() {
        if (this.dc.cellEditor) {
            const input = this.dc.cellEditor.componentRef.instance.inputElement;
            if (input) {
                this.editorInputKeydownEvent = this.render.listen(input, 'keydown', (e) => this.onKeyDownForInput(e));
            }
        }
    }

    unBindEditorInputEvent() {
        if (this.editorInputKeydownEvent) {
            this.editorInputKeydownEvent();
            this.editorInputKeydownEvent = null;
        }
    }

    onKeyDownForInput(e: KeyboardEvent) {
        if (this.editor.stopPropagation) {
            e.stopPropagation();
        }
        const keyCode = e.keyCode;

        switch (keyCode) {
            case 13:  // Enter
                this.closeEditingCell();
                break;
            case 27: // ESC
                this.cancelCellEditing();
                break;
            case 9: // Tab
                this.dg.clickDelay = 0;
                if (e.shiftKey) {
                    this.movePrevCellAndEdit();
                } else {
                    this.moveNextCellAndEdit();
                }
                e.preventDefault();
                break;
        }
    }

    private selectCell(field: string, tdElement?: any) {
        tdElement = tdElement || this.el.nativeElement;
        this.clearCellSelectedClass();
        this.render.addClass(tdElement, CELL_SELECTED_CLS);

        this.dfs.setCurrentCell(this.dr, field, tdElement);
        this.moveScrollbar(tdElement);
    }

    private moveScrollbar(td: any) {
        const tdPosLeft = td.offsetLeft + td.offsetWidth;
        const containerWidth = this.dg.width - this.dgb.columnsGroup.leftFixedWidth;
        const tdRect = td.getBoundingClientRect();
        const scrollContainer = this.dgb.ps.elementRef.nativeElement;
        const psContainer = scrollContainer.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        const scrollLeft = scrollContainer.scrollLeft;
        const scrollbarXLeft = this.dgb.ps.elementRef.nativeElement.scrollLeft;
        if (tdPosLeft > containerWidth) {
            const x = tdPosLeft - containerWidth + 2;
            if (x > scrollbarXLeft) {
                this.dgb.ps.scrollToX(x);
            }
        } else {
            if (tdRect.x < psContainer.x) {
                const x = scrollLeft - tdRect.x;
                this.dgb.ps.scrollToX(x);
            }
        }

        const tdPosTop = tdRect.top - psContainer.top + tdRect.height;
        if (tdPosTop > psContainer.height) {
            const y = tdPosTop - psContainer.height;
            this.dgb.ps.scrollToY(scrollTop + y);
        } else {
            if (tdRect.y < psContainer.y) {
                this.dgb.ps.scrollToY( scrollTop - (psContainer.y - tdRect.y));
            }
        }
    }

    private moveNextCellAndEdit() {
        if (!this.closeEditingCell()) {
            return;
        }
        const fieldIndex = this.dfs.getColumnIndex(this.column.field);
        if (fieldIndex + 1 < this.dgb.columnsGroup.normalColumns.length) {
            const nextColumn = this.dgb.columnsGroup.normalColumns[fieldIndex + 1];
            const nextTd = this.dg.currentCell.cellElement.nextElementSibling;

            this.selectCell(nextColumn.field, nextTd);
            nextTd.focus();
            if (nextColumn.editor) {
                this.dfs.editCell();
                this.dgs.onCellEdit(nextTd);
            }
        } else {
            // next row's first cell to editing
            const nextTr = this.dg.currentCell.cellElement.parentElement.nextElementSibling;
            if (nextTr && nextTr.tagName === 'TR' ) {
                // nextTr.children.find(td => td.editCell).editCell();
                let firstEditor = false;
                let i = 0;
                while (!firstEditor) {
                    firstEditor = !!nextTr.children[i].editCell;
                    if (!firstEditor) {
                        i++;
                    }
                }
                nextTr.children[i].editCell();
            }
        }
    }

    private movePrevCellAndEdit() {
        if (!this.closeEditingCell()) {
            return;
        }
        const fieldIndex = this.dfs.getColumnIndex(this.column.field);
        if (fieldIndex - 1 >= 0) {
            const nextColumn = this.dgb.columnsGroup.normalColumns[fieldIndex - 1];
            const nextTd = this.dg.currentCell.cellElement.previousElementSibling;
            this.selectCell(nextColumn.field, nextTd);
            nextTd.focus();
            if (nextColumn.editor) {
                this.dfs.editCell();
                this.dgs.onCellEdit(nextTd);
            }
        }
    }

    private clearCellSelectedClass() {
        if (this.dg.currentCell) {
            DomHandler.removeClass(this.dg.currentCell.cellElement, CELL_SELECTED_CLS);
        }
    }
}
