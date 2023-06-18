import { EEntityEvent } from "./EntityBase";
import BattleWorld from "./BattleWorld";
import Factory from "./Factory";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { GameConst, E_QUEST_ACTIVE_ID, E_GAME_LEVEL_TYPE, MapUIPrefabs } from "../common/Const";
import _DwarvenKingConfig from "../../ccstudio/config/_DwarvenKingConfig";

import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import MsgHint from "../common/MsgHint";
import UserData from "../user/UserData";
import CtrlBaseBattle, { EBATTLE_STATE, EBATTLE_FAILED_REASON } from "./CtrlBaseBattle";
const { ccclass, property } = cc._decorator;
@ccclass
export default class DwarvenKingBattle extends CtrlBaseBattle {
    private _curLevel: number;
    private static _instance: DwarvenKingBattle;
    private _maxLevel: number;
    public battleDuration: number;
    private boss: any;
    // private _maxLevel: number = 0;
    // private _curLevel: number = 1;
    gameLevelType: number = E_GAME_LEVEL_TYPE.DwarvenKing;
    public state: number;
    public totalDamage: string;
    public bornEnemy(e: any, t: any, n: any): void {
        const o = Model.level.calcDwarvenkingRushLevelData(e.cfgId, this.curLevel);
        const r = o.damage;
        const i = o.hp;
        e.doborn(t, i, r, n);
        e.node.on(EEntityEvent.Hurt, this.onBossHurt, this);
        this.boss = e;
    }
    calcRewardCount(): number {
        return 0;
    }
    public async enter(): Promise<void> {
        cc.director.on(GlobalEventName.AtkChange, this.onAtkChange, this);
        this._curLevel = 1;
        const e = _DwarvenKingConfig.Instance.getAll();
        this._maxLevel = e.length;
        this.battleDuration = GameConst.LIMITTIME_DWARVENKING;
        this.state = EBATTLE_STATE.Battle;
        cc.director.emit(GlobalEventName.BattleStart);
    }
    public exit(): void {
        cc.director.emit(GlobalEventName.BattleComplete);
        this.state = EBATTLE_STATE.None;
        cc.director.targetOff(this);
    }
    fixUpdate(e: number): void {
        if (this.paused) {
            return;
        }
        if (this.state == EBATTLE_STATE.Battle) {
            this.battleDuration -= e;
            if (this.battleDuration <= 0) {
                this.levelFailed(EBATTLE_FAILED_REASON.TimeOut);
            }
        }
    }
    public getSceneInfo(): string {
        return "scene001";
    }
    init() {
        DwarvenKingBattle._instance = this;
    }
    public loadEnemyIds(): number[] {
        const e: number[] = [];
        const t = GameConst.DWARVENKING_BOSS_ID;
        e.push(t);
        return e;
    }
    public async loadRes(): Promise<void> {
        const e = this.getSceneInfo();
        await Factory.Instance.loadScene(e);
        await Factory.Instance.loadEnemys([GameConst.DWARVENKING_BOSS_ID]);
    }
    public onAtkChange(): void {
        const e = Model.level.calcDwarvenkingRushLevelData(this.boss.cfgId, this.curLevel).damage;
        this.boss.damage = e;
    }
    public onBossHurt(e: any, t: any): void {
        this.totalDamage = NumberPlus.add(this.totalDamage, t);
        cc.director.emit(GlobalEventName.DwarvenKingBossHurt, t);
    }
    public onEnemyDead(): void { }
    public onLevelFailed(): void {
        cc.director.emit(GlobalEventName.BattleComplete);
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ClearDwarvenKing, Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.DwarvenKing));
        const e = Model.level.getBossLevelKey(E_GAME_LEVEL_TYPE.DwarvenKing);
        UserData.Instance.subItem(e, 1);
        Model.level.completeBossLevel(this.gameLevelType);
        this.setRecord();
        this.resetData();
        MsgHint.tip(LanMgr.Instance.getLangByID("You have been defeated by the enemy."));
        Model.ui.openViewAsync(MapUIPrefabs.DwarvenKingReward);
        BattleWorld.Instance.exitBossLevel();
    }
    public resetData(): void {
        this.totalDamage = "0";
    }
    public setRecord(): void {
        const e = UserData.Instance.getDwarvenKingDamageRecord();
        NumberPlus.compare(this.totalDamage, NumberPlus.decode(e)) && UserData.Instance.saveDwarvenKingDamageRecord(NumberPlus.format(this.totalDamage));
        cc.director.emit(GlobalEventName.DwarvenkingComplete);
    }
    public waveComplete(): void { }
    public static get Instance(): DwarvenKingBattle {
        return this._instance;
    }
    public get curLevel(): number {
        return this._curLevel;
    }
    public set curLevel(value: number) {
        this._curLevel = value;
    }
    public get maxLevel(): number {
        return this._maxLevel;
    }
}
