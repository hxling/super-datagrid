import { Pipe, PipeTransform } from '@angular/core';

/**
 * 使用说明
 * let message = "今天天气 {0}，处处好 {1}。"
 * template:
 * <h1>{{ message| replaceX: '晴朗', '风光' }}</h1>
 * resule:
 * <h1>今天天气 晴朗，处处好 风光。</h1>
 */
@Pipe({name: 'replaceX'})
export class ReplaceXPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        args.forEach((v, i) => {
            value = value.replace(`{${i}}`, v);
        });

        return value;
    }
}
