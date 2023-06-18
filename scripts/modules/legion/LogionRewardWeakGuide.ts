import LanMgr from "../common/Language";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import WeakGuide, { WeakGuideType } from "../guide/WeakGuide";
// import Language from "Language";
const { ccclass, property } = cc._decorator;
@ccclass
export default class LogionRewardWeakGuide extends WeakGuide {
    private weakGuideType: WeakGuideType = WeakGuideType.LegionReward;
    doAction() {
        this.guideNode.getChildByName("finger").position = cc.v3(40, -40, 0);
        cc.tween(this.guideNode.getChildByName("finger")).sequence(cc.scaleTo(.5, 1.2), cc.scaleTo(.5, 1)).repeatForever().start();
    }
    freshView() {
        let showGuide = false;
        if (LocalStorageTool.getItemLocal("cc_LegionRewardWeakGuide") == null) {
            showGuide = true;
            LocalStorageTool.setItemLocal("cc_LegionRewardWeakGuide", 1);
        }
        if (showGuide) {
            this.show();
            cc.log(LanMgr.Instance.getLangByID("guide_legionRush4"));
            this.showTxt2(LanMgr.Instance.getLangByID("guide_legionRush4"), cc.v3(0, 230));
            this.setFinger(cc.v3(0, 90), 180);
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
