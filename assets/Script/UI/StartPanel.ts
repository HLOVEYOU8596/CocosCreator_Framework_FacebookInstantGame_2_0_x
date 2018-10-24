import PanelBase, { PanelType } from "../UIManager/PanelBase";
import UIManager from "../UIManager/UIManager";




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
export default class StartPanel extends PanelBase
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


    @property(cc.Button)
    startButton: cc.Button = null;
    @property(cc.Button)
    shopButton: cc.Button = null;
    @property(cc.Button)
    rankButton: cc.Button = null;
    @property(cc.Button)
    shareButton: cc.Button = null;
    @property(cc.Button)
    playWithFriendsButton: cc.Button = null;

    @property(cc.Sprite)
    playerSkin: cc.Sprite = null;

    @property(cc.Label)
    gameCoin: cc.Label = null;
    @property(cc.Node)
    gameLogo: cc.Node = null;
    @property(cc.Sprite)
    playerFace: cc.Sprite = null;
    @property(cc.Label)
    playerRankInFriends: cc.Label = null;


    @property(cc.Prefab)
    challengePlayerPrefab: cc.Prefab = null;
    @property(cc.Node)
    challengeRoot: cc.Node = null;
    @property(cc.Node)
    challengeFriendsNode: cc.Node = null;
    @property(cc.Node)
    playerFaceFrameNode: cc.Node = null;
    @property(cc.Node)
    scrollView:cc.Node=null;

    @property(cc.Node)
    screenShotRange: cc.Node = null;

    enterTime: number = 0;

    startButtonAction: cc.Action = null;

    isSpawnedFriends: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        
    }
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}


    OnEnter()
    {
        this.AddBackKeyResponse();
        this.SetActive(true);     
    }

    OnPause()
    {
        this.RemoveBackKeyResponse();
    }

    OnResume()
    {
        this.AddBackKeyResponse();
    }

    OnExit()
    {
        this.RemoveBackKeyResponse();
        this.SetActive(false)
    }

    

}
