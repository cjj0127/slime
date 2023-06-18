import { E_MINE_SP_TYPE_TILE } from "../../ccstudio/data/MineModel";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Mine/Edit/MineEditSpItemUI")
export default class MineEditSpItemUI extends cc.Component {
    @property({
        type: cc.Enum(E_MINE_SP_TYPE_TILE)
    })
    spType = E_MINE_SP_TYPE_TILE.eNone;
    onLoad() {
        this.node.addComponent(cc.Button);
    }
}
