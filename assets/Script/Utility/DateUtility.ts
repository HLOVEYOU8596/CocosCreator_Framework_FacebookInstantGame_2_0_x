// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
* 日期处理公共类
*
* @export
* @class DateUtility
*/
export class DateUtility {
    /**
     * 获取当前日期:格式如20170718
     *
     * @returns{string}
     * @memberofBaseDate
     */
    public static GetDateNow():string {
        let dateNow= new Date();
        let year:number= dateNow.getFullYear();
        let month:string| number=dateNow.getMonth()+1;
        let day:string| number=dateNow.getDate();
        //return new Date(year, month, day);
        if (month<10) {
            month="0"+month;
        }
        if (day<10) {
            day="0"+day;
        }
        return year+ ""+month+""+day;
    }

    /**
     * 格式化日期 格式化后：20170718
     *
     * @param{Date}date
     * @returns{string}
     * @memberofBaseDate
     */
    public static FormatDate(date:Date):string {
        var dateNow= date;
        var year:number= dateNow.getFullYear();
        var month:string| number=dateNow.getMonth()+1;
        var day:string| number=dateNow.getDate();
        //return new Date(year, month, day);
        if (month<10) {
            month="0"+month;
        }
        if (day<10) {
            day="0"+day;
        }
        return year+ ""+month+""+day;
        //return new Date("yyyy-MM-dd");
    }

    /**
     * 获取当前时间-分钟
     *
     * @static
     * @returns{string}
     * @memberofBaseDate
     */
    public static GetCurrentMinutesTostring():string {
        let date= new Date();
        let minute:string= date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes().toString();
        return minute;
    }

    /**
     * 获取当日期格式化至小时 20181023:13
     *
     * @static
     * @returns{string}
     * @memberofBaseDate
     */
    public static GetCurrentDateToString_ss():string {
        let date = new Date();
        let year:number= date.getFullYear();
        let month:string| number=date.getMonth()+1;
        let day:string| number=date.getDate();
        let hour:string| number=date.getHours()<10?"0"+date.getHours():date.getHours();
        let minute:string| number=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
        //return new Date(year, month, day);
        if (month<10) {
            month="0"+month;
        }
        if (day<10) {
            day="0"+day;
        }
        return year+ ""+month+""+day+":"+hour;// + "" + minute;
    }


    


    /**
    * 格式化到日期 20181023
    *
    * @static
    * @param{Date}date
    * @returns
    * @memberofBaseDate
    */
    public static FormatToDay(date:Date) {
        let year= date.getFullYear();
        let month:string| number=date.getMonth()+1;
        let day:string| number=date.getDate();
        // let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        //let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        //return new Date(year, month, day);
        if (month<10) {
            month="0"+month;
        }
        if (day<10) {
            day="0"+day;
        }
        return year+ ""+month+""+day;// + ":" + hour; // + "" + minute;
    }

    /**
     * 格式化到小时 20181023:13
     *
     * @static
     * @param{Date}date
     * @returns
     * @memberofBaseDate
     */
    public static FormatTohh(date:Date) {

        let year:number= date.getFullYear();
        let month:string| number=date.getMonth()+1;
        let day:string| number=date.getDate();
        let hour:string| number=date.getHours()<10?"0"+date.getHours():date.getHours();
        let minute:string| number=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
        //return new Date(year, month, day);
        if (month<10) {
            month="0"+month;
        }
        if (day<10) {
            day="0"+day;
        }
        return year+ ""+month+""+day+":"+hour;// + "" + minute;
    }

    /**
     * 获取当前小时
     *
     * @static
     * @returns{string}
     * @memberofBaseDate
     */
    public static GetCurrentHour():string {
        let date= new Date();
        return date.getHours()<10?"0"+date.getHours():date.getHours()+"";
    }

    /**
     * 
     * 计算指定日期加天数后的日期
     *
     * @param{Date}date 日期
     * @param{number}days 添加的天数    
     * @returns{Date}
     * @memberofBaseDate
     */
    public static AddDays(date:Date,days:number):Date {
        return new Date(date.setDate(date.getDate()+days));
    }

    /**
     * 字符串格式化为日期 格式如2016/09/08
     *
     * @static
     */
    public static  FormatStringToDate(valueDate) {
        //Logger.log("formatStringToDate:" + valueDate.replace(/-/g, "/"));
        return new Date(Date.parse(valueDate.replace(/-/g, "/")));
    }
    


    /**
     * 为当前日期添加月份
     *
     * @static
     */
    static AddMonths(date, month:number) {
        var dateNow = date;
        var year = dateNow.getFullYear();
        var month:number = dateNow.getMonth() + month;
        var day = dateNow.getDate();
        if ((month / 12) > 0) {
            year += (month / 12)
        }
        //Logger.log("year:" + year + " month:" + month + " day:" + day);
        return new Date(year, month, day);

    }


    /**
     * 是否超过时限，超过返回true，没有是false
     *
     * @static
     */
    static IsDateLimit(indexDate, limitDate) 
    {
        //Logger.log("【indexDate:】" + indexDate + " 【limitDate:】" + limitDate);
        //Logger.log(indexDate <= limitDate ? true : false);
        return indexDate <= limitDate ? true : false;
    }

    /**
     * 获取当前时间 yyyy-MM-dd hh:mm:ss
     *
     * @static
     */
    static GetDateStr(time) {
        var date = new Date(time);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        var s = date.getSeconds();
        return cc.js.formatStr("%s-%s-%s %s:%s:%s", y, m, d, h, mm, s);
    }

    /**
     * 获取当前时间 可以指定格式 默认 yyyy-MM-dd hh:mm:ss
     *
     * @static
     */
    static GetDateByFormat(time:number, format:string = "yyyy-MM-dd hh:mm:ss"){
        let date = new Date(time);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let h = date.getHours();
        let mm = date.getMinutes();
        let s = date.getSeconds();
        let formatDatas = {
            "yyyy":y,
            "MM":m,
            "dd":d,
            "hh":h,
            "mm":mm,
            "ss":s
        }
        let ret = format;
        for(let key in formatDatas){
            ret = ret.replace(key, formatDatas[key]);
        }
        return ret;
    }

    /**
    * 取时间小时和分 hh:mm
    */
    static GetHourAndMinites() {
        var t = new Date();
        var hours = (t.getHours() > 9) ? t.getHours() : ("0" + t.getHours());
        var minutes = (t.getMinutes() > 9) ? t.getMinutes() : ("0" + t.getMinutes());
        //var seconds = (t.getMilliseconds() > 9) ? t.getMilliseconds() : ("0" + t.getMilliseconds());
        var str = "" + hours + ":" + minutes;
        return str;
    }

    /**
     * 将倒计时秒数转换成 天-小时-分钟-秒
     * 返回剩余时间数组 [0]day [1]hour [2]minute [3]second
     * 
     */
    static SecondToDayTime(leftSecond: number): number[]
    {
        let time: Array<number> = new Array<number>();
        let day: number = Math.floor(leftSecond / 86400);
        leftSecond -= day * 86400;
        let hour: number = Math.floor(leftSecond / 3600);
        leftSecond -= hour * 3600;
        let minute: number = Math.floor(leftSecond / 60);
        leftSecond -= minute * 60;
        let second: number = Math.floor(leftSecond);

        time.push(day);
        time.push(hour);
        time.push(minute);
        time.push(second);

        //return day+"D "+hour.to()+":"+minute.toFixed(0)+":"+second.toFixed(0);
        return time;
    }
}