/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-19 18:21:29
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
import { Observable, timer, of } from 'rxjs';


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

    private editorInputKeydownEvent: any;

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
                this.celldblclick = this.render.listen(this.el.nativeElement, 'dblclick', (e) => {
                    this.onDblClickCell(e);
                });
                this.el.nativeElement.editCell = () => this.openCellEditor();
            } else {
                this.clickTimer = 0;
            }
        }

        this.dgs.cellEdit$.pipe(
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
    }

    private onClickCell(event: any) {
        if (!this.dg.editable) {
            return;
        }
        event.stopPropagation();
        if (event.target['nodeName'] === 'INPUT') {
            return;
        }
        this.render.addClass(this.dg.el.nativeElement, 'f-datagrid-unselect');

        if (!this.dg.isSingleClick) {
            this.dg.isSingleClick = true;
            this.clickTimer = setTimeout(() => {
                if (this.dg.isSingleClick && this.dg.editable && this.dg.editMode === 'cell') {
                    this.closeEditingCell();
                    if (!this.isDifferentCell()) {
                        return;
                    }

                    this.selectCell(this.column.field);
                    this.render.removeClass(this.dg.el.nativeElement, 'f-datagrid-unselect');
                    this.dg.isSingleClick = false;
                    clearTimeout(this.clickTimer);
                    event.preventDefault();
                }
            }, this.dg.clickDelay);
        }
    }

    private onDblClickCell(event: MouseEvent) {
        if (event.target['nodeName'] === 'INPUT') {
            return;
        }
        if (this.dg.editable && this.dg.editMode === 'cell') {
            this.closeEditingCell();
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
                this.dg.beginEdit.emit({ ediotr: this.dc.cellEditor, column: this.column, rowData: this.rowData });
            }
        });
    }

    closeEditingCell() {

        const afterEditEvent = this.dg.afterEdit(this.dr.rowIndex, this.rowData, this.column );
        if (!afterEditEvent || !afterEditEvent.subscribe) {
            console.warn('please return an Observable Type.');
            return;
        }

        afterEditEvent.subscribe( (flag: boolean) => {
            if (flag) {
                this.dfs.endEditCell();
                this.dgs.onEndCellEdit(this.dfs.getCurrentCell());
                this.unBindEditorInputEvent();
                this.dg.endEdit.emit();
            }
        });
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
        e.stopPropagation();
        const keyCode = e.keyCode;

        switch (keyCode) {
            case 13:  // Enter
            case 27: // ESC
                this.closeEditingCell();
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

        this.dfs.setCurrentCell(this.dr.rowIndex, this.rowData, field, tdElement);
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
        const fieldIndex = this.dfs.getColumnIndex(this.column.field);
        if (fieldIndex + 1 < this.dgb.columnsGroup.normalColumns.length) {
            const nextColumn = this.dgb.columnsGroup.normalColumns[fieldIndex + 1];
            const nextTd = this.dg.currentCell.cellRef.nextElementSibling;
            this.closeEditingCell();
            this.selectCell(nextColumn.field, nextTd);
            nextTd.focus();
            if (nextColumn.editor) {
                this.dfs.editCell();
                this.dgs.onCellEdit(nextTd);
            }
        }
    }

    private movePrevCellAndEdit() {
        const fieldIndex = this.dfs.getColumnIndex(this.column.field);
        if (fieldIndex - 1 >= 0) {
            const nextColumn = this.dgb.columnsGroup.normalColumns[fieldIndex - 1];
            const nextTd = this.dg.currentCell.cellRef.previousElementSibling;
            this.closeEditingCell();
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
            DomHandler.removeClass(this.dg.currentCell.cellRef, CELL_SELECTED_CLS);
        }
    }
}
