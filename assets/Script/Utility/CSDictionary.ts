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


//const { ccclass, property } = cc._decorator;

//@ccclass
export default class CSDictionary<KT, VT> {

    private keys: KT[] = [];
    private values: VT[] = [];
    //public constructor() { };

    Add(key: KT, value: VT)
    {
        if (!this.ContainsKey(key)) {
            this.keys.push(key);
            this.values.push(value);
        }
        else {
            Logger.warn("Already contain key:" + key);
        }

    }

    Remove(key: KT): boolean
    {

        var index = this.keys.indexOf(key, 0);
        if (index != -1) {
            this.keys.splice(index, 0);
            this.values.splice(index, 0);
            return true;
        }
        else {
            Logger.warn("can't find key:" + key);
            return false;
        }


    }

    clear()
    {
        this.keys.splice(0, this.keys.length);
        this.values.splice(0, this.values.length);
    }


    TryGetValue(key: KT): VT
    {
        var index = this.keys.indexOf(key, 0);
        if (index != -1) {
            return this.values[index];
        }
        return null;
    }
    /**判断字典中是否存在对应key的值，返回boolean */
    ContainsKey(key: any): boolean
    {
        // let ks = this.keys;
        // for (let i = 0; i < ks.length; ++i) {
        //     if (ks[i] == key) {
        //         return true;
        //     }
        // }
        // return false;

        let index=this.keys.indexOf(key);
        if (index!=-1) 
        {
            return true;    
        }
        else
        {
            return false;
        }
    }

    SetDicValue(key: any, value: any): boolean
    {
        var index = this.keys.indexOf(key, 0);
        if (index != -1) {
            this.keys[index] = key;
            this.values[index] = value;
            return true;
        }
        Logger.warn("can't find key:" + key);
        return false;
    }

    GetKeys(): KT[]
    {
        return this.keys;
    }
    GetValues(): VT[]
    {
        return this.values;
    }


}
