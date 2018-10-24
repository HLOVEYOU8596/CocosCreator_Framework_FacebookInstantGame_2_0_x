
import Facebook from "../Facebook/Facebook";
import FacebookStorage from "../Facebook/FacebookStorage";
import Logger from "../Logger/Logger";
import MsgSystem from "../MsgSystem/MsgSystem";
import MsgDefine from "../MsgSystem/MsgDefine";
import FacebookPlayerPicDic from "../Facebook/FacebookPlayerPicDic";



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
export default class UserInfo
{

    //单例
    private static instance: UserInfo = null;
    public static GetInstance(): UserInfo
    {
        if (UserInfo.instance == null)
        {
            UserInfo.instance = new UserInfo();
        }
        return UserInfo.instance;
    }

    //玩家基本的账号信息
    playerName: string = "";
    playerPicUrl: string = "";
    playerPic: cc.SpriteFrame = new cc.SpriteFrame();
    playerId: string = "";
    //玩家好友(90天内玩过这个游戏的好友)
    connectedPlayer: Array<FBInstant.ConnectedPlayer> = new Array<FBInstant.ConnectedPlayer>();//90天内玩过这个游戏的好友

    userInfoLoadFinish: boolean = false;

    //保存在fb的游戏信息
    highestScore:number=0;//玩家最高分
    ownSkin:Array<number>=[0];//玩家拥有个人物
    usingSkin:number=0;//正在使用的皮肤
    ownStage:Array<number>=[0];//拥有的舞台
    usingStage:number=0;//正在使用的舞台
    gameCoin:number=0;//游戏金币
    scoreLastRound:number=0;//上一局的分数

    //单局数据
    scoreNow:number=0;
    

    LoadUserInfoFromFB()
    {
        if (!Facebook.IsFBInit()) 
        {
            Logger.warn("InitUserInfo Failed:FBInstant is not defined");
            return;
        }
        this.playerName = FBInstant.player.getName();
        this.playerPicUrl = FBInstant.player.getPhoto();
        this.playerId = FBInstant.player.getID();
        cc.loader.load(this.playerPicUrl, function (err, texture)
        {
            this.playerPic.setTexture(texture);

            //发送玩家信息读取完毕
            this.userInfoLoadFinish = true;
            MsgSystem.GetInstance().PostMsg(MsgDefine.userInfoLoadFinish);
        }.bind(this));

        FBInstant.player.getConnectedPlayersAsync()
            .then(function (players:Array<FBInstant.ConnectedPlayer>)
            {
                for(let i=0;i<players.length;i++)
                {
                    this.connectedPlayer.push(players[i]);
                    FacebookPlayerPicDic.AddToPlayerPicDic(players[i].getID(),players[i].getPhoto());
                }
                Logger.log("connectedPlayers:");
                Logger.log(players);
            }.bind(this))
            .catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
            });
    }

    LoadSavedDataFromFB()
    {
        Facebook.FBStorage.LoadDataFormFB(
            [ 
                // FacebookStorage.highestScore,
                // FacebookStorage.ownSkin,
                // FacebookStorage.usingSkin,
                // FacebookStorage.ownStage,
                // FacebookStorage.usingStage,
                // FacebookStorage.gameCoin,
                // FacebookStorage.scoreLastRound,
            ],
        function(data)
        {
            // this.highestScore=FacebookStorage.LoadItem(data,FacebookStorage.highestScore,0);
            // this.ownSkin=FacebookStorage.LoadItem(data,FacebookStorage.ownSkin,[0]);
            // this.usingSkin=FacebookStorage.LoadItem(data,FacebookStorage.usingSkin,0);
            // this.ownStage=FacebookStorage.LoadItem(data,FacebookStorage.ownStage,[0]);
            // this.usingStage=FacebookStorage.LoadItem(data,FacebookStorage.usingStage,0);
            // this.gameCoin=FacebookStorage.LoadItem(data,FacebookStorage.highestScore,300);
            // this.scoreLastRound=FacebookStorage.LoadItem(data,FacebookStorage.scoreLastRound,0);

        }.bind(this));
    }

    SaveDataToFB()
    {
        Facebook.FBStorage.SaveDataToFB(
            {
                highestScore:this.highestScore,
                ownSkin:this.ownSkin,
                usingSkin:this.usingSkin,
                ownStage:this.ownStage,
                usingStage:this.usingStage,
                gameCoin:this.gameCoin,
                scoreLastRound:this.scoreLastRound
            }
        );
    }


}
