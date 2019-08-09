/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-09 11:55:10
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-09 11:55:30
 * @Company: Inspur
 * @Version: v0.0.1
 */
export class Utils {
    static randomNum(minNum, maxNum) {
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
