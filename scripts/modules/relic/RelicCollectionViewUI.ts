import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import UIPool from "../common/UIPool";
import RelicCollectionItemUI from "./RelicCollectionItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicCollectionViewUI extends UIPool {
    private collectionItems: RelicCollectionItemUI[] = [];
    @property(cc.Layout)
    content: cc.Layout = null;
    createItems() {
        const types = _RelicConfig.Instance.getTypes();
        for (let i = 0; i < types.length; i++) {
            const typeId = types[i];
            const item = this.get();
            const itemComponent = item.getComponent(RelicCollectionItemUI);
            itemComponent.typeId = typeId;
            item.parent = this.content.node;
            this.collectionItems.push(itemComponent);
        }
    }
    onLoad() {
        this.createItems();
    }
}
