
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


export default class Utility
{

    /**
     * 获取文件名字符串中文件的扩展名
     *
     */
    static GetFileType(url: string): string
    {
        if (url.lastIndexOf(".") != -1) 
        {
            let word = url.split(".");
            return word[word.length - 1];
        }
        else
        {
            return null;
        }
    }

    
    /**
     * 将int转换成string 如果位数少于指定的位数,则在左侧补0
     *
     */
    static IntToString(num, length: number): string
    {
        var len = num.toString().length;
        while (len < length) 
        {
            num = "0" + num;
            len++;
        }
        return num;
    }

    // static CopyToClipBoard(str: string)
    // {
    //     if (cc.sys.isNative) //如果是原生
    //     {
    //         if (cc.sys.OS_ANDROID === cc.sys.os)
    //         {
    //             jsb.reflection.callStaticMethod("org/cocos2dx/javascript/OperatorClipboard", "CopyStrtoClipboard", "(Ljava/lang/String;)V", str);
    //         }
    //         else if (cc.sys.OS_IOS === cc.sys.os)
    //         {

    //         }
    //     }
    //     else//如果是网页
    //     {
    //         Logger.log('复制');

    //         var input = str;
    //         const el = document.createElement('textarea');
    //         el.value = input;
    //         el.setAttribute('readonly', '');
    //         el.style.contain = 'strict';
    //         el.style.position = 'absolute';
    //         el.style.left = '-9999px';
    //         el.style.fontSize = '12pt'; // Prevent zooming on iOS

    //         const selection = getSelection();
    //         var originalRange = false;
    //         if (selection.rangeCount > 0)
    //         {
    //             originalRange = selection.getRangeAt(0);
    //         }
    //         document.body.appendChild(el);
    //         el.select();
    //         el.selectionStart = 0;
    //         el.selectionEnd = input.length;

    //         var success = false;
    //         try
    //         {
    //             success = document.execCommand('copy');
    //         }
    //         catch (err) 
    //         {
    //             Logger.log(err);

    //         }

    //         document.body.removeChild(el);

    //         if (originalRange)
    //         {
    //             selection.removeAllRanges();
    //             selection.addRange(originalRange);
    //         }

    //         // var save = function (e) 
    //         // {
    //         //     e.clipboardData.setData('text/plain', this.data.OrderNum);
    //         //     e.preventDefault();
    //         // }.bind(this);
    //         // document.addEventListener('copy', save);
    //         // document.execCommand('copy');
    //         // document.removeEventListener('copy', save);
    //     }
    // }

    // static ReadClipBoard(): string
    // {

    //     return "a";
    // }
    
    

    

    /**
     * Json对象深度拷贝
     *
     */
    static JsonObjDeepCopy(obj): any {
        let str = JSON.stringify(obj);
        let newobj = JSON.parse(str);
        return newobj;
    }

    /**
     * 获取url的参数 
     *@returns {}{}
     */
    static GetUrlParams(url:string) {
        if (!url || url == "") {
            return {};
        }
        let paramArray = url.match(/[0-9a-zA-Z]*=[0-9a-zA-Z]*/g);
        let paramDict: any = {};
        for (let i in paramArray) {
            let kv = paramArray[i].split("=");
            paramDict[kv[0]] = kv[1];
        }
        return paramDict;
    }

    /**
     * 获取一个对象的类名
     *
     */
    static GetClassName(obj: any): string {
        let funcNameRegex = /function (.{1,})\(/;
        let results: string[] = (funcNameRegex).exec((obj).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }

}
