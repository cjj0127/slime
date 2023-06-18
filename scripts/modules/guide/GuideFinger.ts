import GuideMgr from "./GuideMgr";
import { GuideCommandType, SpecialGuideEnum } from "./GuideEnums";
import UIUtil from "../common/UIUtil";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideFinger extends cc.Component {
    private _command: any;
    private _curTaskId: number = 0;
    private _nodePos: cc.Vec2[];
    private _nodes: cc.Node[];
    @property(cc.Node)
    circle: cc.Node = null;
    @property(cc.Node)
    icon: cc.Node = null;
    public init(e: any, t: number): void {
        this._curTaskId = t;
        this._command = e;
        this.resetUI();
        this.updateNodesInfo();
        this.refreshUI();
        this.onNodePosChange();
    }
    public onNodePosChange(): void {
        if (this._command.type == GuideCommandType.CLICK) {
            const e: cc.Vec2 = this._nodePos[0];
            this.updateScaleAndAngel(e);
            this.node.stopAllActions();
            cc.tween(this.node)
                .sequence(cc.moveTo(.3, e), cc.callFunc(() => {
                if (this._curTaskId != SpecialGuideEnum.TouchAnyWhere) {
                    this.circle.active = true;
                }
                cc.tween(this.icon)
                    .sequence(cc.scaleTo(.5, 1.2), cc.scaleTo(.5, 1), cc.callFunc(() => { }))
                    .repeatForever()
                    .start();
                cc.tween(this.circle)
                    .sequence(cc.spawn(cc.scaleTo(1, 1.2), cc.fadeOut(1)), cc.callFunc(() => {
                    this.circle.scale = 1;
                    this.circle.opacity = 255;
                }))
                    .repeatForever()
                    .start();
            }))
                .start();
        }
        else if (this._command.type == GuideCommandType.DRAG) {
            const e: cc.Vec2 = this._nodePos[0];
            this.updateScaleAndAngel(e);
            this.node.setPosition(e);
            this.node.stopAllActions();
            cc.tween(this.node)
                .sequence(cc.moveTo(1, this._nodePos[1]), cc.callFunc(() => {
                this.node.setPosition(this._nodePos[0]);
            }))
                .repeatForever()
                .start();
        }
    }
    public refreshUI(): void {
        this.icon.active = true;
    }
    public resetUI(): void {
        this.node.scale = 1;
        this.node.stopAllActions();
        this.icon.active = false;
        this.icon.angle = 0;
        this.icon.scale = 1;
        this.icon.stopAllActions();
        this.circle.active = false;
        this.circle.scale = 1;
        this.circle.opacity = 255;
        this.circle.stopAllActions();
    }
    public update(): void {
        if (this._command.type == GuideCommandType.CLICK) {
            const e: cc.Vec2 = UIUtil.convertToNodeSpaceAR(this._nodes[0], cc.v2(0, 0), this.node.parent);
            if (!e.equals(this._nodePos[0])) {
                this._nodePos[0] = e;
                this.onNodePosChange();
            }
        }
        else if (this._command.type == GuideCommandType.DRAG) {
            const e: cc.Vec2 = UIUtil.convertToNodeSpaceAR(this._nodes[0], cc.v2(0, 0), this.node.parent);
            const t: cc.Vec2 = UIUtil.convertToNodeSpaceAR(this._nodes[1], cc.v2(0, 0), this.node.parent);
            if (e.equals(this._nodePos[0]) && t.equals(this._nodePos[1])) {
                this._nodePos[0] = e;
                this._nodePos[1] = t;
                this.onNodePosChange();
            }
        }
    }
    public updateNodesInfo(): void {
        this._nodes = [];
        this._nodePos = [];
        if (this._command.type == GuideCommandType.CLICK) {
            const e: number = Number(this._command.args[0]);
            const t: cc.Node = GuideMgr.instance.getGuideNode(e);
            this._nodes.push(t);
            this._nodePos.push(UIUtil.convertToNodeSpaceAR(this._nodes[0], cc.v2(0, 0), this.node.parent));
        }
        else if (this._command.type == GuideCommandType.DRAG) {
            this._nodes.push(cc.find(this._command.args[0]));
            this._nodes.push(cc.find(this._command.args[1]));
            this._nodePos.push(UIUtil.convertToNodeSpaceAR(this._nodes[0], cc.v2(0, 0), this.node.parent));
            this._nodePos.push(UIUtil.convertToNodeSpaceAR(this._nodes[1], cc.v2(0, 0), this.node.parent));
        }
    }
    public updateScaleAndAngel(e: cc.Vec2): void {
        if (e.y < 0 - cc.winSize.height / 2 + 200) {
            this.node.scaleY = -1;
            this.node.y = 120;
        }
        else {
            this.node.scaleY = 1;
            this.node.y = -120;
        }
    }
}
