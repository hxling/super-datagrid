import { Component, OnInit } from '@angular/core';


/**
 * 自动高度
 * 禁用分页，禁用固定表头，禁用虚拟加载，禁用固定列
 * 支持单元格编辑, 支持排序, 支持拖动列宽
 */

@Component({
    selector: 'auto-height',
    templateUrl: './auto-height.component.html'
})
export class AutoHeightComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
