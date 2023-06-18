import ItemUIBase from "../common/ItemUIBase";
import LanMgr from "../common/Language";
import { Q_COLOR } from "../common/Const";
import RingModel from "../../ccstudio/data/RingModel";
import Model from "../../ccstudio/data/Model";
import _RingConfig from "../../ccstudio/config/_RingConfig";
import GradeLabelUI from "../battle/GradeLabelUI";
// import RingModel from "RingModel";
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionRingUI extends ItemUIBase {
    @property(cc.Sprite)
    bgGuang: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(GradeLabelUI)
    ringLevelLabel: GradeLabelUI = null;
    init(e: number, t = 1) {
        let n = parseInt(_RingConfig.Instance.getOriginRingId());
        let o = Model.ring.getRingData(e);
        if (o != null) {
            n = o.originId;
        }
        let i = _RingConfig.Instance.get(n);
        let r = o != null ? o.quality : i.quality + t;
        let l = i.icon;
        this.nameLabel.string = LanMgr.Instance.getLangByID(i.name);
        this.nameLabel.node.color = cc.color().fromHEX(Q_COLOR[r - 1]);
        this.setQualityValue(r - 1);
        this.setIcon(l);
        this.ringLevelLabel.setGrade(r);
        this.bgGuang.node.color = cc.color().fromHEX(Q_COLOR[r - 1]);
    }
    showBreath() {
        this.bgGuang.node.stopAllActions();
        cc.tween(this.bgGuang.node)
            .to(1, { opacity: 255 })
            .to(1, { opacity: 150 })
            .union()
            .repeatForever()
            .start();
    }
}
