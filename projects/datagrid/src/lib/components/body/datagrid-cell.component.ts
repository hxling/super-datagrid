import { Component, OnInit, Input, Output, EventEmitter,
    ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
    OnDestroy, ComponentFactoryResolver, NgZone, ViewRef } from '@angular/core';
import { CommonUtils } from '@farris/ui-common';
import { filter } from 'rxjs/operators';
import { DataColumn } from '../../types/data-column';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridRowDirective } from './datagrid-row.directive';
import { CellInfo } from '../../services/state';
import { GridCellEditorDirective } from '../editors/cell-editor.directive';

@Component({
    selector: 'grid-body-cell',
    template: `
    <div class="f-datagrid-cell-content" #cellContainer [style.width.px]="column.width">
        <span *ngIf="!isEditing && !column.template">{{ value }}</span>
        <ng-container *ngIf="!isEditing && column.template" [ngTemplateOutlet]="column.template"
                        [ngTemplateOutletContext]="{$implicit: cellContext}"></ng-container>
        <ng-container #editorTemplate *ngIf="isEditing" cell-editor [column]="column" [group]="dr.form"></ng-container>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridCellComponent implements OnInit, OnDestroy {
    @Input() width: number;
    @Input() height: number;
    @Input() cls = '';
    @Input() column: DataColumn;
    @Input() rowData: any;
    @Input() rowIndex: number;

    @Input() isEditing = false;
    @Input() isSelected = false;

    @ViewChild('cellContainer') cellContainer: ElementRef;
    @ViewChild(GridCellEditorDirective) cellEditor: GridCellEditorDirective;

    @Output() cellClick = new EventEmitter();
    @Output() cellDblClick = new EventEmitter();

    cellContext: any = {};
    value: any;

    cellStyler: any = {};

    canEdit = () => this.dg.editable && this.dg.editMode === 'cell' && this.column.editor;
    constructor(
        private dfs: DatagridFacadeService, public dr: DatagridRowDirective,
        private render2: Renderer2, private utils: CommonUtils, private el: ElementRef,
        private dg: DatagridComponent, private cfr: ComponentFactoryResolver,
        private cd: ChangeDetectorRef, private zone: NgZone) { }

    ngOnInit(): void {
        this.cellContext = {
            field: this.column.field,
            rowIndex: this.rowIndex,
            rowData: this.rowData
        };

        this.updateValue();

        this.buildCustomCellStyle();

        this.dfs.currentCell$.pipe(
            filter((cell: CellInfo) => {
                return cell && this.column.editor && cell.rowIndex === this.rowIndex && cell.field === this.column.field;
            })
        ).subscribe((cell: CellInfo) => {
            if (cell && this.column.editor) {
                this.isEditing = cell.isEditing;
                if (!this.isEditing) {
                    this.updateValue();
                }
                this.cd.detectChanges();
            }
        });

        // this.dr.form.valueChanges.subscribe( val => {
        //     this.updateValue();
        // });

    }

    ngOnDestroy() {
        // this.isEditing$ = null;
    }

    private buildCustomCellStyle() {
        if (this.column.styler) {
            const cs = this.column.styler(this.rowData[this.column.field], this.rowData, this.rowIndex);
            if (cs && Object.keys(cs).length) {
                const td = this.el.nativeElement.parentNode;
                this.dg.renderCustomStyle(cs, td);
            }
        }
    }


    updateValue() {
        if (this.dr.form) {
            Object.assign(this.rowData, this.dr.form.value);
        }
        if (this.rowData && this.column && this.column.field) {
            this.value = this.utils.getValue(this.column.field, this.rowData);
        }
    }
}
