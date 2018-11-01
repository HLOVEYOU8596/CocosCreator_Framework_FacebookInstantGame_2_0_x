import FacebookAd from "./FacebookAd";
import FacebookRank from "./FacebookRank";
import FacebookStorage from "./FacebookStorage";
import FacebookAnalytics from "./FacebookAnalytics";
import FacebookPlatform from "./FacebookPlatform";
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

@ccclass
export default class Facebook extends cc.Component
{

    //单例
    // private static instance: Facebook = null;
    // public static GetInstance(): Facebook
    // {
    //     if (Facebook.instance == null)
    //     {
    //         Facebook.instance = new Facebook();
    //     }
    //     return Facebook.instance;
    // }

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

    static FBPlatformInfo: FacebookPlatform;
    //static FBPlayerInfo;
    static FBStorage: FacebookStorage;
    static FBRank: FacebookRank;
    static FBAd: FacebookAd;


    static supportApi: Array<string>;//支持的API

    //默认的sharePayload
    static defaultSharePayload = {
        intent: "SHARE",
        image: "",
        text: "Try this fantastic game!"
    };

    //默认的session数据
    static defaultSessionData = {
        scoutSent: true,
        timeZone: Math.floor(new Date().getTimezoneOffset() / 60)
    };

    //默认的updatePayload
    static defaultUpdatePayload = {
        action: "CUSTOM",
        image: "",
        text: {
            default: "Let us play game together",
            localizations: {
                zh_CN: "让我们一起来玩游戏吧!"
            }
        },
        template: "VILLAGE_INVASION",
        data: { myReplayData: '...' },
        strategy: 'IMMEDIATE',
        notification: 'NO_PUSH',
    };

    static canCreateShortcut: Boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    static Init()
    {
        if (Facebook.IsFBInit()) 
        {
            Facebook.supportApi = FBInstant.getSupportedAPIs();
            Logger.log(Facebook.supportApi);
        }
        Facebook.GenerateSubObj();
        Facebook.SetSessionData();
        Facebook.CanCreatorShortCut();
    }

    static GenerateSubObj()
    {
        Facebook.FBPlatformInfo = new FacebookPlatform();
        Facebook.FBAd = new FacebookAd();
        //Facebook.FBAd.Init();

        Facebook.FBRank = new FacebookRank();
        //Facebook.FBRank.GetGlobalRank();
        //Facebook.FBRank.GetWeeklyRank();

        Facebook.FBStorage = new FacebookStorage();
    }

    static IsFBInit():boolean
    {
        if (typeof FBInstant === 'undefined')
        {
            Logger.warn("FBInstant is undefined");
            return false
        }
        else
        {
            return true;
        }
    }

    static IsApiSupport(apiName: string)
    {
        if (!Facebook.IsFBInit()) 
        {
            return;
        }

        if (Facebook.supportApi.indexOf(apiName) != -1)
        {
            return true;
        }
        else
        {
            Logger.warn("Unsupport API:", apiName);
            return false;
        }
    }

    //设置会话数据
    static SetSessionData(sessionData = null)
    {
        if (!Facebook.IsApiSupport("setSessionData")) 
        {
            return;
        }

        let data;
        if (sessionData != null)
        {
            data = sessionData;
        }
        else
        {
            data = Facebook.defaultSessionData;
        }
        FBInstant.setSessionData(data);
        Logger.log("setSessionData:", data);
    }

    //分享
    static Share(sharePayload?: FBInstant.SharePayload, base64Image?: string, text?: string, data?: Object, successCallback?: Function, failedCallback?: Function)
    {
        if (!Facebook.IsApiSupport("shareAsync")) 
        {
            return;
        }

        let payload;
        if (sharePayload)
        {
            payload = sharePayload;
        }
        else
        {
            payload = Facebook.defaultSharePayload;
        }

        if (base64Image) 
        {
            payload.image = base64Image;
        }
        if (text) 
        {
            payload.text = text;
        }
        if (data)
        {
            payload.data = data;
        }
        FBInstant.shareAsync(payload).then(function ()
        {
            Logger.log("Shared");
            Facebook.LogEvent(FacebookAnalytics.shareGameSuccess);
            if (successCallback)
            {
                successCallback();
            }
        }).catch(function (err)
        {
            Logger.error('failed : ' + err.code + " :: " + err.message);
            Facebook.LogEvent(FacebookAnalytics.shareGameFail);
            if (failedCallback)
            {
                failedCallback(err);
            }
        });
    }

    static SendCustomUpdate(updatePayLoad?: FBInstant.CustomUpdatePayload,
        buttonName?: string, image64?: string, textObj?: Object, template?: string,
        data?: Object, strategy?: string, notification?: string, successCallback?: Function, failedCallback?: Function)
    {
        if (!Facebook.IsApiSupport("updateAsync")) 
        {
            return;
        }
        let payload: FBInstant.CustomUpdatePayload;
        if (updatePayLoad)
        {
            payload = updatePayLoad;
        }
        else
        {
            payload = Facebook.defaultUpdatePayload;
        }

        if (buttonName)
        {
            payload.cta = buttonName;
        }
        if (image64)
        {
            payload.image = image64
        }
        if (textObj)
        {
            payload.text = textObj;
        }
        if (template)
        {
            payload.template = template;
        }
        if (data)
        {
            payload.data = data;
        }
        if (strategy)
        {
            payload.strategy = strategy;
        }
        if (notification)
        {
            payload.notification = notification;
        }
        FBInstant.updateAsync(payload)
            .then(function ()
            {
                Logger.log("customUpdate finish");
                Logger.log(payload);
                if (successCallback)
                {
                    successCallback();
                }
            }).catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback)
                {
                    failedCallback(err);
                }
            });
    }

    //切换环境
    static SwitchAsync(contextId: string, successCallback?: Function, failedCallback?: Function)
    {
        if (!Facebook.IsApiSupport("context.switchAsync")) 
        {
            return;
        }
        FBInstant.context.switchAsync(contextId)
            .then(function ()
            {
                Logger.log("switchAsync success");
                Facebook.FBPlatformInfo.RefreshContextInfo();
                if (successCallback)
                {
                    successCallback();
                }
            }.bind(this)).catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback)
                {
                    failedCallback(err);
                }
            });
    }


    //创建环境
    static CreateAsync(playerId: string, successCallback?: Function, failedCallback?: Function)
    {
        if (!Facebook.IsApiSupport("context.createAsync")) 
        {
            return;
        }
        FBInstant.context.createAsync(playerId)
            .then(function ()
            {
                Logger.log("createAsync success");
                Facebook.FBPlatformInfo.RefreshContextInfo();
                if (successCallback)
                {
                    successCallback();
                }
            }.bind(this)).catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback)
                {
                    failedCallback(err);
                }
            });
    }

    //选择环境
    //options Object? An object specifying conditions on the contexts that should be offered.
    //options.filters Array<ContextFilter>? The set of filters to apply to the context suggestions.  ContextFilter: ("NEW_CONTEXT_ONLY" | "INCLUDE_EXISTING_CHALLENGES" | "NEW_PLAYERS_ONLY")
    //options.maxSize number? The maximum number of participants that a suggested context should ideally have.
    //options.minSize number? The minimum number of participants that a suggested context should ideally have.
    static ChooseAsync(options?: Object, successCallback?: Function, failedCallback?: Function)
    {
        if (!Facebook.IsApiSupport("context.chooseAsync")) 
        {
            return;
        }

        FBInstant.context.chooseAsync(options)
            .then(function ()
            {
                Facebook.FBPlatformInfo.RefreshContextInfo();
                if (successCallback)
                {
                    successCallback();
                }
            }).catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback)
                {
                    failedCallback(err);
                }
            });
    }


    //发送分析log
    static LogEvent(eventName: string, valueToSum?: number, parameters?: Object)
    {
        if (!Facebook.IsApiSupport("logEvent")) 
        {
            return;
        }
        FBInstant.logEvent(eventName, valueToSum, parameters);
    }


    //是否可以放置桌面快捷方式
    static CanCreatorShortCut()
    {
        if (!Facebook.IsApiSupport("canCreateShortcutAsync")) 
        {
            Facebook.canCreateShortcut = false;
            return;
        }
        FBInstant.canCreateShortcutAsync()
            .then(function (canCreateShortcut) 
            {
                Facebook.canCreateShortcut = canCreateShortcut;
            });
    }

    //放置桌面快捷方式
    static CreatorShortCut()
    {
        if (!Facebook.IsFBInit()) 
        {
            return;
        }
        if (Facebook.canCreateShortcut) 
        {
            FBInstant.createShortcutAsync()
                .then(function () 
                {
                    // Shortcut created
                    Logger.log("Shortcut created");
                    Facebook.LogEvent(FacebookAnalytics.addToDesktopSuccess);
                })
                .catch(function () 
                {
                    // Shortcut not created
                    Logger.error("Shortcut not created");
                    Facebook.LogEvent(FacebookAnalytics.addToDesktopFail);
                });
        }
        else
        {
            Logger.error("canCreateShortcut False");
        }
    }

    static SetPauseCallback(callback: Function)
    {
        if (!Facebook.IsApiSupport("onPause"))
        {
            return;
        }
        FBInstant.onPause(callback);
    }

    static QuitGame(beforeCallback?: Function)
    {
        if (!Facebook.IsApiSupport("quit"))
        {
            return;
        }
        if (beforeCallback)
        {
            beforeCallback();
        }
        FBInstant.quit();
    }

    static SwitchGame(id: string, data?: Object, failedCallback?: Function)
    {
        if (!Facebook.IsApiSupport("switchGameAsync"))
        {
            return;
        }
        FBInstant.switchGameAsync(id, data)
            .catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback)
                {
                    failedCallback();
                }
            });
    }
}
