import PassModel from "../../ccstudio/data/PassModel";
import Model from "../../ccstudio/data/Model";
import MyTools from "../../ccstudio/utils/MyTools";
const { ccclass, property } = cc._decorator;
const moment: any = window["moment"];
@ccclass
export default class UIPassHudMenu extends cc.Component {
    @property(cc.Label)
    private cdLabel: cc.Label = null;
    private fixedUpdate() {
        this.refreshCd();
    }
    onDisable() {
        this.unscheduleAllCallbacks();
    }
    onEnable() {
        this.refreshCd();
        this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
    private refreshCd() {
        const passTime = Model.pass.resetPassTime;
        const currentTime = moment(MyTools.GetTimeNow());
        const diffTime = passTime.diff(currentTime);
        const diffHours = passTime.diff(currentTime, "hours");
        this.cdLabel.string = `${diffHours}:${moment.utc(diffTime).format("mm:ss")}`;
    }
}
