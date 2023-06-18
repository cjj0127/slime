import { GlobalEventName } from "./common/Events";
import { E_SUMMON_TYPE } from "./common/Const";
import { ManagerBundle } from "./common/BundleMgr";
import AppConstDefine from "./common/AppConst";
import ChannelManager from "./common/ChannelManager";
import { NAMES_BUNDLE } from "./asset/AssetRes";
import { SdkBridge } from "../ccstudio/utils/SdkBridge";
import AsyncQueueTool from "../ccstudio/utils/AsyncQueueTool";
import GlobalNotify from "./common/GlobalNotify";
import LanMgr from "./common/Language";
import Launder from "./common/Launder";
import Loading from "./loading/Loading";
import LocalStorageTool from "../ccstudio/utils/LocalStorage";
import Model from "../ccstudio/data/Model";
import NativeBridge from "../ccstudio/utils/NativeBridge";
import UtilTime from "../ccstudio/utils/TimeUtil";
import MsgHint from "./common/MsgHint";
import MyTools from "../ccstudio/utils/MyTools";
import Transition from "./common/Transition";
import UserData from "./user/UserData";
import Wait from "./battle/Wait";
import CCSdk from "./sdk/ZtSdk";
const wx = window['wx'];
const { ccclass, property } = cc._decorator;
@ccclass
export default class App extends cc.Component {
    private _showModel = false;
    public connectingCount = 0;
    public delayTime = 0.1;
    public retryCnt = 3;
    // window.__errorHandler = function (e: any, t: any, n: any) {
    //     cc.error("fuck error", e, t, n);
    //     cc.director.emit("script-error", `script error:${e}&line:${t}&error:${n}`);
    //     window.__errorHandler = function () { }
    // };
    // property is not converted as it is not used in the code and is therefore unnecessary."
    CheckIsFirstBegin() {
        let e = LocalStorageTool.getItemLocal("cc_firstBegin", true);
        UserData.isNewPlayer = e;
        if (e == 1) {
            LocalStorageTool.setItemLocal("cc_firstBegin", false);
        }
    }
    InitSdk() {
        SdkBridge.initSdk({});
    }
    connectClear() {
        this.connectingCount = 0;
        this.delayTime = 0.1;
    }
    public enterGame() {
        cc.director.emit("transition-message", "正在启动...");
        Transition.enterGame(Launder.Instance.getLoadFuncs(), () => {
            if (wx && wx.startTime) {
                const duration = new Date().getTime() - wx.startTime;
                // const reportData = {
                //     FirstBegin: UserData.isNewPlayer,
                //     Loading_Duration: duration
                // };
                cc.log("enter use time:", duration);
            }
        });
    }
    getCreateTime() {
        let e = LocalStorageTool.getItemLocal("cc_createTime", 0);
        if (e == 0) {
            LocalStorageTool.setItemLocal("cc_createTime", MyTools.GetTimeNow());
        }
        return e;
    }
    getOpenNum() {
        let e = LocalStorageTool.getItemLocal("cc_openNum", 0);
        e++;
        LocalStorageTool.setItemLocal("cc_openNum", e);
        return e;
    }
    initAnalytics() {
        // m.ReporterBridge.init();
        // class GameDataQuerier {
        //     isNew() {
        //         const t = this.getCreateTime();
        //         return TimeUtil.isSameUtcDate(t);
        //     }
        // }
    }
    initSubscribe() {
        // if (SdkBridge.getChannelType() == ChannelType.WECHAT) {
        //     SubscribeModel.Instance.init();
        //     SubscribeModel.Instance.repostVersionMsg();
        // }
    }
    lateUpdate(e: number) {
        MyTools.runningTime += 1000 * e;
    }
    loadLanguage(e) {
        let t = LocalStorageTool.getItemLocal("cc_language", "zh");
        LanMgr.Instance.setAssetsPath(AppConstDefine.LANGUAGE.path.json, AppConstDefine.LANGUAGE.path.texture);
        LanMgr.Instance.setLanguage(t, e);
    }
    onDestroy() {
        cc.director.targetOff(this);
    }
    onLoad() {
        if (wx && wx.setKeepScreenOn) {
            wx.setKeepScreenOn({
                keepScreenOn: true,
            });
            this.wxInit();
        }
        ChannelManager.init();
        cc.game.addPersistRootNode(this.node);
        cc.debug.setDisplayStats(AppConstDefine.DISPLAY_DEBUG);
        // const t = console.log;
        // const n = console.warn;
        // const o = console.error;
        // if (p.CONSOLE_DEBUG) {
        //     cc.log = console.log = t;
        //     cc.warn = console.warn = n;
        // } else {
        //     cc.log = console.log = function () { };
        //     cc.warn = console.warn = function () { };
        // }
        // if (!p.REPORT_LOG) {
        //     console.log = function () { };
        // }
        // cc.error = console.error = o;
        this.node.addComponent(LocalStorageTool).initialize(AppConstDefine.GAME_NAME);
        this.CheckIsFirstBegin();
        if (!MsgHint.Instance) {
            this.node.addComponent(MsgHint);
        }
        // cc.assetManager.downloader.register('.cer', cc.assetManager.downloader.downloadAsset);
        // cc.director.on('restart', this.onRestartEvent, this);
        // cc.director.on(GlobalEvent.LoginOut, this.onloginout, this);
        //@ts-ignore
        var i = cc.EventListener.create({
            //@ts-ignore
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan(e) {
                const t = cc.find('Canvas').convertToNodeSpaceAR(e.getLocation());
                cc.director.emit(GlobalEventName.TouchScreen, t);
            },
        });
        //@ts-ignore
        cc.internal.eventManager.addListener(i, -1);
        // cc.assetManager.downloader.maxConcurrency = 20;
        // cc.assetManager.downloader.maxRequestsPerFrame = 20;
        // cc.assetManager.downloader.limited = false;
        this.InitSdk();
        this.initAnalytics();
        const c = LocalStorageTool.getItemLocal('low-battery', !!NativeBridge.Instance.checkIsLowPhone());
        AppConstDefine.FRAME_RATE = c ? 30 : 60;
        AppConstDefine.FRAME_TIME = 1 / AppConstDefine.FRAME_RATE;
        cc.game.setFrameRate(AppConstDefine.FRAME_RATE);
        cc.macro.ENABLE_MULTI_TOUCH = false;
        this.initSubscribe();
        // cc.game.on(cc.game.EVENT_SHOW, function () {
        //     return _QuestConfig(
        //         e,
        //         void 0,
        //         void 0,
        //         function () {
        //             const e = function () {
        //                 cc.game.emit(GlobalEvent.GameResume);
        //             };
        //             cc.game.emit(GlobalEvent.GamePause);
        //             this.connectClear();
        //             this.syncNetwork(e);
        //             return [2];
        //         }.bind(this)
        //     );
        // });
    }
    onRestartEvent() {
        if (Transition.Instance.loading) {
            cc.director.once("scene-launched", this.restart, this);
        }
        else {
            cc.director.once(cc.Director.EVENT_AFTER_DRAW, this.restart, this);
        }
    }
    onloginout() { }
    reportNewDay() {
        let e = LocalStorageTool.getItemLocal("cc_playDays", 0);
        const t = LocalStorageTool.getItemLocal("cc_loginDay", 0);
        if (!UtilTime.isSameUtcDate(t)) {
            e++;
            LocalStorageTool.setItemLocal("cc_playDays", e);
        }
        LocalStorageTool.setItemLocal("cc_loginDay", MyTools.GetTimeNow());
    }
    reportStartBegin() {
        const e = {
            FirstBegin: UserData.isNewPlayer,
        };
        const t = {
            FirstBegin: UserData.isNewPlayer,
        };
        // Game.Instance.gameTime = MyTools.GetNowTime();
        cc.game.on(GlobalEventName.GameResume, () => {
            // Game.Instance.gameTime = MyTools.GetNowTime();
        });
        cc.game.on(cc.game.EVENT_HIDE, () => {
            //const e = MyTools.GetNowTime() - Game.Instance.gameTime; //todo
            const e = 0;
            const t = Model.summon.getLvData(E_SUMMON_TYPE.Gear);
            const n = Model.summon.getLvData(E_SUMMON_TYPE.Gear);
            const o = Model.summon.getLvData(E_SUMMON_TYPE.Gear);
            const r = {
                Duration: e / 1000,
                Summon_Gear: null != t ? t.total : 0,
                Summon_Partner: null != o ? t.total : 0,
                Summon_Skill: null != n ? n.total : 0,
            };
            // Game.Instance.getInstance().reportLevelGame(r);
            // Game.Instance.gameTime = MyTools.GetNowTime(); 
        });
    }
    restart() {
        LocalStorageTool.flush();
        cc.audioEngine.stopAll();
        cc.audioEngine.uncacheAll();
        ManagerBundle.Instance.removeBundle_(NAMES_BUNDLE.Game);
        cc.game.removePersistRootNode(this.node);
        Transition.loadMainScene("Splash");
    }
    async start() {
        let self = this;
        let t = new AsyncQueueTool();
        t.push(function (t) {
            Loading.Instance || self.node.addComponent(Loading);
            Loading.Instance.load(t);
        });
        t.push(function (e) {
            Wait.load(e);
        });
        t.push(async (t) => {
            await this.loadLanguage(t);
        });
        t.push(async (t) => {
            let e = this;
            cc.director.emit("transition-message", "正在检查网络");
            this.syncNetwork(() => {
                e.reportNewDay();
                e.reportStartBegin();
                t();
            });
        });
        t.push(function (e) {
            cc.director.emit("transition-message", "游戏正在初始化");
            MsgHint.Instance.load(e);
        });
        // t.push((t) => {
        //     self.addComponent(Mgrs).loadMgrs();
        //     t();
        // });
        t.push(function (t) {
            Loading.Instance || self.node.addComponent(Loading);
            Loading.Instance.load(t);
        });
        t.push(function (t) {
            GlobalNotify.Instance || self.node.addComponent(GlobalNotify);
            GlobalNotify.Instance.load(t);
        });
        t.push(async (t) => {
            cc.director.emit("transition-message", "初始化完成");
            await this.loadLanguage(t);
        });
        t.complete = this.enterGame.bind(this);
        t.play();
    }
    syncNetwork(e) {
        e && e();
        // const t = this;
        // ZtSdk.instance.getNowTime()
        //     .then(function (t) {
        //         Wait.close();
        //         MyTools.serverTime = 1000 * t;
        //         MyTools.runningTime = 0;
        //         if (e) e();
        //     })
        //     .catch(function () {
        //         if (t.connectingCount < t.retryCnt) {
        //             t.connectingCount++;
        //             Wait.open(Language.Instance.getLangByID('tip_net_connectiong'));
        //             t.scheduleOnce(function () {
        //                 t.delayTime *= 2;
        //                 t.syncNetwork(e);
        //             }, t.delayTime);
        //         } else {
        //             if (Wait.close(), t._showModel) return;
        //             t._showModel = true;
        //             SdkBridge.showModel({
        //                 title: '网络异常',
        //                 contentText: Language.Instance.getLangByID('tip_net_error'),
        //                 confirmText: '确定',
        //                 showCancel: false,
        //                 success: function () {
        //                     Wait.open(Language.Instance.getLangByID('tip_net_connectiong'));
        //                     t.connectClear();
        //                     t.syncNetwork(e);
        //                     t._showModel = false;
        //                 },
        //                 fail: function () {
        //                     Wait.open(Language.Instance.getLangByID('tip_net_connectiong'));
        //                     t.connectClear();
        //                     t.syncNetwork(e);
        //                     t._showModel = false;
        //                 },
        //             });
        //         }
        //     });
    }
    wxInit() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (!cc.sys.localStorage.getItem("userOpenId")) {
                wx.login({
                    success: async (t: any) => {
                        try {
                            const e = await CCSdk.instance.getPlayerOpenId(t.code);
                            if (typeof e == "string") {
                                cc.sys.localStorage.setItem("userOpenId", e);
                                // TrackingIOManager.reportNewPlayer(e);
                            }
                        }
                        catch (error) {
                            cc.error("zt.getOpenIdFail: ", error);
                        }
                    },
                    fail: (e: any) => {
                        cc.error("wx Login Fail: ", e);
                    },
                });
            }
        }
    }
}
