import { Utils } from './utils';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-07-29 08:14:22
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-09 15:35:09
 * @Company: Inspur
 * @Version: v0.0.1
 */
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RestService } from 'projects/datagrid/src/lib/services/rest.service';
import { DataResult } from 'projects/datagrid/src/lib/services/state';

interface IServerResponse {
    items: string[];
    total: number;
}
@Injectable()
export class DemoDataService implements RestService {

    data: any[];
    private datacount = 1000;
    get dataLength() {
        return this.datacount;
    }

    set dataLength(count) {
        this.datacount = count;
        this.data = this.createData(count);
    }


    constructor() {
        this.data = this.createData(this.dataLength);
    }

    private compare(a, b) {
        return a === b ? 0 : (a > b ? 1 : -1);
    }

    getData(url: string, param?: any): Observable<DataResult> {
        const pageSize = param.pageSize;
        const start = (param.pageIndex - 1) * pageSize;
        const sortName = param.sortName;
        const sortOrder = param.sortOrder;
        const end = start + pageSize;
        const total = this.data.length;
        if (sortName) {
            this.data = this.data.sort((r1, r2) => {
                let r = 0;
                const sortFields = sortName.split(',');
                const orders = sortOrder.split(',');
                for (let i = 0; i < sortFields.length; i++) {
                    const sn = sortFields[i];
                    const so = orders[i];
                    r = this.compare(r1[sn], r2[sn]) * (so === 'asc' ? 1 : -1);
                    if (r !== 0) {
                        return r;
                    }
                }
                return r;
            });
        }
        return of({
            items: this.data.slice(start, end),
            total,
            pageSize,
            pageIndex: param.pageIndex
        }).pipe(delay(1000));
    }

    createData(len: number) {
        const arr = [];
        for (let i = 0; i < len; i++) {
            const k = i + 1;
            arr.push({
                id: k,
                name: Utils.userNames[Utils.randomNum(0, 19)],
                sex: Utils.getXingBie(),
                birthday: Utils.getFullDate(),
                maray: ['', true, false][Utils.randomNum(0, 2)],
                addr: this.buildLongText(i, `天齐大道${7000 + i}号`),
                company: Utils.getCompany(),
                nianxin: Math.round(Math.random() * 10000) * 12,
                zhiwei: Utils.getZhiWei()
            });
        }
        this.data = arr;
        return arr;
    }


    buildLongText(index, t: string) {
        if (index % 5 === 0) {
            return t.repeat(5);
        }

        return t;
    }

    serverCall(data: any[], pageIdx: number, pageSize = 10): Observable<IServerResponse> {
        const perPage = pageSize;
        const start = (pageIdx - 1) * perPage;
        const end = start + perPage;
        const total = data.length;
        return of({
            items: data.slice(start, end),
            total
        }).pipe(delay(1000));
    }
}
