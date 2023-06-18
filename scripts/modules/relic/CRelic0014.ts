import RelicBase from "./RelicBase";
import PropAddationEventTarget from "../common/PropAddation";
import RelicData_ from "./RelicData_";
import { GlobalEventName } from "../common/Events";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
const d = window['_'];
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0014 extends RelicBase {
    private addation: PropAddationEventTarget = null;
    private interval: number = 0;
    private running: boolean = false;
    private runningTime: number = 0;
    buffStart() {
        this.addation.active();
    }
    lateUpdate(e: number) {
        if (this.running) {
            this.runningTime += e;
            if (this.runningTime >= this.interval) {
                this.buffStart();
                this.running = false;
            }
        }
    }
    onActive() {
        if (this.isActive) {
            const e = _RelicConfig.Instance.get(this.relicId);
            const t = RelicData_.Instance.getData(this.relicId);
            const n = e.effectParams;
            const o = n[0];
            const r = n[1];
            this.interval = o;
            if (d.isNil(this.addation)) {
                this.addation = new PropAddationEventTarget();
                this.addation.setProp(r);
            }
            this.addation.value = t.effectValue;
            this.runningTime = 0;
            this.running = true;
            cc.director.on(GlobalEventName.BattleStart, this.onBattleStart, this);
            cc.director.on(GlobalEventName.BattleComplete, this.onBattleComplete, this);
        }
        else {
            this.addation.disable();
            this.running = false;
            cc.director.targetOff(this);
        }
    }
    onBattleComplete() {
        this.running = false;
        this.addation.disable();
    }
    onBattleStart() {
        this.runningTime = 0;
        this.running = true;
    }
    recalc() {
        const e = RelicData_.Instance.getData(this.relicId);
        if (this.addation) {
            this.addation.value = e.effectValue;
        }
    }
}
