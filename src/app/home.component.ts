/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-09-16 10:54:11
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
        <a class="navbar-brand" href="/header-group">多表头</a>
        <a class="navbar-brand" href="/fit-columns">自动列宽</a>
        <a class="navbar-brand" href="/lazy-load">路由跳转</a>
        <a class="navbar-brand" href="/list-card">列表卡片CRUD</a>
    </nav>
    `
})
export class AppHomeComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
