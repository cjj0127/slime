import { IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
// import AssetRes from 'AssetRes';
const { ccclass, property } = cc._decorator;
const TraitKind = [
    "",
    "trait_kind_1",
    "trait_kind_2",
    "trait_kind_3",
    "trait_kind_4",
    "trait_kind_5",
];
@ccclass
export default class TraitKindIconUI extends cc.Component {
    @property(cc.Sprite)
    private _icon: cc.Sprite = null;
    public setEmpty() {
        this.icon.node.active = false;
    }
    public setKind(kind: number) {
        const trait = TraitKind[kind];
        const path = `${IMAGE_ICON_PATH_}/${trait}`;
        this.icon.node.active = true;
        this.icon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, path);
    }
    get icon() {
        if (!this._icon) {
            this._icon = this.node.getComponent(cc.Sprite);
        }
        return this._icon;
    }
}
