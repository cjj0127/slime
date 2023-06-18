import _TraitComboConfig from "../../ccstudio/config/_TraitComboConfig";
import TraitData from "./TraitData";
import _TraitKindConfig from "../../ccstudio/config/_TraitKindConfig";
import UIPool from "../common/UIPool";
import TraitSetEffectItemUI from "./TraitSetEffectItemUI";
const _: any = window["_"];
// import TraitSetEffectItemUI from "./TraitSetEffectItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TraitSetEffectViewUI extends UIPool {
    @property(cc.Layout)
    private content: cc.Layout = null;
    private effectItems: {
        [key: string]: TraitSetEffectItemUI;
    } = {};
    create() {
        const allKinds = _TraitKindConfig.Instance.getAll();
        _.each(allKinds, (kind) => {
            const { name, kind: kindNum } = kind;
            const item = this.createItem();
            item.setKind(kindNum);
            item.setNameStr(name);
            this.effectItems[kindNum] = item;
        });
    }
    createItem(): TraitSetEffectItemUI {
        const item = super.get().getComponent(TraitSetEffectItemUI);
        item.node.parent = this.content.node;
        return item;
    }
    onEnable() {
        _.each(this.effectItems, (item: TraitSetEffectItemUI, key) => {
            const kind = parseInt(key);
            const { prop } = _TraitKindConfig.Instance.get(kind);
            const comboData = TraitData.Instance.getComboData(kind);
            const combos = _TraitComboConfig.Instance.getCombos(kind);
            const comboList = [];
            combos.forEach((combo, index) => {
                const comboCfg = _TraitComboConfig.Instance.get(combo);
                comboList.push({
                    count: comboCfg.count,
                    value: comboCfg.value,
                });
                item.addProp(index, prop, comboCfg.count, comboCfg.value);
            });
            item.setLevel((comboData && comboData.level) || 0);
        });
    }
    onLoad() {
        this.create();
    }
}
