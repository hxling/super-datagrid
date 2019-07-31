import { DatagridCellComponent } from './datagrid-cell.component';
import { Directive, Input, ElementRef, Renderer2, OnInit, ContentChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DatagridBodyComponent } from './datagrid-body.component';
import { DatagridRowDirective } from './datagrid-row.directive';
import { DataColumn } from './../../types/data-column';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';
import { CELL_SELECTED_CLS } from '../../types/constant';
import { DomHandler } from '../../services/domhandler';

@Directive({
    selector: '[cell-editable]',
    exportAs: 'cellEditable'
})
export class DatagridCellEditableDirective implements OnInit, OnDestroy {
    @Input('cell-editable') rowData: any;
    @Input() column: DataColumn;

    private isSingleClick = true;
    private clickTimer: any;


    private cellclick: any;
    private celldblclick: any;

    private editorInputKeydownEvent: any;

    @ContentChild(DatagridCellComponent) dc: DatagridCellComponent;

    private isDifferentCell = () => {
        return !this.dg.currentCell || this.dg.currentCell.rowIndex !== this.dr.rowIndex || this.dg.currentCell.field !== this.column.field;
    }

    constructor(private dfs: DatagridFacadeService, private dr: DatagridRowDirective,
                private dgb: DatagridBodyComponent, private cd: ChangeDetectorRef,
                public el: ElementRef, private render: Renderer2, private dg: DatagridComponent) {
    }

    ngOnInit() {
        // console.log(this.dc);
        if (this.dg.editable) {
            this.cellclick = this.render.listen(this.el.nativeElement, 'click', (e) => this.onClickCell(e));
            this.celldblclick = this.render.listen(this.el.nativeElement, 'dblclick', (e) => this.onDblClickCell(e));
        }
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

    private onClickCell(event: KeyboardEvent) {
        event.stopPropagation();

        if (event.target['nodeName'] === 'INPUT') {
            return;
        }

        this.isSingleClick = true;
        this.clickTimer = setTimeout(() => {
            if (this.isSingleClick) {
                // console.log('ClickCell', event);
                this.dfs.selectRow(this.dr.rowIndex, this.rowData);
                if (this.dg.editable && this.dg.editMode === 'cell') {
                    this.closeEditingCell();
                    this.selectCell();
                    event.preventDefault();
                }
            }
        }, this.dg.clickDelay);

    }

    private onDblClickCell(event: MouseEvent) {

        if (event.target['nodeName'] === 'INPUT') {
            return;
        }

        this.isSingleClick = false;
        clearTimeout(this.clickTimer);
        this.dfs.selectRow(this.dr.rowIndex, this.rowData);
        if (this.dg.editable && this.dg.editMode === 'cell') {
            // console.log('DblClick', event);
            this.closeEditingCell();
            setTimeout(() => {
                this.openCellEditor();
            });
        }
    }

    openCellEditor() {
        if (!this.column.editor) {
            return;
        }

        if (this.isDifferentCell()) {
            this.selectCell();
        }

        this.dfs.editCell();
        setTimeout(() => {
            this.bindEditorInputEvent();
        });
    }

    closeEditingCell() {
        this.unBindEditorInputEvent();
        this.dfs.endEditCell();
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
                const nextTd = this.dg.selectCell('right');
                setTimeout(() => {
                    this.dfs.editCell();
                    setTimeout(() => {
                        this.bindEditorInputEvent();
                        this.dg.clickDelay = 200;
                    });
                }, this.dg.clickDelay + 1);
                break;
        }
    }


    private selectCell() {
        if (!this.isDifferentCell()) {
            return;
        }
        this.clearCellSelectedClass();
        this.render.addClass(this.el.nativeElement, CELL_SELECTED_CLS);

        this.el.nativeElement.editCell = () => this.openCellEditor();

        this.dfs.setCurrentCell(this.dr.rowIndex, this.rowData, this.column.field, this.el.nativeElement);
        this.moveScrollbar(this.el.nativeElement);
    }

    private moveScrollbar(td: any) {
        const tdPosLeft = td.offsetLeft + td.offsetWidth;
        const containerWidth = this.dg.width - this.dgb.columnsGroup.leftFixedWidth;
        const tdRect = td.getBoundingClientRect();
        const scrollContainer = this.dgb.ps.elementRef.nativeElement;
        const psContainer = scrollContainer.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        const scrollLeft = scrollContainer.scrollLeft;
        if (tdPosLeft > containerWidth) {
            const x = tdPosLeft - containerWidth + 2;
            this.dgb.ps.scrollToX(x);
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

    private clearCellSelectedClass() {
        if (this.dg.currentCell) {
            DomHandler.removeClass(this.dg.currentCell.cellRef, CELL_SELECTED_CLS);
        }
    }
}
