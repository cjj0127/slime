import AddCoinLabel from "../common/AddCoinLabel";
import MineDigOptionDragIconUI from "./MineDigOptionDragIconUI";
import { E_MINE_TOOL_TYPE } from "../../ccstudio/data/MineModel";
// import MineDigOptionDragIconUI from "MineDigOptionDragIconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineDigOptionBtnUI extends cc.Component {
    _toggle: cc.Toggle = null;
    @property(AddCoinLabel)
    countLabel: AddCoinLabel = null;
    currSelectItem: any = null;
    deletage: any = null;
    @property(MineDigOptionDragIconUI)
    draggableIcon: MineDigOptionDragIconUI = null;
    @property({ type: cc.Enum(E_MINE_TOOL_TYPE) })
    toolType: E_MINE_TOOL_TYPE = E_MINE_TOOL_TYPE.TOOL_Pickax;
    _onToggle(e: any) {
        e.isChecked && !this.draggableIcon.isDragging && this.deletage && this.deletage.checkTool(this.toolType);
    }
    onDestroy() {
        this.deletage = null;
    }
    onDragEnd(e: any) {
        this.currSelectItem = null;
        let t = this.deletage.mineList.getLocationItem(e);
        if (t && !this.deletage.mineList.isInVisible(t)) {
            t = null;
        }
        this.deletage.onBtnDragEnd(t);
    }
    onDragMove(e: any) {
        let t = this.deletage.mineList.getLocationItem(e);
        if (t && !this.deletage.mineList.isInVisible(t)) {
            t = null;
        }
        if (this.currSelectItem != t) {
            this.currSelectItem = t;
            this.deletage.onBtnDragMove(this.currSelectItem);
        }
    }
    onDragStart() {
        this.deletage && this.deletage.checkTool(this.toolType);
    }
    onLoad() {
        this.toggle = this.getComponent(cc.Toggle);
        this.draggableIcon.deletage = this;
        this.node.on("toggle", this._onToggle, this);
    }
    setCount(count: number) {
        this.countLabel.string = "" + count;
    }
    get toggle() {
        return this._toggle;
    }
    set toggle(toggle: cc.Toggle) {
        this._toggle = toggle;
    }
}
