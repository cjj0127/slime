import LanMgr from "../common/Language";
import _MasteryConfig from "../../ccstudio/config/_MasteryConfig";
import MasteryModel, { E_MASTERY_STATUS } from "../../ccstudio/data/MasteryModel";
import Model from "../../ccstudio/data/Model";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import MasteryItemUI from "./MasteryItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MasteryInfoUI extends cc.Component {
    private _masteryId = 0;
    @property(MasteryItemUI)
    currItem = null;
    @property(cc.Label)
    descLabel = null;
    @property(cc.Label)
    nextDescLabel = null;
    refresh() {
        const masteryCfg = _MasteryConfig.Instance.get(this.masteryId);
        const masteryData = Model.mastery.getData(this.masteryId);
        this.currItem.setIcon(masteryCfg.icon);
        this.currItem.masteryId = this.masteryId;
        this.currItem.refreshStatus();
        const status = masteryData?.status || E_MASTERY_STATUS.EClose;
        const level = masteryData?.level || 0;
        const propType = masteryCfg.propType[0];
        const propAdd = masteryCfg.propAdd[0];
        const propCfg = _PropConfig.Instance.get(propType);
        const desc = LanMgr.Instance.getLangByID(propCfg.desc);
        let value = propAdd;
        if (level > 0) {
            value = propAdd * level;
        }
        this.descLabel.string = desc.replace("%{value}", `${value}`);
        if (status == E_MASTERY_STATUS.EOpen && level > 0) {
            const nextValue = propAdd * (level + 1);
            this.nextDescLabel.string = desc.replace("%{value}", `${nextValue}`);
            this.nextDescLabel.node.parent.active = true;
        }
        else {
            this.nextDescLabel.node.parent.active = false;
        }
    }
    get masteryId() {
        return this._masteryId;
    }
    set masteryId(value: number) {
        if (this._masteryId !== value) {
            this._masteryId = value;
        }
    }
}
