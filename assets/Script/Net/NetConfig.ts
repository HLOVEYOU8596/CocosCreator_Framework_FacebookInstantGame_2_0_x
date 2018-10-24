/*
 * @Author: Suifeng
 * @Date: 2018-01-16 20:17:57
 * @Desc: 网络配置
 */

 export enum HTTP_CODE
 {
    NET_ERROR = -2,
    ERROR = -1,
    SUCCEED = 0,
 }

 export class NetConfig
 {
    static httpRequestTryTime:number=2;//请求尝试次数
    static httpGetTimeout: number = 3000;
    static httpPostTimeout: number = 5000;
    static httpPutTimeout: number = 5000;
    static httpDeleteTimeout:number = 5000;
    static wsUrl: string = "ws://118.25.40.163:8088";
    static httpUrl: string = "http://www.baidu.com";
 }

 export class GameUrl
 {
     static getLocalizationAsset="";
 }

