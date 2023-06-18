import UserData from "../user/UserData";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, IMAGE_ICON_PATH_, GameConst } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
// import UserData from "UserData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BossKeyCountUI extends cc.Component {
    @property(cc.Sprite)
    public assetIcon: cc.Sprite = null;
    @property({ type: cc.Enum(E_ASSET_TYPE) })
    public assetType: E_ASSET_TYPE = E_ASSET_TYPE.BossRushKey;
    @property(cc.Label)
    public keyCountLabel: cc.Label = null;
    onCountChange() {
        this.setCount(UserData.Instance.getItem(this.assetType));
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.setCount(UserData.Instance.getItem(this.assetType));
        this.refreshKeyIcon();
        cc.director.on(GlobalEventName.AssetItemChange + this.assetType, this.onCountChange, this);
    }
    refreshKeyIcon() {
        const assetCfg = _AssetConfig.Instance.get(this.assetType);
        const icon = IMAGE_ICON_PATH_ + "/" + assetCfg.icon;
        this.assetIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, icon);
        this.assetIcon.node.scale = 35 / this.assetIcon.node.width;
    }
    setCount(count: number) {
        let autoReplenishedCount = GameConst.BOSS_AUTO_REPLENISHED_COUNT;
        if (this.assetType == E_ASSET_TYPE.HeroLegion) {
            autoReplenishedCount = GameConst.LEGION_KEY_NUM;
        }
        this.keyCountLabel.string = count + "/" + autoReplenishedCount;
    }
}
