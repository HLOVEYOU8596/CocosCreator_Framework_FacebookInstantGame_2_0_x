import UIManager from "./UIManager";

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



export const PanelType =cc.Enum
    ({
        LogoPanel:0,//logo页 最初进入的页面
        TipsWindow:1,//提示窗口
        StartPanel:2,//开始页面
        //GamePanel:3,//游戏页面
        //ResultPanel:4,//结果页面
        //RankPanel:5,//排行榜页面
        //UpgradePanel:6,//升级界面
        //ShopPanel:6,//商店界面
        //GameRecommendPanel:7,

        
        PanelCount:3
    });

@ccclass
export default class PanelBase extends cc.Component {

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

    @property({type:PanelType})
    panelType=PanelType.LogoPanel;

    @property(cc.Boolean)
    isPreload:boolean=true;

    @property(cc.Boolean)
    isDontDestroy:boolean=true;



    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    OnBackKeyResponse(event)
    {
        switch (event.keyCode) 
        {
            case cc.macro.KEY.back:
                UIManager.instance.PopPanel();  
                break;
        }
    }

    AddBackKeyResponse()
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.OnBackKeyResponse.bind(this),this);
    }

    RemoveBackKeyResponse()
    {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.OnBackKeyResponse.bind(this),this);
    }

    OnEnter()
    {
        this.SetActive(true);
    }

    OnPause()
    {
        
    }

    OnResume()
    {
        
    }

    OnExit()
    {
        this.SetActive(false)
    }

    

    SetActive(active:boolean,delay:number=0)
    {
        if (active) 
        {
            this.scheduleOnce(this.PanelActive,delay);
        }
        else
        {
            this.scheduleOnce(this.PanelUnActive,delay);
        }
    }

    PanelActive()
    {
        this.node.active=true;
    }

    PanelUnActive()
    {
        this.node.active=false;
    }

    
}
