import { EInsertAdType, EOpenUIType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE, GameConst, E_LegionUpType, MapUIPrefabs, MEMBER_PREFAB_URL_ } from "../common/Const";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "./BattleWorld";
import _EnemyConfig from "../../ccstudio/config/_EnemyConfig";
import Factory from "./Factory";
import _GoldRushConfig from "../../ccstudio/config/_GoldRushConfig";
import HeroData from "../hero/HeroData";
import LanMgr from "../common/Language";
import _LegionRushConfig from "../../ccstudio/config/_LegionRushConfig";
import _LegionWaveConfig from "../../ccstudio/config/_LegionWaveConfig";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import MsgHint from "../common/MsgHint";
import CtrlBaseBattle, { EBATTLE_STATE, EBATTLE_FAILED_REASON } from "./CtrlBaseBattle";
const w = window['_'];
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionRushBattle extends CtrlBaseBattle {
    private _currWave = 0;
    public static _instance: LegionRushBattle;
    private _maxWave = 0;
    private battleDuration = 0;
    delegate: any = null;
    private enterBattleQueue = null;
    private gameLevelType = E_GAME_LEVEL_TYPE.LegionRush;
    private loadedMembers = false;
    public state: EBATTLE_STATE;
    public bornEnemy(e: any, t: any, n: any): void {
        const o = _EnemyConfig.Instance.get(e.cfgId);
        const r = Model.level.getCurDifficulty(this.gameLevelType);
        const i = _LegionRushConfig.Instance.get(r);
        const a = NumberPlus.mul(o.damage, NumberPlus.mul(i.multiAtk, Math.pow(i.multiAtkUP, this._currWave)));
        const s = NumberPlus.mul(o.hp, NumberPlus.mul(i.multiHP, Math.pow(i.multiHPUP, this._currWave)));
        e.doborn(t, s, a, n);
    }
    calcRewardCount(): number {
        return 0;
    }
    async createMembers(): Promise<void> {
        await Factory.Instance.loadMember(MEMBER_PREFAB_URL_, HeroData.Instance.battleMembers);
        BattleWorld.Instance.createMembers();
    }
    async createMonsters(): Promise<void> {
        await BattleWorld.Instance.getBattleCtrl(E_GAME_LEVEL_TYPE.LegionRush).loadEnemys();
        BattleWorld.Instance.createEnemys();
    }
    public enter(): void {
        this.state = EBATTLE_STATE.Change;
        this.loadedMembers = false;
        this._maxWave = Object.keys(_LegionWaveConfig.Instance.cfg).length;
        this._currWave = 0;
        this.battleDuration = GameConst.LIMITTIME_DWARVENKING;
        cc.director.emit(GlobalEventName.BattleStart);
    }
    enterBattle(): void {
        BattleWorld.Instance.openBlack();
        BattleWorld.Instance.pause();
        const t: AsyncQueueTool = new AsyncQueueTool();
        t.push(async (t: Function) => {
            if (!this.loadedMembers) {
                this.loadedMembers = true;
                await this.createMembers();
            }
            t();
        }),
            t.push(async (t: Function) => {
                await BattleWorld.Instance.getBattleCtrl(E_GAME_LEVEL_TYPE.LegionRush).createMonsters();
                t();
            }),
            t.complete = () => {
                this.state = EBATTLE_STATE.Battle;
                BattleWorld.Instance.closeBlack();
                BattleWorld.Instance.resume();
            },
            t.play();
        this.enterBattleQueue = t;
    }
    public exit(): void {
        this.enterBattleQueue?.clear();
        Model.legionRush.exit();
        cc.director.emit(GlobalEventName.BattleComplete);
        this.state = EBATTLE_STATE.None;
        this.delegate.clearMembers();
        this.delegate.createPartners();
        if (this.delegate.hero.cfgId != HeroData.Instance.battleId) {
            this.delegate.resetToBattleHero();
        }
    }
    fixUpdate(): void {
        if (!this.paused) {
            this.state = EBATTLE_STATE.Battle;
        }
    }
    getReward(): number {
        const e: number = Model.level.getCurDifficulty(this.gameLevelType);
        return _GoldRushConfig.Instance.get(e).reward;
    }
    public getSceneInfo(): string {
        return "scene001";
    }
    init(): void {
        LegionRushBattle._instance = this;
    }
    levelFailed(e: number): void {
        switch (this.state = EBATTLE_STATE.Change, e) {
            case EBATTLE_FAILED_REASON.HeroDead:
                const t: any[] = this.delegate.getMembers();
                if (t.length == 0) {
                    MsgHint.tip(LanMgr.Instance.getLangByID("You have been defeated by the enemy."));
                    this.onLevelFailed(e);
                }
                else {
                    const n: number = w.first(t).index;
                    this.delegate.changeMemberToLeader(n);
                }
                break;
            case EBATTLE_FAILED_REASON.TimeOut:
                Model.ad.showInterstitial(EInsertAdType.RushAd, EOpenUIType.LevelFailed);
                MsgHint.tip(LanMgr.Instance.getLangByID("Time's up"));
                this.onLevelFailed(e);
        }
    }
    public loadEnemyIds(): number[] {
        let e: number[] = [];
        const t = Model.legionRush.getCurWaveData();
        if (t) {
            for (const n of t.waveData.enemy) {
                const r = n.split("|");
                const i = Number(r[0]);
                const a = Number(r[1]);
                for (let s = 0; s < a; s++) {
                    e.push(i);
                }
            }
            e = w.shuffle(e);
        }
        return e;
    }
    public async loadEnemys(): Promise<void> {
        const e = [];
        const t = Model.legionRush.getCurWaveData();
        if (t) {
            for (const n of t.waveData.enemy) {
                const r = n.split("|");
                const a = Number(r[0]);
                const c = Number(r[1]);
                for (let l = 0; l < c; l++) {
                    e.push(a);
                }
            }
            await Factory.Instance.loadEnemys(e);
        }
    }
    public async loadRes(): Promise<void> {
        this.delegate.clearPartners();
        const e = this.getSceneInfo();
        await Factory.Instance.loadScene(e);
    }
    nextWave(): void {
        this._currWave++,
            Model.legionRush.clearAdsCount(),
            BattleWorld.Instance.skillCtrl.clear();
    }
    public onEnemyDead(): void { }
    onLevelFailed(e): void {
        BattleWorld.Instance.exitBossLevel();
    }
    popGameResult(): void {
        Model.legionRush.reportRushGetRing(),
            Model.ui.openViewAsync(MapUIPrefabs.LegionEndView, {
                data: {
                    wave: this._currWave + 1,
                    ringId: Model.legionRush.getCurRingId()
                }
            });
    }
    public showNewRing(): void {
        this.scheduleOnce(() => {
            const e = Model.legionRush.getCurWaveData();
            if (e != null) {
                BattleWorld.Instance.pause();
                Model.ui.openViewAsync(MapUIPrefabs.LegionPropDetailView, {
                    data: {
                        waveData: e.waveData,
                        heroNum: e.heroNum,
                        upType: E_LegionUpType.Ring
                    }
                });
            }
        }, 1);
    }
    public showRewardView(): void {
        this.scheduleOnce(() => {
            Model.ui.openViewAsync(MapUIPrefabs.LegionRushRewardView);
        });
    }
    showSelectView(): void {
        this.scheduleOnce(() => {
            if (Model.legionRush.getCurWaveData()) {
                BattleWorld.Instance.pause();
                Model.ui.openViewAsync(MapUIPrefabs.LegionSelectPropView, {
                    data: {
                        wave: this._currWave + 1
                    }
                });
            }
        }, 1);
    }
    public waveComplete(): void {
        if (this.state = EBATTLE_STATE.Change, this.currWave + 1 >= this.maxWave) {
            cc.director.emit(GlobalEventName.BattleComplete);
            Model.level.completeBossLevel(E_GAME_LEVEL_TYPE.LegionRush);
            BattleWorld.Instance.exitBossLevel();
        }
        else {
            this.nextWave();
            const e = Model.legionRush.getCurWaveData();
            if (e.waveData.upType == E_LegionUpType.Ring) {
                Model.legionRush.makeRing(e.waveData, e.heroNum);
                this.showNewRing();
            }
            else {
                this.showSelectView();
            }
        }
    }
    static get Instance() {
        return this._instance;
    }
    get currWave() {
        return this._currWave;
    }
    get maxWave() {
        return this._maxWave;
    }
}
