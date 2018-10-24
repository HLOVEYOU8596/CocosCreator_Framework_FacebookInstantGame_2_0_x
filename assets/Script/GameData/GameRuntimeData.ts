
import UserInfo from "./UserInfo";
import Facebook from "../Facebook/Facebook";
import Logger from "../Logger/Logger";
import CSDictionary from "../Utility/CSDictionary";
import FacebookPlayerInfoInRank from "../Facebook/FacebookPlayerInfoInRank";


// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//declare let require:(string)=>any;

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRuntimeData
{

    //单例
    private static instance: GameRuntimeData = null;
    public static GetInstance(): GameRuntimeData
    {
        if (GameRuntimeData.instance == null)
        {
            GameRuntimeData.instance = new GameRuntimeData();
        }
        return GameRuntimeData.instance;
    }

    lanCode: string = "";
    friendsScore: CSDictionary<number, Array<FacebookPlayerInfoInRank>> = new CSDictionary<number, Array<FacebookPlayerInfoInRank>>();


    GenerateFriendsScoreDic()
    {
        this.friendsScore.clear();

        let friends = Facebook.FBRank.friendRankList;
        for (let i = 0; i < friends.length; i++)
        {
            let friend = friends[i];
            let level = friend.playerScore;
            if (!this.friendsScore.ContainsKey(level)) 
            {
                this.friendsScore.Add(level, new Array<FacebookPlayerInfoInRank>());
            }
            let arr = this.friendsScore.TryGetValue(level);
            arr.push(friend);
        }
        Logger.log(this.friendsScore);

    }

    CalRank()
    {
        if (Facebook.IsFBInit()) 
        {
            let rank = Facebook.FBRank.friendRankList;
            for (let i = 0; i < rank.length; i++)
            {
                if (rank[i].playerScore < UserInfo.GetInstance().scoreNow)
                {
                    return i+1;
                }
            }
            return rank.length+1;
        }
        else 
        {
            return 1;
        }

    }

}
