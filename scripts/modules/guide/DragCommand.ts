import { GuideEvent } from "./GuideEnums";
import UIUtil from "../common/UIUtil";
import { GlobalEventTarget } from "../common/GlobalEventTarget";
export default class DragCommand {
    private _nodes: cc.Node[];
    public onTouchEndHandler(event: cc.Event.EventTouch): void {
        if (UIUtil.isTouchInNodeRect(this._nodes[1], event.getLocation())) {
            event.target._touchListener.setSwallowTouches(false);
        }
        else {
            event.target._touchListener.setSwallowTouches(true);
            GlobalEventTarget.emit(GuideEvent.TASK_VERIFICTION_FAILED);
        }
    }
    public onTouchStartHandler(event: cc.Event.EventTouch): void {
        if (UIUtil.isTouchInNodeRect(this._nodes[0], event.getLocation())) {
            event.target._touchListener.setSwallowTouches(false);
        }
        else {
            event.target._touchListener.setSwallowTouches(true);
        }
    }
    constructor(nodes: string[]) {
        this._nodes = [];
        nodes.forEach((node) => {
            const n = cc.find(node);
            UIUtil.updateNodeWidget(n);
            this._nodes.push(n);
        });
    }
}
