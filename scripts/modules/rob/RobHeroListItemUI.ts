import LanMgr from "../common/Language";
import HeroListItemUI from "../hero/HeroListItemUI";
import { GlobalEventName } from "../common/Events";
import { ROB_BUILDTYPE_, IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RobHeroListItemUI extends HeroListItemUI {
    @property(cc.Sprite)
    typeIcon: cc.Sprite = null;
    @property(cc.Label)
    typeName: cc.Label = null;
    equipHero(type: number): void {
        if (type == this.getHeroId()) {
            this.setEquiped(true);
        }
    }
    initUI(type: number): void {
        const heroCfg = _HeroConfig.Instance.get(this.getHeroId());
        const typeName = ROB_BUILDTYPE_[heroCfg.heroType];
        this.typeName.string = LanMgr.Instance.getLangByID(typeName);
        this.typeIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, IMAGE_ICON_PATH_ + "/" + typeName);
        const isSelected = heroCfg.heroType == type;
        this.typeIcon.node.color = isSelected ? cc.color().fromHEX("#FFF900") : cc.color().fromHEX("#B1CAD4");
        this.typeName.node.color = isSelected ? cc.color().fromHEX("#FFF900") : cc.color().fromHEX("#B1CAD4");
    }
    onDisable(): void {
        cc.director.targetOff(this);
    }
    onEnable(): void {
        cc.director.on(GlobalEventName.AddRobHero, this.equipHero, this);
        cc.director.on(GlobalEventName.RemoveRobHero, this.unEquipHero, this);
    }
    unEquipHero(type: number): void {
        if (type == this.getHeroId()) {
            this.setEquiped(false);
        }
    }
}
