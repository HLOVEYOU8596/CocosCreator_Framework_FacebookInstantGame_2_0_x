import Facebook from "./Facebook";
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
export default class FacebookAd
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

    videoAdNum: string = "2194985904115553_2194988047448672";
    picAdNum: string = "2194985904115553_2194987930782017";

    preloadedRewardedVideo: FBInstant.AdInstance = null;
    preloadedInterstitial: FBInstant.AdInstance = null;


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
        if (!Facebook.IsFBInit())
        {
            return;
        }
        this.InitVideoAd();
        this.InitPicAd();
    }

    InitVideoAd()
    {
        if (!Facebook.IsApiSupport("getRewardedVideoAsync")) 
        {
            return;
        }
        if (this.videoAdNum=="") {
            Logger.log("videoAdNum is null");
            return;
        }
        FBInstant.getRewardedVideoAsync(this.videoAdNum).then(function (reward)
        {
            this.preloadedRewardedVideo = reward;
            this.PreLoadVideoAd();
        }.bind(this)).catch(function (err)
        {
            Logger.error('Rewarded video failed to preload : ' + err.code + " :: " + err.message);
        });
    }

    InitPicAd()
    {
        if (!Facebook.IsApiSupport("getInterstitialAdAsync")) 
        {
            return;
        }
        if (this.picAdNum=="") {
            Logger.log("picAdNum is null");
            return;
        }
        FBInstant.getInterstitialAdAsync(this.picAdNum).then(function (interstitial)
        {
            this.preloadedInterstitial = interstitial;
            this.PreLoadPicAd();
        }.bind(this)).catch(function (err)
        {
            Logger.error('Rewarded video failed to preload : ' + err.code + " :: " + err.message);
        });
    }

    PreLoadVideoAd()
    {
        if (this.preloadedRewardedVideo==null) 
        {
            return;    
        }
        this.preloadedRewardedVideo.loadAsync().then(function ()
        {
            Logger.log("Rewarded video preloaded");

        }).catch(function (err)
        {
            Logger.error('Rewarded video failed to preload : ' + err.code + " :: " + err.message);
        });
    }

    PreLoadPicAd()
    {
        if (this.preloadedInterstitial==null)
        {
            return;    
        }
        this.preloadedInterstitial.loadAsync().then(function ()
        {
            Logger.log("Interstitial preloaded");

        }).catch(function (err)
        {
            Logger.error('Interstitial failed to preload : ' + err.code + " :: " + err.message);
        })
    }

    ShowVideoAd(successCallback: Function = null, failCallback: Function = null)
    {
        if (!Facebook.IsFBInit())
        {
            if (failCallback)
            {
                failCallback();
            }
            return;
        }
        if (this.preloadedRewardedVideo == null) 
        {
            this.PreLoadVideoAd();
            if (failCallback)
            {
                failCallback();
            }
            return;
        }
        Logger.log("show videoAd");
        this.preloadedRewardedVideo.showAsync().then(function ()
        {
            if (successCallback)
            {
                successCallback();
            }
            this.InitVideoAd();
        }.bind(this)).catch(function (err)
        {
            if (failCallback)
            {
                failCallback();
            }
            Logger.error('ShowVideoAdFail : ' + err.code + " :: " + err.message);
        });

    }

    ShowPicAd(successCallback: Function=null, failCallback: Function = null)
    {
        if (!Facebook.IsFBInit())
        {
            if (failCallback)
            {
                failCallback();
            }
            return;
        }
        if (this.preloadedInterstitial == null) 
        {
            this.PreLoadPicAd();
            if (failCallback)
            {
                failCallback();
            }
            return;
        }
        Logger.log("show picAd");
        this.preloadedInterstitial.showAsync().then(function ()
        {
            if (successCallback)
            {
                successCallback();
            }
            this.InitPicAd();
        }.bind(this)).catch(function (err)
        {
            if (failCallback)
            {
                failCallback();
            }
            Logger.error('ShowPicAdFail : ' + err.code + " :: " + err.message);
        });
    }
}
