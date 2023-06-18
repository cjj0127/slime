import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import Utils_ from "../../ccstudio/utils/Utils";
import WeakGuide, { WeakGuideType } from "./WeakGuide";
// import Utils from "Utils";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BossWeakGuide extends WeakGuide {
    weakGuideType = WeakGuideType.Boss;
    boosTip() {
        this.guideNode.parent = this.node;
        this.guideNode.position = cc.v3(0, -60);
    }
    doAction() {
        this.guideNode.getChildByName("finger").position = cc.v3(40, -40, 0);
        cc.tween(this.guideNode.getChildByName("finger")).sequence(cc.scaleTo(0.5, 1.2), cc.scaleTo(0.5, 1)).repeatForever().start();
    }
    async freshView(e = false) {
        let t = false;
        if (LocalStorageTool.getItemLocal("cc_bossWeakGuide") == null && e == true) {
            t = true;
            LocalStorageTool.setItemLocal("cc_bossWeakGuide", 1);
        }
        if (t) {
            Model.ui.closeAll();
            cc.director.emit(GlobalEventName.BossGuide);
            await Utils_.waits(0.5);
        }
        else {
            this.show();
            this.guideNode.parent = this.node;
            this.guideNode.position = cc.v3(0, -60);
            this.showTxt(LanMgr.Instance.getLangByID("Boss_Guide_Tip"));
            this.hideFinger();
        }
        let n = cc.find("App");
        let o = this.guideNode.parent.convertToWorldSpaceAR(cc.v3(0, -60));
        let r = n.convertToNodeSpaceAR(o);
        this.guideNode.parent = n;
        this.guideNode.position = r;
    }
    onLoad() {
        cc.director.on(GlobalEventName.RestartLevel, this.showTip, this);
        cc.director.on(GlobalEventName.BossTip, this.boosTip, this);
        this.node.on("click", this.hide, this);
        this.freshView();
    }
    showTip() {
        this.freshView(true);
    }
}
