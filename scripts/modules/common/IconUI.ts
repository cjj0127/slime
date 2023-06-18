import { IMAGE_ICON_PATH_ } from "./Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
const { ccclass, property } = cc._decorator;
@ccclass
export default class IconUI extends cc.Component {
    public _icon: string = null;
    @property(cc.Sprite)
    public _sprite: cc.Sprite = null;
    @property
    public iconOriginSize: cc.Size = null;
    private applyIcon(): void {
        if (isEmpty(this.icon)) {
            this.iconSprite.spriteFrame = null;
        }
        else {
            const path = IMAGE_ICON_PATH_ + '/' + this.icon;
            const size = this.iconSize;
            this.iconSprite.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, path);
            const contentSize = this.iconSprite.node.getContentSize();
            if (contentSize.width > contentSize.height) {
                this.iconSprite.node.scale = size.width / this.iconSprite.node.width;
            }
            else {
                this.iconSprite.node.scale = size.height / this.iconSprite.node.height;
            }
        }
    }
    get icon(): string {
        return this._icon;
    }
    set icon(value: string) {
        if (this._icon !== value) {
            this._icon = value;
            this.applyIcon();
        }
    }
    get iconSize(): cc.Size {
        if (!this.iconOriginSize) {
            this.iconOriginSize = this.iconSprite.node.getContentSize();
            this.iconSprite.trim = false;
            this.iconSprite.sizeMode = cc.Sprite.SizeMode.RAW;
        }
        return this.iconOriginSize;
    }
    get iconSprite(): cc.Sprite {
        if (!this._sprite) {
            this._sprite = this.node.getComponent(cc.Sprite);
        }
        return this._sprite;
    }
}
function isEmpty(str: string): boolean {
    return str == null || str == undefined || str.trim() == '';
}
