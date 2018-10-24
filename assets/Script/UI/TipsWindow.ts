import PanelBase from "../UIManager/PanelBase";
import UIManager from "../UIManager/UIManager";
import LocalizationComponent from "../Localization/LocalizationComponent";


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

export const TipsWindowStyle =cc.Enum
    ({
        OK_CANCEL:0,
        CONFIRM:1,
        NO_BUTTON:2,
        CLOSE:3
    });

@ccclass
export default class TipsWindow extends PanelBase {

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

    @property(cc.Node)
    frameRoot:cc.Node=null;
    @property(cc.Button)
    okButton:cc.Button=null;
    @property(cc.Button)
    cancelButton:cc.Button=null;
    @property(cc.Button)
    confirmButton:cc.Button=null;
    @property(cc.Button)
    closeButton:cc.Button=null;

    @property(cc.RichText)
    tipInfo:cc.RichText=null;
    @property(LocalizationComponent)
    tipInfoLocal:LocalizationComponent=null;
    
    
    
    

    enterCallback:Function=null;
    exitCallback:Function=null;
    okCallback:Function=null;
    cancelCallback:Function=null;
    confirmCallback:Function=null;
    closeCallback:Function=null;


    appearAction:cc.Action=null;
    disappearAction:cc.Action=null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        //this.tipInfoLocal=this.node.getChildByName("tips").getComponent(LocalizationRichText);

        this.closeButton.node.on("click",this.OnCloseClick.bind(this));
        this.confirmButton.node.on("click",this.OnConfirmClick.bind(this));
        this.okButton.node.on("click",this.OnOkClick.bind(this));
        this.cancelButton.node.on("click",this.OnCancelClick.bind(this));

        this.enterCallback=null;
        this.exitCallback=null;
        this.okCallback=null;
        this.closeCallback=null;
        this.cancelCallback=null;
        this.confirmCallback=null;

        this.appearAction=cc.scaleTo(0.5,1,1).easing(cc.easeBackOut());
        this.disappearAction=cc.sequence(cc.scaleTo(0.3,0,0),cc.callFunc(function(){this.SetActive(false)}.bind(this)));
    }
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    SetTipsStyle(style)
    {
        switch (style) {
            case TipsWindowStyle.NO_BUTTON:
                this.okButton.node.active=false;
                this.cancelButton.node.active=false;
                this.confirmButton.node.active=false;
                this.closeButton.node.active=false;
                break;
            case TipsWindowStyle.OK_CANCEL:
                this.okButton.node.active=true;
                this.cancelButton.node.active=true;
                this.confirmButton.node.active=false;
                this.closeButton.node.active=false;
                break;
            case TipsWindowStyle.CLOSE:
                this.okButton.node.active=false;
                this.cancelButton.node.active=false;
                this.confirmButton.node.active=false;
                this.closeButton.node.active=true;
                break;
            case TipsWindowStyle.CONFIRM:
                this.okButton.node.active=false;
                this.cancelButton.node.active=false;
                this.confirmButton.node.active=true;
                this.closeButton.node.active=false;
                break;
        
        }
    }

    OnEnter()
    {
        this.frameRoot.scale=0;
        this.SetActive(true);
        UIManager.instance.isTipsWindowActive=true;
        if (this.enterCallback!=null) 
        {
            this.enterCallback();
        }

        this.frameRoot.runAction(this.appearAction);
    }

    OnPause()
    {
        
    }

    OnResume()
    {
        
    }

    OnExit()
    {
        //this.SetActive(false)

        this.frameRoot.runAction(this.disappearAction);
        if (this.exitCallback!=null) 
        {
            this.exitCallback();    
        }
        this.enterCallback=null;
        this.exitCallback=null;
        this.okCallback=null;
        this.closeCallback=null;
        this.cancelCallback=null;
        this.confirmCallback=null;

        UIManager.instance.isTipsWindowActive=false;
    }

    OnCloseClick()
    {
        
        if (this.closeCallback!=null) {
            this.closeCallback();   
        }
        UIManager.instance.PopTipsWindow();
    }

    OnConfirmClick()
    {
        
        if (this.confirmCallback!=null) {
            this.confirmCallback();   
        }
        UIManager.instance.PopTipsWindow();
    }

    OnOkClick()
    {
        
        if (this.okCallback!=null) {
            this.okCallback();   
        }
        UIManager.instance.PopTipsWindow(); 
    }

    OnCancelClick()
    {
        
        if (this.cancelCallback!=null) {
            this.cancelCallback();   
        }
        UIManager.instance.PopTipsWindow();
    }

}
