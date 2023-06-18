import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import WeakGuide, { WeakGuideType } from "../guide/WeakGuide";
// import { default as LocalStorage } from "LocalStorage";
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionEnterWeakGuide extends WeakGuide {
    weakGuideType: WeakGuideType = WeakGuideType.LegionEnter;
    doAction() {
        this.guideNode.getChildByName("finger").position = cc.v3(40, -40, 0);
        cc.tween(this.guideNode.getChildByName("finger")).sequence(cc.scaleTo(.5, 1.2), cc.scaleTo(.5, 1)).repeatForever().start();
    }
    freshView() {
        let shouldShowGuide = false;
        if (LocalStorageTool.getItemLocal("cc_LegionEnterWeakGuide") == null) {
            shouldShowGuide = true;
            LocalStorageTool.setItemLocal("cc_LegionEnterWeakGuide", 1);
        }
        if (shouldShowGuide) {
            this.show();
            this.setFinger(cc.v3(150, 0), 90);
        }
        else {
            this.hide();
        }
    }
    onEnable() {
        this.node.on("click", this.hide, this);
        this.freshView();
    }
}
