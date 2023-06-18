import TraitModel from "../../ccstudio/data/TraitModel";
import Model from "../../ccstudio/data/Model";
import _TraitConfig from "../../ccstudio/config/_TraitConfig";
import TraitData, { TRAIT_SLOT_COUNT } from "./TraitData";
import UIPool from "../common/UIPool";
import TraitResultListItemUI from "./TraitResultListItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TraitResultListUI extends UIPool {
    @property(cc.Layout)
    content: cc.Layout = null;
    items: TraitResultListItemUI[] = [];
    create() {
        if (this.items.length == 0) {
            for (let i = 0; i < TRAIT_SLOT_COUNT; i++) {
                const item = this.createItem();
                item.slot = i;
                item.node.on("click", this.onClickItem, this);
                this.items.push(item);
            }
        }
    }
    createItem(): TraitResultListItemUI {
        const item = super.get(); //as TraitResultListItemUI;
        item.parent = this.content.node;
        return item.getComponent(TraitResultListItemUI);
    }
    getItem(index: number): TraitResultListItemUI {
        return this.items[index];
    }
    onClickItem(event: TraitResultListUI) {
        const item = event.getComponent(TraitResultListItemUI);
        const newLockStatus = Model.trait.changeLockStatus(item.slot);
        item.setStatus(newLockStatus);
    }
    onLoad() {
        this.create();
    }
    refresh() {
        for (let i = 0; i < TRAIT_SLOT_COUNT; i++) {
            const slotData = TraitData.Instance.getSlotData(i);
            const id = slotData.id;
            const kind = slotData.kind;
            const lock = slotData.lock;
            const item = this.getItem(i);
            if (id == -1) {
                item.showEmpty();
            }
            else {
                const traitCfg = _TraitConfig.Instance.get(id);
                item.setProp(traitCfg.propType, traitCfg.propAdd);
                item.setGrade(traitCfg.quality);
                item.setStatus(lock);
                item.setComboKind(kind);
            }
        }
    }
}
