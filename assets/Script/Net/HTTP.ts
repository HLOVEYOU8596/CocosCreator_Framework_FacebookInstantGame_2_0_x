import { NetConfig, HTTP_CODE } from "./NetConfig";
import Logger from "../Logger/Logger";
import { StringUtil } from "../Utility/StringUtil";

/*
 * @Author: zhy 
 * @Date: 2018-01-15 15:27:40 
 * @Desc: function
 */


enum HallRequestType
{
    POST = 1,
    GET = 2,
    PUT = 3,
    DELETE = 4,
}

export class HTTP
{

    //单例
    private static instance: HTTP = null;
    public static GetInstance(): HTTP
    {
        if (HTTP.instance == null)
        {
            HTTP.instance = new HTTP();
        }
        return HTTP.instance;
    }

    baseURL: string = NetConfig.httpUrl;

    private send(requestType: HallRequestType, url: string, param: any = {}, successCallback: Function=null, failCallback: Function=null, timeoutCallback: Function=null, authorization:any=null,time:number=1,err: boolean = false)
    {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4)
            {
                if (xhr.status >= 200 && xhr.status < 400)
                {
                    let respone = xhr.responseText;
                    try 
                    {
                        Logger.debug("=================收到http返回数据begin============");
                        Logger.debug("status:" + xhr.status);
                        Logger.debug(respone);
                        Logger.debug("=================收到http返回数据end==============");
                        let data = JSON.parse(respone);
                        if (!err && data.code == HTTP_CODE.SUCCEED)
                        {
                            if (successCallback)
                            {
                                successCallback(data);
                            }
                        } 
                    } 
                    catch (error) {
                        Logger.error(error);
                        if (failCallback) 
                        {
                            failCallback();
                        }
                        else
                        {
                            //默认的错误处理
                        }
                    }
                }
                else 
                {
                    Logger.error("status:" + xhr.status);
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
            else
            {
                //默认的错误处理
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
                    this.send(requestType, url, param, successCallback, failCallback, timeoutCallback, authorization,time+1,err);
                }
                else
                {
                    //弹出网络问题提示框
                    Logger.error("网络无响应");
                }
            }.bind(this);
        }

        if (url.substr(0, 4) != "http")
        {
            url = this.baseURL + url;
        }
        Logger.debug("====================发送http请求begin==================");
        Logger.debug("url:" + url);
        Logger.debug(param);
        Logger.debug("====================发送http请求end==================");
        switch (requestType)
        {
            case HallRequestType.GET:
                xhr.open("GET", url, true);
                xhr.timeout = NetConfig.httpGetTimeout;
                break;
            case HallRequestType.POST:
                xhr.open("POST", url, true);
                xhr.timeout = NetConfig.httpPostTimeout;
                xhr.setRequestHeader("Content-Type", "application/json");
                break;
            case HallRequestType.PUT:
                xhr.open("PUT", url, true);
                xhr.timeout = NetConfig.httpPutTimeout;
                xhr.setRequestHeader("Content-Type", "application/json");
                break;
            case HallRequestType.DELETE:
                xhr.open("DELETE", url, true);
                xhr.timeout = NetConfig.httpDeleteTimeout;
                xhr.setRequestHeader("Content-Type", "application/json");
                break;
        }
        if (authorization != null)
        {
            xhr.setRequestHeader("authorization", authorization);
        }
        if (requestType == HallRequestType.GET)
        {
            xhr.send();
        } else
        {
            xhr.send(JSON.stringify(param));
        }
    }

    private getUrl(url: string, param: any = null): string
    {
        if (param)
        {
            let paramStr = "";
            for (let key in param)
            {
                paramStr += StringUtil.Format("&{0}={1}", key, param[key]);
            }
            url += "?" + paramStr.substr(1);
        }
        return url;
    }

    // getFile(url: string, successCallback: Function=null, failCallback: Function=null, timeoutCallback: Function=null, authorization:any=null,err: boolean = false)
    // {
    //     this.send(HallRequestType.GET, url, callback, null, "file", err);
    // }

    get(url: string,param:any={}, successCallback: Function=null, failCallback: Function=null, timeoutCallback: Function=null, authorization:any=null,time:number=1,err: boolean = false)
    {
        url = this.getUrl(url, param);
        this.send(HallRequestType.GET, url,param, successCallback,failCallback,timeoutCallback,authorization,time,err);
    }

    
    post(url: string,param:any={}, successCallback: Function=null, failCallback: Function=null, timeoutCallback: Function=null, authorization:any=null,time:number=1,err: boolean = false)
    {
        this.send(HallRequestType.POST, url,param, successCallback,failCallback,timeoutCallback,authorization,time,err);
    }

    put(url: string,param:any={}, successCallback: Function=null, failCallback: Function=null, timeoutCallback: Function=null, authorization:any=null,time:number=1,err: boolean = false)
    {
        this.send(HallRequestType.PUT, url,param, successCallback,failCallback,timeoutCallback,authorization,time,err);
    }

    delete(url: string,param:any={}, successCallback: Function=null, failCallback: Function=null, timeoutCallback: Function=null, authorization:any=null,time:number=1,err: boolean = false)
    {
        this.send(HallRequestType.DELETE, url,param, successCallback,failCallback,timeoutCallback,authorization,time,err);
    }
}

