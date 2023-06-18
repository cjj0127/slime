import ModeBase from "./ModelBase";
import MyTools from "../utils/MyTools";
import { GameConst } from "../../modules/common/Const";
import ChestDataBattle from "../../modules/battle/ChestDataBattle";
export default class BattleChestModel extends ModeBase {
    getCdTime(time: number) {
        // return 6e4 * GameConst.CHEST_CD - Math.floor(MyTools.GetNowTime() - time);
        const chestCdMs = GameConst.CHEST_CD * 60 * 1000; // 将分钟转换为毫秒
        const nowTime = MyTools.GetTimeNow();
        const elapsedTime = nowTime - time;
        const remainingTime = chestCdMs - Math.floor(elapsedTime);
        return remainingTime;
    }
    initLoadData() { }
    load() {
        const tmp = ChestDataBattle.Instance;
        tmp.load();
    }
    onDestroy() {
        cc.director.targetOff(this);
    }
}
