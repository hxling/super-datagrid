import { FormBuilder, FormGroup } from '@angular/forms';
import { Directive, Input, Output, EventEmitter, HostListener,
    OnInit, ElementRef, Renderer2, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridComponent } from '../../datagrid.component';

@Directive({
    selector: '[grid-row]',
    exportAs: 'gridRow'
})
export class GridRowDirective implements OnInit, AfterViewInit {
    @Input('grid-row') rowData: any;
    @Input() rowIndex: number;
    @Output() clickHandler = new EventEmitter();

    form = new FormGroup({});

    constructor(public dg: DatagridComponent, private dfs: DatagridFacadeService,
                private cd: ChangeDetectorRef,
                private fb: FormBuilder, private el: ElementRef, private render: Renderer2) {}

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
        console.log(event);
        this.dfs.selectRow(this.rowIndex, this.rowData);
        this.clickHandler.emit();
    }

    createControl() {
        const group = this.fb.group({});
        this.dg.columns.forEach(col => {
            if (!col.editor) {return; }
            const control = this.fb.control(
                this.rowData[col.field],
                // this.bindValidations(field.validations || [])
            );
            group.addControl(col.field, control);
        });
        return group;
    }
}
