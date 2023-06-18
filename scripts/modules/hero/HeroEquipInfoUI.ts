import ItemUIBase from "../common/ItemUIBase";
// import ItemUIBase from "ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroEquipInfoUI extends ItemUIBase {
    icon;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    setLevel(e: number) {
        this.levelLabel.string = "LV" + e;
    }
    setNameStr(e) { }
    showEmpty() {
        this.levelLabel.string = "";
        this.icon = "";
        this.iconSprite.spriteFrame = null;
    }
}
