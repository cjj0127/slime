import { E_MINE_TILE_TYPE } from "../../ccstudio/data/MineModel";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Mine/Edit/MineEditTileItemUI")
export default class MineEditTileItemUI extends cc.Component {
    @property({
        type: cc.Enum(E_MINE_TILE_TYPE)
    })
    tileType: E_MINE_TILE_TYPE = E_MINE_TILE_TYPE.eEmpty;
    hideSelect() {
        this.node.color = cc.Color.WHITE;
    }
    onLoad() {
        this.node.addComponent(cc.Button);
    }
    showSelect() {
        this.node.color = cc.Color.GREEN;
    }
}
