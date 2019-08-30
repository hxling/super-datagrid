/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 11:07:01
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-30 16:11:48
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Directive, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef, Input, Injector} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataColumn, DatagridComponent, ValidatorMessagerService, DatagridFacadeService, DatagridRowDirective } from '@farris/ui-datagrid';

@Directive({
    selector: 'datagrid-editor',
})
export class DatagridBaseEditorDirective implements OnInit, OnDestroy, AfterViewInit {

    @Input() placeholder = '';

    type: string;
    options: any;
    group: FormGroup;
    column: DataColumn;
    formControl: FormControl;

    inputElement: any;
    /** 是否正在向server 发送请求 */
    pending = false;

    errorMessage: string;

    private clickEvent: any;
    private keyDownEvent: any;
    private dblClickEvent: any;
    vms: ValidatorMessagerService;
    dg: DatagridComponent;
    dfs: DatagridFacadeService;
    validators = [];
    get dr(): DatagridRowDirective {
        return this.dg.selectedRow.dr;
    }
    constructor(public render: Renderer2, public el: ElementRef, public injector: Injector) {
        this.vms = this.injector.get(ValidatorMessagerService);
        this.dg = this.injector.get(DatagridComponent);
        this.dfs = this.injector.get(DatagridFacadeService);
    }

    ngOnInit(): void {

        this.formControl = this.group.get(this.column.field) as FormControl;
        if (this.column && this.column.editor) {
            this.options = this.column.editor.options;
        }

        this.validators = this.column.editor.validators;

        // console.log(this.formControl);
        this.clickEvent = this.render.listen(this.el.nativeElement, 'click', (e: Event) => {
            e.stopPropagation();
        });

        // this.dblClickEvent = this.render.listen(this.el.nativeElement, 'dblclick', (e: MouseEvent) => {
        //     e.stopPropagation();
        //     e.preventDefault();
        // });
        this.formControl.valueChanges.subscribe( (val: any) => {
            // console.log(val, this.formControl, this.group);
            // 记录变更集
            if (!this.formControl.pristine) {
                const rowId = this.dr.rowId;
                const keyField = this.dg.idField;
                const changeData = { [keyField]: rowId, [this.column.field]: val };
                this.dfs.appendChanges(changeData);
            }
            this.setErrorMessage();
        });
    }

    ngAfterViewInit() {
        this.focus();

        this.setErrorMessage();
    }

    ngOnDestroy() {
        if (this.clickEvent) {
            this.clickEvent();
        }
        if (this.dblClickEvent) {
            this.dblClickEvent();
        }
    }

    private setErrorMessage() {
        if (this.formControl && this.formControl.invalid) {
            Object.keys(this.formControl.errors).forEach( (key: string) => {
                this.errorMessage = this.vms.getValidatorErrorMessage(key, this.validators);
            });
        }
    }

    private focus() {
        if (this.inputElement) {
            setTimeout(() => {
                this.inputElement.focus();
            });
        }
    }
}
