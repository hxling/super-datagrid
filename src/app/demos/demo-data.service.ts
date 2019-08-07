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
    datacount = 5000;
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

    getData(url: string, param?: any): Observable<DataResult> {
        const pageSize = param.pageSize;
        const start = (param.pageIndex - 1) * pageSize;
        const end = start + pageSize;
        const total = this.data.length;
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
                name: '姓名' + k,
                sex: '男',
                birthday: (2000 + i) + '-01-01',
                maray: true,
                addr: this.buildLongText(i, `天齐大道${7000 + i}号`),
                company: `inspur`,
                nianxin: Math.round(Math.random() * 10000) * 12,
                zhiwei: 'CEO&CPU'
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
