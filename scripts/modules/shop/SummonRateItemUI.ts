import _SummonWidgetConfig from "../../ccstudio/config/_SummonWidgetConfig";
import UIPool from "../common/UIPool";
import QualityItemUI from "../quest/QualityItemUI";
// import QualityItemUI from "QualityItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SummonRateItemUI extends UIPool {
    @property
    level: number = 0;
    init(level: number) {
        this.level = level;
        this.refresUi();
    }
    refresUi() {
        this.clear();
        const e = _SummonWidgetConfig.Instance.get(this.level);
        for (let i = 0; i < e.length; i++) {
            const node = this.get();
            node.parent = this.node;
            const component = node.getComponent(QualityItemUI);
            component.index = i,
                component.init(this.level);
        }
    }
}
