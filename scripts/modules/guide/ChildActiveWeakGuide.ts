import QuestChain from "../quest/QuestChain";
import WeakGuide, { WeakGuideType } from "./WeakGuide";
import { GameConst } from "../common/Const";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ChildActiveWeakGuide extends WeakGuide {
    @property(cc.Node)
    checkNode: cc.Node = null;
    private toTop: boolean = false;
    weakGuideType: WeakGuideType = WeakGuideType.ChildActive;
    check() {
        if (QuestChain.Instance.chainQuestId > GameConst.GUIDE_END) {
            this.hide();
        }
        else {
            let isShow = false;
            for (let t = 0; t < this.checkNode.childrenCount; t++) {
                const n = this.node.getContentSize().height - 130 - 26;
                const o = this.checkNode.children[t].getChildByName("Button");
                if (o) {
                    const r = o.getComponent(WeakGuide);
                    if (r && r.GetIsShow()) {
                        if (this.checkNode.y > 140 * (t + 1)) {
                            isShow = true;
                            this.toTop = true;
                        }
                        else if (140 * (t + 1) <= this.checkNode.y + n) {
                            isShow = false;
                        }
                        else {
                            isShow = true;
                            this.toTop = false;
                        }
                    }
                }
            }
            isShow ? this.show() : this.hide();
        }
    }
    doAction() {
        let startOffsetY: number = -100;
        let endOffsetY: number = 200;
        if (this.toTop) {
            startOffsetY = 200;
            endOffsetY = -200;
        }
        if (this.guideNode) {
            cc.tween(this.guideNode)
                .sequence(cc.callFunc(() => {
                if (this.guideNode) {
                    this.guideNode.setPosition(0, startOffsetY, 0);
                }
            }), cc.moveBy(1, 0, endOffsetY), cc.callFunc(() => {
                if (this.guideNode) {
                    this.guideNode.setPosition(0, startOffsetY, 0);
                }
            }))
                .repeatForever()
                .start();
        }
    }
    start() { }
    update() {
        this.check();
    }
}
