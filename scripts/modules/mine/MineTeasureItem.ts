import TeasureDisplayItem from "../treasure/TeasureDisplayItem";
import UnlockCtrl from "../unlock/UnlockCtrl";
import { GlobalEventName } from "../common/Events";
import { EUNLOCKSYS_ID } from "../common/Const";
const { ccclass, property } = cc._decorator;
const _ = globalThis._;
@ccclass
export default class MineTeasureItem extends cc.Component {
    @property([TeasureDisplayItem])
    displayItem = [];
    checkUnlock() {
        let e = EUNLOCKSYS_ID.Rob;
        let t = UnlockCtrl.Instance.isUnlock(e);
        UnlockCtrl.Instance.refreshUnlockNodeState(t, this.node, e);
    }
    initDisplayItem() {
        _.each(this.displayItem, function (e, t) {
            let n = t + 1;
            e.typeId = n;
        });
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.checkUnlock();
        cc.director.on(GlobalEventName.UnlockRob, this.checkUnlock, this);
    }
    onLoad() {
        this.initDisplayItem();
    }
}
