import { GuideVerification } from "./GuideVerification";
import { GuideVerifactionEvent } from "./GuideEnums";
import { GlobalEventTarget } from "../common/GlobalEventTarget";
import CustomEventTarget from "../common/CustomEventTarget";
export default class DragInRegion extends GuideVerification {
    _nodes: any[] = [];
    public destroy() {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }
    onDragInRegin(nodes: cc.Node[]) {
        for (let i = 0; i < nodes.length; i++) {
            if (this._nodes.indexOf(nodes[i]) < 0) {
                return;
            }
        }
        this.onSuccess();
    }
    onSuccess() {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }
    constructor(nodes: string[]) {
        super();
        this._nodes.push(cc.find(nodes[0]));
        this._nodes.push(cc.find(nodes[1]));
        GlobalEventTarget.on(GuideVerifactionEvent.DRAG_IN_REGIN, this.onDragInRegin, this);
    }
}
