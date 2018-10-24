import Facebook from "./Facebook";

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
export default class FacebookAnalytics extends cc.Component {

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

    //通用
    static watchPicAd:string="watchPicAd";//观看插页广告
    static watchVideoAd:string="watchVideoAd";//观看视频广告
    static noWatchPicAd:string="noWatchPicAd";//不观看插页广告
    static noWatchVideoAd:string="noWatchVideoAd";//不观看视频广告

    static shareGame:string="shareGame";//分享游戏
    static shareGameSuccess:string="shareGameSuccess";
    static shareGameFail:string="shareGameFail";
    static rejectShare:string="rejectShare";

    static inviteFriend:string="inviteFriend";//邀请好友
    static inviteFriendSuccess:string="inviteFriendSuccess";
    static inviteFriendFail:string="inviteFriendFail";

    static addToDesktopSuccess:string="addToDeskTopSuccess"//将添加到桌面
    static addToDesktopFail:string="addToDesktopFail";//添加桌面失败

    static showPlayWithFriendWindow:string="showPlayWithFriendWindow";

    static clickRecommendGame:string="clickRecommendGame";
    static showRecommendWindow:string="showRecommendWindow";

    static buySkin:string="buySkin";

    static startPk:string="startPk";
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    
}
