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

const { ccclass, property } = cc._decorator;

@ccclass
export default class FacebookStorage
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


    static highestScore:string="highestScore";
    static ownSkin:string="ownSkin";
    static usingSkin:string="usingSkin";
    static ownStage:string="ownStage";
    static usingStage:string="usingStage";
    static gameCoin:string="gameCoin";
    static scoreLastRound:string="scoreLastRound";



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    static LoadItem(data: any, key: string, defaultValue: any)
    {
        let itemValue = data[key];
        if (itemValue != undefined) 
        {
            return itemValue;
        }
        else
        {
            return defaultValue;
        }
    }

    LoadDataFormFB(keys:Array<string>,successCallback?:Function,failedCallback?:Function)
    {
        if (!Facebook.IsApiSupport("player.getDataAsync")) 
        {
            return;
        }
        FBInstant.player
            .getDataAsync(keys)
                .then(function (data: Object)
                {
                    Logger.log('data is loaded');
                    if (successCallback) {
                        successCallback(data);
                    }
                    
                    //发送读取记录完成
                    this.fbStorageLoadFinish = true;
                    MsgSystem.GetInstance().PostMsg(MsgDefine.loadDataFromFBFinish);

                }.bind(this))
                .catch(function (err)
                {
                    Logger.error('failed : ' + err.code + " :: " + err.message);
                    if (failedCallback) {
                        failedCallback();
                    }
                });
    }

    SaveDataToFB(data:Object,successCallback?:Function,failedCallback?:Function)
    {
        if (!Facebook.IsApiSupport("player.setDataAsync")) 
        {
            return;
        }
        FBInstant.player.setDataAsync(data)
            .then(function ()
            {
                Logger.log('Data Presaved');
                if (successCallback) {
                    successCallback();
                }
            }.bind(this))
            .catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback) {
                    failedCallback();
                }
            });
    }

    FlushData(successCallback?:Function,failedCallback?:Function)
    {
        if (!Facebook.IsApiSupport("player.flushDataAsync")) 
        {
            return;
        }
        FBInstant.player.flushDataAsync()
            .then(function ()
            {
                Logger.log('Data persisted to FB!');
                if (successCallback) {
                    successCallback();
                }
            }.bind(this))
            .catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback) {
                    failedCallback();
                }
            });
    }
}
