import Logger from "../Logger/Logger";

/*
 * @Author: Suifeng 
 * @Date: 2018-01-16 14:29:06 
 * @Desc: 网络
 */

//import { h } from "../common/H";
//import { HallAlert } from "../common/HallAlert";
//import { HallUserModel } from "../view/login/HallUserModel";


export class Net {
    private static instance: Net = null;
    private reconnectCount: number = 0;
    private socket: any = null;
    private static routeIndex: number = 0;
    private listeners: any = {};
    static GetInstance(): Net {
        if (this.instance == null) {
            this.instance = new Net();
        }
        return this.instance;
    }
    //连接登陆服务器
    initSocket(url: string, callback: Function) {
        let opts = {
            'reconnection': false,
            'force new connection': true,
            'transports': ['websocket', 'polling']
        }
        this.socket = io.connect(url, opts);
        this.socket.on('connect', function () {
            this.onConnect();
            if (callback) {
                callback();
            }
        }.bind(this));
        //window.socket = this.socket;
        this.socket.on("message", this.onMessage.bind(this));
        this.socket.on("command", this.onCommand.bind(this));
        this.socket.on("disconnect", this.onDisconnect.bind(this));
    }

    onCommand(data) {
        Logger.debug("====================收到socket返回数据begin==================");
        Logger.debug("routeSign:" + data.command);
        Logger.debug(data);
        Logger.debug("====================收到socket返回数据end==================");
        let listener = this.listeners[data.command];
        if(!listener){
            return;
        }
        if (data.status && data.status != 1) {
            //HallAlert.show(data.message);
            if (listener.err && listener.callback) {
                listener.callback(data);
            }
        } else if (listener.callback) {
            listener.callback(data);
        }
    }

    onConnect() {
        Logger.debug("connect");
    }

    onMessage(data) {
        Logger.debug("message", data);
    }

    onDisconnect(data) {
        Logger.debug("disconnect", data);
    }

    // 关闭连接
    disconnect() {
        //h.pomelo.disconnect();
        this.socket = null;
    }

    // 模拟后端发送数据
    simulateSendData(data){
        this.onCommand(data);
    }
    // 发送数据
    sendData(route: string, callback: Function = null, data: any = null, err: boolean = false) {
        let routeSign: string = Net.getRouteSign(route);
        data = data || {};
        //data.token = HallUserModel.getInstance().getToken();
        //data.orgi = "beimi";
        Logger.debug("====================发送socket请求begin==================");
        Logger.debug("routeSign:" + routeSign);
        Logger.debug(data);
        Logger.debug("====================发送socket请求end==================");
        this.socket.emit(route, JSON.stringify(data));
        this.listeners[route] = { err: err, callback: callback };
    }

    regPush(route: string, callback: Function, sign: string = "") {
        this.listeners[sign + route] = { sign: sign, route: route, callback: callback };
    }

    unregPush(route:string, sign:string = ""){
        delete this.listeners[sign + route];
    }

    static getRouteSign(route: string) {
        return route + "_" + ++this.routeIndex;
    }

    getUrl(host: string, port: string): string {
        let url: string = 'ws://' + host;
        if (port) {
            url += ':' + port;
        }
        return url;
    }
}