import BattleWorld from "./BattleWorld";
import { EInsertAdType, EOpenUIType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, E_QUEST_ACTIVE_ID, GameConst, ENUM_PROP_TYPE } from "../common/Const";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import Config from "../../ccstudio/configs/Config";
import _EnemyConfig from "../../ccstudio/config/_EnemyConfig";
import Factory from "./Factory";
import HeroData from "../hero/HeroData";
import _LevelConfig from "../../ccstudio/config/_LevelConfig";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import SubscribeModel from "../../ccstudio/data/SubscribeModel";
import Model from "../../ccstudio/data/Model";
import MyTools from "../../ccstudio/utils/MyTools";
import UserData, { AssetGetType } from "../user/UserData";
import Utils_ from "../../ccstudio/utils/Utils";
import CtrlBaseBattle, { EBATTLE_FAILED_REASON, EBATTLE_STATE } from "./CtrlBaseBattle";
const { ccclass, property } = cc._decorator;
@ccclass
export default class NormalBattle extends CtrlBaseBattle {
    private _currWave: number = 0;
    private static _instance: NormalBattle = null;
    private _loop: boolean = false;
    private _maxWave: number = 0;
    public boosFailTimes: number = 0;
    public bossWave: boolean = false;
    public bossWaveDuration: number = 0;
    public changeBossQueue: any = null;
    delegate;
    public killCount: number = 0;
    bornEnemy(e, t) {
        const n = e.cfgId, o = _EnemyConfig.Instance.get(n), r = Model.level.calcEnemyData(e.cfgId, this.currLevel), i = r.damage, a = r.hp, s = r.gold;
        e.doborn(t, a, i, o.bulletId),
            e.gold = s;
    }
    challengeBoss() {
        this.enterChangeBoss(() => {
            cc.director.emit(GlobalEventName.BattleStart);
        }),
            this.reportReChallenge();
    }
    public enter(): void {
        this.state = EBATTLE_STATE.Battle;
        if (this.bossWave) {
            this.enterChangeBoss(() => {
                cc.director.emit(GlobalEventName.BattleStart);
            });
        }
        else {
            cc.director.emit(GlobalEventName.BattleStart);
        }
    }
    public async enterChangeBoss(e = null) {
        if (this.state !== EBATTLE_STATE.Battle) {
            return;
        }
        this.state = EBATTLE_STATE.Change;
        this.changeBossQueue = new AsyncQueueTool();
        this.changeBossQueue.push(async (e) => {
            await this.delegate.openBlack();
            e();
        });
        this.changeBossQueue.push(async (e) => {
            this.delegate.clear();
            this.delegate.reset();
            this._currWave = this.maxWave - 1;
            await this.delegate.clearLevel();
            e();
        });
        this.changeBossQueue.push(async (e) => {
            this.state = EBATTLE_STATE.Battle;
            await this.loadRes();
            e();
        });
        this.changeBossQueue.push(async (e) => {
            const t = HeroData.Instance.battleId;
            const n = this.loadEnemyIds()[0];
            const o = await Model.ui.openViewAsync(MapUIPrefabs.BossBattleTip, {
                data: {
                    heroId: t,
                    bossId: n
                },
                priority: 0
            }) as cc.Node;
            o.once("removed", e);
        });
        this.changeBossQueue.push(async (a) => {
            await this.delegate.createEnemys();
            a();
        });
        this.changeBossQueue.push(async (n) => {
            cc.director.emit(GlobalEventName.ChangeLevelWave);
            if (e) {
                e();
            }
            await this.delegate.closeBlack();
            n();
        });
        this.changeBossQueue.play();
    }
    public async enterChangeLevel() {
        this.state = EBATTLE_STATE.Change;
        this.delegate.stopCamera();
        await MyTools.sleep(.5);
        await this.delegate.openBlack();
        this.delegate.clear();
        this.delegate.hero.reborn();
        this.delegate.createGameScene();
        this.delegate.resetCamera();
        this.delegate.startCamera();
        this.bossWave = false;
        this._currWave = 0;
        this.killCount = 0;
        const e = Config.level.getMax();
        if (this.currLevel < e) {
            this.currLevel++;
            Model.level.completeNormall(this.currLevel);
        }
        const t = Config.level.get(this.currLevel);
        this._maxWave = 5;
        this.state = EBATTLE_STATE.Battle;
        cc.director.emit(GlobalEventName.ChangeLevel);
        await this.loadRes();
        await this.delegate.createEnemys();
        await this.delegate.closeBlack();
        this.reportLevelStart();
        Model.ui.openViewAsync(MapUIPrefabs.LevelTip, {
            priority: 0
        });
    }
    public exit(): void {
        cc.director.emit(GlobalEventName.BattleComplete);
        this.state = EBATTLE_STATE.None;
        this.changeBossQueue?.clear();
        Model.ui.closeView(MapUIPrefabs.BossBattleTip.path);
    }
    public fixUpdate(e: number) {
        if (!this.paused) {
            switch (this.state) {
                case EBATTLE_STATE.Battle:
                    if (this.bossWave) {
                        this.bossWaveDuration -= e;
                        if (this.bossWaveDuration <= 0) {
                            this.levelFailed(EBATTLE_FAILED_REASON.TimeOut);
                        }
                    }
                    break;
                case EBATTLE_STATE.NextLevel:
                    this.nextLevel();
                    break;
                case EBATTLE_STATE.NextWave:
                    this.nextWave();
            }
        }
    }
    // private _currWave: number = 0;
    // private loop: boolean = LocalStorage.getItem("normal_level_loop", false);
    public getCurrLevelCfg(): any {
        return Config.level.get(this.currLevel);
    }
    public getSceneInfo(): string {
        const e = Config.level.get(this.currLevel);
        return window['_'].isNil(e) ? "scene001" : e.scene;
    }
    public init(): void {
        NormalBattle._instance = this;
        const e = Config.level.get(this.currLevel);
        this._maxWave = 5;
        this.reportLevelStart();
    }
    levelComplete() {
        Model.ad.showInterstitial(EInsertAdType.LevelAd, EOpenUIType.LevelSuecess),
            this.reportLevelSuccess();
    }
    loadEnemyIds() {
        let e = [];
        const currLevel = this.currLevel, currWave = this.currWave, o = Config.level.get(currLevel), r = o['wave' + (currWave + 1)];
        this.bossWave = 5 - 1 == currWave;
        if (this.bossWave) {
            this.bossWaveDuration = GameConst.LIMITTIME_STAGE + window['_'].toNumber(Model.user.calcPropAddation(ENUM_PROP_TYPE.BossBattleTime));
        }
        window['_'].each(r, (wave) => {
            e.length += wave.num;
            e = window['_'].fill(e, wave.id, e.length - wave.num);
        });
        e = window['_'].shuffle(e);
        return e;
    }
    public async loadRes(): Promise<void> {
        const e = this.getSceneInfo();
        await Factory.Instance.loadScene(e);
        const t = this.currLevel;
        const n = Config.level.get(t);
        const o = Config.level.getIdsByLevel(t);
        // window['_'].each(n.Waves, (e) => {
        //     window['_'].each(e, (e) => {
        //         o.push(e.id)
        //     });
        // });
        await Factory.Instance.loadEnemys(o);
    }
    public async nextLevel(): Promise<void> {
        this.boosFailTimes = 0;
        cc.director.emit(GlobalEventName.BattleStart);
        await this.enterChangeLevel();
        SubscribeModel.Instance.repostHangUpMsg();
    }
    nextWave() {
        this.state = EBATTLE_STATE.Battle;
        const e = {
            MonsterNumber: this._currWave,
            SuccessType: this.loop ? "Loop" : "Normal"
        };
        const currLevel = this.currLevel, n = this._currWave + 1;
        5 - 1 == n ? (this.enterChangeBoss(), cc.director.emit(GlobalEventName.ChangeLevelToBoss)) : (this._currWave++, this.delegate.createEnemys(), cc.director.emit(GlobalEventName.ChangeLevelWave));
    }
    onEnemyDead(e: any) {
        if (this.killCount++, "0" != e.gold) {
            let coinCount = Model.user.calcAddationCoins(e.gold), worldPos = e.node.convertToWorldSpaceAR(cc.Vec3.ZERO), screenPos = BattleWorld.Instance.worldCamera.camera.getWorldToScreenPoint(cc.v2(worldPos));
            worldPos = BattleWorld.Instance.uiCamera.getScreenToWorldPoint(screenPos);
            let flyCount;
            flyCount = e.isBoss ? Utils_.getRandomRange(3, 5) : Utils_.getRandomRange(2, 3);
            UserData.Instance.addCoin(coinCount, {
                sourcePos: worldPos,
                priority: 1,
                flyCnt: flyCount,
                type: AssetGetType.Basic
            });
        }
    }
    // popGameLost() { }
    async onLevelFailed(e) {
        this.popGameLost(),
            this.reportLevelFail(e),
            this.loop = !0,
            this._currWave = 0,
            this.bossWave && this.boosFailTimes++,
            !this.bossWave && this.currLevel > 1 && this.currLevel--,
            this.bossWave = !1,
            await this.delegate.restartLevel();
        this.state = EBATTLE_STATE.Battle,
            cc.director.emit(GlobalEventName.RestartLevel);
    }
    private reportLevelFail(e: EBATTLE_FAILED_REASON) {
        const t = {
            FailType: "",
            MonsterKill: this.killCount,
            MonsterNumber: this.currWave
        };
        if (this.bossWave) {
            t.FailType = "BossFail";
        }
        else {
            t.FailType = this.loop ? "LoopFail" : "Fail";
        }
        if (e == EBATTLE_FAILED_REASON.TimeOut) {
            t.FailType = "TimeFail";
        }
    }
    private reportLevelStart() {
        if (!this.loop) {
            const e = {
                EnterType: this.loop ? "Fail" : "Success"
            };
            if (Model.level.currNormalLevel == 1) {
                e.EnterType = "Start";
            }
        }
    }
    private reportLevelSuccess() {
        const e = {
            MonsterKill: this.killCount,
            MonsterNumber: this.currWave,
            SuccessType: this.loop ? "Rechallenge" : "Success"
        };
    }
    // private changeBossQueue: AsyncQueueTool;
    public reportReChallenge() {
        const e = {
            StartTimes: this.boosFailTimes
        };
    }
    public async restart(): Promise<void> {
        this.boosFailTimes = 0;
        if (this.state == EBATTLE_STATE.Battle) {
            this.state = EBATTLE_STATE.Change;
            this.delegate.stopCamera();
            await MyTools.sleep(.5);
            await this.delegate.openBlack();
        }
        await this.loadRes();
        this.delegate.clear();
        this.delegate.hero.reborn();
        this.delegate.createGameScene();
        this.delegate.resetCamera();
        this.delegate.startCamera();
        this.bossWave = false;
        this._currWave = 0;
        this.killCount = 0;
        const e = Config.level.get(this.currLevel);
        this._maxWave = 5;
        this.state = EBATTLE_STATE.Battle;
        cc.director.emit(GlobalEventName.ChangeLevel);
        await this.loadRes();
        await this.delegate.createEnemys();
        await this.delegate.closeBlack();
        this.reportLevelStart();
        Model.ui.openViewAsync(MapUIPrefabs.LevelTip, {
            priority: 0
        });
    }
    tryNextWave() {
        if (!this.bossWave && this.loop) {
            if (this.currWave + 1 == this.maxWave - 1) {
                this._currWave = -1;
                cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ClearStage);
                cc.director.emit(GlobalEventName.BattleComplete);
                cc.director.emit(GlobalEventName.BattleStart);
            }
            this.state = EBATTLE_STATE.NextWave;
        }
        else if (this.currWave + 1 >= this.maxWave) {
            cc.director.emit(GlobalEventName.BattleComplete);
            const currLevel = this.currLevel;
            this.state = EBATTLE_STATE.NextLevel;
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.ClearStage, currLevel);
        }
        else {
            this.state = EBATTLE_STATE.NextWave;
        }
    }
    waveComplete() {
        if (this.state == EBATTLE_STATE.Battle) {
            if (this.bossWave) {
                this.levelComplete();
                this.loop = !1;
            }
            this.tryNextWave();
        }
    }
    public static get Instance(): NormalBattle {
        return NormalBattle._instance;
    }
    public get currLevel(): number {
        return Model.level.currNormalLevel;
    }
    public set currLevel(e: number) {
        Model.level.currNormalLevel = e;
    }
    public get currWave(): number {
        return this._currWave;
    }
    public get loop(): boolean {
        return this._loop;
    }
    public set loop(val: boolean) {
        if (this._loop !== val) {
            this._loop = val;
            LocalStorageTool.setItemLocal('normal_level_loop', val);
        }
    }
    public get maxWave(): number {
        return this._maxWave;
    }
}
