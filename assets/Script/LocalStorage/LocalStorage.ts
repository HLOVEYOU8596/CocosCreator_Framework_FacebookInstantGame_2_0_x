

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
export default class LocalStorage
{

    //单例
    // private static instance: LocalStorage = null;
    // public static GetInstance(): LocalStorage
    // {
    //     if (LocalStorage.instance == null) {
    //         LocalStorage.instance = new LocalStorage();
    //     }
    //     return LocalStorage.instance;
    // }

    static GetItem(key:string,defaultValue:any):any
    {
        let value=cc.sys.localStorage.getItem(key);
        if (value!=undefined) 
        {
            return value;    
        }
        else
        {
            return defaultValue;
        }
    }

    static SetItem(key:string,value:any)
    {
        cc.sys.localStorage.setItem(key,value);
    }

    

}
