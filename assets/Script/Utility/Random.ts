// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export class Random  {

    /**
     * 获取 0-1 之间的随机数(小数)
     *
     */
    static Random0To1Float()
    {
        return Math.random();
    }

    /**
     * 获取随机数 0 或者 1
     *
     */
    static Random0To1Int()
    {
        return Math.round(Math.random());
    }

    /**
     * 获取随机数 0-9 整数
     *
     */
    static Random0TO9Int()
    {
        return Math.floor(Math.random()*10);
    }

    /**
     * min max 间随机一个整数 min 和 max 都包括在内
     *
     */
    static RandomInt(min:number,max:number)
    {
        let offset=max-min;
        let num=Math.floor(Math.random()*(offset+1))+min;
        return num;
    }

    /**
     * min max 间随机一个小数 min 和 max 都包括在内
     *
     */
    static RandomFloat(min:number,max:number)
    {
        return Math.random()*(max-min)+min;
    }
}
