import { E_SHOP_GOODS_TYPE } from "../common/Const";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import ItemUIBase from "../common/ItemUIBase";
import AssetInfoUI from "../asset/AssetInfoUI";
// import ItemUIBase from 'ItemUIBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopSymbolItemUI extends ItemUIBase {
    private assetId: number = 0;
    @property(cc.Label)
    countlabel: cc.Label = null;
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchIcon, this);
    }
    onTouchIcon() {
        this.showAssetInfo();
    }
    setCount(count: number) {
        this.countlabel.string = `x${count}`;
    }
    setItemInfo({ type, id, count }: {
        type: number;
        id: number;
        count: number;
    }) {
        this.assetId = id;
        if (type == E_SHOP_GOODS_TYPE.Asset) {
            const cfg = _AssetConfig.Instance.get(id);
            this.setIcon(cfg.icon);
            this.setQualityValue(1);
        }
        this.setCount(count);
    }
    showAssetInfo() {
        AssetInfoUI.addPopItem(this.assetId, this.node);
    }
}
