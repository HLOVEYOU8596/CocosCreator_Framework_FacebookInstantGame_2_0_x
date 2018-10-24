
import LocalizationComponent from "./LocalizationComponent";
import LocalizationAsset from "./LocalizationAsset";
import Logger from "../Logger/Logger";
import HttpRequest from "../Net/HttpRequest";
import CSDictionary from "../Utility/CSDictionary";
import MsgSystem from "../MsgSystem/MsgSystem";
import MsgDefine from "../MsgSystem/MsgDefine";
import { NetConfig, GameUrl } from "../Net/NetConfig";







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

// export const LocalizationType =cc.Enum
//     ({
//         TEXT:0,
//         TEXTURE:1,
//         AUDIO:2,
//         VIDEO:3,
//     });

export enum LocalizationType
{
    TEXT,
    TEXTRUE,
    AUDIO,
    VIDEO,
}

@ccclass
export default class LocalizationManager extends cc.Component
{
    //单例
    static instance: LocalizationManager = null;

    //@property([cc.String])
    //supportLanguages:Array<string>=new Array<string>();
    @property([cc.Font])
    fonts: Array<cc.Font> = new Array<cc.Font>();
    fontDic;

    //romoteLanguagePackageSourceUrl: string = "";
    localLanguagePackageSourceUrl: string = "Localization";
    defaultLanguage: string = "en";

    //当前支持的语言
    supportLanList: Array<string> = new Array<string>();

    //当前使用的语言的key和对应的内容
    localizationSource: CSDictionary<string, LocalizationAsset> = new CSDictionary<string, LocalizationAsset>();
    //当前正在使用的多语言组件对象
    localiztionComponentList: Array<LocalizationComponent> = new Array<LocalizationComponent>();

    loadingLanCode:string="";//正在加载的语言
    usingLanCode:string="";//正在使用的语言

    isLoadBasePackage:boolean=true;

    onLoad() 
    {
        LocalizationManager.instance = this;
    }

    onEnable()
    {
        // en英语 es西班牙语 pt葡萄牙语 fr法语  tr土耳其 id印度尼西亚语 vi越南  de德语  -拉丁语系
        // zh中文 
        // ja日语
        // th泰语
        // ar阿拉伯语
        this.fontDic = {
            "en": this.fonts[0],
            "es": this.fonts[0],
            "pt": this.fonts[0],
            "fr": this.fonts[0],
            "tr": this.fonts[0],
            "vi": this.fonts[0],
            "id": this.fonts[0],
            "de": this.fonts[0],
            "zh": this.fonts[0],
            "ja": this.fonts[0],
            "th": this.fonts[0],
            "ar": this.fonts[0]
        }
    }

    AddToLocalizationList(obj: LocalizationComponent)
    {
        if (this.localiztionComponentList.indexOf(obj) == -1)
        {
            this.localiztionComponentList.push(obj);
        }
        else
        {
            Logger.log("Localization: a repeated key:" + obj.key);
        }
    }

    RemoveFromLocalizationList(obj: LocalizationComponent)
    {
        let index: number = this.localiztionComponentList.indexOf(obj);
        if (index != -1)
        {
            this.localiztionComponentList.splice(index, 1);
        }
    }



    //获取服务器上的语言包
    GetRemoteLocalizationPackage(languageName: string)
    {
        this.isLoadBasePackage=false;
        let url: string = NetConfig.httpUrl + GameUrl.getLocalizationAsset + languageName +".json";
        HttpRequest.GetInstance().LoadRemoteJson(url, null, this.OnGetPackageOK.bind(this), this.OnGetPackageFail.bind(this));
    }

    OnGetPackageOK(json: any)
    {
        let self = this;
        //this.localizationSource.clear();
        let jsonData=json.json;
        let totalKeyCount: number = jsonData.length;
        let loadedCount: number = 0;
        for (let i = 0; i < totalKeyCount; i++)
        {
            if (!this.localizationSource.ContainsKey(jsonData[i].akey))
            {
                let localAsset: LocalizationAsset = new LocalizationAsset();
                this.localizationSource.Add(jsonData[i].akey, localAsset);
                switch (jsonData[i].atype)
                {
                    case "string":
                        localAsset.assetType = LocalizationType.TEXT;
                        localAsset.str = jsonData[i].content;
                        loadedCount++;
                        if (loadedCount >= totalKeyCount)
                        {
                            self.ChangeLanguage();
                        }
                        break;
                    case "img":
                        // localAsset.assetType = LocalizationType.TEXTRUE;
                        // localAsset.str = json[i].content;
                        // RemoteImgLoader.GetInstance().LoadRemoteImg(localAsset.str,localAsset.spriteFrame,function(texture){
                        //     if (loadedCount >= totalKeyCount) {
                        //         self.ChangeLanguage();
                        //     }
                        // })

                        // let url = GameRuntimeData.GetInstance().url + localAsset.str;
                        // cc.loader.load(url, function (err, texture)
                        // {
                        //     if (err) {
                        //         Logger.log(err);
                        //         return;
                        //     }
                        //     localAsset.spriteFrame.setTexture(texture);
                        //     loadedCount++;
                        //     if (loadedCount >= totalKeyCount) {
                        //         self.ChangeLanguage();
                        //     }
                        // })
                        break;
                    case "video":
                        break;
                    case "voice":
                        break;


                }

            }
            else
            {
                loadedCount++;
                if (loadedCount >= totalKeyCount)
                {
                    self.ChangeLanguage();
                }
            }
        }
        Logger.log(this.localizationSource);
        //发送语言包加载完成
        this.usingLanCode = this.loadingLanCode;
        if (this.isLoadBasePackage==false) {
            MsgSystem.GetInstance().PostMsg(MsgDefine.languageLoadFinsih);
        }
    }

    OnGetPackageFail()
    {
        var self = this;
        //弹出窗口提示--获取远程语言包失败,将默认使用英语

        //读取本地默认语言
        this.GetLocalLanguagePackage(this.defaultLanguage);

    }

    //获取本地的语言包
    GetLocalLanguagePackage(languageName: string)
    {
        //显示正在切换语言提示
        //UIManager.instance.ShowTipsWindow(TipsWindowStyle.NO_BUTTON,"@tip@tipWindow@changeLanguage");

        var self = this;
        let url = this.localLanguagePackageSourceUrl + "/" + languageName;
        cc.loader.loadRes(url, function (err, json)
        {
            if (err)
            {
                Logger.error("-------------load local language file error---------------");
                Logger.error(err);

                Logger.log("load default language:"+this.defaultLanguage);
                this.GetLocalLanguagePackage(this.defaultLanguage);      
            }
            else
            {
                this.loadingLanCode=languageName;
                self.OnGetPackageOK(json);
            }
        }.bind(this));
    }

    ChangeLanguage()
    {
        for (let i = 0; i < this.localiztionComponentList.length; i++)
        {
            this.localiztionComponentList[i].ChangeLanguage();
        }
        //发送完成切换语言的消息
        MsgSystem.GetInstance().PostMsg(MsgDefine.localization_finishChange);
    }

    //开始切换语言
    StartSwitchLanguage(lanCode:string)
    {
        //弹出正在切换语言显示

        //清空语言词典
        this.localizationSource.clear();

        //加载大厅的语言包
    }

}


