import { GlobalEventName } from "../common/Events";
import { EUNLOCKSYS_ID } from "../common/Const";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import UnlockCtrl from "../unlock/UnlockCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MIneRobItem extends cc.Component {
    checkUnlock() {
        const id = EUNLOCKSYS_ID.Rob;
        const isUnlock = Model.user.isUnlock(id);
        UnlockCtrl.Instance.refreshUnlockNodeState(isUnlock, this.node, id);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.checkUnlock();
        cc.director.on(GlobalEventName.UnlockRob, this.checkUnlock, this);
    }
}
