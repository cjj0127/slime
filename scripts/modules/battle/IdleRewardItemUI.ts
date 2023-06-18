import _GearConfig from "../../ccstudio/config/_GearConfig";
import ItemUIBase from "../common/ItemUIBase";
// import ItemUIBase from "ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class IdleRewardItemUI extends ItemUIBase {
    @property(cc.Label)
    countLabel: cc.Label = null;
    gearId: number = 0;
    refresh() {
        const e = _GearConfig.Instance.get(this.gearId);
        this.setQualityValue(e.quality);
        this.setIcon(e.icon);
    }
    setCount(e: number) {
        this.countLabel.string = `${e}`;
    }
    setItemInfo(e: number, t: number) {
        if (this.gearId != e) {
            this.gearId = e;
            this.refresh();
        }
        this.setCount(t);
    }
}
