import { EntityBase, EEntityEvent } from "./EntityBase";
import BattleWorld from "./BattleWorld";
import Factory from "./Factory";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE, GameConst, E_QUEST_ACTIVE_ID, E_ASSET_TYPE, MapUIPrefabs } from "../common/Const";
import _GoldRushConfig from "../../ccstudio/config/_GoldRushConfig";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import UserData from "../user/UserData";
import CtrlBaseBattle, { EBATTLE_STATE, EBATTLE_FAILED_REASON } from "./CtrlBaseBattle";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GoldRushBattle extends CtrlBaseBattle {
    private static _instance: GoldRushBattle = null;
    public battleDuration: number = 0;
    public boss: EntityBase = null;
    public gameLevelType: E_GAME_LEVEL_TYPE = E_GAME_LEVEL_TYPE.GoldRush;
    public bornEnemy(enemy: any, x: number, y: number): void {
        const data = Model.level.calcGoldRushLevelData(enemy.cfgId);
        const damage = data.damage;
        const hp = data.hp;
        enemy.doborn(x, y, hp, damage);
        enemy.node.on(EEntityEvent.HpChanged, this.onBossHpChange, this);
        enemy.node.on(EEntityEvent.Remove, this.onBossRemove, this);
        this.boss = enemy;
    }
    public enter(): void {
        this.battleDuration = GameConst.LIMITTIME_GOLDRUSH;
        this.state = EBATTLE_STATE.Battle;
        cc.director.emit(GlobalEventName.BattleStart);
    }
    public exit(): void {
        cc.director.emit(GlobalEventName.BattleComplete);
        this.state = EBATTLE_STATE.None;
    }
    public fixUpdate(dt: number): void {
        if (!this.paused && this.state == EBATTLE_STATE.Battle) {
            this.battleDuration -= dt;
            if (this.battleDuration <= 0) {
                this.levelFailed(EBATTLE_FAILED_REASON.TimeOut);
            }
        }
    }
    public getGoldProgress(): number {
        if (this.boss) {
            const hp = this.boss.hp;
            const maxHp = this.boss.maxHp;
            return 1 - NumberPlus.percent(hp, maxHp);
        }
        return 0;
    }
    public getReward(): number {
        const curDifficulty = Model.level.getCurDifficulty(this.gameLevelType);
        return _GoldRushConfig.Instance.get(curDifficulty).reward;
    }
    public getSceneInfo(): string {
        return "scene001";
    }
    init(): void {
        GoldRushBattle._instance = this;
    }
    public loadEnemyIds(): number[] {
        const curDifficulty = Model.level.getCurDifficulty(this.gameLevelType);
        return [_GoldRushConfig.Instance.get(curDifficulty).enemy];
    }
    public async loadRes(): Promise<void> {
        const sceneName = this.getSceneInfo();
        await Factory.Instance.loadScene(sceneName);
        const curDifficulty = Model.level.getCurDifficulty(this.gameLevelType);
        const enemy = _GoldRushConfig.Instance.get(curDifficulty).enemy;
        await Factory.Instance.loadEnemys([enemy]);
    }
    public onBossHpChange(): void {
        cc.director.emit(GlobalEventName.GoldRushBossHurt);
    }
    public onBossRemove(): void {
        if (this.boss) {
            this.boss.node.targetOff(this);
        }
        this.boss = null;
    }
    public onEnemyDead(): void { }
    public onLevelFailed(): void {
        BattleWorld.Instance.exitBossLevel();
    }
    public waveComplete(): void {
        cc.director.emit(GlobalEventName.BattleComplete);
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ClearGold, Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.GoldRush));
        const curDifficulty = Model.level.getCurDifficulty(this.gameLevelType);
        const reward = _GoldRushConfig.Instance.get(curDifficulty).reward;
        const data = {
            asset: E_ASSET_TYPE.Coin,
            count: reward,
            type: this.gameLevelType
        };
        Model.ui.openViewAsync(MapUIPrefabs.BossLevelReward, {
            data: data
        });
        const bossLevelKey = Model.level.getBossLevelKey(E_GAME_LEVEL_TYPE.GoldRush);
        UserData.Instance.subItem(bossLevelKey, 1);
        Model.level.completeBossLevel(this.gameLevelType);
        BattleWorld.Instance.exitBossLevel();
    }
    static get Instance() {
        return GoldRushBattle._instance;
    }
}
