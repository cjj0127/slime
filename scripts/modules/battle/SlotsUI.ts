import SlotUI from "./SlotUI";
import { EUNLOCKSYS_ID } from "../common/Const";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class SlotsUI extends cc.Component {
    delegate: any = null;
    @property({
        type: [SlotUI],
        tooltip: "UI slots"
    })
    slots: SlotUI[] = [];
    hideCandidates() {
        _.each(this.slots, (e) => {
            e.hideSelect();
        });
    }
    onClickRemove(e) {
        const t = e.getComponent(SlotUI);
        if (this.delegate && this.delegate.removeEquipSlot) {
            this.delegate.removeEquipSlot(t.slotIndex);
        }
    }
    onClickSlot(e) {
        const t = e.getComponent(SlotUI);
        if (this.delegate) {
            this.delegate.onSelectSlot(t.slotIndex);
        }
    }
    onLoad() {
        if (this.slots.length == 0) {
            this.slots = this.getComponentsInChildren(SlotUI);
        }
        _.each(this.slots, (slot: SlotUI, index: number) => {
            slot.slotIndex = index;
            slot.node.on("click", this.onClickSlot, this);
            slot.node.on("click-remove", this.onClickRemove, this);
        });
    }
    onSlotEquipChange(e, t) {
        this.refreshSlot(e, t);
    }
    refreshEquips(ids: number[]) {
        _.each(this.slots, (slot: SlotUI) => {
            const id = ids[slot.slotIndex];
            this.refreshSlot(id, slot.slotIndex);
        });
    }
    refreshSlot(id: number, index: number) {
        const slot = this.slots[index];
        if (index > 0 && this.delegate.isLocked(index)) {
            const o = EUNLOCKSYS_ID.Skill + index;
            slot.showLock(o);
        }
        else {
            slot.hideLock();
            if (id >= 0) {
                const r = this.delegate.getItemInfo(id);
                const i = r.icon;
                const s = r.quality;
                const c = r.name;
                slot.showItem(i, s, c);
                slot.hideEmpty();
            }
            else {
                slot.showEmpty();
            }
        }
    }
    showCandidates() {
        _.each(this.slots, (e) => {
            e.showSelect();
        });
    }
}
