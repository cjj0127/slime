import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
import BattleWorld from "../battle/BattleWorld";
import LanMgr from "../common/Language";
import BossLevelItemUI from "../boss/BossLevelItemUI";
import UserData from "../user/UserData";
// import Events from "Events";
const { ccclass, property } = cc._decorator;
@ccclass
export default class DwarvenKingRushLevelItemUI extends BossLevelItemUI {
    @property(cc.Label)
    damageRecord: cc.Label = null;
    calcRewardCount() {
        return BattleWorld.Instance.getBattleCtrl(E_GAME_LEVEL_TYPE.DwarvenKing).calcRewardCount().toString();
    }
    onDisable() {
        super.onDisable();
        cc.director.targetOff(this);
    }
    onEnable() {
        super.onEnable();
        cc.director.on(GlobalEventName.DwarvenkingComplete, this.refresh, this);
    }
    refresh() {
        this.btnAdd.node.active = false;
        this.btnSub.node.active = false;
        const lang = LanMgr.Instance.getLangByID("HighestRecord");
        this.damageRecord.string = lang.replace("{s}", UserData.Instance.getDwarvenKingDamageRecord().toString());
    }
}
