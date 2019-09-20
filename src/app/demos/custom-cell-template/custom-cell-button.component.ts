import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'cell-button',
    template: `
    <button class="btn btn-primary" (click)="onDeleteClick($event)">删除</button> &nbsp;
    <button class="btn btn-success">审核</button>
    `,
})
export class CustomCellButtonComponent implements OnInit {
    @Input() rowData: any;
    @Output() clickHandler = new EventEmitter();
    constructor() { }

    ngOnInit(): void { }

    onDeleteClick($event) {
        console.log(' 自定义列组件事件 ', this.rowData);
        this.clickHandler.emit($event);
    }
}
