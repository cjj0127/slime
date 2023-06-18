import ItemUIBase from "../common/ItemUIBase";
import { E_GEAR_TYPE } from "../common/Const";
import _GearConfig from "../../ccstudio/config/_GearConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class DwarvenKingRewardItemUI extends ItemUIBase {
    @property(cc.SpriteFrame)
    armorSf = null;
    @property(cc.Label)
    nameLabel = null;
    @property(cc.Label)
    numLabel = null;
    @property(cc.Sprite)
    typeSprite = null;
    @property(cc.SpriteFrame)
    weaponSf = null;
    setNum(e) {
        this.numLabel.string = e.toString();
    }
    
    setType(e, t = false) {
        if (t) {
            // do nothing
        }
        else {
            const n = _GearConfig.Instance.get(e);
            if (n) {
                switch (n.type) {
                    case E_GEAR_TYPE.WEAPON:
                        this.typeSprite.spriteFrame = this.weaponSf;
                        break;
                    case E_GEAR_TYPE.ARMOR:
                        this.typeSprite.spriteFrame = this.armorSf;
                        break;
                }
            }
        }
    }
}
