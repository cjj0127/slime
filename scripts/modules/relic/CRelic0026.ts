import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import RelicBase from "./RelicBase";
import SkillModel from "../../ccstudio/data/SkillModel";
import Model from "../../ccstudio/data/Model";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0026 extends RelicBase {
    private interval: number = 0;
    private running: boolean = false;
    private runningTime: number = 0;
    private skillIdx: number = -1;
    lateUpdate(dt: number) {
        if (this.running) {
            this.runningTime += dt;
            if (this.runningTime >= this.interval) {
                this.runningTime = 0;
                const effectParams = _RelicConfig.Instance.get(this.relicId).effectParams;
                const interval = effectParams[0];
                const quality = effectParams[1];
                let skills = Model.skill.getSkillsWithQuality(quality);
                if (skills.length > 0) {
                    skills = this.shuffle(skills);
                    this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(skills[0], interval, this.skillIdx);
                }
            }
        }
    }
    onActive() {
        if (this.isActive) {
            const effectParams = _RelicConfig.Instance.get(this.relicId).effectParams;
            const interval = effectParams[0];
            const quality = effectParams[1];
            let skills = Model.skill.getSkillsWithQuality(quality);
            if (skills.length > 0) {
                skills = this.shuffle(skills);
                this.interval = interval;
                this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(skills[0], 0, this.skillIdx);
                this.running = true;
            }
            cc.director.on(GlobalEventName.ReleaseSkill, this.onReleaseSkill, this);
            cc.director.on(GlobalEventName.SkillOwnedChange, this.onSkillOwnedChange, this);
        }
        else {
            this.running = false;
            BattleWorld.Instance.skillCtrl.removeCustomSkill(this.skillIdx);
            cc.director.targetOff(this);
        }
    }
    onReleaseSkill(event: any, idx: number) {
        if (!BattleWorld.Instance.skillCtrl.isSlotsSkill(event, idx)) {
            if (this.skillIdx == idx) {
                BattleWorld.Instance.skillCtrl.removeCustomSkill(this.skillIdx);
            }
        }
    }
    onSkillOwnedChange() {
        if (!this.running && this.isActive) {
            const effectParams = _RelicConfig.Instance.get(this.relicId).effectParams;
            const interval = effectParams[0];
            const quality = effectParams[1];
            let skills = Model.skill.getSkillsWithQuality(quality);
            if (skills.length > 0) {
                skills = this.shuffle(skills);
                this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(skills[0], interval, this.skillIdx);
                this.running = true;
            }
        }
    }
    shuffle(arr: any[]) {
        let m = arr.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr;
    }
}
