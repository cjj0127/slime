import { Q_COLOR } from "../common/Const";
import SummonModel from "../../ccstudio/data/SummonModel";
import Model from "../../ccstudio/data/Model";
import _SummonWidgetConfig from "../../ccstudio/config/_SummonWidgetConfig";
// import SummonModel from "SummonModel";
const { ccclass, property } = cc._decorator;
@ccclass
export default class QualityItemUI extends cc.Component {
    @property(cc.Integer)
    index = 0;
    level = 0;
    @property(cc.Sprite)
    qualityIcon = null;
    @property(cc.Label)
    qualityName = null;
    @property(cc.Label)
    qualityRate = null;
    convertNum(num) {
        return `${(num / 10000).toString()}%`;
    }
    init(e) {
        this.level = e;
        this.refresUi();
    }
    refresUi() {
        const cfg = _SummonWidgetConfig.Instance.get(this.level);
        this.qualityName.string = Model.summon.getQualityName(this.index);
        this.qualityRate.string = this.convertNum(cfg[this.index]);
        this.setCpmColor(this.index);
    }
    setCpmColor(index) {
        const color = Q_COLOR[index + 1];
        this.qualityName.node.color = cc.color().fromHEX(color);
        this.qualityRate.node.color = cc.color().fromHEX(color);
        this.qualityIcon.node.color = cc.color().fromHEX(color);
    }
}
