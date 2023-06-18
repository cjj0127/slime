import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import ItemUIBase from "../common/ItemUIBase";
// import ItemUIBase from "ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIAssetReceiveItem extends ItemUIBase {
    @property(cc.Label)
    private countLabel: cc.Label = null;
    private setCount(count: number): void {
        this.countLabel.string = `x${count}`;
    }
    public setItemData(itemId: string, itemCount: number, name: string): void {
        const asset = _AssetConfig.Instance.get(itemId);
        this.setIcon(asset.icon);
        let quality = _AssetConfig.Instance.getAssetQuality(itemId);
        if (quality < 0) {
            quality = 1;
        }
        this.setQualityValue(quality);
        this.setCount(itemCount);
    }
}
