import { GlobalEventName } from "../../modules/common/Events";
import { Q_NAME, E_GAME_LEVEL_TYPE, E_LegionHeroRingAddType, E_QUEST_ACTIVE_ID, E_LegionUpType } from "../../modules/common/Const";
import LegionRushBattle from "../../modules/battle/LegionRushBattle";
import BattleWorld from "../../modules/battle/BattleWorld";
import _LegionHeroConfig from "../config/_LegionHeroConfig";
import _LegionRandConfig from "../config/_LegionRandConfig";
import _LegionWaveConfig from "../config/_LegionWaveConfig";
import ModeBase from "./ModelBase";
import Model from "./Model";
import PropAddationEventTarget from "../../modules/common/PropAddation";
import UserData from "../../modules/user/UserData";
import Utils_ from "../utils/Utils";
const _: any = window["_"];
export default class LegionRushModel extends ModeBase {
    addations = [];
    curRingId = -1;
    curWaveData = null;
    refreshAdCount = 0;
    public addAdsCount(e: number): void {
        this.refreshAdCount += e;
    }
    public clearAdsCount(): void {
        this.refreshAdCount = 0;
    }
    public disableAllAddation() {
        _.forEach(this.addations, (e: any) => {
            e.addation.disable();
        });
        this.addations = [];
    }
    public exit() {
        if (this.getCurRingId() !== -1) {
            LegionRushBattle.Instance.popGameResult();
        }
        this.setCurWaveData(null);
        this.clearAdsCount();
        BattleWorld.Instance.resume();
        this.setCurRingId(-1);
        this.disableAllAddation();
    }
    public getAddation(e: number) {
        let result = null;
        _.forEach(this.addations, (t: any) => {
            if (t.addation.prop == e) {
                result = t.addation;
            }
        });
        return result;
    }
    public getAddationByType(e: any) {
        const t: any[] = [];
        _.forEach(this.addations, (n: any) => {
            if (n.upType == e) {
                t.push(n.addation);
            }
        });
        return t;
    }
    public getAddedRingPropIds() {
        const e: number[] = [];
        const t = this.getCurRingId();
        if (t !== -1) {
            const n = Model.ring.getRingData(t);
            if (n) {
                _.forEach(n.propData, (t: any) => {
                    e.push(t.propId);
                });
            }
        }
        return e;
    }
    // private refreshAdCount: number = 0;
    public getAdsCount(): number {
        return this.refreshAdCount;
    }
    public getCurRingId() {
        return this.curRingId;
    }
    public getCurWaveData() {
        return this.curWaveData;
    }
    public getRandomProps(e: any, t: any) {
        const o = _LegionWaveConfig.Instance.get(e);
        const r = o.waveType;
        const i = o.propNum;
        const s = {
            ids: [],
            waveType: 1
        };
        let c = _.keys(_LegionRandConfig.Instance.cfg);
        const f = this.getCurRingId();
        if (f !== -1 && Model.ring.getRingData(f).quality == Q_NAME.length - 1) {
            c = _LegionRandConfig.Instance.getDataWithOutAddLevelProp();
        }
        c.splice(c.indexOf(t.toString()), 1);
        for (let d = 0; d < i; d++) {
            const h: any = Utils_.getItemByWeight(c, (e: any) => _LegionRandConfig.Instance.get(e).propWeight);
            s.ids.push(parseInt(h));
            s.waveType = r;
            c.splice(c.indexOf(h), 1);
        }
        return s;
    }
    public initLoadData() { }
    public load() { }
    public makeRing(e: any, t: any) {
        const o = Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.LegionRush);
        let r = this.getCurRingId();
        if (r == -1) {
            const i = _LegionHeroConfig.Instance.getTotalAddValue(t, E_LegionHeroRingAddType.AddQuality);
            const l = {
                quality: 2 + i,
                ringLevel: o + _LegionHeroConfig.Instance.getTotalAddValue(t, E_LegionHeroRingAddType.AddLevel)
            };
            const u = Model.ring.createRing(l);
            if (this.setCurRingId(u.id), (r = u.id) !== -1) {
                const f = Model.level.getBossLevelKey(E_GAME_LEVEL_TYPE.LegionRush);
                UserData.Instance.subItem(f, 1);
                cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ClearLegionRush, Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.LegionRush));
            }
        }
        if (e.propId == 0) {
            const d = Model.ring.lvUpRingQuality(r, 1);
            e.id = d;
            this.setCurRingId(d);
        }
        else if (e.upType == E_LegionUpType.Ring) {
            Model.ring.addRingProp(r, {
                propId: e.propId,
                value: e.upNumValue
            });
        }
        this.setAddation(e);
    }
    public onDestroy() {
        cc.director.targetOff(this);
    }
    public reportRushChoseProp(): void {
        // const e = {
        //   LegionRush_Level: Model.level.getCurDifficulty(GAME_LEVEL_TYPE.LegionRush),
        //   LegionRush_Num: HeroData.Instance.battleMembers.length + 1,
        //   LegionRush_Wave: LegionRushBattle.Instance.currWave + 1,
        //   LegionRand_Id: this.curWaveData.waveData.id,
        //   LegionRush_PropId: this.curWaveData.waveData.propId,
        //   LegionRush_UpNum: this.curWaveData.waveData.upNumValue,
        //   LegionRush_UpType: this.curWaveData.waveData.upType,
        //   LegionRush_IsBoss: this.curWaveData.waveData.isPowerEnemy
        // };
    }
    public reportRushGetRing(): void {
        const e = this.getCurRingId();
        const t = Model.ring.getRingData(e);
        const o = {
            LegionRush_Level: Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.LegionRush),
            LegionRush_Prop: Model.ring.getPropListString(e),
            LegionRush_Quality: t.quality,
            LegionRush_RingLevel: t.ringLevel,
            LegionRush_Wave: LegionRushBattle.Instance.currWave + 1
        };
    }
    public setAddation(e: any) {
        if (e !== null && e.propId !== 0) {
            const t = e.propId;
            const n = e.upNumValue;
            const o = e.upType;
            let r = this.getAddation(t);
            if (_.isNil(r)) {
                ((r = new PropAddationEventTarget).value = 0), r.setProp(t);
                this.addations.push({
                    upType: o,
                    addation: r
                });
            }
            r.value = parseInt(r.value) + n;
            r.value = r.value.toString();
            r.active();
        }
    }
    public setCurRingId(e: number) {
        this.curRingId = e;
    }
    public setCurWaveData(e: any) {
        this.curWaveData = e;
    }
}
