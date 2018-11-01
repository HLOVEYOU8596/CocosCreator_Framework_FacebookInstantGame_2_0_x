import Facebook from "./Facebook";
import Logger from "../Logger/Logger";
import MsgSystem from "../MsgSystem/MsgSystem";
import MsgDefine from "../MsgSystem/MsgDefine";

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


export default class FacebookPlatform {

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

    contextId: string = null;
    contextType: string = "";
    local:string="";
    lanCode: string = "";
    platform: string = "";
    SDKVersion:string="";
    entryPoint:string="";
    entryPointData:any=null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    Init()
    {
        if(!Facebook.IsFBInit())
        {
            return;
        }

        this.contextType=FBInstant.context.getType();
        if (this.contextType=="SOLO") 
        {
            this.contextId=FBInstant.player.getID()+"_SOLO";    
        }
        else
        {
            this.contextId=FBInstant.context.getID();
        }
        this.local=FBInstant.getLocale();
        this.lanCode=this.local.substr(0,2);
        this.platform=FBInstant.getPlatform();
        this.SDKVersion=FBInstant.getSDKVersion();
        this.entryPoint=FBInstant.getEntryPointAsync();
        this.entryPointData= FBInstant.getEntryPointData();
        Logger.log("contextType:"+this.contextType);
        Logger.log("contextId:"+this.contextId);
        Logger.log("local:"+this.local);
        Logger.log("lanCode:"+this.lanCode);
        Logger.log("SDKVersion:"+this.SDKVersion);
        Logger.log("entryPoint:"+this.entryPoint);
        Logger.log("entryPointData:"+JSON.stringify(this.entryPointData));

        //发送消息
        MsgSystem.GetInstance().PostMsg(MsgDefine.contextInfoLoadFinish);
    }

    RefreshContextInfo()
    {
        this.contextType=FBInstant.context.getType();
        if (this.contextType=="SOLO") 
        {
            this.contextId=FBInstant.player.getID()+"_SOLO";    
        }
        else
        {
            this.contextId=FBInstant.context.getID();
        }
    }
}
