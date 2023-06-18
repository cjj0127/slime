import GuideOut from "./GuideOut";
import MyTools from "../../ccstudio/utils/MyTools";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideUnlock extends cc.Component {
    @property(GuideOut)
    guideOut: GuideOut = null;
    async showFocusTo(e) {
        const t = cc.view.getVisibleSize();
        this.guideOut.width = t.width;
        this.guideOut.height = t.height;
        await MyTools.sleep(.22);
        const n = e.convertToWorldSpaceAR(cc.Vec3.ZERO), o = this.node.convertToNodeSpaceAR(n);
        this.guideOut.center = cc.v2(o);
        await this.guideOut.rectTo(.3, cc.v2(o), e.width, e.height, 6, 6);
    }
}
