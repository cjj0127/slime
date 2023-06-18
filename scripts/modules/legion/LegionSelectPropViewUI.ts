import { EOpenUIType, EVideoType } from "../common/ViedioType";
import { E_LegionUpType, MapUIPrefabs, GameConst, E_LegionHeroRingAddType, IMAGE_ICON_PATH_, Q_COLOR, E_GAME_LEVEL_TYPE } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AdsManager from "../ads/AdsManager";
import AssetManager from "../asset/AssetManager";
import LegionRushBattle from "../battle/LegionRushBattle";
import BattleWorld from "../battle/BattleWorld";
import LanMgr from "../common/Language";
import _LegionHeroConfig from "../../ccstudio/config/_LegionHeroConfig";
import _LegionRandConfig from "../../ccstudio/config/_LegionRandConfig";
import LogionSelectWeakGuide from "./LogionSelectWeakGuide";
import AdsModel from "../../ccstudio/data/AdsModel";
import LegionRushModel from "../../ccstudio/data/LegionRushModel";
import LevelModel from "../../ccstudio/data/LevelModel";
import RingModel from "../../ccstudio/data/RingModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _RingConfig from "../../ccstudio/config/_RingConfig";
import MsgHint from "../common/MsgHint";
import GradeLabelUI from "../battle/GradeLabelUI";
import LegionProgressViewUI from "./LegionProgressViewUI";
import LegionPropItemUI from "./LegionPropItemUI";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
// import * as LegionPropItemUI from "LegionPropItemUI";
const { ccclass, property } = cc._decorator;
const D: any = window["_"];
@ccclass
export default class LegionSelectPropViewUI extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Button)
    enterBtn: cc.Button = null;
    @property(cc.Button)
    exitBtn: cc.Button = null;
    heroNum: number = 0;
    @property(LogionSelectWeakGuide)
    legionRewardGuide: LogionSelectWeakGuide = null;
    @property(cc.Node)
    proNode: cc.Node = null;
    @property(LegionProgressViewUI)
    progressItem: LegionProgressViewUI = null;
    @property(cc.Prefab)
    propListItem: cc.Prefab = null;
    @property(GradeLabelUI)
    qualityLabel: GradeLabelUI = null;
    randData: any[] = [];
    @property(cc.Button)
    refreshBtn: cc.Button = null;
    @property(cc.Sprite)
    ringBg: cc.Sprite = null;
    @property(cc.Sprite)
    ringIcon: cc.Sprite = null;
    @property(cc.Button)
    tipBtn: cc.Button = null;
    @property(cc.Button)
    tipBtnBg: cc.Button = null;
    wave: number = 0;
    public clear() {
        this.content.removeAllChildren();
        this.randData = [];
    }
    async enterBattle(t) {
        BattleWorld.Instance.resume();
        Model.ui.closeView(MapUIPrefabs.LegionSelectPropView.path);
        Model.ui.closeView(MapUIPrefabs.LegionAddHeroView.path);
        Model.ad.showBanner(EOpenUIType.Rush);
        LegionRushBattle.Instance.enterBattle();
    }
    public getSelectItemIndex() {
        for (let e = 0; e < this.content.childrenCount; e++) {
            if (this.content.children[e].getComponent(cc.Toggle).isChecked) {
                return e;
            }
        }
        return -1;
    }
    public onClose() {
        this.node.getComponent(ViewAnimCtrl).onClose();
    }
    public onDisable() { }
    public onEnable() {
        this.refreshUi();
        if (LegionRushBattle.Instance.currWave == 0) {
            this.legionRewardGuide.show();
        }
        else {
            this.legionRewardGuide.hide();
        }
        Model.ad.hideBanner();
    }
    public onExit() {
        Model.ui.closeAll();
        BattleWorld.Instance.exitBossLevel();
    }
    // private exitBtn: cc.Button;
    // private refreshBtn: cc.Button;
    // private enterBtn: cc.Button;
    // private tipBtn: cc.Button;
    // private tipBtnBg: cc.Button;
    // private legionRewardGuide: any;
    // private wave: number;
    // private heroNum: number;
    // private content: cc.Node;
    // private randData: any[];
    // private progressItem: any;
    // private ringIcon: cc.Sprite;
    // private ringBg: cc.Sprite;
    // private qualityLabel: any;
    public onLoad() {
        this.exitBtn.node.on("click", this.onExit, this);
        this.refreshBtn.node.on("click", this.onRefresh, this);
        this.enterBtn.node.on("click", this.showDetialView, this);
        this.tipBtn.node.on("click", this.showTipView, this);
        this.tipBtnBg.node.on("click", this.showTipView, this);
    }
    public onRefresh() {
        const t = {
            AdsType: EVideoType.AdLegionReFresh,
            OpenUi: EVideoType.AdLegionReFresh,
            onSucceed: () => {
                Model.legionRush.addAdsCount(1);
                this.refresAdBtn();
                this.refreshList();
            },
        };
        AdsManager.getInstance().showRewardedVideo(t);
    }
    public refresAdBtn() {
        this.refreshBtn.node.active = Model.legionRush.getAdsCount() < GameConst.LEGION_AD_REFRESH_NUM;
    }
    public refreshList() {
        let e = "";
        let t = -1;
        if (this.randData.length > 0) {
            e = D.first(D.shuffle(D.keys(this.randData)));
            t = this.randData[parseInt(e)].id;
        }
        this.clear();
        const n = Model.legionRush.getRandomProps(this.wave, t);
        const o = n.ids;
        const r = Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.LegionRush);
        for (let i = 0; i < o.length; i++) {
            const a = cc.instantiate(this.propListItem);
            a.parent = this.content;
            const s = _LegionRandConfig.Instance.randData(r, o[i], 2 == n.waveType);
            a.getComponent(LegionPropItemUI).init(s),
                this.randData.push(s),
                o.length;
        }
        this.progressItem.init(this.wave);
    }
    public refreshUi() {
        this.setRing();
        this.refreshList();
        this.refresAdBtn();
    }
    public reuse(e: {
        wave: number;
        heroNum: number;
    }) {
        this.wave = e.wave;
        this.heroNum = e.heroNum;
    }
    public setRing() {
        const e = _LegionHeroConfig.Instance.getTotalAddValue(this.heroNum, E_LegionHeroRingAddType.AddQuality);
        let t = Model.legionRush.getCurRingId();
        let n = 2 + e;
        if (t !== -1) {
            const o = Model.ring.getRingData(t);
            const r = _RingConfig.Instance.get(o.originId);
            this.ringIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, IMAGE_ICON_PATH_ + "/" + r.icon);
            n = o.quality;
        }
        this.ringBg.node.color = cc.color().fromHEX(Q_COLOR[n - 1]);
        this.qualityLabel.setGrade(n);
        this.ringBg.node.stopAllActions();
        cc.tween(this.ringBg.node).to(1, { opacity: 255 }).to(1, { opacity: 150 }).union().repeatForever().start();
    }
    async showDetialView() {
        const e = this.getSelectItemIndex();
        if (e > -1) {
            const t = this.randData[e];
            const n = {
                heroNum: this.heroNum,
                waveData: t
            };
            Model.legionRush.setCurWaveData(n);
            if (t.upType != E_LegionUpType.Ring) {
                await this.enterBattle(t);
                return;
            }
            Model.ui.openViewAsync(MapUIPrefabs.LegionPropDetailView, {
                data: {
                    waveData: t,
                    heroNum: this.heroNum,
                    upType: E_LegionUpType.Mushroom
                }
            });
        }
        else {
            MsgHint.tip(LanMgr.Instance.getLangByID("select_join_tip"));
        }
        Model.legionRush.reportRushChoseProp();
    }
    public showTipView() {
        const e = {
            enemy: [],
            id: 0,
            isPowerEnemy: !1,
            propId: -1,
            upNumValue: 0,
            upType: E_LegionUpType.Ring
        };
        Model.ui.openViewAsync(MapUIPrefabs.LegionPropDetailView, {
            data: {
                waveData: e,
                heroNum: this.heroNum,
                upType: E_LegionUpType.Ring
            }
        });
    }
}
