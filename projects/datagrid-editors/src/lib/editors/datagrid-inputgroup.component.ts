/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 11:41:00
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 18:34:12
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { DatagridBaseEditorDirective } from '../datagrid-base-editor.directive';

@Component({
    selector: 'grid-editor-inputgroup',
    template: ``,
})
export class DatagridInputGroupComponent extends DatagridBaseEditorDirective implements OnInit {
    constructor(render: Renderer2, el: ElementRef) {
        super(render, el);
    }

    ngOnInit(): void { }
}
