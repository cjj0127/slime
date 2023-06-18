import BattleWorld from "./BattleWorld";
import { GlobalEventName } from "../common/Events";
import { GameConst, E_QUEST_ACTIVE_ID, E_GAME_LEVEL_TYPE, E_ASSET_TYPE, MapUIPrefabs } from "../common/Const";
import _BossRushConfig from "../../ccstudio/config/_BossRushConfig";
import Config from "../../ccstudio/configs/Config";
import Factory from "./Factory";
import Model from "../../ccstudio/data/Model";
import UserData, { AssetGetType } from "../user/UserData";
import CtrlBaseBattle, { EBATTLE_STATE, EBATTLE_FAILED_REASON } from "./CtrlBaseBattle";
const b: any = window["_"];
// n.default = I
const { ccclass, property } = cc._decorator;
@ccclass
export default class BossRushBattle extends CtrlBaseBattle {
    private _currWave: number;
    private static _instance: BossRushBattle;
    private _maxWave: number;
    public battleDuration: number;
    delegate;
    public stateBATTLE_STATE;
    public bornEnemy(e: any, t: any, n: any) {
        const o = Model.level.calcBossRushLevelData(e.cfgId, this.currWave);
        const r = o.damage;
        const i = o.hp;
        e.doborn(t, i, r, n);
    }
    public calcRewardCount(): number {
        return GameConst.BOSS_RUSH_BASE_REWARD_COUNT + 10 * Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.BossRush);
    }
    public enter() {
        this._currWave = 0;
        this._maxWave = Config.bossRush.values.length;
        this.battleDuration = GameConst.LIMITTIME_BOSSRUSH;
        this.state = EBATTLE_STATE.Battle;
        cc.director.emit(GlobalEventName.BattleStart);
    }
    public exit() {
        cc.director.emit(GlobalEventName.BattleComplete);
        this.state = EBATTLE_STATE.None;
    }
    public fixUpdate(e: number): void {
        if (!this.paused && this.state == EBATTLE_STATE.Battle) {
            this.battleDuration -= e;
            if (this.battleDuration <= 0)
                this.levelFailed(EBATTLE_FAILED_REASON.TimeOut);
        }
    }
    public getSceneInfo() {
        return "scene001";
    }
    public init() {
        BossRushBattle._instance = this;
    }
    public loadEnemyIds() {
        const e = [];
        const t = this.currWave;
        const n = Config.bossRush.get(t);
        e.push(n.enemy);
        return e;
    }
    public async loadRes() {
        const e = this.getSceneInfo();
        await Factory.Instance.loadScene(e);
        //  const t = _BossRushConfig.Instance.getAll();
        const n = Config.bossRush.values.map((element) => element.enemy);
        // b.each(t, function (e) { n.push(e.enemy); });
        await Factory.Instance.loadEnemys(n);
    }
    public nextWave() {
        this._currWave++;
        this.delegate.createEnemys();
        cc.director.emit(GlobalEventName.BossRushLevelChangeWave);
    }
    public onEnemyDead() { }
    public onLevelFailed(): void {
        this.popGameLost();
        BattleWorld.Instance.exitBossLevel();
    }
    public waveComplete() {
        if (this.currWave + 1 >= this.maxWave) {
            cc.director.emit(GlobalEventName.BattleComplete);
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ClearBoss, Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.BossRush));
            const e = this.calcRewardCount();
            const t = {
                asset: E_ASSET_TYPE.Diamond,
                count: e,
                type: E_GAME_LEVEL_TYPE.BossRush
            };
            UserData.Instance.addMemItem(E_ASSET_TYPE.Diamond, e, {
                type: AssetGetType.BossRush
            });
            Model.ui.openViewAsync(MapUIPrefabs.BossLevelReward, {
                data: t
            });
            const n = Model.level.getBossLevelKey(E_GAME_LEVEL_TYPE.BossRush);
            UserData.Instance.subItem(n, 1);
            Model.level.completeBossLevel(E_GAME_LEVEL_TYPE.BossRush);
            BattleWorld.Instance.exitBossLevel();
        }
        else
            this.nextWave();
    }
    // private _maxWave: number = 0;
    // private _currWave: number = 0;
    // battleDuration: number = 0;
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
