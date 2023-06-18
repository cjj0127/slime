import { E_ITEM_TYPE, E_GEAR_TYPE } from "../common/Const";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import ItemUIBase from "../common/ItemUIBase";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RobLevelUpRewardItemUI extends ItemUIBase {
    @property(cc.SpriteFrame)
    armorSf: cc.SpriteFrame = null;
    @property(cc.Label)
    countLabel: cc.Label = null;
    id: number = 0;
    @property(cc.Sprite)
    typeSprite: cc.Sprite = null;
    @property(cc.SpriteFrame)
    weaponSf: cc.SpriteFrame = null;
    onEnable() { }
    refresh(): void {
        const itemCfg = _AssetConfig.Instance.get(this.id);
        if (itemCfg) {
            if (itemCfg.type == E_ITEM_TYPE.Gear) {
                const gearCfg = _GearConfig.Instance.get(this.id);
                this.setGearType(gearCfg.type);
            }
            this.setIcon(itemCfg.icon);
            const assetQuality = _AssetConfig.Instance.getAssetQuality(this.id);
            if (assetQuality !== -1) {
                this.setQualityValue(assetQuality);
            }
        }
    }
    setCount(count: number): void {
        const countStr = NumberPlus.format(count);
        this.countLabel.string = `x${countStr}`;
    }
    setGearType(type: E_GEAR_TYPE): void {
        switch (type) {
            case E_GEAR_TYPE.WEAPON:
                this.typeSprite.spriteFrame = this.weaponSf;
                break;
            case E_GEAR_TYPE.ARMOR:
                this.typeSprite.spriteFrame = this.armorSf;
        }
    }
    setItemInfo(id: number, count: number): void {
        if (this.id != id) {
            this.id = id;
            this.refresh();
        }
        this.setCount(count);
    }
}
