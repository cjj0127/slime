import { GlobalEventName } from "../common/Events";
import { EUNLOCKSYS_ID, MapUIPrefabs, E_ASSET_TYPE, GameConst } from "../common/Const";
import AppConstDefine from "../common/AppConst";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import BattleWorld from "./BattleWorld";
import BlessData from "../bless/BlessData";
import ChannelManager, { eChannelType } from "../common/ChannelManager";
import GlobalNotify from "../common/GlobalNotify";
import GuideMgr from "../guide/GuideMgr";
import LanMgr from "../common/Language";
import QuestSevenChallenge from "../quest/QuestSevenChallenge";
import { SdkBridge } from "../../ccstudio/utils/SdkBridge";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import Model from "../../ccstudio/data/Model";
import UISevenChallengeView from "../activity/UISevenChallengeView";
import UnlockCtrl from "../unlock/UnlockCtrl";
import WeekMgr from "../activity/WeekMgr";
// import * as BattleWorld from 'BattleWorld';
const _ = window["_"];
const moment: any = window["moment"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class HudUI extends cc.Component {
    @property([cc.Sprite])
    blessSprites: cc.Sprite[] = [];
    @property(cc.Button)
    btnBless: cc.Button = null;
    @property(cc.Button)
    btnCollection: cc.Button = null;
    @property(cc.Button)
    btnDailyQuest: cc.Button = null;
    @property(cc.Button)
    btnGm: cc.Button = null;
    @property(cc.Button)
    btnIdleChest: cc.Button = null;
    @property(cc.Button)
    btnMail: cc.Button = null;
    @property(cc.Button)
    btnPass: cc.Button = null;
    @property(cc.Button)
    btnRulette: cc.Button = null;
    @property(cc.Button)
    btnSevenChallenge: cc.Button = null;
    @property(cc.AudioClip)
    music: cc.AudioClip = null;
    @property(cc.Node)
    recordBtn: cc.Node = null;
    @property([cc.Button])
    setBtn: cc.Button[] = [];
    async addRecordBtn() {
        if (SdkBridge.getChannelType() !== eChannelType.BYTEDANCE)
            return;
        this.recordBtn = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.RecordBtn.path);
        this.btnPass.node.getParent().addChild(this.recordBtn);
        this.recordBtn.on("click", this.onClickRecord, this);
    }
    check() {
        WeekMgr.Instance.OpenWeekDialog();
        if (Model.user.isUnlock(EUNLOCKSYS_ID.Hangup) && Model.obtain.getCollectTime() > 600) {
            const e = Model.obtain.getIdleInfo();
            if ("0" == e.coins && _.isEmpty(e.items)) {
                Model.ui.addViewAsyncQueue(MapUIPrefabs.IdleChestView);
            }
        }
        this.updataeNotify();
        Model.ui.setViewAsyncComplete(this.checkGuide.bind(this));
    }
    async checkGuide() {
        GuideMgr.instance.check();
        await GuideMgr.instance.startCheckLastSpecial();
    }
    checkShowRightUpShare() {
        if (SdkBridge.getChannelType() == eChannelType.WECHAT) {
            SdkBridge.showRightUpShare();
        }
    }
    delayRefreshIdleChest() {
        this.unschedule(this.refreshIdleChestStatus);
        this.scheduleOnce(this.refreshIdleChestStatus, 600);
    }
    onClickBless() {
        Model.ui.openViewAsync(MapUIPrefabs.BlessPropView);
    }
    onClickCollection() {
        Model.ui.openViewAsync(MapUIPrefabs.CollectionView);
    }
    onClickDailyQuest() {
        Model.ui.openViewAsync(MapUIPrefabs.QuestDailyView);
    }
    onClickGm() {
        Model.ui.openViewAsync({
            url: "UI/GM/GameGMUI"
        });
    }
    onClickIdleChest() {
        Model.ui.openViewAsync(MapUIPrefabs.IdleChestView);
    }
    onClickPass() {
        Model.ui.openViewAsync(MapUIPrefabs.PassView);
    }
    onClickRecord() {
        // const e = this;
        // if (A.ttSdk.getVideoState() == A.RECORD_STATE.CLOSE || A.ttSdk.getVideoState() == A.RECORD_STATE.END) {
        //     A.ttSdk.recordStart(function () {
        //         e.recordBtn.getComponent(S.default).startRecord()
        //     })
        // } else if (A.ttSdk.getVideoState() == A.RECORD_STATE.START && A.ttSdk.getRecordTime() > 4) {
        //     A.ttSdk.recordStop(function () {
        //         e.recordBtn.getComponent(S.default).stopRecord();
        //         Model.ui.openViewAsync(UIPrefabs.ShareRecordView)
        //     })
        // } else if (A.ttSdk.getVideoState() == A.RECORD_STATE.START && A.ttSdk.getRecordTime() <= 4) {
        //     MsgHint.tip("录屏时间较短，请稍后重试！")
        // }
    }
    onClickRoulette() {
        Model.ui.openViewAsync(MapUIPrefabs.RouletteView);
    }
    onClickSevenChallenge() {
        Model.ui.openViewAsync(MapUIPrefabs.SevenChallenge, {
            viewComp: UISevenChallengeView,
            data: Model.sevenChallenge.getToggleIndex()
        });
    }
    onDestroy() {
        cc.game.targetOff(this);
        cc.director.targetOff(this);
    }
    onEnable() {
        //todo SoundPlayerComp.Instance.playMusic(this.music);
        this.refreshRouletteCount();
        this.refreshIdleChestStatus();
        this.refreshCollectionUnlockState(EUNLOCKSYS_ID.Atlas);
        this.refreshWheelUnlockState(EUNLOCKSYS_ID.Wheel);
        this.refreshPassUnlockState(EUNLOCKSYS_ID.Pass);
        this.refreshTaskUnlockState(EUNLOCKSYS_ID.Task);
        this.refreshHungupUnlockState(EUNLOCKSYS_ID.Hangup);
        this.refreshBlessUnlockState(EUNLOCKSYS_ID.Bless);
        this.refreshSevenChanllengeUnlockState(EUNLOCKSYS_ID.SevenChallenge);
        for (let e = 1; e < 4; e++)
            this.refreshBlessState(e);
        cc.director.on(GlobalEventName.RouletteCountChange, this.onRouletteCountChange, this);
        cc.director.on(GlobalEventName.ObtainIdleReceived, this.onObtainReceived, this);
        cc.director.on(GlobalEventName.BlessTakeEffect, this.refreshBlessState, this);
        cc.director.on(GlobalEventName.UnlockAtlas, this.refreshCollectionUnlockState, this);
        cc.director.on(GlobalEventName.UnlockWheel, this.refreshWheelUnlockState, this);
        cc.director.on(GlobalEventName.UnlockSign, this.refreshSignUnlockState, this);
        cc.director.on(GlobalEventName.UnlockPass, this.refreshPassUnlockState, this);
        cc.director.on(GlobalEventName.UnlockTask, this.refreshTaskUnlockState, this);
        cc.director.on(GlobalEventName.UnlockHungup, this.refreshHungupUnlockState, this);
        cc.director.on(GlobalEventName.UnlockBless, this.refreshBlessUnlockState, this);
        cc.director.on(GlobalEventName.UnlockSevenChallenge, this.refreshSevenChanllengeUnlockState, this);
        this.check();
        const t = ["Game_Tips_01", "Game_Tips_02", "Game_Tips_03", "Game_Tips_04", "Game_Tips_05"];
        let n = 0;
        const o = () => {
            GlobalNotify.open(LanMgr.Instance.getLangByID(t[n++ % t.length]));
        };
        o();
        this.schedule(o, GameConst.SCROLL_TIP_CD, cc.macro.REPEAT_FOREVER);
    }
    //  btnIdleChest: cc.Button;
    //  btnDailyQuest: cc.Button;
    //  btnRulette: cc.Button;
    //  btnPass: cc.Button;
    //  setBtn: cc.Button[];
    //  btnCollection: cc.Button;
    //  btnBless: cc.Button;
    //  btnSevenChallenge: cc.Button;
    //  btnMail: cc.Button;
    //  recordBtn: cc.Node;
    //  music: string;
    onLoad() {
        this.btnIdleChest.node.on("click", this.onClickIdleChest, this);
        this.btnDailyQuest.node.on("click", this.onClickDailyQuest, this);
        this.btnRulette.node.on("click", this.onClickRoulette, this);
        this.btnPass.node.on("click", this.onClickPass, this);
        this.addRecordBtn();
        this.btnCollection.node.on("click", this.onClickCollection, this);
        this.btnBless.node.on("click", this.onClickBless, this);
        this.btnSevenChallenge.node.on("click", this.onClickSevenChallenge, this);
        this.btnMail.node.on("click", this.onMailClick, this);
        for (let e = 0; e < this.setBtn.length; e++)
            this.setBtn[e].node.on("click", this.onOpenSetView, this);
        if (ChannelManager.getChannelType() == eChannelType.WECHAT) {
            this.setBtn[0].node.active = !1;
            this.setBtn[1].node.active = !0;
        }
        else {
            this.setBtn[0].node.active = !0;
            this.setBtn[1].node.active = !1;
        }
        AppConstDefine.OPEN_GM && this.btnGm.node.on("click", this.onClickGm, this);
        cc.game.on(GlobalEventName.GameResume, this.refreshIdleChestStatus, this);
        this.checkShowRightUpShare();
    }
    onMailClick() {
        Model.ui.openViewAsync(MapUIPrefabs.MailView);
    }
    onObtainReceived() {
        this.btnIdleChest.node.active = !1;
        this.delayRefreshIdleChest();
    }
    onOpenSetView() {
        Model.ui.openViewAsync(MapUIPrefabs.SetViewUI);
    }
    onRouletteCountChange() {
        this.refreshRouletteCount();
    }
    refreshBlessState(e) {
        if (BlessData.Instance.getRemainTime(e) <= 0) {
            this.blessSprites[e - 1].setState(cc.Sprite.State.GRAY);
            this.blessSprites[e - 1].node.color = cc.color(180, 180, 180);
        }
        else {
            this.blessSprites[e - 1].node.color = cc.Color.WHITE;
            this.blessSprites[e - 1].setState(cc.Sprite.State.NORMAL);
        }
    }
    refreshBlessUnlockState(e) {
        this.btnBless.node.active = UnlockCtrl.Instance.isUnlock(e);
    }
    // @property(cc.AudioClip)
    // music = null
    // @property(cc.Button)
    // btnIdleChest = null
    // @property(cc.Button)
    // btnDailyQuest = null
    // @property(cc.Button)
    // btnRulette = null
    // @property(cc.Button)
    // btnPass = null
    // @property(cc.Button)
    // btnCollection = null
    // @property(cc.Button)
    // btnBless = null
    // @property(cc.Button)
    // btnSevenChallenge = null
    // @property(cc.Button)
    // btnMail = null
    // @property(cc.Button)
    // setBtn = null
    // @property([cc.Sprite])
    // blessSprites = []
    // @property(cc.Button)
    // btnGm = null
    refreshCollectionUnlockState(e) {
        this.btnCollection.node.active = UnlockCtrl.Instance.isUnlock(e);
    }
    refreshHungupUnlockState(e) {
        this.refreshIdleChestStatus();
    }
    refreshIdleChestStatus() {
        if (UnlockCtrl.Instance.isUnlock(EUNLOCKSYS_ID.Hangup)) {
            const e = Model.obtain.getIdleInfo();
            const t = ("0" != e.coins || !_.isEmpty(e.items)) && Model.obtain.getCollectTime() > 600;
            this.btnIdleChest.node.active = t;
            if (!t) {
                this.delayRefreshIdleChest();
            }
        }
        else {
            this.btnIdleChest.node.active = !1;
        }
    }
    refreshPassUnlockState(e) {
        this.btnPass.node.active = UnlockCtrl.Instance.isUnlock(e);
    }
    refreshRouletteCount() {
        const e = Model.roulette.getLastSpinCount();
        this.btnRulette.node.active = e > 0;
    }
    refreshSevenChanllengeUnlockState(a) {
        const e = Model.sevenChallenge.isOpen();
        this.btnSevenChallenge.node.active = e;
        if (e && Model.sevenChallenge.getSevenChallengeOpenTime() == -1) {
            Model.sevenChallenge.saveSevenChallengeOpenTime();
            QuestSevenChallenge.Instance.genQuests();
        }
    }
    refreshSignUnlockState() {
        WeekMgr.Instance.OpenWeekDialog(function () { });
    }
    refreshTaskUnlockState(e) {
        this.btnDailyQuest.node.active = UnlockCtrl.Instance.isUnlock(e);
    }
    refreshWheelUnlockState(e) {
        this.btnRulette.node.active = UnlockCtrl.Instance.isUnlock(e);
    }
    start() {
        if (window['wx'] && window['wx'].getMenuButtonBoundingClientRect) {
            const e = this.node.getChildByName("top").getChildByName("right");
            const t = this.node.getComponent(cc.Widget);
            const n = window['wx'] && window['wx'].getMenuButtonBoundingClientRect && window['wx'].getMenuButtonBoundingClientRect();
            const o = window['wx'].getSystemInfoSync();
            const r = cc.view.getVisibleSize().height * (n.bottom / o.screenHeight) - t.top;
            e.getComponent(cc.Widget).top = Math.max(0, r) + 3;
        }
    }
    updataeNotify() {
        AppConstDefine.getLocalStorageVersion();
        const e = AppConstDefine.VERSION;
        const t = LocalStorageTool.getItemLocal("cc_createTime", 0);
        if (0 != t && moment(t).isBefore(moment("2023-03-20 00:00:00"))) {
            const n = e.substring(0, e.lastIndexOf("."));
            if (!LocalStorageTool.getItemLocal(n, !1)) {
                Model.ui.addViewAsyncQueue(MapUIPrefabs.AssetCompensation, {
                    data: {
                        title: LanMgr.Instance.getLangByID("Update_title"),
                        message: LanMgr.Instance.getLangByID("Update_content"),
                        itemDatas: [{
                                id: E_ASSET_TYPE.Diamond,
                                count: GameConst.NEW_VERSION_UPDATE_REWERD
                            }]
                    },
                    callback: (t) => {
                        BattleWorld.Instance.pause(),
                            t.once("removed", () => {
                                BattleWorld.Instance.resume(),
                                    LocalStorageTool.setItemLocal(n, !0),
                                    AppConstDefine.setVersion(e);
                            });
                    }
                });
            }
            else
                AppConstDefine.setVersion(e);
        }
        else
            AppConstDefine.setVersion(e);
    }
}
