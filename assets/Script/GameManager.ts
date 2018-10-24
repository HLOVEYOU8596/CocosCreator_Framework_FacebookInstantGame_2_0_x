import UIManager from "./UIManager/UIManager";
import { PanelType } from "./UIManager/PanelBase";
import Facebook from "./Facebook/Facebook";
import Logger from "./Logger/Logger";
import MsgDefine from "./MsgSystem/MsgDefine";
import MsgSystem from "./MsgSystem/MsgSystem";
import LocalizationManager from "./Localization/LocalizationManager";
import UserInfo from "./GameData/UserInfo";

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
export default class GameManager extends cc.Component
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

    static instance: GameManager = null;

    startStep: number = 0;


    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        GameManager.instance = this;

        //碰撞组件
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;


        //响应游戏暂停和恢复
        cc.game.on(cc.game.EVENT_HIDE, this.OnGamePause.bind(this), this);
        cc.game.on(cc.game.EVENT_SHOW, this.OnGameResume.bind(this), this);

        //开始监听各个模块是否加载完毕
        MsgSystem.GetInstance().AddListener(MsgDefine.languageLoadFinsih, this.CheckStartFinish.bind(this), this);
        MsgSystem.GetInstance().AddListener(MsgDefine.nodePoolInitFinish, this.CheckStartFinish.bind(this), this);
        MsgSystem.GetInstance().AddListener(MsgDefine.preLoadUIPanelFinish, this.CheckStartFinish.bind(this), this);

        MsgSystem.GetInstance().AddListener(MsgDefine.rankLoadFinish, this.CheckStartFinish.bind(this), this);
        MsgSystem.GetInstance().AddListener(MsgDefine.loadDataFromFBFinish, this.CheckStartFinish.bind(this), this);
        MsgSystem.GetInstance().AddListener(MsgDefine.userInfoLoadFinish, this.CheckStartFinish.bind(this), this);
        MsgSystem.GetInstance().AddListener(MsgDefine.contextInfoLoadFinish, this.CheckStartFinish.bind(this), this);
        

        this.AppStart();
    }
    // onEnable() {}
    start() 
    {
        
    }
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    onDestroy() 
    {
        Logger.log("退出App");
    }

    OnGamePause()
    {
        Logger.log("gamePause");
        cc.game.pause();
    }
    OnGameResume()
    {
        cc.game.resume();
        Logger.log("gameResume");
    }

    AppStart()
    {
        Facebook.Init();

        //响应暂停
        Facebook.SetPauseCallback(this.OnGamePause);

        //读取context和FB平台 信息
        Facebook.FBPlatformInfo.Init();

        //加载语言
        LocalizationManager.instance.GetLocalLanguagePackage(Facebook.FBPlatformInfo.lanCode);

        //读取玩家facebook信息
        UserInfo.GetInstance().LoadUserInfoFromFB();

        //读取facebook保存的信息
        UserInfo.GetInstance().LoadSavedDataFromFB();

        //读取全球和好友的排行榜信息
        Facebook.FBRank.GetGlobalRank();
        //Facebook.FBRank.GetWeeklyRank();


        //测试游戏中scoreLine
        //Facebook.FBRank.TestFunction();

        //初始化广告
        Facebook.FBAd.Init();

        //异步加载UI
        UIManager.instance.PreloadUIPanel();
        //显示LogoPanel
        UIManager.instance.PushPanel(PanelType.LogoPanel);


    }

    CheckStartFinish()
    {
        //检查是否加载完成,加载完成后进入 StartPanel
        this.startStep++;
        if ((Facebook.IsFBInit()==true&&this.startStep>=7)||(Facebook.IsFBInit()==false&&this.startStep>=3))
        {
            MsgSystem.GetInstance().DeleteListenerByTarget(MsgDefine.nodePoolInitFinish, this);
            MsgSystem.GetInstance().DeleteListenerByTarget(MsgDefine.languageLoadFinsih, this);
            MsgSystem.GetInstance().DeleteListenerByTarget(MsgDefine.preLoadUIPanelFinish, this);

            MsgSystem.GetInstance().DeleteListenerByTarget(MsgDefine.rankLoadFinish, this);
            MsgSystem.GetInstance().DeleteListenerByTarget(MsgDefine.loadDataFromFBFinish, this);
            MsgSystem.GetInstance().DeleteListenerByTarget(MsgDefine.userInfoLoadFinish, this);
            MsgSystem.GetInstance().DeleteListenerByTarget(MsgDefine.contextInfoLoadFinish, this);

            UIManager.instance.PopAllPanel();
            UIManager.instance.PushPanel(PanelType.StartPanel);
        }
    }

    

   


}
