import CustomEventTarget from "./CustomEventTarget";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BaseUI extends cc.Component {
    private _touchId: any = null;
    private _touchMode: number = 0;

    _onSimpleTouchCancel(e) {
        this._touchId == e.getID() && (this.onTouchCancelHandler(e), this._touchId = null);
    }

    _onSimpleTouchEnd(e) {
        this._touchId == e.getID() && (this.onTouchEndHandler(e), this._touchId = null);
    }

    _onSimpleTouchMove(e) {
        this._touchId == e.getID() && this.onTouchMoveHandler(e);
    }

    _onSimpleTouchStart(e) {
        null == this._touchId && (this._touchId = e.getID(), this.onTouchStartHandler(e));
    }

    clearTouchId() {
        this._touchId = null;
    }

    onDestroy() {
        this.unregisterEvent();
    }
    onDisable() {
        this._touchId = null;
    }

    onEnable() { }

    onLoad() {
        this.registerEvent();
    }

    onTouchCancelHandler(e) { }

    onTouchEndHandler(e) { }

    onTouchMoveHandler(e) { }

    onTouchStartHandler(e) { }

    registerEvent() { }

    registerMutilTouchEvents() {
        this._touchMode = 1;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelHandler, this);
    }

    registerSimpleTouchEvents() {
        this.unregisterTouchEvents();
        this._touchMode = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, this._onSimpleTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onSimpleTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onSimpleTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onSimpleTouchCancel, this);
    }

    reuse() { }

    unregisterEvent() {
        CustomEventTarget.removeTargetAllEventTargets(this);
    }

    unregisterMutilTouchEvents() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelHandler, this);
    }

    unregisterSimpleTouchEvents() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onSimpleTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onSimpleTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onSimpleTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onSimpleTouchCancel, this);
    }

    unregisterTouchEvents() {
        null != this._touchMode && (0 == this._touchMode ? this.unregisterSimpleTouchEvents() : this.unregisterMutilTouchEvents(), this._touchMode = null);
    }

    unuse() {
        this.unscheduleAllCallbacks();
        this.node.stopAllActions();
        this.unregisterEvent();
    }
}
