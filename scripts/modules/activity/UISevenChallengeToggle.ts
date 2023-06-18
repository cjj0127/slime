import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import SevenChallengeModel from "../../ccstudio/data/SevenChallengeModel";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UISevenChallengeToggle extends cc.Component {
    @property()
    day: number = 0;
    delegate = null;
    @property(cc.Node)
    redDot = null;
    onEnable() {
        let e = Model.sevenChallenge.getSevenChallengeDay();
        this.node.getComponent(cc.Toggle).enabled = this.day <= e;
        cc.director.on(GlobalEventName.SevenChallengeQuestStatusChange, this.refreshUi, this);
        this.playRedDot(this.redDot);
        this.refreshUi();
    }
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    }
    playRedDot(e) {
        e.stopAllActions();
        e.scale = 1;
        cc.tween(e)
            .to(0.2, { scale: 1.2 })
            .to(0.2, { scale: 1 })
            .union()
            .repeatForever()
            .start();
    }
    refreshUi() {
        this.redDot.active = Model.sevenChallenge.isShowDayRedDot(this.day);
    }
    touchStart() {
        let e = Model.sevenChallenge.getSevenChallengeDay();
        if (this.day > e) {
            MsgHint.tip(LanMgr.Instance.getLangByID("NewTaskEveryDay"));
        }
    }
}
// 
