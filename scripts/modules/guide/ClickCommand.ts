import GuideMgr from "./GuideMgr";
import UIUtil from "../common/UIUtil";
export default class ClickCommand {
    private _node: cc.Node;
    private _pressed: boolean = false;
    onTouchCancelHandler(): void {
        this._pressed = false;
    }
    onTouchEndHandler(e: cc.Event.EventTouch): void {
        const t = this._node.getComponent(cc.Button);
        if (t && !t.interactable) {
            return;
        }
        if (this._pressed && UIUtil.isTouchInNodeRect(this._node, e.getLocation())) {
            e.currentTarget = this._node;
            e.target = this._node;
            this._node.dispatchEvent(e);
        }
        this._pressed = false;
    }
    onTouchMoveHandler(): boolean {
        return this._pressed;
    }
    onTouchStartHandler(e: cc.Event.EventTouch): void {
        const t = this._node.getComponent(cc.Button);
        if (t && !t.interactable) {
            return;
        }
        if (UIUtil.isTouchInNodeRect(this._node, e.getLocation())) {
            this._pressed = true;
            e.currentTarget = this._node;
            e.target = this._node;
            this._node.dispatchEvent(e);
        }
    }
    constructor(e: string) {
        this._node = GuideMgr.instance.getGuideNode(Number(e));
        if (this._node == null) {
            cc.error("node is null");
        }
    }
}
