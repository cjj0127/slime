import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import { eVIEW_ANIM_EVENT } from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class WeekRewardView extends cc.Component {
    closeBack: any = null;
    close() {
        if (this.closeBack) {
            this.closeBack();
        }
        this.node.emit(eVIEW_ANIM_EVENT.Close);
    }
    onDisable() {
        cc.director.targetOff(this);
        BattleWorld.Instance.resume();
    }
    onEnable() {
        BattleWorld.Instance.pause();
        cc.director.on(GlobalEventName.CloseWeekView, this.close, this);
    }
    setCloseCallback(callback: any) {
        this.closeBack = callback;
    }
    start() { }
}
