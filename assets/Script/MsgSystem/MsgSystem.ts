
import Logger from "../Logger/Logger";
import CSDictionary from "../Utility/CSDictionary";

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
export default class MsgSystem {


    //单例
    private static instance: MsgSystem = null;
    public static GetInstance(): MsgSystem
    {
        if (MsgSystem.instance == null) {
            MsgSystem.instance = new MsgSystem();
        }
        return MsgSystem.instance;
    }

    msgID:number= 0;
    //监听者列表
    msgList:Array<MsgEvent>=new Array<MsgEvent>();
    //事件列表
    listenerMap:CSDictionary<string,Array<MsgListener>>=new CSDictionary<string,Array<MsgListener>>();

    AddListener(msgType:string, callback:Function, target,times:number=-1)
    {
        //回调对象
        let msgListener:MsgListener=new MsgListener();
        msgListener.callback=callback;
        msgListener.target=target;
        msgListener.times=times;
        

        let listener = this.listenerMap.TryGetValue(msgType);
        if (listener!=null) {
            listener.push(msgListener);
        }
        else{
            let arr = new Array(msgListener);
            this.listenerMap.Add(msgType, arr);
        }
    }

    /**
     * 发送消息
     * @param msgType 消息名称
     * @param msgData 消息参数
     * @param delayTime 延迟执行 毫秒
     */
    PostMsg(msgType:string, msgData=null,delayTime:number=0 )
    {
        Logger.log("Post Msg:"+msgType);
        
        this.msgID++;
        if (this.msgID > 100000000) {
            this.msgID = 1;
        }
        let listener = this.listenerMap.TryGetValue(msgType);
        if (listener!=null) 
        {
            for (let j = 0; j < listener.length; j++) {
                setTimeout(function(){listener[j].callback(msgData);}.bind(this),delayTime); 
                if(listener[j].times>0)
                {
                    listener[j].times--;
                    if (listener[j].times=0) 
                    {
                        //移除这个监听者
                        this.DeleteListenerByTarget(msgType, listener[j].target)
                    }
                }
            }
            return this.msgID;
        }
        else
        {
            Logger.warn("message:"+msgType+" have no listener");
            return -1;
        }
        
    }

    //删除一条消息
    DeleteMsg(msgID)
    {
        for (let index = 0; index < this.msgList.length;index++) {
            if (this.msgList[index].id==msgID) {
                this.msgList.splice(index,1);
                break;
            }
        }
    }
    //删除回调,删除该消息类型的所有回调
    DeleteListenerByType(msgType)
    {
        if (this.listenerMap.ContainsKey(msgType)) {
            this.listenerMap.Remove(msgType);
        }
    }

    //删除回调,删除该消息类型的一个回调
    DeleteListenerByTarget(msgType, target)
    {
        let listener = this.listenerMap.TryGetValue(msgType);
        if (listener!=null) {
            for (let index = 0; index < listener.length; index++) {
                if (listener[index].target===target) {
                    listener.splice(index,1);
                    break;
                }
            }
        }
    }

    
}

class MsgEvent
{
    id:number;
    msgType:string;
    data:any;
    delayTime:number;
}

class MsgListener
{
    callback:Function;
    target;
    times:number;
}
