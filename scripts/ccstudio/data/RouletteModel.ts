import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import _RouletteConfig from "../config/_RouletteConfig";
import MyTools from "../utils/MyTools";
import UserData, { AssetGetType } from "../../modules/user/UserData";
import { GlobalEventName } from "../../modules/common/Events";
import { GameConst } from "../../modules/common/Const";
const moment: any = window["moment"];
const _: any = window["_"];
export default class RouletteModel extends ModeBase {
    private _lastSpinTime: any = null;
    private _spinCount = 0;
    fixUpdate() {
        if (!moment(MyTools.GetTimeNow()).isSame(this.lastSpinTime, "day")) {
            this.spinCount = 0;
        }
    }
    freeSpinEnable() {
        return !moment(MyTools.GetTimeNow()).isSame(this.lastSpinTime, "days");
    }
    getCdTime() {
        if (_.isNil(this.lastSpinTime)) {
            return 0;
        }
        const e = moment(MyTools.GetTimeNow()).diff(this.lastSpinTime, "s");
        return e > GameConst.ROULETTE_SPIN_INTERVAL ? 0 : GameConst.ROULETTE_SPIN_INTERVAL - e;
    }
    getLastSpinCount() {
        return GameConst.ROULETTE_SPIN_MAX_COUNT - this.spinCount;
    }
    initLoadData() {
        if (this.lastSpinTime !== null) {
            if (moment(MyTools.GetTimeNow()).isSame(this.lastSpinTime, "day")) {
                this.spinCount = 0;
            }
        }
        // this.schedule(this.fixUpdate, 60, cc.macro.REPEAT_FOREVER);
        // cc.game.on(cc.game.EVENT_HIDE, () => {
        //     this.unschedule(this.fixUpdate);
        // });
        // cc.game.on(GlobalEvent.GameResume, () => {
        //     this.schedule(this.fixUpdate, 60, cc.macro.REPEAT_FOREVER, Math.random());
        // });
    }
    load() {
        const e = LocalStorageTool.getItemLocal("cc_user-last-spin-time");
        this.lastSpinTime = e ? moment(e) : null;
        const t = moment(MyTools.GetTimeNow());
        if (this.lastSpinTime && this.lastSpinTime.isAfter(t)) {
            this.lastSpinTime = t;
        }
        this.spinCount = parseInt(LocalStorageTool.getItemLocal("cc_user-last-spin-count")) || 0;
    }
    sendReward(e: number, t: cc.Vec2 | cc.Vec3) {
        this.lastSpinTime = moment(MyTools.GetTimeNow());
        this.spinCount++;
        const n = _RouletteConfig.Instance.getWithIdx(e);
        const o = n.asset;
        const r = n.count;
        UserData.Instance.addItem(o, r, {
            sourcePos: t,
            type: AssetGetType.Spin
        });
        cc.director.emit(GlobalEventName.RouletteSendReward);
    }
    spin() {
        return _RouletteConfig.Instance.randomReward();
    }
    spinEnable() {
        if (this.lastSpinTime) {
            if (moment(MyTools.GetTimeNow()).diff(this.lastSpinTime, "s") < GameConst.ROULETTE_SPIN_INTERVAL) {
                return false;
            }
        }
        if (Model.roulette) {
            return !(Model.roulette.getLastSpinCount() <= 0);
        }
        return false;
    }
    set lastSpinTime(e: any) {
        this._lastSpinTime = e;
        if (this._lastSpinTime) {
            LocalStorageTool.setItemLocal("cc_user-last-spin-time", this._lastSpinTime.format());
        }
        else {
            LocalStorageTool.setItemLocal("cc_user-last-spin-time", null);
        }
    }
    get lastSpinTime() {
        return this._lastSpinTime;
    }
    set spinCount(e: number) {
        if (this._spinCount !== e) {
            this._spinCount = e;
            LocalStorageTool.setItemLocal("cc_user-last-spin-count", e);
            cc.director.emit(GlobalEventName.RouletteCountChange);
        }
    }
    get spinCount() {
        return this._spinCount;
    }
}
