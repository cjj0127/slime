import GuideMgr from "./GuideMgr";
import { GuideVerifactionEvent } from "./GuideEnums";
import { GlobalEventTarget } from "../common/GlobalEventTarget";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideTouch extends cc.Component {
    @property(cc.Integer)
    id: number = 0;
    TouchGuide() {
        GlobalEventTarget.emit(GuideVerifactionEvent.CLICK_IN_REGIN, this.node, this.id);
    }
    addGuideNode(id: number) {
        GuideMgr.instance.addGuideNode(id, this.node);
    }
    onDisable() {
        GuideMgr.instance.removeGuideNode(this.id);
    }
    onEnable() {
    }
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.TouchGuide, this);
        if (this.id !== 0) {
            this.addGuideNode(this.id);
        }
    }
    setId(id: number) {
        this.addGuideNode(id);
    }
}
