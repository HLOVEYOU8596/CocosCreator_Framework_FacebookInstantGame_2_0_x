import Form from "./Form";
import Logger from "../Logger/Logger";
import { NetConfig } from "./NetConfig";

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
export default class HttpRequest
{

    //单例
    private static instance: HttpRequest = null;
    public static GetInstance(): HttpRequest
    {
        if (HttpRequest.instance == null)
        {
            HttpRequest.instance = new HttpRequest();
        }
        return HttpRequest.instance;
    }


    public LoadRemoteJson(url: string,
        form: Form = null,
        okCallback: Function = null,
        failCallback: Function = null,
        timeoutCallback: Function = null,
        time: number = 1,
        timeout: number = NetConfig.httpGetTimeout)
    {
        let xhr: XMLHttpRequest = cc.loader.getXMLHttpRequest();
        xhr.timeout = timeout;

        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400))
            {
                let response = xhr.response;
                Logger.log(response);
                try
                {
                    let str = response;
                    var json = JSON.parse(str);
                    if (okCallback) 
                    {
                        okCallback(json);
                    }
                }
                catch (e)
                {
                    Logger.error(e);
                    if (failCallback) 
                    {
                        failCallback();
                    }
                }

            }
        }


        //出错
        xhr.onerror = function (error)
        {
            if (failCallback)
            {
                failCallback(error);
            }
        }

        //超时
        if (timeoutCallback)
        {
            xhr.ontimeout = function () { timeoutCallback(); }
        }
        else 
        {
            xhr.ontimeout = function ()
            {
                if (time < NetConfig.httpRequestTryTime)
                {
                    //重新发一次请求
                    HttpRequest.GetInstance().LoadRemoteJson(url, form, okCallback, failCallback, timeoutCallback, time + 1, timeout);
                }
                else
                {
                    //弹出网络问题提示框
                }
            }
        }

        let p: string = "";
        if (form)
        {
            p = form.ToRequestPrama();
        }

        xhr.open("GET", url + p);
        Logger.log(url + p);
        xhr.send(null);
    }



    //发送http请求
    public SendAHttpRequest(url: string,
        form: Form = null,
        okCallback: Function = null,
        errorCallback: Function = null,
        failCallback: Function = null,
        timeoutCallback: Function = null,
        time: number = 1,
        timeout: number = NetConfig.httpGetTimeout)
    {
        let xhr: XMLHttpRequest = cc.loader.getXMLHttpRequest();
        xhr.timeout = timeout;
        
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400))
            {
                var response = xhr.responseText;
                Logger.log(response);
                let json = JSON.parse(response);
                if (json.status == "ok")
                {
                    if (okCallback)
                    {
                        okCallback(json.msg, json.result)
                    }
                }
                else if (json.status == "error")
                {
                    if (errorCallback)
                    {
                        errorCallback(json.msg, json.result);
                    }
                }
            }
        }



        //出错
        xhr.onerror = function (error)
        {
            if (failCallback)
            {
                failCallback(error);
            }
        }

        //超时
        if (timeoutCallback)
        {
            xhr.ontimeout = function () { timeoutCallback(); }
        }
        else 
        {
            xhr.ontimeout = function ()
            {
                if (time < NetConfig.httpRequestTryTime)
                {
                    //重新发一次请求
                    HttpRequest.GetInstance().SendAHttpRequest(url, form, okCallback, errorCallback, failCallback, timeoutCallback, time + 1, timeout);
                }
                else
                {
                    //弹出网络问题提示框
                }
            }
        }


        let p: string = "";
        if (form)
        {
            p = form.ToRequestPrama();
        }

        xhr.open("GET", url + p);
        Logger.log(url + p);

        xhr.send(null);


    }


    //发送http请求 上传json数据
    // public SendJsonData(url: string,
    //     form: Form = null,
    //     json: any =null,
    //     okCallback: Function = null,
    //     errorCallback: Function = null,
    //     failCallback: Function = null,
    //     timeoutCallback: Function = null,
    //     time: number = 1,
    //     timeout: number = GameConfig.httpRequestTimeOut)
    // {
    //     let xhr: XMLHttpRequest = cc.loader.getXMLHttpRequest();
    //     xhr.timeout = timeout;

    //     //设置发送数据的请求格式
    //     xhr.setRequestHeader('content-type', 'application/json');
    //     xhr.onreadystatechange = function ()
    //     {
    //         if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
    //             var response = xhr.responseText;
    //             Logger.log(response);
    //             let json = JSON.parse(response);
    //             if (json.status == "ok") {
    //                 if (okCallback) {
    //                     okCallback(json.msg, json.result)
    //                 }
    //             }
    //             else if (json.status == "error") {
    //                 if (errorCallback) {
    //                     errorCallback(json.msg, json.result);
    //                 }
    //             }
    //         }
    //     }



    //     //出错
    //     xhr.onerror = function (error)
    //     {
    //         if (failCallback) {
    //             failCallback(error);
    //         }
    //     }

    //     //超时
    //     if (timeoutCallback) {
    //         xhr.ontimeout = function(){timeoutCallback();}
    //     }
    //     else 
    //     {
    //         xhr.ontimeout = function ()
    //         {
    //             if (time < GameConfig.httpRequestTryTime) {
    //                 //重新发一次请求
    //                 HttpRequest.GetInstance().SendAHttpRequest(url, form, okCallback, errorCallback, failCallback, timeoutCallback,time + 1, timeout);
    //             }
    //             else {
    //                 //弹出网络问题提示框
    //             }
    //         }
    //     }


    //     let p: string = "";
    //     if (form) {
    //         p = form.ToRequestPrama();
    //     }

    //     xhr.open("POST", url + p);
    //     Logger.log(url+p);

    //     xhr.send(json);


    // }
}
