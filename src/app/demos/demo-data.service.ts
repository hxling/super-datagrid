import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

interface IServerResponse {
    items: string[];
    total: number;
}
@Injectable()
export class DemoDataService {
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
                addr: `天齐大道${7000 + i}号`,
                company: `inspur`,
                nianxin: Math.round(Math.random() * 10000) * 12,
                zhiwei: 'CEO&CPU'
            });
        }
        return arr;
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