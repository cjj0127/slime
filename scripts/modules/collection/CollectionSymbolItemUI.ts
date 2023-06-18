import ItemUIBase from "../common/ItemUIBase";
// import ItemUIBase from "ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CollectionSymbolItemUI extends ItemUIBase {
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Node)
    unlockNode: cc.Node = null;
    setLevel(e: number, t: number): void {
        this.levelLabel.string = `${e}/${t}`;
        this.levelLabel.node.color = e >= t ? cc.Color.WHITE : cc.Color.RED;
        this.unlockNode.active = e < t;
    }
}
