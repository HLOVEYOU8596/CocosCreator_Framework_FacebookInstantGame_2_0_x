import Facebook from "./Facebook";
import Logger from "../Logger/Logger";
import FacebookPlayerInfoInRank from "./FacebookPlayerInfoInRank";
import FacebookPlayerPicDic from "./FacebookPlayerPicDic";
import MsgSystem from "../MsgSystem/MsgSystem";
import MsgDefine from "../MsgSystem/MsgDefine";

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
export default class FacebookRank
{

    //属性声明
    // @property(cc.Label)     // 使用 property 装饰器声明属性，括号里是属性类型，装饰器里的类型声明主要用于编辑器展示
    // label: cc.Label = null; // 这里是 TypeScript 用来声明变量类型的写法，冒号后面是属性类型，等号后面是默认值

    // 也可以使用完整属性定义格式
    // @property({
    //     visible: false
    //     displayName: "Score (player)"
    //     tooltip: "The score of player"
    // })
    // text: string = 'hello';

    globalRankName: string = "permanentRank";//全球排行名称
    weeklyRankName: string = "weeklyRank";//每周更新的排行榜名称
    contextRankName: string = "";//context排行榜名称

    globalRank: FBInstant.Leaderboard = null;
    weeklyRank: FBInstant.Leaderboard = null;
    contextRank: FBInstant.Leaderboard = null;

    loadedRankListCount: number = 0;
    needLoadedRankListCount: number = 4;

    globalRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//全球排行榜
    friendRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//好友排行榜
    weeklyFriendRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//每周更新的好友排行榜
    weeklyGlobalRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//每周更新的全球排行榜
    contextRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//context排行榜

    myRankInGlobal: FBInstant.LeaderboardEntry = null;//自己的全球排名
    myRankInWeeklyGlobal: FBInstant.LeaderboardEntry = null;//自己的全球每周排名
    myRankInFriends: FBInstant.LeaderboardEntry = null;//自己的好友排名
    myRankInWeeklyFriends: FBInstant.LeaderboardEntry = null;//自己的好友每周排名

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable() {}
    // start() {}
    // update(dt) {}
    // lateUpdate(dt) {}
    // onDisable() {}
    // onDestroy() {}


    GetGlobalRank()
    {
        var firstTime = false;
        if (!Facebook.IsApiSupport("getLeaderboardAsync")) 
        {
            return;
        }
        if (this.globalRankName != "") 
        {
            FBInstant.getLeaderboardAsync(this.globalRankName).then(function (leaderboard)
            {
                this.globalRank = leaderboard;
                return leaderboard.getPlayerEntryAsync();
            }.bind(this)).then(function (entry)
            {
                if (entry == null) 
                {
                    Logger.warn("no data in", this.globalRank);
                    firstTime = true;
                    return this.globalRank.setScoreAsync(0, "");
                }
                else
                {
                    firstTime = false;
                    this.GetGlobalRankList();
                    this.GetFriendRankList();
                }
            }.bind(this)).then(function ()
            {
                if (firstTime == false)
                {
                    return;
                }
                this.GetGlobalRankList();
                this.GetFriendRankList();
            }.bind(this)).catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
            });
        }
    }

    GetWeeklyRank()
    {
        var firstTime = false;
        if (!Facebook.IsApiSupport("getLeaderboardAsync")) 
        {
            return;
        }
        if (this.weeklyRankName != "") 
        {
            FBInstant.getLeaderboardAsync(this.weeklyRankName).then(function (leaderboard)
            {
                this.weeklyRank = leaderboard;
                return leaderboard.getPlayerEntryAsync();
            }.bind(this)).then(function (entry)
            {
                if (entry == null) 
                {
                    Logger.warn("no data in", this.weeklyRank);
                    firstTime = true;
                    return this.weeklyRank.setScoreAsync(0, "");
                }
                else
                {
                    firstTime = false;
                    this.GetWeeklyGlobalRankList();
                    this.GetWeeklyFriendRankList();
                }
            }.bind(this)).then(function ()
            {
                if (firstTime == false)
                {
                    return;
                }
                this.GetWeeklyGlobalRankList();
                this.GetWeeklyFriendRankList();
            }.bind(this)).catch(function (err)
            {
                Logger.error('failed : ' + err.code + " :: " + err.message);
            });
        }
    }
    // {
    //     if (!Facebook.IsApiSupport("getLeaderboardAsync")) 
    //     {
    //         return;
    //     }
    //     if (this.weeklyRankName != "") 
    //     {
    //         FBInstant.getLeaderboardAsync(this.weeklyRankName).then(function (leaderboard)
    //         {
    //             this.weeklyRank = leaderboard;
    //             this.GetWeeklyGlobalRankList();
    //             this.GetWeeklyFriendRankList();
    //         }.bind(this)).catch(function (err)
    //         {
    //             Logger.log('failed : ' + err.code + " :: " + err.message);
    //         });
    //     }
    // }

    GetGlobalRankList(count: number = 30, offset = 0)
    {
        this.globalRank.getEntriesAsync(count, offset).then(function (entries) 
        {
            this.FullRank(entries, this.globalRankList);
        }.bind(this)).catch(function (err)
        {
            Logger.error('failed : ' + err.code + " :: " + err.message);
        });

        this.globalRank.getPlayerEntryAsync().then(function (entry: FBInstant.LeaderboardEntry) 
        {
            this.myRankInGlobal = entry;
            Logger.log("myRankInGlobal:", this.myRankInGlobal.getRank());
        }.bind(this)).catch(function (err)
        {
            Logger.error('failed : ' + err.code + " :: " + err.message);
        });
    }
    GetWeeklyGlobalRankList(count: number = 30, offset = 0)
    {
        this.weeklyRank.getEntriesAsync(count, offset).then(function (entries) 
        {
            this.FullRank(entries, this.weeklyGlobalRankList);
        }.bind(this)).catch(function (err)
        {
            Logger.error('failed : ' + err.code + " :: " + err.message);
        });

        this.weeklyRank.getPlayerEntryAsync().then(function (entry: FBInstant.LeaderboardEntry) 
        {
            this.myRankInWeeklyGlobal = entry;
            Logger.log("myRankInWeeklyGlobal:", this.myRankInWeeklyGlobal.getRank());
        }.bind(this)).catch(function (err)
        {
            Logger.error('failed : ' + err.code + " :: " + err.message);
        });
    }

    GetFriendRankList(count: number = 100, offset = 0)
    {
        this.globalRank.getConnectedPlayerEntriesAsync(count, offset).then(function (entries) 
        {
            this.FullRank(entries, this.friendRankList, true);
        }.bind(this)).catch(function (err)
        {
            Logger.error('failed : ' + err.code + " :: " + err.message);
        });
    }

    GetWeeklyFriendRankList(count: number = 100, offset = 0)
    {
        this.weeklyRank.getConnectedPlayerEntriesAsync(count, offset).then(function (entries) 
        {
            this.FullRank(entries, this.weeklyFriendRankList, true, true);
        }.bind(this)).catch(function (err)
        {
            Logger.error('failed : ' + err.code + " :: " + err.message);
        });
    }

    FullRank(entries: Array<FBInstant.LeaderboardEntry>, rank: Array<FacebookPlayerInfoInRank>, isFriendsRank: boolean = false, isWeekly: boolean = false)
    {
        let playerid: string;
        if (isFriendsRank == true)
        {
            playerid = FBInstant.player.getID();
        }
        let totalCount = entries.length;
        let count: number = 0;
        for (let i = 0; i < entries.length; i++)
        {
            let player: FacebookPlayerInfoInRank = new FacebookPlayerInfoInRank();
            player.playerId = entries[i].getPlayer().getID();
            player.playerName = entries[i].getPlayer().getName();
            player.playerRank = entries[i].getRank();
            player.playerScore = entries[i].getScore();
            player.playerPicUrl = entries[i].getPlayer().getPhoto();
            rank.push(player);
            FacebookPlayerPicDic.AddToPlayerPicDic(player.playerId, player.playerPicUrl);
            player.playerPic = FacebookPlayerPicDic.GetPlayerPic(player.playerId);
            // cc.loader.load(player.playerPicUrl, function (err, texture)
            //         {
            //             player.playerPic.setTexture(texture);    
            //         }.bind(this));
            if (isFriendsRank == true && player.playerId == playerid) 
            {
                if (isWeekly == false) 
                {
                    this.myRankInFriends = entries[i];
                    Logger.log("myRankInFriends:", this.myRankInFriends.getRank());
                }
                else
                {
                    this.myRankInWeeklyFriends = entries[i];
                    Logger.log("myRankInWeeklyFriends:", this.myRankInWeeklyFriends.getRank());
                }

            }
        }
        Logger.log(rank);
        //检测是否加载完成
        this.LoadRankFinish();
    }

    LoadRankFinish()
    {
        this.loadedRankListCount++;
        if (this.loadedRankListCount >= this.needLoadedRankListCount) 
        {

            //加载完毕,发送加载完成的消息
            MsgSystem.GetInstance().PostMsg(MsgDefine.rankLoadFinish);

            //
            //GameRuntimeData.GetInstance().GenerateFriendsScoreDic();
        }
    }

    AddTestFriendsToRank()
    {

        //测试用 排行榜加入数据
        for (let i = 0; i < 10; i++)
        {
            let player = new FacebookPlayerInfoInRank();
            player.playerId = "T00" + (i+1).toString();
            player.playerName = "TestPlayer-" + player.playerId;
            player.playerRank = i+1;
            player.playerScore = 100 - 10 * i;
            this.friendRankList.push(player);
        }


        //
        //GameRuntimeData.GetInstance().GenerateFriendsScoreDic();

    }

    SetScoreToGloalRank(score:number,extraData?:string)
    {
        if (!Facebook.IsFBInit()) 
        {
            return;
        }
        this.globalRank.setScoreAsync(score,extraData);
    }

    SetScoreToWeeklyRank(score:number,extraData?:string)
    {
        if (!Facebook.IsFBInit()) 
        {
            return;
        }
        this.weeklyRank.setScoreAsync(score,extraData);
    }

}
