const { ccclass, property } = cc._decorator;
@ccclass
export default class TeasureEffectItem extends cc.Component {
    @property(cc.Label)
    titleLabel: cc.Label = null;
    @property(cc.Label)
    valueLabel: cc.Label = null;
    showItem(title: any, value: any) {
        this.titleLabel.string = title.toString();
        this.valueLabel.string = value.toString();
    }
}
