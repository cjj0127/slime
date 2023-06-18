import TraitData from "./TraitData";
import UIPool from "../common/UIPool";
import TraitKindLevelItemUI from "./TraitKindLevelItemUI";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class TraitKindLevelListUI extends UIPool {
    @property(cc.Layout)
    content: cc.Layout = null;
    refresh() {
        this.clear();
        const allCombos = TraitData.Instance.getAllCombo();
        _.each(allCombos, (combo) => {
            const kind = combo.kind;
            const level = combo.level;
            const item = this.get();
            item.parent = this.content.node;
            const itemComponent = item.getComponent(TraitKindLevelItemUI);
            itemComponent.setKind(kind);
            itemComponent.setLevel(level);
        });
    }
}
