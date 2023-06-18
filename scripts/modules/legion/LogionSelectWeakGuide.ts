import WeakGuide, { WeakGuideType } from "../guide/WeakGuide";
// import WeakGuide from "WeakGuide";
const { ccclass, property } = cc._decorator;
@ccclass
export default class LogionSelectWeakGuide extends WeakGuide {
    private weakGuideType: number = WeakGuideType.LegionSelect;
    doAction() {
        this.guideNode.getChildByName("finger").position = cc.v3(40, -40, 0);
        cc.tween(this.guideNode.getChildByName("finger")).sequence(cc.scaleTo(.5, 1.2), cc.scaleTo(.5, 1)).repeatForever().start();
    }
    onEnable() { }
}
