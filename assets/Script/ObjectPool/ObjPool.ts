import Logger from "../Logger/Logger";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


export default class ObjPool
{

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

    public activePool: Array<cc.Node> = new Array<cc.Node>();
    public scriptPool:Array<any>=new Array<any>();
    public limitCount: number;

    private pool: cc.NodePool;
    private prefab: cc.Prefab = null;
    private scriptName;
    private isLimited: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    /**
     *
     */
    constructor(prefab: cc.Prefab, count: number, scriptName?: string | { prototype: cc.Component; }, 
                limitCount: number = 0,delayTime:number=0,interval:number=0) 
    {
        if (scriptName) {
            this.scriptName=scriptName;
        }
        this.pool = new cc.NodePool(scriptName);
        this.prefab = prefab;
        for (let i = 0; i < count; i++)
        {
            if (delayTime==0&&interval==0) {
                let obj = cc.instantiate(prefab);
                this.pool.put(obj);
            }
            else
            {
                setTimeout(function() 
                {
                    let obj = cc.instantiate(prefab);
                    this.pool.put(obj);
                }.bind(this),delayTime+i*interval);
            }
        }
        if (limitCount <= 0) 
        {
            this.isLimited = false;
        }
        else
        {
            this.isLimited = true;
            this.limitCount = count > limitCount ? count : limitCount;
        }
    }

    /**
     * 从池中获取一个对象
     * @param params 
     */
    SpawnAnObj(...params: any[])
    {
        if (this.isLimited && this.activePool.length >= this.limitCount) 
        {
            Logger.warn("objPool is on limit size");
            return null;
        }

        let obj: cc.Node = null;
        if (this.pool.size() > 0) 
        {
            obj = this.pool.get(...params);
        }
        else
        {
            obj = cc.instantiate(this.prefab);
            if (params != null) 
            {
                let script: any = obj.getComponent(this.scriptName);
                if (script) 
                {
                    script.reuse(...params);
                }
            }

        }
        this.activePool.push(obj);
        if (this.scriptName) {
            this.scriptPool.push(obj.getComponent(this.scriptName));
        }
        
        return obj;
    }

    /**
     * 回收一个对象
     * @param obj 
     */
    RecoverAnObj(obj: cc.Node)
    {
        this.pool.put(obj);
        let index = this.activePool.indexOf(obj);
        if (index != -1)
        {
            this.activePool.splice(index, 1);
            this.scriptPool.splice(index,1);
        }

        Logger.debug(this.prefab.name+" ObjectPool an object "+"{"+obj.name +"}"+" recovered");
    }

    /**
     * 回收全部对象
     */
    RecoverAllObj()
    {
        for (let i = 0; i < this.activePool.length; i++)
        {
            this.pool.put(this.activePool[i]);
        }
        this.activePool.splice(0, this.activePool.length);
        this.scriptPool.splice(0,this.scriptPool.length);

        Logger.debug(this.prefab.name+" ObjectPool all objects recovered");
    }

    /**
     * 销毁对象池
     */
    DestoryPool()
    {
        this.RecoverAllObj();
        this.pool.clear();
        Logger.debug(this.prefab.name+" ObjectPool Destoried");
    }

}
