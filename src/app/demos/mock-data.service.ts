import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RestService } from 'projects/datagrid/src/lib/services/rest.service';
import { DataResult } from 'projects/datagrid/src/lib/services/state';

@Injectable()
export class MockDataService  implements RestService {

    private users =  ['HuangXiuling', 'JiWeitao', 'FanXiaosheng', 'JiPeng',
                    'GuoZhiqi', 'XiaJianglong', 'WangLongsheng', 'WangXiaohang',
                    'ZengZhen', 'WangXufa', 'HuYuyang', 'ZhaoShuai',
                    'YangBenqing', 'ChenShenjie', 'WangHao', 'GuoYanxue',
                    'LiYazhou', 'HuangPing', 'XuNing', 'ZhuoRujing'];
    private userNames = [
        '黄秀岭', '季维涛', '范潇生', '纪  朋',
        '郭志奇', '夏江龙', '王龙生', '王晓航',
        '曾  珍', '王续法', '胡玉洋', '赵  帅',
        '杨本庆', '陈圣杰', '王  浩', '郭言学',
        '李亚洲', '黄  平', '许  宁', '禚如静'
    ];

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
                FSYXDJ_JE: this.randomNum(100, 5000),                                    // 金额
                FSYXDJ_ZY: '',                                   // 摘要
                FSYXDJ_DJZT: '制单',                                  // 状态
                RODJTREE_NAME: '通讯费报销单',                     // 单据类型
                FSYXDJ_LCSL_CURRENTPARTICIPANT: this.getUserName(),                 // 待审批人
                FSYXDJ_YXZT: 99,                                    // 影像状态
                FSYXDJ_DWBH_LSBZDW_DWMC: '花生油有限公司(共享中心)',  // 单位
                FSYXDJ_DYCS: this.randomNum(0, 100),                                     // 打印次数
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
        return this.userNames[this.randomNum(0, 19)];
    }

    private buildUser() {
        const i = this.randomNum(0, 19);
        return {
            code: this.users[i],
            name: this.userNames[i]
        };
    }

    private randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt('' + (Math.random() * minNum + 1), 10);
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);

            default:
                return 0;
        }
    }
}




