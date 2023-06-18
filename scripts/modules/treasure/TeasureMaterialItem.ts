import { IMAGE_ICON_PATH_, COLOR_WHITE, COLOR_RED } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import UserData from "../user/UserData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TeasureMaterialItem extends cc.Component {
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    valueLabel: cc.Label = null;
    showItem(e: string, t: string) {
        const n = _AssetConfig.Instance.get(Number(e));
        const o = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, IMAGE_ICON_PATH_ + "/" + n.icon);
        this.icon.spriteFrame = o;
        this.valueLabel.string = t.toString();
        this.valueLabel.node.color = Number(UserData.Instance.getItem(Number(e))) >= Number(NumberPlus.decode(t)) ? COLOR_WHITE : COLOR_RED;
    }
}
