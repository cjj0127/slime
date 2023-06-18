import BattleWorld from "./BattleWorld";
import Factory from "./Factory";
import Game from "../Game";
import { GlobalEventName } from "../common/Events";
import { E_SKILL_STATE, E_SKILL_TYPE, E_ENTITY_GROUP } from "../common/Const";
import Model from "../../ccstudio/data/Model";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import SkillFire from "./SkillFire";
import SkillBattleSlotsUI from "../skill/SkillBattleSlotsUI";
const { ccclass, property } = cc._decorator;
const _ = window['_'];
@ccclass
export default class SkillCtrl extends cc.Component {
    _pause: boolean = false;
    _running: boolean = true;
    cdAddation: number = 0;
    @property(SkillFire)
    fire: SkillFire = null;
    heroSkillIdx: number = 0;
    skillStatus: any[] = [];
    slotSkillIdxs: number[] = [];
    @property(SkillBattleSlotsUI)
    slots: SkillBattleSlotsUI = null;
    // private skillStatus: any[] = [];
    public addCusSkill(e: number, t: number, n: number = -1): number {
        const o = _SkillConfig.Instance.get(e);
        if (n < 0)
            n = this.skillStatus.length;
        return new Promise(async (resolve) => {
            await Factory.Instance.loadSkills(e);
            resolve(null);
        }), this.skillStatus[n] = {
            id: e,
            status: E_SKILL_STATE.Idle,
            cdTime: t,
            duration: o.duration,
            runningTime: 0
        }, n;
    }
    public clear(): void {
        _.each(this.skillStatus, (e: any) => {
            if (e) {
                e.runningTime = 0;
                e.status = E_SKILL_STATE.Idle;
            }
        });
        this.slots.clear();
        this.fire.clear();
    }
    public fixedUpdate(): void {
        if (!this._pause && this._running) {
            let t = false;
            _.each(this.skillStatus, (n: any, o: number) => {
                if (!_.isNil(n) && n.status == E_SKILL_STATE.Idle && !t) {
                    const r = _SkillConfig.Instance.get(n.id);
                    if (n.id > 0 && (r.type == E_SKILL_TYPE.Hero || Model.skill.auto || this.slotSkillIdxs.indexOf(o) < 0)
                        && BattleWorld.Instance.hero.ai.attackEnable() && BattleWorld.Instance.getScreenTargets(E_ENTITY_GROUP.Enemy).length > 0 && this.releaseSkill(n, o)) {
                        t = true;
                    }
                }
            });
        }
    }
    public getSkillData(e: number): any {
        return this.skillStatus[e];
    }
    initSkills(): void {
        const e = this;
        const t = Model.skill.equippedIds;
        _.each(t, function (t, n) {
            const o = e.skillStatus.length;
            if (t >= 0) {
                const r = _SkillConfig.Instance.get(t);
                e.skillStatus.push({
                    id: t,
                    status: E_SKILL_STATE.Idle,
                    cdTime: r.cd,
                    duration: r.duration,
                    runningTime: 0,
                });
            }
            else {
                e.skillStatus.push(null);
            }
            e.slotSkillIdxs[n] = o;
        });
        this.heroSkillIdx = this.skillStatus.length;
        const n = Model.skill.heroSkillId;
        if (n >= 0) {
            const o = _SkillConfig.Instance.get(n);
            this.skillStatus.push({
                id: n,
                status: E_SKILL_STATE.Idle,
                cdTime: o.cd,
                duration: o.duration,
                runningTime: 0,
            });
        }
        else {
            this.skillStatus.push(null);
        }
    }
    public isSlotsSkill(e: number, t: number): boolean {
        return this.slotSkillIdxs.indexOf(t) >= 0;
    }
    public lateUpdate(e: number): void {
        if (!this._pause && this._running) {
            _.each(this.skillStatus, (n: any, o: number) => {
                if (!_.isNil(n)) {
                    this.updateSkill(o, e);
                }
            });
        }
    }
    public manualReleaseSkill(e: number): void {
        const t = Model.skill.getEquipedIdx(e);
        const n = this.slotSkillIdxs[t];
        const o = this.skillStatus[n];
        if (o && o.status == E_SKILL_STATE.Idle) {
            this.releaseSkill(o, n);
        }
    }
    async onChangeHeroSkill(e: number): Promise<void> {
        this.skillStatus[this.heroSkillIdx] = null;
        if (!_.isNil(e) && e >= 0) {
            const t = _SkillConfig.Instance.get(e);
            await Factory.Instance.loadSkills(e);
            this.skillStatus[this.heroSkillIdx] = {
                id: e,
                status: E_SKILL_STATE.Idle,
                cdTime: t.cd,
                duration: t.duration,
                runningTime: 0,
            };
        }
    }
    async onChangeSkill(e: number): Promise<void> {
        const t = this.slotSkillIdxs[e];
        this.skillStatus[t] = null;
        const n = Model.skill.getEquipedId(e);
        if (!_.isNil(n) && n >= 0) {
            await Factory.Instance.loadSkills(n);
            const o = _SkillConfig.Instance.get(n);
            this.skillStatus[t] = {
                id: n,
                status: E_SKILL_STATE.Cd,
                cdTime: o.cd,
                duration: o.duration,
                runningTime: 0,
            };
            this.slots.updateState(n, E_SKILL_STATE.Cd);
        }
        else {
            this.slots.clearState(e);
        }
    }
    onDisable(): void {
        cc.director.targetOff(this);
    }
    onEnable(): void {
        this.cdAddation = Model.user.calcSkillCd();
        cc.director.on(GlobalEventName.ChangeHeroSkill, this.onChangeHeroSkill, this);
        cc.director.on(GlobalEventName.SkillEquipedChange, this.onChangeSkill, this);
        this.schedule(this.fixedUpdate, 0.1, cc.macro.REPEAT_FOREVER);
    }
    pause(): void {
        this._pause = true;
        this.fire.pause();
    }
    releaseSkill(e: any, t: number): boolean {
        if (this.fire.fire(e)) {
            e.status = E_SKILL_STATE.Duration;
            e.runningTime = 0;
            if (this.slotSkillIdxs.indexOf(t) >= 0) {
                this.slots.updateState(e.id, e.status);
            }
            cc.director.emit(GlobalEventName.ReleaseSkill, e.id, t);
            return true;
        }
        return false;
    }
    public removeCustomSkill(e: number): void {
        if (e > 0) {
            this.skillStatus[e] = null;
        }
    }
    resetSkillCd(): void {
        const e = this;
        _.each(this.slotSkillIdxs, function (t) {
            const n = e.skillStatus[t];
            if (n && n.status == E_SKILL_STATE.Cd) {
                e.slots.updateCdProgress(n.id, 0, 1);
                e.skillEnterIdle(t);
            }
        });
    }
    resume(): void {
        this._pause = false;
        this.fire.resume();
    }
    setRunning(e: boolean): void {
        this._running = e;
    }
    public skillEnterCd(e: number): void {
        const t = this.skillStatus[e];
        t.runningTime = 0;
        t.status = E_SKILL_STATE.Cd;
        if (this.slotSkillIdxs.indexOf(e) >= 0) {
            this.slots.updateState(t.id, t.status);
        }
    }
    public skillEnterIdle(e: number): void {
        const t = this.skillStatus[e];
        t.runningTime = 0;
        t.status = E_SKILL_STATE.Idle;
        if (this.slotSkillIdxs.indexOf(e) >= 0) {
            this.slots.updateState(t.id, t.status);
        }
    }
    subSkillCdWithCount(e: number, t: number): void {
        for (let n = 0; n < this.slotSkillIdxs.length; n++) {
            const o = this.slotSkillIdxs[n];
            const r = this.skillStatus[o];
            if (r && r.status == E_SKILL_STATE.Cd) {
                r.runningTime += t;
                this.slots.updateCdProgress(r.id, 0, 1);
                if (r.runningTime >= r.cdTime) {
                    this.skillEnterIdle(o);
                }
                e--;
            }
            if (e == 0)
                break;
        }
    }
    public updateCustomSkill(e: number, t: number, n: number): void {
        const o = this.skillStatus[n];
        if (!_.isNil(o) && o.id == e) {
            o.cdTime = t;
        }
    }
    public updateSkill(e: number, t: number): void {
        const n = this.skillStatus[e];
        if (!_.isNil(n)) {
            switch (n.status) {
                case E_SKILL_STATE.Duration:
                    n.runningTime += t * Game.Instance.globalSpeed;
                    if (n.runningTime >= n.duration) {
                        this.skillEnterCd(e);
                    }
                    else if (this.slotSkillIdxs.indexOf(e) >= 0) {
                        this.slots.updateDurationProgress(n.id, n.duration - n.runningTime, n.duration);
                    }
                    break;
                case E_SKILL_STATE.Cd:
                    n.runningTime += t * Game.Instance.globalSpeed;
                    const o = n.cdTime * this.cdAddation;
                    if (n.runningTime >= o) {
                        this.skillEnterIdle(e);
                    }
                    else if (this.slotSkillIdxs.indexOf(e) >= 0) {
                        this.slots.updateCdProgress(n.id, o - n.runningTime, o);
                    }
                    break;
                case E_SKILL_STATE.Idle:
            }
        }
    }
}
