import { GlobalEventName } from "../common/Events";
import { ENUM_PROP_TYPE, E_UnlockSysType, E_ASSET_TYPE, E_GAME_LEVEL_TYPE } from "../common/Const";
import MsgBox from "../common/MsgBox";
import AppConstDefine from "../common/AppConst";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import BattleWorld from "./BattleWorld";
import BlessData from "../bless/BlessData";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import GuideMgr from "../guide/GuideMgr";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import { RingInfoData, RingPropInfo } from "../../ccstudio/data/RingModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import QuestChain from "../quest/QuestChain";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import _SysUnlockConfig from "../../ccstudio/config/_SysUnlockConfig";
import MsgHint from "../common/MsgHint";
import Transition from "../common/Transition";
import UnlockCtrl from "../unlock/UnlockCtrl";
import UserData from "../user/UserData";
import UserProp from "../user/UserProp";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class GameGMUI extends cc.Component {
    @property(cc.Button)
    addAllPropBtn: cc.Button = null;
    @property(cc.Button)
    btnAddCoin: cc.Button = null;
    @property(cc.Button)
    btnAddDiamond: cc.Button = null;
    @property(cc.Button)
    btnAddDwarvenKingKey: cc.Button = null;
    @property(cc.Button)
    btnAddHero: cc.Button = null;
    @property(cc.Button)
    btnAddItem: cc.Button = null;
    @property(cc.Button)
    btnAddPassExp: cc.Button = null;
    @property(cc.Button)
    btnAddRobExp: cc.Button = null;
    @property(cc.Button)
    btnAddSkill: cc.Button = null;
    @property(cc.Button)
    btnClear: cc.Button = null;
    @property(cc.Button)
    btnCompleteChain: cc.Button = null;
    @property(cc.Button)
    btnCreateRing: cc.Button = null;
    @property(cc.Button)
    btnDebugTime: cc.Button = null;
    @property(cc.Button)
    btnEditMine: cc.Button = null;
    @property(cc.Button)
    btnExport: cc.Button = null;
    @property(cc.Button)
    btnGoBlessLevel: cc.Button = null;
    @property(cc.Button)
    btnGoGameLevel: cc.Button = null;
    @property(cc.Button)
    btnGuide: cc.Button = null;
    @property(cc.Button)
    btnMiao: cc.Button = null;
    @property(cc.Button)
    btnOnekeyUnlock: cc.Button = null;
    @property(cc.Button)
    btnOpenBossRush: cc.Button = null;
    @property(cc.Button)
    btnOpenGoldRush: cc.Button = null;
    @property(cc.Button)
    btnPause: cc.Button = null;
    @property(cc.Button)
    btnShowFps: cc.Button = null;
    @property(cc.Button)
    btnUnlockChain: cc.Button = null;
    @property(cc.Button)
    btnWudi: cc.Button = null;
    @property(cc.EditBox)
    inputCount: cc.EditBox = null;
    @property(cc.EditBox)
    inputId: cc.EditBox = null;
    static isMiao: boolean = false;
    static isWudi: boolean = false;
    @property(cc.Label)
    labelUnlockState: cc.Label = null;
    @property(cc.Label)
    pauseStatus: cc.Label = null;
    @property(cc.Button)
    setMineBtn: cc.Button = null;
    @property(cc.Button)
    unlockAllGearBtn: cc.Button = null;
    @property(cc.Button)
    unlockAllHeroBtn: cc.Button = null;
    @property(cc.Button)
    unlockAllPartnerBtn: cc.Button = null;
    @property(cc.Button)
    unlockAllSkillBtn: cc.Button = null;
    clickMiao() {
        GameGMUI.isMiao = !GameGMUI.isMiao;
        this.freshMiaoLabel();
    }
    clickWudi() {
        GameGMUI.isWudi = !GameGMUI.isWudi;
        this.freshWudiLabel();
    }
    close(): void {
        this.node.getComponent(ViewAnimCtrl).onClose();
    }
    freshMiaoLabel() {
        this.btnMiao.getComponentInChildren(cc.Label).string = GameGMUI.isMiao ? "秒杀:是" : "秒杀:否";
    }
    freshWudiLabel() {
        this.btnWudi.getComponentInChildren(cc.Label).string = GameGMUI.isWudi ? "无敌:是" : "无敌:否";
    }
    genContent(e) {
        let t = AppConstDefine.LANGUAGE.path.json + "/zh";
        return cc.resources.load(t, cc.JsonAsset, function (t, n) {
            if (t) {
                cc.error(t);
                e(t);
            }
            else {
                e(t, n.json);
            }
            ;
        }), "";
    }
    onAddDwarvenKingKey(): void {
        if (this.inputCount.string !== "") {
            const e: number = parseInt(this.inputCount.string);
            UserData.Instance.addItem(E_ASSET_TYPE.DwarvenKing, e);
            this.close();
        }
        else
            MsgHint.tip("在 ‘数量’ 输入增加数量!");
    }
    onAddPassExp(): void {
        if (this.inputCount.string !== "") {
            const e: number = parseInt(this.inputCount.string);
            Model.pass.addExp(e);
            this.close();
        }
        else
            MsgHint.tip("在 ‘数量’ 输入增加数量!");
    }
    onAddRobExp() {
        if ("" != this.inputCount.string) {
            const e = this.inputCount.string;
            Model.rob.addRobExp(Number(e)),
                this.close();
        }
        else
            MsgHint.tip("在 ‘数量’ 输入增加数量!");
    }
    onClear(): void {
        const e = this;
        const t = MsgBox.open("是否清除存档?清除后将关闭游戏。");
        t.confirm(() => {
            LocalStorageTool.clearStorage();
            e.scheduleOnce(() => {
                cc.game.end();
            }, 0);
        });
        t.cancel();
    }
    onClickAddCoin(): void {
        if (this.inputCount.string !== "") {
            const e: string = NumberPlus.decode(this.inputCount.string);
            UserData.Instance.addCoin("" + e);
            this.close();
        }
        else
            MsgHint.tip("在 ‘数量’ 输入增加数量!");
    }
    onClickAddDiamond(): void {
        if (this.inputCount.string !== "") {
            const e: string = NumberPlus.decode(this.inputCount.string);
            UserData.Instance.addDiams("" + e);
            this.close();
        }
        else
            MsgHint.tip("在 ‘数量’ 输入增加数量!");
    }
    onClickAddHero() {
        var e = parseInt(this.inputId.string);
        var t = _HeroConfig.Instance.get(e);
        if (_.isNil(t)) {
            MsgHint.tip("主角不存在，检查id");
        }
        else if (Model.hero.unlock(e)) {
            MsgHint.tip("增加成功");
        }
        else {
            MsgHint.tip("增加失败");
        }
    }
    onClickAddItem() {
        if (this.inputId.string !== "") {
            var e = parseInt(this.inputId.string);
            if (this.inputCount.string !== "") {
                var t = parseInt(this.inputCount.string);
                var n = _AssetConfig.Instance.get(e);
                if (_.isNil(n)) {
                    MsgHint.tip("物品不存在!");
                }
                else {
                    Model.user.addAsset(e, t);
                    MsgHint.tip("增加成功");
                    this.close();
                }
            }
            else {
                MsgHint.tip("输入数量!");
            }
        }
        else {
            MsgHint.tip("输入id!");
        }
    }
    onClickAddSkill() {
        var e = parseInt(this.inputId.string);
        var t = _SkillConfig.Instance.get(e);
        if (_.isNil(t)) {
            MsgHint.tip("技能不存在，检查id!");
        }
        else {
            Model.skill.addSkill(e, 1);
            MsgHint.tip("增加成功");
        }
    }
    onClickDebugTime() {
        AppConstDefine.CHECK_NETWORK_TIME = !AppConstDefine.CHECK_NETWORK_TIME;
        this.btnDebugTime.getComponentInChildren(cc.Label).string = "禁止改时间:" + AppConstDefine.CHECK_NETWORK_TIME;
    }
    onClickGuide() {
        GuideMgr.instance.skipGuide = !GuideMgr.instance.skipGuide;
        this.btnGuide.getComponentInChildren(cc.Label).string = GuideMgr.instance.skipGuide ? "忽略引导:开" : "忽略引导:关";
    }
    onClickOnekeyUnlock() {
        var e = LocalStorageTool.getItemLocal("cc_user-unlock-GM");
        LocalStorageTool.setItemLocal("cc_user-unlock-GM", !e);
        this.refreshUnlockLabel();
        _SysUnlockConfig.Instance.getAllType().forEach((e) => {
            UnlockCtrl.Instance.unlockSys(e);
        });
        this.close();
    }
    onCompleteChainQuest(): void {
        QuestChain.Instance.complete();
        this.close();
    }
    onCreateRing() {
        if ("" != this.inputId.string) {
            const e = this.inputId.string.split(" ");
            if (2 == e.length) {
                const t = new RingInfoData;
                t.quality = Number(e[0]);
                t.ringLevel = Number(e[1]);
                const n = Model.ring.createRing(t);
                if ("" != this.inputCount.string) {
                    const o = this.inputCount.string.split(" ");
                    if (o.length % 2 == 0) {
                        for (let r = 0; r < o.length; r++) {
                            if (r % 2 == 0) {
                                const i = new RingPropInfo;
                                i.propId = Number(o[r]),
                                    i.value = Number(o[r + 1]),
                                    Model.ring.addRingProp(n.id, i);
                            }
                        }
                    }
                    else
                        MsgHint.tip("正确输入戒指属性");
                }
            }
            else
                MsgHint.tip("正确输入戒指品质和Id!");
        }
        else
            MsgHint.tip("输入戒指品质和Id!");
    }
    onExportChars() {
        let t = " 0123456789.,.(){}[]/$#@%&qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM<>+-::_!";
        this.genContent((n, o) => {
            let r = JSON.stringify(o), i = {};
            for (let e of r) {
                i[e] = true;
            }
            let a = Object.keys(i);
            t += a.join("");
            this.writeFile(t, "lang");
        });
    }
    onGoBlessLevel(): void {
        if (this.inputId.string !== "") {
            const e: number = parseInt(this.inputId.string);
            if (e < 1 || e > 3)
                MsgHint.error("祝福类型为： 1， 2，3");
            else if (this.inputCount.string !== "") {
                const t: number = parseInt(this.inputCount.string);
                if (t <= 0)
                    MsgHint.error("输入正确得等级");
                else {
                    const n = BlessData.Instance.getData(e);
                    n.exp = 0;
                    n.level = t;
                    this.close();
                }
            }
            else
                MsgHint.tip("在 ‘数量’ 输入祝福等级!");
        }
        else
            MsgHint.tip("在 ‘id’ 输入祝福类型，类型未：1，2，3!");
    }
    onGoGameLevel(): void {
        if (this.inputId.string !== "") {
            const e: number = parseInt(this.inputId.string);
            Model.level.completeNormall(e);
            Model.level.currNormalLevel = e;
            BattleWorld.Instance.currGameModeType !== E_GAME_LEVEL_TYPE.Normal
                ? BattleWorld.Instance.exitBossLevel()
                : BattleWorld.Instance.getBattleCtrl(E_GAME_LEVEL_TYPE.Normal).restart();
            this.close();
        }
        else
            MsgHint.tip("在 ‘id’ 输入关卡id!");
    }
    onLoad() {
        this.btnAddItem.node.on("click", this.onClickAddItem, this);
        this.btnAddSkill.node.on("click", this.onClickAddSkill, this);
        this.btnAddHero.node.on("click", this.onClickAddHero, this);
        this.btnOnekeyUnlock.node.on("click", this.onClickOnekeyUnlock, this);
        this.btnAddCoin.node.on("click", this.onClickAddCoin, this);
        this.btnAddDiamond.node.on("click", this.onClickAddDiamond, this);
        this.btnGuide.node.on("click", this.onClickGuide, this);
        this.btnUnlockChain.node.on("click", this.onUnlockChainQuest, this);
        this.btnCompleteChain.node.on("click", this.onCompleteChainQuest, this);
        this.btnAddDwarvenKingKey.node.on("click", this.onAddDwarvenKingKey, this);
        this.btnGoGameLevel.node.on("click", this.onGoGameLevel, this);
        this.btnOpenBossRush.node.on("click", this.onOpenBossRush, this);
        this.btnOpenGoldRush.node.on("click", this.onOpenGoldRush, this);
        this.btnPause.node.on("click", this.onPauseGame, this);
        this.btnAddPassExp.node.on("click", this.onAddPassExp, this);
        this.btnGoBlessLevel.node.on("click", this.onGoBlessLevel, this);
        this.btnClear.node.on("click", this.onClear, this);
        this.btnExport.node.on("click", this.onExportChars, this);
        this.btnEditMine.node.on("click", this.openMineEdit, this);
        this.btnMiao.node.on("click", this.clickMiao, this);
        this.btnWudi.node.on("click", this.clickWudi, this);
        this.btnShowFps.node.on("click", this.onShowFps, this);
        this.btnDebugTime.node.on("click", this.onClickDebugTime, this);
        this.btnDebugTime.getComponentInChildren(cc.Label).string = "禁止改时间:" + AppConstDefine.CHECK_NETWORK_TIME;
        this.btnCreateRing.node.on("click", this.onCreateRing, this);
        this.btnAddRobExp.node.on("click", this.onAddRobExp, this);
        this.unlockAllHeroBtn.node.on("click", this.unlockAllHero, this);
        this.unlockAllGearBtn.node.on("click", this.unlockAllGear, this);
        this.addAllPropBtn.node.on("click", this.unlockAllProp, this);
        this.setMineBtn.node.on("click", this.setMineDeepClick, this);
        this.unlockAllSkillBtn.node.on("click", this.unlockAllSkill, this);
        this.unlockAllPartnerBtn.node.on("click", this.unlockAllPartner, this);
        this.refreshUnlockLabel();
        this.refreshPauseLabel();
        this.freshMiaoLabel();
        this.freshWudiLabel();
    }
    onOpenBossRush(): void {
        if (this.inputId.string !== "") {
            const e: number = parseInt(this.inputId.string);
            Model.level.setMaxDifficulty(E_GAME_LEVEL_TYPE.BossRush, e);
            cc.director.emit(GlobalEventName.BossLevelUnlockDifficulty, E_GAME_LEVEL_TYPE.BossRush);
            this.close();
        }
        else
            MsgHint.tip("在 ‘id’ 输入副本难度!");
    }
    onOpenGoldRush(): void {
        if (this.inputId.string !== "") {
            const e: number = parseInt(this.inputId.string);
            Model.level.setMaxDifficulty(E_GAME_LEVEL_TYPE.GoldRush, e);
            cc.director.emit(GlobalEventName.BossLevelUnlockDifficulty, E_GAME_LEVEL_TYPE.GoldRush);
            this.close();
        }
        else
            MsgHint.tip("在 ‘id’ 输入副本难度!");
    }
    onPauseGame(): void {
        BattleWorld.Instance.PauseStatus ? BattleWorld.Instance.resume() : BattleWorld.Instance.pause();
        this.refreshPauseLabel();
        this.close();
    }
    onShowFps() {
        AppConstDefine.DISPLAY_DEBUG = !AppConstDefine.DISPLAY_DEBUG;
        cc.debug.setDisplayStats(AppConstDefine.DISPLAY_DEBUG);
    }
    onUnlockChainQuest(): void {
        if (this.inputId.string !== "") {
            const e: number = parseInt(this.inputId.string), t = _QuestConfig.Instance.get(e);
            _.isNil(t)
                ? MsgHint.tip("不存在的主线任务 questId: " + e)
                : (QuestChain.Instance.gotoQuest(e), this.close());
        }
        else
            MsgHint.tip("在 ‘Id’ 输入有效的任务id!");
    }
    openMineEdit(): void {
        Transition.loadScene(NAMES_BUNDLE.Game, "MineEdit");
    }
    refreshPauseLabel() {
        BattleWorld.Instance.PauseStatus ? this.pauseStatus.string = "恢复游戏" : this.pauseStatus.string = "暂停游戏";
    }
    refreshUnlockLabel() {
        var e = LocalStorageTool.getItemLocal("cc_user-unlock-GM", false);
        this.labelUnlockState.string = (e == 1) ? "一键解锁(开)" : "一键解锁(关)";
        this.btnGuide.getComponentInChildren(cc.Label).string = GuideMgr.instance.skipGuide ? "SkipGuide:On" : "SkipGuide:Off";
    }
    setMineDeepClick() {
        if (this.inputCount.string !== "") {
            const deep = parseInt(this.inputCount.string);
            Model.mine.setDigDepp(deep);
        }
        else {
            MsgHint.tip("在 ‘数量’ 输入增加数量!");
        }
    }
    unlockAllGear() {
        const e = _GearConfig.Instance.getAllGearId();
        for (let t = 0; t < e.length; t++) {
            Model.user.addAsset(e[t], 10000);
        }
    }
    unlockAllHero() {
        const e = _HeroConfig.Instance.getAllHeroId();
        for (let t = 0; t < e.length; t++) {
            Model.hero.unlock(e[t]);
        }
    }
    unlockAllPartner() {
        const ids = _PartnerConfig.Instance.getAllPartnerId();
        for (let i = 0; i < ids.length; i++) {
            Model.partner.addPartner(ids[i], 1000);
        }
    }
    unlockAllProp() {
        for (let i = 1; i <= 8; i++) {
            const propData = UserProp.Instance.getData(i);
            UserProp.Instance.saveUserPropLevel(i, propData.level + 1000, "10");
            if (i == ENUM_PROP_TYPE.ASPD) {
                cc.director.emit(GlobalEventName.UnlockValueChange, E_UnlockSysType.DoubleShot, propData.level + 1000);
            }
            else if (i == ENUM_PROP_TYPE.DoubleShot) {
                cc.director.emit(GlobalEventName.UnlockValueChange, E_UnlockSysType.TripleShot, propData.level + 1000);
            }
        }
    }
    unlockAllSkill() {
        const ids = _SkillConfig.Instance.getAllSkillId();
        for (let i = 0; i < ids.length; i++) {
            Model.skill.addSkill(ids[i], 1000);
        }
    }
    async writeFile(e, t) {
        // await window.showSaveFilePicker({
        //     suggestedName: t,
        //     types: [{
        //         description: "保存文件",
        //         accept: {
        //             "text/plain": [".txt"]
        //         }
        //     }]
        // }).then(async function (t) {
        //     const n = await t.createWritable();
        //     await n.write(e);
        //     await n.close();
        //     const o = "保存成功: " + t.name;
        //     MsgBox(o);
        // }).catch(function (e) {
        //     console.log(e);
        //     const o = "保存失败: " + e.message;
        //     MsgBox(o);
        // });
    }
}
