/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-08 14:38:43
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-09 15:00:45
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RestService } from 'projects/datagrid/src/lib/services/rest.service';
import { DataResult } from 'projects/datagrid/src/lib/services/state';
import { Utils } from './utils';

@Injectable()
export class MockDataService  implements RestService {
    data: any[];

    private datacount = 1000;
    get dataLength() {
        return this.datacount;
    }

    set dataLength(count) {
        this.datacount = count;
        this.data = this.buildData(count);
    }

    constructor() {
        this.data = this.buildData(this.dataLength);
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

    buildData(size = 1000) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            const k = i + 1;
            const user = this.buildUser();
            arr.push({
                FSYXDJ_DJBH: this.buildDjbh(k, size),                 // 单据编号
                FSYXDJ_DJRQ: '2019-08-01',             // 单据日期
                FSYXDJ_USER: user.code,                          // 制单人
                FSYXDJ_BXR_LSZGZD_ZGXM: user.name,                // 报销人
                FSYXDJ_BMID_LSBMZD_BMMC: '销售部',               // 部门
                FSYXDJ_WBBH_LSWBZD_BZMC: '人民币',               // 币种
                FSYXDJ_JE: Utils.randomNum(100, 5000),                                    // 金额
                FSYXDJ_ZY: '',                                   // 摘要
                FSYXDJ_DJZT: '制单',                                  // 状态
                RODJTREE_NAME: '通讯费报销单',                     // 单据类型
                FSYXDJ_LCSL_CURRENTPARTICIPANT: this.getUserName(),                 // 待审批人
                FSYXDJ_YXZT: 99,                                    // 影像状态
                FSYXDJ_DWBH_LSBZDW_DWMC: '花生油有限公司(共享中心)',  // 单位
                FSYXDJ_DYCS: Utils.randomNum(0, 100),                                     // 打印次数
                FSYXDJ_YCXX: this.getUserName(),                                    // 退回原因
                FSYXDJ_CSRMC: this.getUserName(),                                   // 初审人
                FSYXDJ_JHRMC: this.getUserName(),                                   // 稽核人
                FSYXDJ_FHRMC: this.getUserName(),                                   // 复核人
                FSYXDJ_LZZT: '未签发'                                     // 原始票据状态
            });
        }
        return arr;
    }


    private buildDjbh(n, len) {
        return 'BX20190801' + ('' + n).padStart(('' + len).length, '0');
    }

    private getUserName() {
        return Utils.userNames[Utils.randomNum(0, 19)];
    }

    private buildUser() {
        const i = Utils.randomNum(0, 19);
        return {
            code: Utils.users[i],
            name: Utils.userNames[i]
        };
    }
}




