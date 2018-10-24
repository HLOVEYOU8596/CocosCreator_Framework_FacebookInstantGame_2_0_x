import CountDownTimer from './CountDownTimer';
import AppConfig from '../AppConfig/AppConfig';
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CountDownTimerObj extends cc.Component {

    //属性声明
    // @property(cc.Label)     // 使用 property 装饰器声明属性，括号里是属性类型，装饰器里的类型声明主要用于编辑器展示
    // label: cc.Label = null; // 这里是 TypeScript 用来声明变量类型的写法，冒号后面是属性类型，等号后面是默认值

    // 也可以使用完整属性定义格式
    // @property({
    //     visible: false
    //     displayName: "Score (player)"
    //     tooltip: "The score of player"
    // })
    // text: string = 'hello';
    @property(cc.Float)
    _now_time:number=0;



    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable() {}
    start() 
    {
        this._now_time=0;
    }
    update(dt) 
    {
        this._now_time+=dt;
        while (this._now_time>=AppConfig.fixedDeltaTime) {
            this.fixedUpdate(AppConfig.fixedDeltaTime);
            this._now_time-=AppConfig.fixedDeltaTime;
        }
    }
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    fixedUpdate(dt)
    {
        CountDownTimer.GetInstance().FixedUpdate(dt);
    }
    
}
