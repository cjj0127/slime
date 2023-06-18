import NormalBattle from "./NormalBattle";
import GuideUnlock from "../guide/GuideUnlock";
import BossLevelTitleComp from "./BossLevelTitleComp";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, LEVEL_DIFFICULTY_NAME, LEVEL_DIFFICULTY_COLOR, LEVEL_NAME_NUM, GameConst } from "../common/Const";
import Model from "../../ccstudio/data/Model";
import Utils_ from "../../ccstudio/utils/Utils";
const b = [.11, .32, .55, .76, 1];
const { ccclass, property } = cc._decorator;
const m: any = window["_"];
@ccclass
export default class NormallTitleBattle extends BossLevelTitleComp {
    @property(cc.Node)
    bossGuideNode: cc.Node = null;
    @property(cc.Button)
    btnBoss: cc.Button = null;
    @property(cc.ProgressBar)
    cdTimeProgress: cc.ProgressBar = null;
    @property(cc.Label)
    levelIdLabel: cc.Label = null;
    @property(cc.Label)
    levelNameLabel: cc.Label = null;
    @property(cc.ProgressBar)
    levelProgress: cc.ProgressBar = null;
    @property(cc.Tween)
    levelProgressTween: cc.Tween = null;
    @property(cc.Node)
    loopFlg: cc.Node = null;
    // async onBossGuide() {
    //     await new Promise<void>(async (resolve, reject) => {
    //         try {
    //             let e;
    //             await Model.ui.openViewAsync(UIPrefabs.GuideUnlock);
    //             [e] = await Promise.all([Model.ui.getComponent(GuideUnlock).showFocusTo(this.bossGuideNode), Utils.wait(2)]);
    //             Model.ui.closeView(e);
    //             cc.director.emit(GlobalEvent.BossTip);
    //             resolve();
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // }
    async onBossGuide() {
        try {
            const e = await Model.ui.openViewAsync(MapUIPrefabs.GuideUnlock);
            await e.getComponent(GuideUnlock).showFocusTo(this.bossGuideNode);
            await Utils_.waits(2);
            Model.ui.closeView(e);
            cc.director.emit(GlobalEventName.BossTip);
        }
        catch (t) {
            console.error(t);
        }
    }
    onChangeLevel() {
        this.refreshLevelName();
        this.refreshBattleStatus();
        this.refreshWaveProgress();
    }
    onChangeLevelToBoss() {
        this.levelProgressTween = cc.tween(this.levelProgress).to(.15, { progress: 1 }).start();
    }
    onChangeLevelWave() {
        if (NormalBattle.Instance.loop || NormalBattle.Instance.bossWave) {
            this.refreshBattleStatus();
        }
        else {
            this.refreshWaveProgress();
        }
    }
    onClickBoss() {
        NormalBattle.Instance.challengeBoss();
        this.btnBoss.node.active = !1;
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        if (this.levelProgressTween) {
            this.levelProgressTween.stop();
        }
        this.refreshLevelName();
        this.refreshBattleStatus();
        const e = NormalBattle.Instance.currWave;
        const _ = NormalBattle.Instance.maxWave;
        this.levelProgress.progress = b[e];
        cc.director.on(GlobalEventName.ChangeLevel, this.onChangeLevel, this);
        cc.director.on(GlobalEventName.ChangeLevelWave, this.onChangeLevelWave, this);
        cc.director.on(GlobalEventName.ChangeLevelToBoss, this.onChangeLevelToBoss, this);
        cc.director.on(GlobalEventName.RestartLevel, this.onRestartLevel, this);
        this.btnBoss.target.stopAllActions();
        cc.tween(this.btnBoss.target)
            .to(.2, { scale: 1.4 })
            .to(.2, { scale: 1.2 })
            .union()
            .repeatForever()
            .start();
    }
    // levelNameLabel: cc.Label = null;
    // levelIdLabel: cc.Label = null;
    // loopFlg: cc.Node = null;
    // btnBoss: cc.Button = null;
    // levelProgress: cc.ProgressBar = null;
    // cdTimeProgress: cc.ProgressBar = null;
    // bossGuideNode: cc.Node = null;
    onLoad() {
        this.btnBoss.node.on("click", this.onClickBoss, this);
        cc.director.on(GlobalEventName.BossGuide, this.onBossGuide, this);
    }
    onRestartLevel() {
        this.refreshLevelName();
        this.refreshBattleStatus();
    }
    refreshBattleStatus() {
        const e = NormalBattle.Instance.loop;
        if (NormalBattle.Instance.bossWave) {
            this.cdTimeProgress.node.active = !0;
            this.levelProgress.node.active = !1;
            this.loopFlg.active = !1;
            this.btnBoss.node.active = !1;
        }
        else {
            this.cdTimeProgress.node.active = !1;
            this.levelProgress.node.active = !e;
            this.loopFlg.active = e;
            this.btnBoss.node.active = e;
        }
    }
    refreshBossBattleTime() {
        this.cdTimeProgress.progress = NormalBattle.Instance.bossWaveDuration / GameConst.LIMITTIME_STAGE;
    }
    refreshLevelName() {
        const e = NormalBattle.Instance.getCurrLevelCfg();
        const t = e.difficulty;
        const n = e.level;
        let o = "";
        let r = null;
        if (t <= LEVEL_DIFFICULTY_NAME.length) {
            o = LEVEL_DIFFICULTY_NAME[t - 1];
            r = LEVEL_DIFFICULTY_COLOR[t - 1];
        }
        else {
            o = m.last(LEVEL_DIFFICULTY_NAME);
            r = m.last(LEVEL_DIFFICULTY_COLOR);
        }
        let i = LanMgr.Instance.getLangByID(o);
        if (t >= LEVEL_DIFFICULTY_NAME.length) {
            i += LEVEL_NAME_NUM[t - LEVEL_DIFFICULTY_NAME.length];
        }
        this.levelNameLabel.node.color = r;
        this.levelNameLabel.string = "" + i;
        this.levelIdLabel.string = "" + n;
    }
    refreshWaveProgress() {
        const e = NormalBattle.Instance.currWave;
        const _ = NormalBattle.Instance.maxWave;
        if (this.levelProgressTween) {
            this.levelProgressTween.stop();
        }
        const t = b[e];
        this.levelProgressTween = cc.tween(this.levelProgress).to(.15, { progress: t }).start();
    }
    updateDuration() {
        if (NormalBattle.Instance.bossWave) {
            this.refreshBossBattleTime();
        }
    }
}
