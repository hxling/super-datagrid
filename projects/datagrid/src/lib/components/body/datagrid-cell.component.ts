import { Subscription } from 'rxjs';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-20 18:57:48
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, Output, EventEmitter,
    ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef,
    OnDestroy, Injector, Inject, forwardRef, ApplicationRef, OnChanges, SimpleChanges } from '@angular/core';
import { Utils } from '../../utils/utils';
import { filter } from 'rxjs/operators';
import { DataColumn } from '../../types/data-column';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridRowDirective } from './datagrid-row.directive';
import { CellInfo } from '../../services/state';
import { GridCellEditorDirective } from '../editors/cell-editor.directive';
import { ColumnFormatService } from '@farris/ui-common/column';

@Component({
    selector: 'grid-body-cell',
    template: `
    <div class="f-datagrid-cell-content" #cellContainer [style.width.px]="column.width">
        <ng-container *ngIf="!isEditing && !column.template">
            <span *ngIf="column.formatter" [innerHtml]="formatData(column.field, rowData, column.formatter) | safe: 'html'"></span>
            <span *ngIf="!column.formatter">{{ value }}</span>
        </ng-container>
        <ng-container *ngIf="!isEditing && column.template" [ngTemplateOutlet]="column.template"
                        [ngTemplateOutletContext]="{$implicit: cellContext}"></ng-container>
        <ng-container #editorTemplate *ngIf="isEditing" cell-editor [column]="column" [group]="dr.form"></ng-container>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.Default
})
export class DatagridCellComponent implements OnInit, OnDestroy {
    @Input() width: number;
    @Input() height: number;
    @Input() cls = '';
    @Input() column: DataColumn;
    @Input() rowData: any;
    @Input() rowIndex: number;

    private _isEditing = false;
    @Input() get isEditing() {
        return this._isEditing;
    }
    set isEditing(v) {
        this._isEditing = v;
        if (!this.cd['destroyed']) {
            this.cd.detectChanges();
        }
    }
    @Input() isSelected = false;

    @ViewChild('cellContainer') cellContainer: ElementRef;
    @ViewChild(GridCellEditorDirective) cellEditor: GridCellEditorDirective;

    @Output() cellClick = new EventEmitter();
    @Output() cellDblClick = new EventEmitter();

    cellContext: any = {};
    value: any;

    cellStyler: any = {};

    private dfs: DatagridFacadeService;
    private cellSubscription: Subscription;
    canEdit = () => this.dg.editable && this.dg.editMode === 'cell' && this.column.editor;
    constructor(
        private app: ApplicationRef,
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent,
        @Inject(forwardRef(() => DatagridRowDirective)) public dr: DatagridRowDirective,
        private el: ElementRef, private cd: ChangeDetectorRef, private injector: Injector,
        public colFormatSer: ColumnFormatService
    ) {
        this.dfs = this.injector.get(DatagridFacadeService);
    }

    ngOnInit(): void {
        this.cellContext = {
            field: this.column.field,
            rowIndex: this.rowIndex,
            rowData: this.rowData
        };

        this.updateValue();

        this.buildCustomCellStyle();

        this.cellSubscription = this.dfs.currentCell$.pipe(
            filter((cell: CellInfo) => {
                return cell && this.column.editor && cell.rowIndex === this.rowIndex && cell.field === this.column.field;
            })
        ).subscribe((cell: CellInfo) => {
            if (cell && this.column.editor) {
                this.isEditing = cell.isEditing;
                if (!this.isEditing) {
                    this.updateValue();
                } else {
                    this.dr.form.controls[this.column.field].setValue(this.value);
                }

                if (!this.cd['destroyed']) {
                    this.cd.detectChanges();
                }

                // this.app.tick();
            }
        });

        // this.dr.form.valueChanges.subscribe( val => {
        //     this.updateValue();
        // });

    }

    ngOnDestroy() {
        if (this.cellSubscription) {
            this.cellSubscription.unsubscribe();
            this.cellSubscription = null;
        }
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

    formatData(field: any, data: any, formatter: any) {
        const value = Utils.getValue(field, data);
        return this.colFormatSer.format(value, data, formatter);
    }

    updateValue() {
        if (this.dr.form) {
            Object.assign(this.rowData, this.dr.form.value);
        }
        if (this.rowData && this.column && this.column.field) {
            this.value = Utils.getValue(this.column.field, this.rowData);
        }
    }
}
