import { ENUM_PROP_TYPE } from "../../modules/common/Const";
import BlessCtr from "../../modules/bless/BlessCtr";
import BlessData from "../../modules/bless/BlessData";
import _BlessTypeConfig from "../config/_BlessTypeConfig";
import Config from "../configs/Config";
import ModeBase from "./ModelBase";
export default class BlessModel extends ModeBase {
    blessCtrl: BlessCtr = null;
    addNewBless(e: number) {
        let t = BlessData.Instance.getData(e);
        let n = Config.blessLevel.take(t.type, t.level);
        return this.blessCtrl.addBless(e, this.getBlessProp(e), n.addition);
    }
    fixedUpdate(dt: number) {
        if (this.blessCtrl)
            this.blessCtrl.fixedUpdate();
        let e = _BlessTypeConfig.Instance.getAll();
        let t = false;
        for (let n in e) {
            let o = e[n], r = BlessData.Instance.getData(o.type);
            if (r && r.remainTime > 0) {
                BlessData.Instance.getData(r.type).remainTime--;
                t = true;
            }
        }
        if (t) {
            BlessData.Instance.save();
        }
    }
    getBless(e: number) {
        return this.blessCtrl.getBless(e);
    }
    getBlessProp(e: any): number {
        return 1 == e ? ENUM_PROP_TYPE.BlessCoins : 2 == e ? ENUM_PROP_TYPE.BlessAtk : 3 == e ? ENUM_PROP_TYPE.BlessSkill : 0;
    }
    initBless() {
        let e = _BlessTypeConfig.Instance.getAll();
        for (let t in e) {
            let n = e[t];
            let o = BlessData.Instance.getData(n.type);
            if (o && o.remainTime > 0) {
                var r = Config.blessLevel.take(o.type, o.level);
                this.blessCtrl.addBless(o.type, this.getBlessProp(o.type), r.addition);
            }
        }
    }
    initLoadData() {
        this.blessCtrl = new BlessCtr();
        this.initBless();
    }
    // onDestroy() {
    //     this.unschedule(this.timeUpdate);
    // }
    load() {
        BlessData.Instance.load();
        // this.schedule(this.timeUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
}
