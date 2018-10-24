import MsgSystem from "./MsgSystem/MsgSystem";
import { StringUtil } from "./Utility/StringUtil";
import Logger from "./Logger/Logger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
        this.label.string = this.text;

        Logger.log(StringUtil.Format("My name is {0}. I'm {1} years old.","John",15));

        MsgSystem.GetInstance().PostMsg("msgSystemTest",5,2000);

    }
}
