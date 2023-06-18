import LanMgr from "../common/Language";
import LevelModel from "../../ccstudio/data/LevelModel";
import Model from "../../ccstudio/data/Model";
import MyTools from "../../ccstudio/utils/MyTools";
const { ccclass, property } = cc._decorator;
const moment: any = window['moment'];
@ccclass
export default class BossKeyHelperUI extends cc.Component {
    @property(cc.Label)
    descLabel: cc.Label = null;
    fixedUpdate() {
        this.refreshDesc();
    }
    onDisable() {
        this.unscheduleAllCallbacks();
    }
    onEnable() {
        this.refreshDesc();
        this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
    refreshDesc() {
        const e = Model.level.lastAutoReplenished;
        let t = moment(e).add(24, "hours").diff(moment(MyTools.GetTimeNow()));
        t = Math.max(0, t);
        this.descLabel.string = LanMgr.Instance.getLangByID("boss_level_tooltip_desc") + "(" + LanMgr.Instance.getLangByID("Time Remaining") + ":" + moment.utc(t).format("HH:mm:ss") + ")";
    }
}
