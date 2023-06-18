import GuideMgr from "./GuideMgr";
import { GuideCommandType, SpecialGuideEnum } from "./GuideEnums";
import RobModel from "../../ccstudio/data/RobModel";
import Model from "../../ccstudio/data/Model";
import UIUtil from "../common/UIUtil";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideMask extends cc.Component {
    private _command: {
        type: any;
        args: any;
    };
    private _id: number;
    private _nodePos: cc.Vec2[] = [];
    private _nodes: cc.Node[] = [];
    public init(e: any) {
        this._command = e.command;
        this._id = e.id;
        this.updateNodesInfo();
        this.refresh();
    }
    //     t.prototype.refresh = function() {
    //         var e = this.getComponent(cc.Mask)._graphics;
    //         if (e.clear(), this._command.type == c.GuideCommandType.CLICK || this._command.type == c.GuideCommandType.DRAG) {
    //             for (var t = 0; t < this._nodePos.length; t++) {
    //                 var n = this._nodes[t].width,
    //                 o = this._nodes[t].height;
    //                 this._id != SpecialGuideEnum.TouchFirstBuild && this._id != SpecialGuideEnum.TouchBuildReward || null != a.default.Instance.getMapCtr() && (n = a.default.Instance.getMapCtr().getMapScale() * n, o = a.default.Instance.getMapCtr().getMapScale() * o),
    //                 e.rect(this._nodePos[t].x - n / 2, this._nodePos[t].y - o / 2, n, o)
    //             }
    //             e.fill()
    //         }
    //     },
    private refresh(): void {
        //@ts-ignore
        const graphics = this.getComponent(cc.Mask)._graphics;
        graphics.clear();
        if (this._command.type == GuideCommandType.CLICK || this._command.type == GuideCommandType.DRAG) {
            for (let i = 0; i < this._nodePos.length; i++) {
                let width = this._nodes[i].width;
                let height = this._nodes[i].height;
                if (this._id != SpecialGuideEnum.TouchFirstBuild && this._id != SpecialGuideEnum.TouchBuildReward) {
                    if (null != Model.rob.getMapCtr()) {
                        width = Model.rob.getMapCtr().getMapScale() * width;
                        height = Model.rob.getMapCtr().getMapScale() * height;
                    }
                }
                graphics.rect(this._nodePos[i].x - width / 2, this._nodePos[i].y - height / 2, width, height);
            }
            graphics.fill();
        }
    }
    public update(): void {
        if (this._command.type == GuideCommandType.CLICK) {
            const nodePos = UIUtil.convertToNodeSpaceAR(this._nodes[0], cc.v2(0, 0), this.node.parent);
            if (!nodePos.equals(this._nodePos[0])) {
                this._nodePos[0] = nodePos;
                this.refresh();
            }
        }
        else if (this._command.type == GuideCommandType.DRAG) {
            const nodePos0 = UIUtil.convertToNodeSpaceAR(this._nodes[0], cc.v2(0, 0), this.node.parent);
            const nodePos1 = UIUtil.convertToNodeSpaceAR(this._nodes[1], cc.v2(0, 0), this.node.parent);
            if (!nodePos0.equals(this._nodePos[0]) || !nodePos1.equals(this._nodePos[1])) {
                this._nodePos[0] = nodePos0;
                this._nodePos[1] = nodePos1;
                this.refresh();
            }
        }
    }
    private updateNodesInfo(): void {
        this._nodes = [];
        this._nodePos = [];
        for (let i = 0; i < this._command.args.length; i++) {
            const id = Number(this._command.args[0]);
            const node = GuideMgr.instance.getGuideNode(id);
            this._nodes.push(node);
            this._nodePos.push(UIUtil.convertToNodeSpaceAR(this._nodes[i], cc.v2(0, 0), this.node));
        }
    }
}
