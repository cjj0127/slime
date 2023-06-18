import LanMgr from "../../modules/common/Language";
import ModeBase from "./ModelBase";
import MsgHint from "../../modules/common/MsgHint";
import _TraitCostConfig from "../config/_TraitCostConfig";
import TraitData, { TRAIT_SLOT_COUNT } from "../../modules/trait/TraitData";
import UserData, { AssetUseType } from "../../modules/user/UserData";
import { GlobalEventName } from "../../modules/common/Events";
import { E_ASSET_TYPE } from "../../modules/common/Const";
export default class TraitModel extends ModeBase {
    changeLockStatus(e) {
        const t = TraitData.Instance.getSlotData(e);
        if (t.id >= 0) {
            t.lock = !t.lock;
            cc.director.emit(GlobalEventName.TraitSlotLockStatusChange);
        }
        return t.lock;
    }
    getChangeEnable() {
        return this.getLockCnt() < TRAIT_SLOT_COUNT;
    }
    getCost() {
        const e = this.getLockCnt();
        return e == TRAIT_SLOT_COUNT ? 0 : _TraitCostConfig.Instance.get(e).cost;
    }
    getLockCnt() {
        let e = 0;
        for (let t = 0; t < TRAIT_SLOT_COUNT; t++) {
            const n = TraitData.Instance.getSlotData(t);
            if (n && n.lock)
                e++;
        }
        return e;
    }
    initLoadData() {
        TraitData.Instance.init();
        TraitData.Instance.activeProps();
    }
    load() {
        TraitData.Instance.load();
    }
    requestChange() {
        const e = this.getCost();
        if (0 != e) {
            if (UserData.Instance.subItem(E_ASSET_TYPE.Tailt, e, { type: AssetUseType.Mastery })) {
                TraitData.Instance.change();
                return true;
            }
            else {
                MsgHint.tip(LanMgr.Instance.getLangByID("Not enough Trait"));
                return false;
            }
        }
        else {
            return false;
        }
    }
}
