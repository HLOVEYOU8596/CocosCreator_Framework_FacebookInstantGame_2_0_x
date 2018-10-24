// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MsgDefine {

	//查找服务器
	static server_startsearch:string="server_startsearch";
	static server_searching:string="server_searching";

	//服务器状态
	static server_available:string="server_available";
	static server_down:string="server_down";

	//切换语言加载完成
	static languageLoadFinsih="languageLoadFinsih";
	static localization_finishChange="localization_finishChange";

	//加载国家列表完成
	static countryList_loadFinish="countryList_loadFinish";
	static countryList_loadFailed="countryList_loadFailed";
	
	//热更新
	static hotUpdate_start="hotUpdate_start";//热更新开始
	static hotUpdate_percent="hotUpdate_percent";//热更新进度
	static hotUpdate_finish="hotUpdate_finish";//热更新结束
	static hotUpdate_faild="hotUpdate_faild";//热更新失败
	static hotUpdate_skip="hotUpdate_skip"//跳过热更新 包括找不到manifest文件 已经是最新版 平台不支持等等

	
	
}
