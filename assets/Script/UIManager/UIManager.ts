import PanelBase, { PanelType } from "./PanelBase";
import TipsWindow from "../UI/TipsWindow";
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
export default class UIManager extends cc.Component 
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

    static instance: UIManager = null;

    @property(cc.Node)
    uiRoot: cc.Node = null;

    @property([cc.Prefab])
    panelPrefabs: cc.Prefab[] = [];


    _panelDict: { [key: number]: PanelBase } = {};


    _panelStack: Array<PanelBase> = new Array<PanelBase>();

    //@property(cc.Integer)
    _panelIndex: number = 0;

    //@property(cc.Integer)
    _pushingPanelType = -1;

    isTipsWindowActive: boolean = false;




    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        UIManager.instance = this;
    }
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}

    PreloadUIPanel()
    {
        this.LoadUIPanel();
        if (PanelType.PanelCount <= 1)
        {
            return;
        }
        this.schedule(this.LoadUIPanel.bind(this), 0, PanelType.PanelCount - 2, 0);
    }

    private LoadUIPanel()
    {
        cc.log(this._panelIndex + " panel loading");
        let uiPanel: cc.Node = cc.instantiate(this.panelPrefabs[this._panelIndex]);

        if (uiPanel == null)
        {
            console.error(this._panelIndex + " panel not exist");
            //PanelType
            return;
        }
        uiPanel.setSiblingIndex(0);


        let uiPanelScript: PanelBase = uiPanel.getComponent(PanelBase);

        if (uiPanelScript.isPreload == true)
        {
            uiPanel.parent = this.uiRoot;
            uiPanel.active = false;
            this._panelDict[uiPanelScript.panelType] = uiPanelScript;
            //this._panelDict[uiPanelScript.panelType].SetActive(false);
        }
        else
        {
            this._panelDict[uiPanelScript.panelType] = null;
            uiPanel.destroy();
        }

        this._panelIndex++;

        //加载完成后发送完成消息
        if (this._panelIndex>=PanelType.PanelCount) 
        {
            MsgSystem.GetInstance().PostMsg(MsgDefine.preLoadUIPanelFinish);    
        }
    }

    GetPanel(type: number): PanelBase
    {
        let panelTemp: PanelBase = this._panelDict[type];
        if (panelTemp == null)
        {
            let uiPanel: cc.Node = cc.instantiate(this.panelPrefabs[type]);
            if (uiPanel == null)
            {
                console.error("Can't find panel " + type);
            }
            uiPanel.parent = this.uiRoot;
            this._panelDict[type] = uiPanel.getComponent(PanelBase);
            panelTemp = this._panelDict[type];
        }
        return panelTemp;
    }

    PushPanel(type: number, delay: number = 0)
    {
        if (this._panelStack.length > 0)
        {
            let topPanel: PanelBase = this._panelStack[this._panelStack.length - 1];
            topPanel.OnPause();
        }
        this._pushingPanelType = type;
        if (delay <= 0)
        {
            this._Push();
        }
        else
        {
            this.scheduleOnce(this._Push, delay);
        }

    }

    _Push()
    {
        let panelTemp: PanelBase = this.GetPanel(this._pushingPanelType);
        if (panelTemp == null)
        {
            console.error("Can't find panel " + this._pushingPanelType);
            return;
        }
        panelTemp.OnEnter();
        this._panelStack.push(panelTemp);
        panelTemp.node.setSiblingIndex(this.uiRoot.childrenCount);
        this._pushingPanelType = -1;
    }

    PopPanel(delay: number = 0)
    {
        if (this._panelStack.length <= 0)
        {
            return;
        }
        if (delay <= 0)
        {
            this._Pop();
        }
        else
        {
            this.scheduleOnce(this._Pop, delay);
        }

    }

    PopTipsWindow()
    {
        if (this.isTipsWindowActive == true)
        {
            this.PopPanel();
        }
    }

    _Pop()
    {
        if (this._panelStack.length <= 0)
        {
            return;
        }
        let topPanel1: PanelBase = this._panelStack.pop();
        topPanel1.OnExit();
        if (topPanel1.isDontDestroy == false)
        {
            this._panelDict[topPanel1.panelType] = null;
            topPanel1.node.destroy();
        }
        if (this._panelStack.length <= 0)
        {
            return;
        }
        let topPanel2: PanelBase = this._panelStack[this._panelStack.length - 1];
        topPanel2.OnResume();
    }

    PopAllPanel(delay: number = 0)
    {
        let times: number = this._panelStack.length;
        for (let i = 0; i < times; i++)
        {
            if (delay <= 0)
            {
                this._Pop();
            }
            else
            {
                this.scheduleOnce(this._Pop, delay);
            }
        }
    }

    // ShowTipsWindow(tipsWindowStyle, term: string,
    //     okCallback: Function = null,
    //     cancelCallback: Function = null,
    //     confirmCallback: Function = null,
    //     closeCallback: Function = null,
    //     enterCallback: Function = null,
    //     exitCallback: Function = null)
    // {
    //     let tipsWindow: TipsWindow = (UIManager.instance.GetPanel(PanelType.TipsWindow)) as TipsWindow;
    //     tipsWindow.SetTipsStyle(tipsWindowStyle);
    //     tipsWindow.tipInfo.string=term;
    //     tipsWindow.okCallback = okCallback;
    //     tipsWindow.cancelCallback = cancelCallback;
    //     tipsWindow.confirmCallback = confirmCallback;
    //     tipsWindow.closeCallback = closeCallback;
    //     tipsWindow.enterCallback = enterCallback;
    //     tipsWindow.exitCallback = exitCallback;

    //     UIManager.instance.PushPanel(PanelType.TipsWindow);
    //     return tipsWindow;
    // }


    ShowTipsWindow(tipsWindowStyle, term: string, arg:Array<any> = null,
        okCallback: Function = null,
        cancelCallback: Function = null,
        confirmCallback: Function = null,
        closeCallback: Function = null,
        enterCallback: Function = null,
        exitCallback: Function = null)
    {
        let tipsWindow: TipsWindow = (UIManager.instance.GetPanel(PanelType.TipsWindow)) as TipsWindow;
        tipsWindow.SetTipsStyle(tipsWindowStyle);
        tipsWindow.tipInfoLocal.SetTerm(term, arg);
        tipsWindow.okCallback = okCallback;
        tipsWindow.cancelCallback = cancelCallback;
        tipsWindow.confirmCallback = confirmCallback;
        tipsWindow.closeCallback = closeCallback;
        tipsWindow.enterCallback = enterCallback;
        tipsWindow.exitCallback = exitCallback;

        UIManager.instance.PushPanel(PanelType.TipsWindow);
        return tipsWindow;
    }


}
