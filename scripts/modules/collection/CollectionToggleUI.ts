import { E_COLLECTION_TYPE } from "../common/Const";
// import Const from "Const";
const { ccclass, property, requireComponent } = cc._decorator;
@ccclass
@requireComponent(cc.Toggle)
export default class CollectionToggleUI extends cc.Component {
    delegate = null;
    @property({
        type: cc.Enum(E_COLLECTION_TYPE)
    })
    type = E_COLLECTION_TYPE.Gear;
    onEnable() {
        const toggleComponent = this.getComponent(cc.Toggle);
        if (toggleComponent.isChecked) {
            this.onToggle();
        }
    }
    onLoad() {
        this.node.on("toggle", this.onToggle, this);
    }
    onToggle() {
        this.delegate.onToggle(this.type);
    }
}
