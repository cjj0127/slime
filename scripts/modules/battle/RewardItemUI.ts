import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import ItemUIBase from "../common/ItemUIBase";
// import ItemUIBase from "ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RewardItemUI extends ItemUIBase {
    @property(cc.Label)
    countLabel: cc.Label = null;
    private id: number = 0;
    refresh(): void {
        const asset = _AssetConfig.Instance.get(this.id);
        if (asset) {
            this.setIcon(asset.icon);
            const quality = _AssetConfig.Instance.getAssetQuality(this.id);
            this.setQualityValue(quality);
        }
    }
    setCount(count: number): void {
        this.countLabel.string = "x" + count;
    }
    setItemInfo(id: number, count: number): void {
        if (this.id != id) {
            this.id = id;
            this.refresh();
        }
        this.setCount(count);
    }
}
