import Logger from "../Logger/Logger";
import CSDictionary from "../Utility/CSDictionary";
import AppConfig from "../AppConfig/AppConfig";

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
export default class CountDownTimer
{


    //单例
    private static instance: CountDownTimer = null;
    public static GetInstance(): CountDownTimer
    {
        if (CountDownTimer.instance == null)
        {
            CountDownTimer.instance = new CountDownTimer();
        }
        return CountDownTimer.instance;
    }

    guid: number = 0;
    dic_timer: CSDictionary<number, TimerObject> = new CSDictionary<number, TimerObject>();
    removeList: Array<number> = new Array<number>();

    /**
     * 生成id
     */
    private SpawnId(): number
    {
        let id = this.guid++;
        if (this.guid > 10000000)
        {
            this.guid = 0;
        }
        return id;
    }

    /**
     * 注册一个计时器
     */
    RegisterTimer(totalTime: number,
        triggerTime: number = 0,
        onStartCallback: Function = null,
        onTriggerCallback: Function = null,
        onFinishCallback: Function = null,
        onCancelCallback: Function = null,
        onPauseCallback: Function = null,
        onResumeCallback: Function = null,
        onRunningCallbackEveryFixedTime: Function = null,
        start: boolean = true): number
    {
        let timerId: number = this.SpawnId();
        let newTimer: TimerObject = new TimerObject(timerId,
            totalTime,
            triggerTime,
            onStartCallback,
            onTriggerCallback,
            onFinishCallback,
            onCancelCallback,
            onPauseCallback,
            onResumeCallback,
            onRunningCallbackEveryFixedTime);
        this.dic_timer.Add(timerId, newTimer);
        if (start == true)
        {
            this.StartTimer(timerId);
        }
        if (triggerTime < AppConfig.fixedDeltaTime)
        {
            Logger.warn("trigger time is to short");
        }
        return timerId;
    }

    /**
     * 获取一个计时器
     * @param id 计时器ID
     */
    GetTimer(id: number): TimerObject
    {
        if (this.dic_timer.ContainsKey(id)) 
        {
            return this.dic_timer.TryGetValue(id);
        }
        else
        {
            return null;
        }
    }

    /**
     * 开始计时
     * @param id 
     */
    StartTimer(id: number): boolean
    {
        if (this.dic_timer.ContainsKey(id) && this.dic_timer.TryGetValue(id).state == TimerState.READY)
        {
            this.dic_timer.TryGetValue(id).TimerStart();
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * 暂停计时
     * @param id 
     */
    PauseTimer(id: number): boolean
    {
        if (this.dic_timer.ContainsKey(id) && this.dic_timer.TryGetValue(id).state == TimerState.RUN)
        {
            this.dic_timer.TryGetValue(id).TimerPause();
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * 恢复计时
     * @param id 
     */
    ResumeTimer(id: number): boolean
    {
        if (this.dic_timer.ContainsKey(id) && this.dic_timer.TryGetValue(id).state == TimerState.PAUSE)
        {
            this.dic_timer.TryGetValue(id).TimerResume();
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * 取消计时器
     * @param id 
     */
    CancelTimer(id: number): boolean
    {
        if (this.dic_timer.ContainsKey(id)) 
        {
            this.dic_timer.TryGetValue(id).TimerCancel();
            return true;
        }
        else
        {
            return false;
        }
    }

    RemoveTimer(id: number): boolean
    {
        if (this.dic_timer.ContainsKey(id))
        {
            this.dic_timer.Remove(id);
            return true;
        }
        else
        {
            return false;
        }
    }

    FixedUpdate(dt: number)
    {
        let timer: TimerObject;
        let timers: TimerObject[] = this.dic_timer.GetValues();
        for (let i = 0; i < timers.length; i++)
        {
            timers[i].Update(dt);
            if (timers[i].state == TimerState.FINISH || timers[i].state == TimerState.CANCEL) 
            {
                this.removeList.push(timers[i].guid);
            }
        }
        if (this.removeList.length > 0) 
        {
            for (let i = this.removeList.length - 1; i >= 0; i--)
            {
                this.dic_timer.Remove(this.removeList[i]);
                this.removeList.splice(i, 0)
            }
        }
    }

}

enum TimerState
{
    READY,
    PAUSE,
    RUN,
    FINISH,
    CANCEL,
}

export class TimerObject
{
    state: TimerState;
    guid: number;
    totalTime: number;
    leftTime: number;
    triggerTime: number;
    passTime: number;

    triggerCount: number;

    onStartCallback: Function = null;
    onTriggerCallback: Function = null;
    onFinishCallback: Function = null;
    onCancelCallback: Function = null;
    onPauseCallback: Function = null;
    onResumeCallback: Function = null;
    onRunningCallbackEveryFixedTime: Function = null;

    /**
     *
     */
    constructor(id: number,
        totalTime: number,
        triggerTime: number,
        onStartCallback: Function,
        onTriggerCallback: Function,
        onFinishCallback: Function,
        onCancelCallback: Function,
        onPauseCallback: Function,
        onResumeCallback: Function,
        onRunningCallbackEveryFixedTime: Function) 
    {
        this.state = TimerState.READY;
        this.guid = id;
        this.totalTime = totalTime;
        this.leftTime = totalTime;
        this.triggerTime = triggerTime;
        this.onStartCallback = onStartCallback;
        this.onTriggerCallback = onTriggerCallback;
        this.onFinishCallback = onFinishCallback;
        this.onCancelCallback = onCancelCallback;
        this.onPauseCallback = onPauseCallback;
        this.onResumeCallback = onResumeCallback;
        this.onRunningCallbackEveryFixedTime = onRunningCallbackEveryFixedTime;
        this.triggerCount = 0;
        this.passTime = 0;
    }

    OnStartCallback(onStartCallback: Function): TimerObject
    {
        this.onStartCallback = onStartCallback;
        return this;
    }

    OnTriggerCallback(onTriggerCallback: Function): TimerObject
    {
        this.onTriggerCallback = onTriggerCallback;
        return this;
    }

    OnFinishCallback(onFinishCallback: Function): TimerObject
    {
        this.onFinishCallback = onFinishCallback;
        return this;
    }

    OnCancelCallback(onCancelCallback: Function): TimerObject
    {
        this.onCancelCallback = onCancelCallback;
        return this;
    }

    OnPauseCallback(onPauseCallback: Function): TimerObject
    {
        this.onPauseCallback = onPauseCallback;
        return this;
    }

    OnResumeCallback(onResumeCallback: Function): TimerObject
    {
        this.onResumeCallback = onResumeCallback;
        return this;
    }

    OnRunningCallbackEveryFixedTime(onRunningCallbackEveryFixedTime: Function): TimerObject
    {
        this.onRunningCallbackEveryFixedTime = onRunningCallbackEveryFixedTime;
        return this;
    }

    Update(dt: number)
    {
        if (this.state == TimerState.RUN)
        {
            if (this.onRunningCallbackEveryFixedTime) 
            {
                this.onRunningCallbackEveryFixedTime();
            }
            this.leftTime -= dt;
            this.passTime += dt;
            if (this.leftTime <= 0 && this.totalTime > 0) 
            {
                this.TimerFinish();
            }
            else if (this.triggerTime > 0) 
            {
                while (this.passTime >= this.triggerCount * this.triggerTime) 
                {
                    if (this.onTriggerCallback) 
                    {
                        this.onTriggerCallback(this.triggerCount, this.leftTime);
                    }
                    this.triggerCount++;
                }
            }
        }
    }

    TimerFinish()
    {
        this.state = TimerState.FINISH;
        if (this.onFinishCallback) 
        {
            this.onFinishCallback();
        }
    }

    TimerPause()
    {
        this.state = TimerState.PAUSE;
        if (this.onPauseCallback) 
        {
            this.onPauseCallback();
        }
    }

    TimerResume()
    {
        this.state = TimerState.RUN;
        if (this.onResumeCallback) 
        {
            this.onResumeCallback();
        }
    }

    TimerStart()
    {
        this.state = TimerState.RUN;
        this.triggerCount++;
        this.leftTime = this.totalTime;
        this.passTime = 0;
        this.triggerCount = 0;
        if (this.onStartCallback) 
        {
            this.onStartCallback();
        }
    }

    TimerCancel()
    {
        this.state = TimerState.CANCEL;
        if (this.onCancelCallback) 
        {
            this.onCancelCallback();
        }
    }
}
