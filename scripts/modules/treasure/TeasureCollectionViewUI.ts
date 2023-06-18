import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
import UIPool from "../common/UIPool";
import TeasureCollectionItemUI from "./TeasureCollectionItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TeasureCollectionViewUI extends UIPool {
    private collectionItems: TeasureCollectionItemUI[] = [];
    @property(cc.Layout)
    content: cc.Layout = null;
    createItems() {
        const types = _TeasureConfig.Instance.getTypes();
        for (let i = 0; i < types.length; i++) {
            const typeId = types[i];
            const item = this.get();
            const collectionItem = item.getComponent(TeasureCollectionItemUI);
            collectionItem.typeId = typeId;
            item.parent = this.content.node;
            this.collectionItems.push(collectionItem);
        }
    }
    onLoad() {
        this.createItems();
    }
}
