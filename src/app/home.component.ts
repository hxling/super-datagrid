import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    template: `
    <nav class="navbar-dark bg-primary" style="padding: 10px;">
        <a class="navbar-brand" href="/">分页 + 虚拟加载</a>
        <a class="navbar-brand" href="/normal">全部加载</a>
        <a class="navbar-brand" href="/load-all">一次性加载大数据</a>
        <a class="navbar-brand" href="/scroll-load">滚动条加载</a>
        <a class="navbar-brand" href="/row-number">显示行号</a>
        <a class="navbar-brand" href="/cell-edit">单元格编辑</a>
        <a class="navbar-brand" href="/custom-cell">自定义单元格模板</a>
        <a class="navbar-brand" href="/scrollbar">原生滚动条</a>
        <a class="navbar-brand" href="/fit-columns">自动列宽</a>
        
    </nav>
    `
})
export class AppHomeComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
