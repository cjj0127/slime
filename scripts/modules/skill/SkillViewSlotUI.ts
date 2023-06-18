import SlotUI from "../battle/SlotUI";
// import SlotUI from 'SlotUI';
const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillViewSlotUI extends SlotUI {
    @property(cc.Label)
    levelLabel: cc.Label = null;
    setLevel(e: number) {
        this.levelLabel.string = `LV${e}`;
    }
    showEmpty() {
        super.showEmpty();
        this.levelLabel.string = '';
    }
}
