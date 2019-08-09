/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-09 14:57:54
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    template: `
    <nav class="navbar-dark bg-primary" style="padding: 10px;">
        <a class="navbar-brand" href="/">分页 + 虚拟加载</a>
        <a class="navbar-brand" href="/normal">全部加载</a>
        <a class="navbar-brand" href="/load-all">一次性加载大数据</a>
        <a class="navbar-brand" href="/scroll-load">滚动条加载</a>
        <a class="navbar-brand" href="/row-number">自定义样式</a>
        <a class="navbar-brand" href="/cell-edit">单元格编辑</a>
        <a class="navbar-brand" href="/custom-cell">自定义单元格模板</a>
        <a class="navbar-brand" href="/selection">选中行</a>
        <a class="navbar-brand" href="/fit-columns">自动列宽</a>
    </nav>
    `
})
export class AppHomeComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
