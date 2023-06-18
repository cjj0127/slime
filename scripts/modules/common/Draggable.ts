export enum DragEvent {
    DRAG_START = "drag-start",
    DRAG_MOVE = "drag-move",
    DRAG_END = "drag-end"
}
const { ccclass, property } = cc._decorator;
@ccclass
export default class Draggable extends cc.Component {
    _isDragging = false;
    dragOffset = null;
    @property()
    dragThreshold = 1;
    @property()
    revertPos: boolean = false;
    touchStartNodePos = null;
    touchStartPos = null;
    onDestroy() {
        this.unregisterEvent();
    }
    onDisable() {
        this._isDragging = false;
        if (this.revertPos && this.touchStartNodePos)
            this.node.setPosition(this.touchStartNodePos);
    }
    onDragEnd(e = null) {
    }
    onDragMove(e = null) {
    }
    onDragStart(e = null) {
    }
    onLoad() {
        this.registerEvent();
    }
    onTouchCancelHandler(e: cc.Event.EventTouch) {
        this.onTouchEndHandler(e);
    }
    onTouchEndHandler(e) {
        if (this.dragOffset) {
            this.touchStartPos = null;
            this.dragOffset = null;
            if (this._isDragging) {
                this._isDragging = false;
                this.onDragEnd();
            }
            if (this.revertPos && this.touchStartNodePos)
                this.node.setPosition(this.touchStartNodePos);
        }
    }
    onTouchMoveHandler(e: cc.Event.EventTouch) {
        if (this.dragOffset) {
            const pos = e.getLocation();
            const parentAR = this.node.getParent().convertToNodeSpaceAR(pos);
            if (!this._isDragging && this.dragThreshold !== 0) {
                if (cc.Vec2.distance(this.touchStartPos, pos) < this.dragThreshold)
                    return;
                this.dragOffset = parentAR.sub(this.node.getPosition());
            }
            this.node.setPosition(parentAR.sub(this.dragOffset));
            if (this._isDragging)
                this.onDragMove();
            else {
                this._isDragging = true;
                this.onDragStart();
            }
        }
    }
    onTouchStartHandler(e: cc.Event.EventTouch) {
        this.touchStartPos = e.getLocation();
        this.touchStartNodePos = this.node.getPosition();
        const parentAR = this.node.getParent().convertToNodeSpaceAR(e.getLocation());
        this.dragOffset = parentAR.sub(this.node.getPosition());
    }
    registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelHandler, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
    }
    unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelHandler, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
    }
    get isDragging() {
        return this._isDragging;
    }
}
