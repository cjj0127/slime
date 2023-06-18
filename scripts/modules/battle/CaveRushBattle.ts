import { EntityBase, EEntityEvent } from "./EntityBase";
import BattleWorld from "./BattleWorld";
import Factory from "./Factory";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE, GameConst, E_QUEST_ACTIVE_ID, E_ASSET_TYPE, MapUIPrefabs } from "../common/Const";
import _CaveRushConfig from "../../ccstudio/config/_CaveRushConfig";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import UserData from "../user/UserData";
import CtrlBaseBattle, { EBATTLE_STATE, EBATTLE_FAILED_REASON } from "./CtrlBaseBattle";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class CaveRushBattle extends CtrlBaseBattle {
    private _curLevel: number = 1;
    private static _instance: CaveRushBattle = null;
    private _maxLevel: number = 0;
    public battleDuration: number = 0;
    public boss: EntityBase | null = null;
    public curWave: number = 0;
    delegate: any = null;
    public gameLevelType: number = E_GAME_LEVEL_TYPE.CaveRush;
    public maxWave: number = 5;
    paused = false;
    public bornEnemy(e: any, t: any, n: any): void {
        const o = Model.level.calCaveRushLevelData(e.cfgId);
        const r = o.damage;
        const i = o.hp;
        e.doborn(t, i, r, n);
        e.node.on(EEntityEvent.Hurt, this.onEnemyHurt, this);
        e.view.updateHp("1", "1");
    }
    calcRewardCount() {
        const e = Model.level.getCurDifficulty(this.gameLevelType);
        return _CaveRushConfig.Instance.get(e).reward;
    }
    public enter(): void {
        this.curWave = 0;
        this._curLevel = 1;
        const e = _CaveRushConfig.Instance.getAll();
        this._maxLevel = e.length;
        this.battleDuration = GameConst.LIMITTIME_CAVERUSH;
        this.state = EBATTLE_STATE.Battle;
        cc.director.emit(GlobalEventName.BattleStart);
    }
    public exit(): void {
        cc.director.emit(GlobalEventName.BattleComplete);
        this.state = EBATTLE_STATE.None;
        cc.director.targetOff(this);
    }
    fixUpdate(e) {
        if (!this.paused && this.state == EBATTLE_STATE.Battle) {
            this.battleDuration -= e;
            if (this.battleDuration <= 0) {
                this.levelFailed(EBATTLE_FAILED_REASON.TimeOut);
            }
        }
    }
    public getSceneInfo(): string {
        return "scene201";
    }
    init(): void {
        CaveRushBattle._instance = this;
    }
    public loadEnemyIds(): Array<number> {
        let e: Array<number> = [];
        let t: Array<string> = [];
        const n = _CaveRushConfig.Instance.get(this.curLevel);
        if (this.curWave == 0) {
            t = n.wave1;
        }
        else if (this.curWave == 1) {
            t = n.wave2;
        }
        else if (this.curWave == 2) {
            t = n.wave3;
        }
        else if (this.curWave == 3) {
            t = n.wave4;
        }
        else if (this.curWave == 4) {
            t = n.wave5;
        }
        for (let o = 0; o < t.length; o++) {
            const r = t[o].split("|");
            const i = Number(r[0]);
            const a = Number(r[1]);
            for (let s = 0; s < a; s++) {
                e.push(i);
            }
        }
        e = _.shuffle(e);
        e.splice(1, 0, n.caveId);
        return e;
    }
    public async loadRes(): Promise<void> {
        const e = this.getSceneInfo();
        const t = _CaveRushConfig.Instance.get(this.curLevel);
        const n: Array<number> = [];
        const o = [...t.wave1, ...t.wave2, ...t.wave3, ...t.wave4, ...t.wave5];
        for (let r = 0; r < o.length; r++) {
            const i = o[r].split("|");
            const a = Number(i[0]);
            const s = Number(i[1]);
            if (n.indexOf(a) == -1) {
                n.push(a);
            }
            for (let u = 0; u < s; u++) {
                if (n.indexOf(a) == -1) {
                    n.push(a);
                }
            }
        }
        n.push(t.caveId);
        await Factory.Instance.loadEnemys(n);
        await Factory.Instance.loadScene(e);
    }
    public onEnemyDead(): void {
    }
    public onEnemyHurt(e: any): void {
        NumberPlus.percent(e._hp, e._mHp);
        e.view.updateHp(e._hp, e._mHp);
    }
    onLevelFailed() {
        this.popGameLost();
        BattleWorld.Instance.exitBossLevel();
        this.resetData();
    }
    resetData() {
        this.curWave = 0;
    }
    public waveComplete(): void {
        if (++this.curWave < this.maxWave) {
            this.delegate.createEnemys();
            cc.director.emit(GlobalEventName.CaveRushLevelChangeWave);
        }
        else {
            cc.director.emit(GlobalEventName.BattleComplete);
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ClearCaveRush, Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.CaveRush));
            const e = Model.level.getCurDifficulty(this.gameLevelType);
            const t = _CaveRushConfig.Instance.get(e).reward;
            const n = {
                asset: E_ASSET_TYPE.Fork,
                count: t,
                type: this.gameLevelType
            };
            UserData.Instance.addMemItem(E_ASSET_TYPE.Fork, t);
            Model.ui.openViewAsync(MapUIPrefabs.BossLevelReward, {
                data: n
            });
            this.resetData();
            const o = Model.level.getBossLevelKey(E_GAME_LEVEL_TYPE.CaveRush);
            UserData.Instance.subItem(o, 1);
            Model.level.completeBossLevel(this.gameLevelType);
            BattleWorld.Instance.exitBossLevel();
        }
    }
    public static get Instance(): CaveRushBattle {
        return this._instance;
    }
    get curLevel(): number {
        return this._curLevel;
    }
    set curLevel(e: number) {
        this._curLevel = e;
    }
    get maxLevel(): number {
        return this._maxLevel;
    }
}
