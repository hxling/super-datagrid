/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-09 11:55:10
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-09 14:59:44
 * @Company: Inspur
 * @Version: v0.0.1
 */
export class Utils {

    static users =  [
        'ZhangSan', 'LiSi', 'WangWu', 'ZhaoLiu',
        'XiongDa', 'HuiTailang', 'XiYangyang', 'XiaoHuihui',
        'ZhangXiaojing', 'TangSangzang', 'XunWukong', 'HuLuwa',
        'ShunLiu', 'XuSanduo', 'ZouBapi', 'Super mary',
        'ChouNiZadi', 'WoZainali', 'NiShishui', 'Super Haha Star'
    ];
    static userNames = [
        '张三八', '李四九', '王五七', '赵六六',
        '熊大大', '灰太狼', '喜洋洋', '小灰灰',
        '张小敬', '糖三脏', '熏悟空', '葫芦娃',
        '顺溜六', '许三多', '周八皮', '超级玛莉',
        '瞅你咋地', '我在哪', '你是谁', '超级笑星'
    ];


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
