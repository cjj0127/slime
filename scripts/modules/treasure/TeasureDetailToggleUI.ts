import IconUI from "../common/IconUI";
import { COLOR_WHITE, COLOR_GRAY } from "../common/Const";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TeasureDetailToggleUI extends cc.Component {
    @property(cc.Node)
    euqipFlag: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    treasureId: number = 0;
    setEquipState(e: boolean): void {
        this.euqipFlag.active = e ? true : false;
    }
    setIcon(e: any): void {
        this.icon.node.getComponent(IconUI).icon = e;
    }
    setOwned(e: boolean): void {
        this.node.color = e ? COLOR_WHITE : COLOR_GRAY;
        this.icon.node.color = e ? COLOR_WHITE : COLOR_GRAY;
    }
    ;
}
