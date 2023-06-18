import { EVideoType, EOpenUIType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, GameConst, IMAGE_ICON_PATH_ } from "../common/Const";
import AddCoinLabel from "../common/AddCoinLabel";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AdsManager from "../ads/AdsManager";
import AssetManager from "../asset/AssetManager";
import LanMgr from "../common/Language";
import AdsModel, { E_AD_TYPE } from "../../ccstudio/data/AdsModel";
import MineModel, { E_MINE_TOOL_TYPE, MINE_MAX_ROW_COUNT, MINE_MAX_COL_COUNT } from "../../ccstudio/data/MineModel";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
import MyTools from "../../ccstudio/utils/MyTools";
import MineDigOptionBtnUI from "./MineDigOptionBtnUI";
import MineDigWithBombUI from "./MineDigWithBombUI";
import MineDigWithDrillUI from "./MineDigWithDrillUI";
import MineDigWithPickaxUI from "./MineDigWithPickaxUI";
import MineListUI from "./MineListUI";
import UserData, { AssetGetType } from "../user/UserData";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
// n.default = L
const { ccclass, property } = cc._decorator;
const moment: any = window["moment"];
const w: any = window["_"];
@ccclass
export default class MineDigCtrlUI extends cc.Component {
    @property(cc.Button)
    btnAddBomb: cc.Button = null;
    @property(cc.Button)
    btnAddDrill: cc.Button = null;
    @property(cc.Button)
    btnAddMine: cc.Button = null;
    @property(MineDigOptionBtnUI)
    btnBomb: MineDigOptionBtnUI = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(MineDigOptionBtnUI)
    btnDrill: MineDigOptionBtnUI = null;
    @property(MineDigOptionBtnUI)
    btnPickax: MineDigOptionBtnUI = null;
    checkTool = function (e: number) {
        if (this.currToolItem !== e) {
            this.currToolItem = e;
            this.toolToBtn[e].toggle.check();
        }
    };
    @property(AddCoinLabel)
    cubCountLabel: AddCoinLabel = null;
    currToolItem = E_MINE_TOOL_TYPE.TOOL_Pickax;
    @property(cc.Label)
    deepMeterLabel: cc.Label = null;
    @property(MineListUI)
    mineList: MineListUI = null;
    onBtnDragEnd = async function (e: cc.Event.EventTouch) {
        const t = this.toolAdapters[this.currToolItem];
        await t.onPreEnd();
        await t.digItem(e);
        this.setDeepMeter(Model.mine.digDeep);
        this.checkTool(E_MINE_TOOL_TYPE.TOOL_Pickax);
    };
    onBtnDragMove = function (e: cc.Event.EventTouch) {
        this.toolAdapters[this.currToolItem].onPreItem(e);
    };
    onDestroy = function () {
        this.toolToBtn = null;
    };
    onEnable = async function () {
        const e = Model.mine.openDataDeep - MINE_MAX_ROW_COUNT;
        for (let t = e; t < Model.mine.openDataDeep; t++) {
            for (let n = 0; n < MINE_MAX_COL_COUNT; n++) {
                const o = Model.mine.getInfo(t, n);
                await this.mineList.addMine(t, n, o);
            }
        }
        this.mineList.setToDeep(e);
        const r = w.flatten(this.mineList.mineItems);
        w.each(r, function (e) {
            if (e) {
                e.refreshTile();
                e.refreshStatus();
                e.refreshSp();
            }
        });
        this.refreshCubeCount();
        this.refreshBombCount();
        this.refreshDrillCount();
        this.refreshPickaxCount();
        this.setDeepMeter(Model.mine.digDeep);
        this.schedule(this.fixUpdate, 0.1, cc.macro.REPEAT_FOREVER);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.MinePickax, this.onPickaxCountChange, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.MineCube, this.onCubeCountChange, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.MineBomb, this.onBombCountChange, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.MineDrill, this.onDrillCountChange, this);
        cc.director.on(GlobalEventName.CloseMineView, this.closeMineView, this);
        cc.director.on(GlobalEventName.CloseAllMineView, this.closeMineView, this);
        this.btnClose.node.on("click", this.onClickClose, this);
        await Model.ad.showBanner(EOpenUIType.Mine);
    };
    onLoad = function () {
        this.mineList.setUICount(MINE_MAX_ROW_COUNT, MINE_MAX_COL_COUNT);
        this.mineList.delegate = this;
        this.btnDrill.deletage = this;
        this.btnPickax.deletage = this;
        this.btnBomb.deletage = this;
        this.toolToBtn[E_MINE_TOOL_TYPE.TOOL_Drill] = this.btnDrill;
        this.toolToBtn[E_MINE_TOOL_TYPE.TOOL_Pickax] = this.btnPickax;
        this.toolToBtn[E_MINE_TOOL_TYPE.TOOL_Bomb] = this.btnBomb;
        this.toolAdapters[E_MINE_TOOL_TYPE.TOOL_Drill] = this.addComponent(MineDigWithDrillUI).setMineList(this.mineList);
        this.toolAdapters[E_MINE_TOOL_TYPE.TOOL_Pickax] = this.addComponent(MineDigWithPickaxUI).setMineList(this.mineList);
        this.toolAdapters[E_MINE_TOOL_TYPE.TOOL_Bomb] = this.addComponent(MineDigWithBombUI).setMineList(this.mineList);
        this.btnAddMine.node.on("click", this.onClickAddMine, this);
        this.btnAddBomb.node.on("click", this.onClickAddBomb, this);
        this.btnAddDrill.node.on("click", this.onClickAddDrill, this);
    };
    onTouchItem = async function (e) {
        const t = this.toolAdapters[this.currToolItem];
        await t.onPlaySelect(e);
        await t.digItem(e);
        this.setDeepMeter(Model.mine.digDeep);
        this.checkTool(E_MINE_TOOL_TYPE.TOOL_Pickax);
    };
    @property(cc.Label)
    pickaxCdLabel: cc.Label = null;
    @property(cc.Label)
    pickaxCountLabel: cc.Label = null;
    setDeepMeter = function (e: number) {
        this.deepMeterLabel.string = `${e}m`;
    };
    toolAdapters = {};
    toolToBtn = {};
    closeMineView() {
        this.getComponent(ViewAnimCtrl).onClose();
    }
    fixUpdate() {
        this.refreshPickaxCd();
    }
    onBombCountChange(): void {
        this.refreshBombCount();
    }
    async onClickAddBomb() {
        if (Model.ad.getAdTimes(E_AD_TYPE.eBomb) >= GameConst.PICKAX_AD_DAILY_COUNT) {
            MsgHint.warn(LanMgr.Instance.getLangByID("Not enough Ad Bombs!"));
            return [2];
        }
        else {
            const e = async () => {
                Model.ad.addTodayTimes(E_AD_TYPE.eBomb);
                UserData.Instance.addItem(E_ASSET_TYPE.MineBomb, GameConst.BOMB_AD_GET_NUMBER, {
                    type: AssetGetType.Mine
                });
            };
            const t = {
                AdsType: EVideoType.AdBomb,
                OpenUi: EVideoType.AdBomb,
                onSucceed: e
            };
            await AdsManager.getInstance().showRewardedVideo(t);
            return [2];
        }
    }
    async onClickAddDrill() {
        if (Model.ad.getAdTimes(E_AD_TYPE.eDrill) >= GameConst.PICKAX_AD_DAILY_COUNT) {
            MsgHint.warn(LanMgr.Instance.getLangByID("Not enough Ad Drills!"));
            return [2];
        }
        else {
            const e = async () => {
                Model.ad.addTodayTimes(E_AD_TYPE.eDrill);
                UserData.Instance.addItem(E_ASSET_TYPE.MineDrill, GameConst.DRILL_AD_GET_NUMBER, {
                    type: AssetGetType.Mine
                });
            };
            const t = {
                AdsType: EVideoType.AdDrill,
                OpenUi: EVideoType.AdDrill,
                onSucceed: e
            };
            await AdsManager.getInstance().showRewardedVideo(t);
            return [2];
        }
    }
    async onClickAddMine() {
        if (Model.ad.getAdTimes(E_AD_TYPE.ePickax) >= GameConst.PICKAX_AD_DAILY_COUNT) {
            MsgHint.warn(LanMgr.Instance.getLangByID("Not enough Ad Pickaxs!"));
            return [2];
        }
        else {
            const e = async () => {
                Model.ad.addTodayTimes(E_AD_TYPE.ePickax);
                UserData.Instance.addItem(E_ASSET_TYPE.MinePickax, GameConst.PICKAX_AD_NUMBER, {
                    type: AssetGetType.Mine
                });
            };
            const t = {
                AdsType: EVideoType.AdMine,
                OpenUi: EVideoType.AdMine,
                onSucceed: e
            };
            await AdsManager.getInstance().showRewardedVideo(t);
            return [2];
        }
    }
    onClickClose() {
        this.getComponent(ViewAnimCtrl).onClose();
    }
    onCubeCountChange(): void {
        const e = UserData.Instance.getItem(E_ASSET_TYPE.MineCube);
        this.cubCountLabel.playTo(parseInt(e), .2);
    }
    onDisable() {
        this.unschedule(this.fixUpdate);
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onDrillCountChange(): void {
        this.refreshDrillCount();
    }
    onPickaxCountChange() {
        this.refreshPickaxCount();
    }
    refreshBombCount() {
        this.btnBomb.setCount(UserData.Instance.getItem(E_ASSET_TYPE.MineBomb));
        this.refreshBombStatus();
    }
    refreshBombStatus() {
        const e = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MineBomb));
        this.btnAddBomb.node.active = e <= 0;
        if (e <= 0) {
            const t = Model.ad.getAdTimes(E_AD_TYPE.eBomb);
            const n = this.btnAddBomb.node.getChildByName("tag");
            n.getComponentInChildren(cc.Label).string = `X${GameConst.BOMB_AD_GET_NUMBER}`;
            n.active = t < GameConst.PICKAX_AD_DAILY_COUNT;
            this.btnAddBomb.target.getComponentInChildren(cc.Label).string = `${GameConst.PICKAX_AD_DAILY_COUNT - t}/${GameConst.PICKAX_AD_DAILY_COUNT}`;
            const o = t < GameConst.PICKAX_AD_DAILY_COUNT ? 'mine_btn_mine_02_on' : 'mine_btn_mine_02';
            this.btnAddBomb.target.getComponent(cc.Sprite).spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${o}`);
        }
    }
    refreshCubeCount() {
        this.cubCountLabel.string = `${UserData.Instance.getItem(E_ASSET_TYPE.MineCube)}`;
    }
    refreshDrillCount() {
        this.btnDrill.setCount(UserData.Instance.getItem(E_ASSET_TYPE.MineDrill));
        this.refreshDrillStatus();
    }
    refreshDrillStatus() {
        const e = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.MineDrill));
        this.btnAddDrill.node.active = e <= 0;
        if (e <= 0) {
            const t = Model.ad.getAdTimes(E_AD_TYPE.eDrill);
            const n = this.btnAddDrill.node.getChildByName("tag");
            n.getComponentInChildren(cc.Label).string = `X${GameConst.DRILL_AD_GET_NUMBER}`;
            n.active = t < GameConst.PICKAX_AD_DAILY_COUNT;
            this.btnAddDrill.target.getComponentInChildren(cc.Label).string = `${GameConst.PICKAX_AD_DAILY_COUNT - t}/${GameConst.PICKAX_AD_DAILY_COUNT}`;
            const o = t < GameConst.PICKAX_AD_DAILY_COUNT ? 'mine_btn_mine_02_on' : 'mine_btn_mine_02';
            this.btnAddDrill.target.getComponent(cc.Sprite).spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${o}`);
        }
    }
    refreshPickaxCd() {
        if (!(Model.mine.pickaxCount >= Model.mine.pickaxMaxCount)) {
            const e = Model.mine.pickaxAddStartMoment;
            const t = moment(MyTools.GetTimeNow());
            const n = Model.mine.pickaxCd;
            const o = t.diff(e);
            this.pickaxCdLabel.string = moment.utc(1000 * n - o).format('mm:ss');
        }
    }
    refreshPickaxCount() {
        const e = Model.mine.pickaxCount;
        const t = Model.mine.pickaxMaxCount;
        this.pickaxCountLabel.string = `${e}/${t}`;
        this.btnPickax.setCount(e);
        if (e >= t) {
            this.pickaxCdLabel.string = "";
        }
        this.refreshPickaxStatus();
    }
    refreshPickaxStatus() {
        const e = Model.mine.pickaxCount;
        this.btnAddMine.node.active = e <= 0;
        if (e <= 0) {
            const t = Model.ad.getAdTimes(E_AD_TYPE.ePickax);
            const n = this.btnAddMine.node.getChildByName("tag");
            n.getComponentInChildren(cc.Label).string = `X${GameConst.PICKAX_AD_NUMBER}`;
            n.active = t < GameConst.PICKAX_AD_DAILY_COUNT;
            this.btnAddMine.target.getComponentInChildren(cc.Label).string = `${GameConst.PICKAX_AD_DAILY_COUNT - t}/${GameConst.PICKAX_AD_DAILY_COUNT}`;
            const o = t < GameConst.PICKAX_AD_DAILY_COUNT ? 'mine_btn_mine_02_on' : 'mine_btn_mine_02';
            this.btnAddMine.target.getComponent(cc.Sprite).spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${o}`);
        }
    }
    ;
}
