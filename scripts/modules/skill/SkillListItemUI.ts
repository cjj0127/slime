import UIListViewItem from "../../ccstudio/display/UIListViewItem";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillListItemUI extends UIListViewItem {
    @property(cc.SpriteFrame)
    equipSpriteFrame = null;
    @property(cc.SpriteFrame)
    unequipSpriteFrame = null;
    setEquiped(e: boolean) {
        this.btnEquip.target.getComponent(cc.Sprite).spriteFrame = e ? this.unequipSpriteFrame : this.equipSpriteFrame;
    }
}
