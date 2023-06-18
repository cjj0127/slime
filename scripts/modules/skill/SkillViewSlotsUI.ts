import { EUNLOCKSYS_ID } from "../common/Const";
import SkillModel from "../../ccstudio/data/SkillModel";
import Model from "../../ccstudio/data/Model";
import SlotsUI from "../battle/SlotsUI";
import UnlockCtrl from "../unlock/UnlockCtrl";
import UnlockData from "../unlock/UnlockData";
// import SlotsUI from 'SlotsUI';
const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillViewSlotsUI extends SlotsUI {
    refreshSlot(id: number, slotIndex: number) {
        const slot = this.slots[slotIndex];
        if (slotIndex > 0) {
            const sysID = EUNLOCKSYS_ID.Skill + slotIndex;
            if (this.delegate.isLocked(slotIndex)) {
                slot.showLock(sysID);
                return;
            }
            if (this.delegate.isWaitUnLock(slotIndex)) {
                Model.unlock.unlock(sysID);
                slot.showLock(sysID);
                slot.playUnlockAni(() => {
                    const msgType = UnlockCtrl.Instance.getMsgByType(sysID);
                    cc.director.emit(msgType, sysID);
                });
                return;
            }
        }
        slot.hideLock();
        if (id >= 0) {
            const itemInfo = this.delegate.getItemInfo(id);
            const icon = itemInfo.icon;
            const quality = itemInfo.quality;
            const name = itemInfo.name;
            const level = Model.skill.getData(id).level;
            slot.showItem(icon, quality, name);
            slot.setLevel(level);
            slot.hideEmpty();
        }
        else {
            slot.showEmpty();
        }
    }
}
