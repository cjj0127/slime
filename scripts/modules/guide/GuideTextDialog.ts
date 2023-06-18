import { GuideCommandType } from "./GuideEnums";
import _GuideConfig from "../../ccstudio/config/_GuideConfig";
import GuideMgr from "./GuideMgr";
import LanMgr from "../common/Language";
import UIUtil from "../common/UIUtil";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideTextDialog extends cc.Component {
    private _command: any;
    private _id: number;
    private _nodePos: cc.Vec2;
    private _nodes: cc.Node[];
    private _text: string;
    @property(cc.Node)
    text: cc.Node = null;
    @property(cc.Label)
    textLabel: cc.Label = null;
    init(e) {
        if ("" != e.text) {
            this._id = e.id;
            this._text = LanMgr.Instance.getLangByID(e.text);
            this._command = e.command;
            this.initNodes();
            this.refresh();
        }
        else {
            this.node.active = false;
        }
    }
    initNodes() {
        this._nodes = [];
        if (this._command.type == GuideCommandType.CLICK || this._command.type == GuideCommandType.DRAG) {
            for (let e = 0; e < this._command.args.length; e++) {
                let t = Number(this._command.args[0]);
                let n = GuideMgr.instance.getGuideNode(t);
                this._nodes.push(n);
            }
        }
    }
    refresh() {
        this.textLabel.string = this._text;
        this.text.getComponent(cc.Layout).updateLayout();
        this.node.getComponent(cc.Layout).updateLayout();
        this.updatePos();
    }
    update() {
        this.updatePos();
    }
    updatePos() {
        if (this._command.type == GuideCommandType.CLICK) {
            let e = UIUtil.convertToNodeSpaceAR(this._nodes[0], cc.v2(0, 0), this.node.parent);
            if (!this._nodePos || !e.equals(this._nodePos)) {
                let t: number, n = _GuideConfig.Instance.get(this._id).textPos;
                t = e.y >= cc.winSize.height / 2 - 350 ? e.y - 200 : e.y + 250;
                t += n;
                this.node.setPosition(0, t);
                this._nodePos = e;
            }
        }
        else if (this._command.type == GuideCommandType.DRAG) {
            let o = UIUtil.convertToNodeSpaceAR(this._nodes[0], cc.v2(0, 0), this.node.parent);
            let r = UIUtil.convertToNodeSpaceAR(this._nodes[1], cc.v2(0, 0), this.node.parent);
            let i: number, s: number;
            if (Math.abs(o.x - r.x) >= this.node.getContentSize().width) {
                i = (r.x + o.x) / 2;
            }
            else {
                i = Math.abs(r.x) < Math.abs(o.x) ? r.x : o.x;
                if (i > 0) {
                    i -= this.node.getContentSize().width;
                    i = Math.max(i, -cc.winSize.width / 2 + this.node.getContentSize().width);
                }
                else {
                    i += this.node.getContentSize().width;
                    i = Math.min(i, cc.winSize.width / 2 - this.node.getContentSize().width / 2);
                }
            }
            if (Math.abs(r.y - o.y) >= this.node.getContentSize().height) {
                s = (r.y + o.y) / 2;
            }
            else {
                s = Math.abs(r.y) < Math.abs(o.y) ? r.y : o.y;
                if (s > 0) {
                    s -= this.node.getContentSize().height;
                    s = Math.max(s, -cc.winSize.height / 2 + this.node.getContentSize().height / 2);
                }
                else {
                    s += this.node.getContentSize().height;
                    s = Math.min(s, cc.winSize.height / 2 - this.node.getContentSize().width / 2);
                }
            }
            this.node.setPosition(i, s);
            this._nodePos = cc.v2(i, s);
        }
    }
}
