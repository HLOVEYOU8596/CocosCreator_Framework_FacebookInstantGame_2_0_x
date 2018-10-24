import { DateUtility } from "../Utility/DateUtility";



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

export enum LogLevel
{
    // 用于打印所有调试信息
    Debug = 0,
    // 原则上所有的代码分支都有一行这条日志
    Log = 1,
    // 一般来说线上可能是这种日志级别，打印一些标志性信息
    Info = 2,
    // 一般来跟预期不一致的异常都应该打印这个结果
    Warn = 3,
    // 一般来说错误都应该打印这个级别的日志，注意这个级别的日志会把调用栈信息也打印出来
    Error = 4,
}

@ccclass
export default class Logger
{

    static curLevel = LogLevel.Debug;
    private static levelDesc: string[] = ["DEBUG", "LOG", "INFO", "WARN", "ERROR"];

    static SetLevel(level: LogLevel)
    {
        Logger.curLevel = level;
    }

    // 红底红字
    static error(err?: any, ...optionalParams: any[])
    {
        Logger.myLog(LogLevel.Error, err, ...optionalParams);
        
    }

    // 白底黄字
    static warn(warn?: any, ...optionalParams: any[])
    {
        Logger.myLog(LogLevel.Warn, warn, ...optionalParams);
        
    }

    // 白底黑字
    static log(log?: any, ...optionalParams: any[])
    {
        Logger.myLog(LogLevel.Log, log, ...optionalParams);
        
    }

    // 黄底黄字
    static debug(debug?: any, ...optionalParams: any[])
    {
        Logger.myLog(LogLevel.Debug, debug, ...optionalParams);
        
    }

    // 白底紫字
    static info(info?: any, ...optionalParams: any[])
    {
        Logger.myLog(LogLevel.Info, info, ...optionalParams);
        
    }

    private static myLog(level: LogLevel, msg?: any, ...optionalParams: any[])
    {
        if (level < Logger.curLevel)
        {
            return;
        }
        let logTitle = DateUtility.GetDateStr(Date.now()) + "[" + Logger.levelDesc[level] + "]";
        switch (level)
        {
            case LogLevel.Debug:
                console.debug(logTitle, msg, ...optionalParams);
                break;
            case LogLevel.Log:
                console.log(logTitle, msg, ...optionalParams);
                break;
            case LogLevel.Info:
                console.info(logTitle, msg, ...optionalParams);
                break;
            case LogLevel.Warn:
                console.warn(logTitle, msg, ...optionalParams);
                break;
            case LogLevel.Error:
                console.error(logTitle, msg, ...optionalParams);
                break;

        }
    }
}
