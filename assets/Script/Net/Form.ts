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
export default class Form
{

    keys = new Array();
    values = new Array();
    
    /**
     * 添加键值对
     * @param key 
     * @param value 
     */
    public Set(key: string, value: number | string | boolean)
    {
        if (this.values[key] == null)
        {
            this.keys.push(key);
        }
        this.values[key] = value;
    }

    /**
     * 添加键值对
     * @param key 
     * @param value 
     */
    public SetArray<T>(key:string,value:Array<T>)
    {
        if (this.values[key]==null) 
        {
            this.keys.push(key);
        }
        this.values[key]=value;
    }

    
    /**
     * 获取键对应的值
     * @param key 
     */
    public Get(key: string): number | string | boolean 
    {
        return this.values[key];
    }

    /**
     * 获取键对应的值
     * @param key 
     */
    public GetArray<T>(key:string):Array<T>
    {
        return this.values[key];
    }
    
    /**
     * 去除键值对
     * @param key 
     */
    public Remove(key: string)
    {
        this.values[key] = null;
    }

    /**
     * 判断键值元素是否为空
     * @param key 
     */
    public IsEmpty(): boolean
    {
        return this.keys.length == 0;
    }

    
    /**
     * 获取键值元素大小
     * @param key 
     */
    public Size(): number
    {
        return this.keys.length;
    }
    
    /**
     * 转换成Get请求的参数
     */
    public ToRequestPrama(): string 
    {
        let prama: string = "?";
        prama = "?"
        for (let i = 0; i < this.keys.length; i++) 
        {
            if (i > 0) 
            {
                prama += "&";
            }
            
            if (Array.isArray(this.values[this.keys[i]]))
            {
                let arr=this.values[this.keys[i]];
                prama+=this.keys[i]+"=";
                for(let i=0;i<arr.length;i++)
                {
                    if (i>0) 
                    {
                        prama+=","
                    }
                    prama+=arr[i];
                }
            }
            else
            {
                prama += (this.keys[i] + "=" + this.values[this.keys[i]])
            }
        }
        return prama;
    }



}
