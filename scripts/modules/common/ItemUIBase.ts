import IconUI from "./IconUI";
import { QUALITY_SPRITE_PATH_, Q_SPRITE_FRAME } from "./Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
// import IconUI from "IconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemUIBase extends cc.Component {
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    private quality: number = -1;
    @property(cc.Sprite)
    qualitySprite: cc.Sprite = null;
    public setIcon(icon: any): void {
        (this.iconSprite.getComponent(IconUI) || this.iconSprite.addComponent(IconUI)).icon = icon;
    }
    setNameStr(name) {
    }
    public setQualityValue(quality: number): void {
        if (this.quality != quality) {
            this.quality = quality;
            const path: string = `${QUALITY_SPRITE_PATH_}/${Q_SPRITE_FRAME[quality]}`;
            this.qualitySprite.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, path);
        }
    }
}
