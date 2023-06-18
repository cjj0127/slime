import { AssetFlyViewUI } from "./AssetFlyViewUI";
import { E_ASSET_TYPE } from "../common/Const";
import AddCoinLabel from "../common/AddCoinLabel";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CoinComponent extends cc.Component {
    @property(AddCoinLabel)
    addCoinLabel = null;
    @property({
        type: cc.Enum(E_ASSET_TYPE)
    })
    assetType = E_ASSET_TYPE.Coin;
    onDisable() {
        AssetFlyViewUI.Instance.unregister(this.assetType);
    }
    onEnable() {
        const parentComponent = this.node.getComponentInParent(ViewAnimCtrl);
        if (parentComponent) {
            parentComponent.node.once("anim-in-done", () => {
                AssetFlyViewUI.Instance.register(this.assetType, this.node.convertToWorldSpaceAR(cc.Vec3.ZERO), this.addCoinLabel);
            });
        }
        else {
            this.scheduleOnce(() => {
                AssetFlyViewUI.Instance.register(this.assetType, this.node.convertToWorldSpaceAR(cc.Vec3.ZERO), this.addCoinLabel);
            });
        }
    }
}
