import { GuideEnums, SpecialGuideEnum } from "../../modules/guide/GuideEnums";
import { EVideoType, EInsertAdType, EOpenUIType } from "../../modules/common/ViedioType";
import { GlobalEventName } from "../../modules/common/Events";
import { E_GAME_LEVEL_TYPE, E_ASSET_TYPE, GameConst, DAY_SECONDS, E_UnlockSysType, E_ENEMY_TYPE } from "../../modules/common/Const";
import AdsManager from "../../modules/ads/AdsManager";
import MsgBox from "../../modules/common/MsgBox";
import BattleWorld from "../../modules/battle/BattleWorld";
import _BossRushConfig from "../config/_BossRushConfig";
import _CaveRushConfig from "../config/_CaveRushConfig";
import Config from "../configs/Config";
import _DwarvenKingConfig from "../config/_DwarvenKingConfig";
import _EnemyConfig from "../config/_EnemyConfig";
import _GoldRushConfig from "../config/_GoldRushConfig";
import GuideMgr from "../../modules/guide/GuideMgr";
import LanMgr from "../../modules/common/Language";
import _LegionRushConfig from "../config/_LegionRushConfig";
import _LevelConfig from "../config/_LevelConfig";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import NumberPlus from "../utils/NumberPlus";
import MsgHint from "../../modules/common/MsgHint";
import UserData from "../../modules/user/UserData";
const _ = window["_"];
const moment = window['moment'];
const G = "user-dungeon-ad-replenished";
const x = { [E_GAME_LEVEL_TYPE.BossRush]: EVideoType.AdBossRush, [E_GAME_LEVEL_TYPE.GoldRush]: EVideoType.AdGoldRush, [E_GAME_LEVEL_TYPE.DwarvenKing]: EVideoType.AdDwarvenKing, [E_GAME_LEVEL_TYPE.CaveRush]: EVideoType.AdCaveRush, [E_GAME_LEVEL_TYPE.LegionRush]: EVideoType.AdLegionRush };
export default class LevelModel extends ModeBase {
    private _currNormalLevel: number;
    private _lastAutoReplenished: any;
    bossKeyAdCont: any;
    bossLevelCompleteCnt: any;
    bossLevelTotalCompleteCnt: any;
    bossLevelUseKey: any = {};
    curDifficulty: any;
    maxDifficulty: any;
    unlockLevel: number;
    addBossLevelCompleteCount(e: any, t: any) {
        const n = _.get(this.bossLevelCompleteCnt, [e, t], 0) + 1;
        _.set(this.bossLevelCompleteCnt, [e, t], n);
        const o = _.get(this.bossLevelTotalCompleteCnt, e, 0) + 1;
        _.set(this.bossLevelTotalCompleteCnt, e, o);
        LocalStorageTool.setItemLocal("cc_boss_level_complete_count", this.bossLevelCompleteCnt);
        LocalStorageTool.setItemLocal("cc_boss_level_complete_total_count", this.bossLevelTotalCompleteCnt);
    }
    calCaveRushLevelData(e) {
        let t, n;
        const o = _EnemyConfig.Instance.get(e), r = this.getCurDifficulty(E_GAME_LEVEL_TYPE.CaveRush), i = _CaveRushConfig.Instance.get(r);
        if (o.type == E_ENEMY_TYPE.House) {
            n = NumberPlus.mul(o.damage, "0");
            t = NumberPlus.mul(o.hp, i.caveHP);
        }
        else {
            n = NumberPlus.mul(o.damage, i.multiAttack);
            t = NumberPlus.mul(o.hp, i.multiHP);
        }
        return {
            damage: n,
            hp: t,
        };
    }
    calcBossRushLevelData(e, t) {
        const n = _EnemyConfig.Instance.get(e), o = this.getCurDifficulty(E_GAME_LEVEL_TYPE.BossRush), r = Config.bossRush.get(t), i = _GoldRushConfig.Instance.get(o);
        return {
            damage: NumberPlus.mul(n.damage, NumberPlus.mul(r.multiAttack, i.multiAttack)),
            hp: NumberPlus.mul(n.hp, NumberPlus.mul(r.multiHP, i.multiHP)),
        };
    }
    calcDwarvenkingRushLevelData(e, t) {
        const n = _EnemyConfig.Instance.get(e), o = _DwarvenKingConfig.Instance.get(t);
        return {
            damage: NumberPlus.mul(n.damage, o.atkMulit),
            hp: NumberPlus.mul(n.hp, NumberPlus.decode("85.3J")),
        };
    }
    calcEnemyData(e, t) {
        let n = _EnemyConfig.Instance.get(e);
        let o = Config.level.get(t);
        let r = NumberPlus.mul(n.damage, o.multiAttack);
        let i = NumberPlus.mul(n.hp, o.multiHP);
        let a = NumberPlus.mul(n.gold, o.multiGold);
        if (n.type == E_ENEMY_TYPE.Normal) {
            i = NumberPlus.div(i, o.multiBossHP);
            r = NumberPlus.div(r, o.multiBossAttack);
        }
        return {
            damage: r,
            hp: i,
            gold: a,
        };
    }
    calcGoldRushLevelData(e) {
        const t = _EnemyConfig.Instance.get(e), n = this.getCurDifficulty(E_GAME_LEVEL_TYPE.GoldRush), o = _GoldRushConfig.Instance.get(n);
        return {
            damage: NumberPlus.mul(t.damage, o.multiAttack),
            hp: NumberPlus.mul(t.hp, o.multiHP),
        };
    }
    calcRewardCount(e) {
        if (e == E_GAME_LEVEL_TYPE.BossRush) {
            return (E_ASSET_TYPE.Diamond.toString() +
                "|" +
                (GameConst.BOSS_RUSH_BASE_REWARD_COUNT +
                    10 * this.getCurDifficulty(e)));
        }
        if (e == E_GAME_LEVEL_TYPE.GoldRush) {
            const t = this.getCurDifficulty(e), o = _GoldRushConfig.Instance.get(t);
            return E_ASSET_TYPE.Diamond.toString() + "|" + o.reward;
        }
        if (e == E_GAME_LEVEL_TYPE.CaveRush) {
            const t = this.getCurDifficulty(E_GAME_LEVEL_TYPE.CaveRush);
            const o = _CaveRushConfig.Instance.get(t);
            const r = o.reward;
            return E_ASSET_TYPE.Fork.toString() + "|" + r;
        }
        if (e == E_GAME_LEVEL_TYPE.LegionRush) {
            const i = Model.ring.getLastRingData();
            return i.originId + "|" + i.id;
        }
        return "";
    }
    // initLoadData() {
    //     const e = this;
    //     this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
    //     cc.game.on(cc.game.EVENT_HIDE, () => {
    //         e.unschedule(e.fixedUpdate);
    //     });
    //     cc.game.on(GlobalEvent.GameResume, () => {
    //         e.schedule(e.fixedUpdate, 1, cc.macro.REPEAT_FOREVER, Math.random());
    //     });
    // }
    checkAndReplenished() {
        let isReplenished = false;
        if (moment(Date.now()).diff(this.lastAutoReplenished, "seconds") >= DAY_SECONDS) {
            this.lastAutoReplenished = moment(Date.now()).subtract(8, "hours").startOf("days").add(8, "hours");
            _.each(this.bossLevelUseKey, (t, n) => {
                const o = parseInt(n);
                const r = this.getDailyInitKeyCount(o);
                if (parseInt(UserData.Instance.getItem(t)) < r) {
                    UserData.Instance.setItem(t, r);
                    cc.director.emit(GlobalEventName.AssetItemChange + t);
                }
                this.bossKeyAdCont[o] = 0;
            });
            isReplenished = true;
        }
        return isReplenished;
    }
    completeBossLevel(e) {
        const t = this.getCurDifficulty(e);
        this.addBossLevelCompleteCount(e, t),
            this.reportDungeon(e),
            this.unlockDifficulty(e),
            Model.ad.showInterstitial(EInsertAdType.RushAd, EOpenUIType.Rush);
    }
    completeNormall(e) {
        this.unlockNormalLevel(e);
    }
    async enterBossLevel(e: any) {
        const t = this;
        return new Promise(async (n) => {
            const o = t.bossLevelUseKey[e];
            if (parseInt(UserData.Instance.getItem(o)) <= 0) {
                let r = e == E_GAME_LEVEL_TYPE.LegionRush ? GameConst.LEGION_AD_REPLENISHED_COUNT : GameConst.BOSS_AD_REPLENISHED_COUNT;
                if (CC_PREVIEW) {
                    r = 100;
                }
                const i = _.get(t.bossKeyAdCont, e, 0);
                if (i >= r) {
                    MsgHint.tip(LanMgr.Instance.getLangByID("Can't enter the dungeon anymore"));
                    return false;
                }
                const a = MsgBox.open(LanMgr.Instance.getLangByID("Watch an ad and get tickets"));
                a.confirmAd(async () => {
                    await (async () => {
                        const t = () => {
                            UserData.Instance.addItem(o, 1);
                            _.set(this.bossKeyAdCont, e, i + 1);
                            this.saveItems(G, this.bossKeyAdCont);
                            BattleWorld.Instance.switchGameMode(e);
                            n(true);
                        };
                        const r = x[e];
                        const a = {
                            AdsType: r,
                            OpenUi: r,
                            onCancel: () => n(false),
                            onFail: () => n(false),
                            onSucceed: t
                        };
                        AdsManager.getInstance().showRewardedVideo(a);
                    })();
                });
                a.cancel(() => {
                    n(false);
                });
            }
            else {
                BattleWorld.Instance.switchGameMode(e);
                n(true);
            }
        });
    }
    fixedUpdate() {
        if (this.checkAndReplenished()) {
            this.saveItems(G, this.bossKeyAdCont);
        }
    }
    getAdCount(e: any) {
        return _.get(this.bossKeyAdCont, e, 0);
    }
    getBossLevelCompleteCount(e: any, t: any) {
        return {
            count: _.get(this.bossLevelCompleteCnt, [e, t], 0),
            totalCount: _.get(this.bossLevelTotalCompleteCnt, e, 0)
        };
    }
    getBossLevelKey(e: any) {
        return this.bossLevelUseKey[e];
    }
    getBossLevelMaxCfgLevel(e) {
        switch (e) {
            case E_GAME_LEVEL_TYPE.BossRush:
            case E_GAME_LEVEL_TYPE.GoldRush:
                return _GoldRushConfig.Instance.getMax();
            case E_GAME_LEVEL_TYPE.CaveRush:
                return _CaveRushConfig.Instance.getMax();
            case E_GAME_LEVEL_TYPE.LegionRush:
                return _LegionRushConfig.Instance.getMax();
        }
        return 0;
    }
    getCurDifficulty(e: any) {
        return _.get(this.curDifficulty, e, 1);
    }
    getDailyInitKeyCount(e) {
        return e == E_GAME_LEVEL_TYPE.LegionRush ? GameConst.LEGION_KEY_NUM : GameConst.BOSS_AUTO_REPLENISHED_COUNT;
    }
    getGameTicket(e: any) {
        return this.getBossLevelKey(e);
    }
    getMaxDifficulty(e: any) {
        return _.get(this.maxDifficulty, e, 1);
    }
    load(): void {
        var e = this;
        this.curDifficulty = this.loadItems("user-curr-difficulty"),
            this.maxDifficulty = this.loadItems("user-max-difficulty"),
            _.each(this.maxDifficulty, function (t, n) {
                var o = parseInt(n), r = e.getBossLevelMaxCfgLevel(o);
                cc.log(E_GAME_LEVEL_TYPE[o], r, t, e.getCurDifficulty(o)),
                    t > r && e.setMaxDifficulty(o, r),
                    e.getCurDifficulty(o) > r && e.setCurDifficulty(o, r);
            }),
            this.unlockLevel = LocalStorageTool.getItemLocal("cc_user-normal-unlock-level", 1),
            1 == this.unlockLevel,
            this.currNormalLevel = LocalStorageTool.getItemLocal("cc_user-normal-curr-level", 1),
            this.bossKeyAdCont = this.loadItems(G);
        var t = LocalStorageTool.getItemLocal("cc_user-dungeon-auto-replenished");
        _.isNil(t) ? (this.lastAutoReplenished = moment(Date.now()).subtract(8, "hours").startOf("days").add(8, "hour"), _.each(this.bossLevelUseKey, function (t, n) {
            var o = parseInt(n);
            UserData.Instance.setItem(t, e.getDailyInitKeyCount(o)),
                e.bossKeyAdCont[o] = 0;
        })) : (this.lastAutoReplenished = moment(t), this.checkAndReplenished()),
            this.bossLevelCompleteCnt = LocalStorageTool.getItemLocal("cc_boss_level_complete_count", {}),
            this.bossLevelTotalCompleteCnt = LocalStorageTool.getItemLocal("cc_boss_level_complete_total_count", {}),
            this.saveItems(G, this.bossKeyAdCont);
    }
    loadItems(e: any) {
        return LocalStorageTool.getItemLocal(e, {});
    }
    reportDungeon(e) {
        const t = this.getCurDifficulty(e), o = this.getMaxDifficulty(e);
        console.log("levelMax=", o, t);
        const r = this.getBossLevelCompleteCount(e, t), i = r.count, a = r.totalCount, s = {
            Dungeon_Level: t,
            Dungeon_Reward: this.calcRewardCount(e).toString(),
            Dungeon_Times: i,
            Dungeon_Total: a,
            Dungeon_Type: E_GAME_LEVEL_TYPE[e],
        };
    }
    saveItems(e: any, t: any) {
        LocalStorageTool.setItemLocal(e, t);
    }
    setCurDifficulty(e: any, t: any) {
        _.set(this.curDifficulty, e, t);
        this.saveItems("user-curr-difficulty", this.curDifficulty);
    }
    setMaxDifficulty(e: any, t: any) {
        _.set(this.maxDifficulty, e, t);
        this.saveItems("user-max-difficulty", this.maxDifficulty);
    }
    unlockDifficulty(e) {
        let t = this.getCurDifficulty(e), n = this.getMaxDifficulty(e);
        if (t == n && n < this.getBossLevelMaxCfgLevel(e)) {
            n = t += 1;
            this.setCurDifficulty(e, t),
                this.setMaxDifficulty(e, n),
                cc.director.emit(GlobalEventName.BossLevelUnlockDifficulty, e);
        }
    }
    unlockNormalLevel(e) {
        if (e > this.unlockLevel) {
            this.unlockLevel = e;
            this.saveItems("user-normal-unlock-level", this.unlockLevel);
            cc.director.emit(GlobalEventName.UnlockValueChange, E_UnlockSysType.Level, this.unlockLevel);
            const t = GuideMgr.instance.getSpecialGuideEnum(GuideEnums.UNLOCK_CUSTOMS, e);
            if (t !== SpecialGuideEnum.None) {
                Model.ui.closeAll();
                GuideMgr.instance.checkSpecial(t);
            }
        }
    }
    constructor() {
        super();
        this.bossLevelUseKey[E_GAME_LEVEL_TYPE.BossRush] = E_ASSET_TYPE.BossRushKey;
        this.bossLevelUseKey[E_GAME_LEVEL_TYPE.GoldRush] = E_ASSET_TYPE.GoldRushKey;
        this.bossLevelUseKey[E_GAME_LEVEL_TYPE.CaveRush] = E_ASSET_TYPE.CaveRushKey;
        this.bossLevelUseKey[E_GAME_LEVEL_TYPE.DwarvenKing] = E_ASSET_TYPE.DwarvenKing;
        this.bossLevelUseKey[E_GAME_LEVEL_TYPE.LegionRush] = E_ASSET_TYPE.HeroLegion;
    }
    set currNormalLevel(value: number) {
        if (this._currNormalLevel !== value) {
            this._currNormalLevel = value;
            LocalStorageTool.setItemLocal("cc_user-normal-curr-level", value);
        }
    }
    get currNormalLevel(): number {
        return this._currNormalLevel;
    }
    set lastAutoReplenished(value: any) {
        if (this._lastAutoReplenished !== value) {
            this._lastAutoReplenished = value;
            this.saveItems("user-dungeon-auto-replenished", value.format());
        }
    }
    get lastAutoReplenished(): any {
        return this._lastAutoReplenished;
    }
}
