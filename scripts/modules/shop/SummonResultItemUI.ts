import ItemUIBase from "../common/ItemUIBase";
import { E_SUMMON_TYPE, E_GEAR_TYPE, Q_COLOR } from "../common/Const";
import _GearConfig from "../../ccstudio/config/_GearConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SummonResultItemUI extends ItemUIBase {
    @property(cc.SpriteFrame)
    armorSf: cc.SpriteFrame = null;
    @property(cc.Node)
    glowNode: cc.Node = null;
    @property(cc.Sprite)
    typeSprite: cc.Sprite = null;
    @property(cc.SpriteFrame)
    weaponSf: cc.SpriteFrame = null;
    playGlow(e: number): void {
        if (e < 4) {
            this.glowNode.active = false;
        }
        else {
            this.glowNode.active = true;
            this.glowNode.stopAllActions();
            this.glowNode.color = cc.color().fromHEX(Q_COLOR[e]);
            cc.tween(this.glowNode).set({
                scale: 1,
            }).to(0.25, {
                scale: 0.95,
            }).union().repeatForever().start();
        }
    }
    setType(e: number, t: number): void {
        if (t >= E_SUMMON_TYPE.Gear) {
            const n = _GearConfig.Instance.get(e).type;
            switch (n) {
                case E_GEAR_TYPE.WEAPON:
                    this.typeSprite.spriteFrame = this.weaponSf;
                    break;
                case E_GEAR_TYPE.ARMOR:
                    this.typeSprite.spriteFrame = this.armorSf;
            }
        }
        else {
            this.typeSprite.spriteFrame = null;
        }
    }
}
