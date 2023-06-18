import { EOpenUIType } from "../common/ViedioType";
import { E_LegionUpType, MapUIPrefabs, IMAGE_ICON_PATH_, E_LegionHeroRingAddType, Q_NAME } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import LegionRushBattle from "../battle/LegionRushBattle";
import BattleWorld from "../battle/BattleWorld";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import HeroData from "../hero/HeroData";
import LanMgr from "../common/Language";
import _LegionHeroConfig from "../../ccstudio/config/_LegionHeroConfig";
import AdsModel from "../../ccstudio/data/AdsModel";
import LegionRushModel from "../../ccstudio/data/LegionRushModel";
import RingModel from "../../ccstudio/data/RingModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import GradeLabelUI from "../battle/GradeLabelUI";
import LegionPropDescItemUI from "./LegionPropDescItemUI";
import LegionRingUI from "./LegionRingUI";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionPropDetailViewUI extends cc.Component {
    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Button)
    enterBattleBtn: cc.Button = null;
    @property(cc.Sprite)
    heroBg = null;
    @property(cc.Sprite)
    heroIcon = null;
    heroNum = 0;
    @property(cc.Node)
    heroPropContent = null;
    @property(cc.Prefab)
    itemPrefab = null;
    @property(cc.Node)
    jiantouNode = null;
    @property(GradeLabelUI)
    qualityLabel1: GradeLabelUI = null;
    @property(GradeLabelUI)
    qualityLabel2: GradeLabelUI = null;
    @property(LegionRingUI)
    ringCmp: LegionRingUI = null;
    @property(cc.Node)
    ringPropContent = null;
    upType = E_LegionUpType.None;
    waveData = null;
    addItem(e, t, n, o = false) {
        if (void 0 == o && (o = !1), !(t <= 0)) {
            var r = cc.instantiate(this.itemPrefab);
            r.parent = e;
            var i = "";
            if (0 != t) {
                var a = _PropConfig.Instance.get(t);
                i = LanMgr.Instance.getLangByID(a.desc).replace("%{value}", "" + n);
            }
            else
                i = LanMgr.Instance.getLangByID("AddRingQualityNum").replace("%{value}", "" + n);
            r.getComponent(LegionPropDescItemUI).init(o, i);
        }
    }
    // private addItem(e: cc.Node, t: number, n: number, o: boolean = false) {
    //     if (t > 0) {
    //         const r = cc.instantiate(this.itemPrefab);
    //         r.parent = e;
    //         let i = "";
    //         const a = _PropConfig.Instance.get(t);
    //         i = Language.Instance.getLangByID(a.desc).replace("%{value}", `${n}`);
    //         r.getComponent(LegionPropDescItemUI).init(o, i);
    //     } else {
    //         const i = Language.Instance.getLangByID("AddRingQualityNum").replace("%{value}", `${n}`);
    //         e.getChildByName("qualityItem").getComponent(LegionPropDescItemUI).init(o, i);
    //     }
    // }
    async enterBattle() {
        Model.legionRush.makeRing(this.waveData, this.heroNum);
        const e = {
            heroNum: this.heroNum,
            waveData: this.waveData,
        };
        Model.legionRush.setCurWaveData(e);
        BattleWorld.Instance.resume();
        Model.ui.closeView(MapUIPrefabs.LegionPropDetailView.path);
        Model.ui.closeView(MapUIPrefabs.LegionSelectPropView.path);
        Model.ui.closeView(MapUIPrefabs.LegionAddHeroView.path);
        Model.ad.showBanner(EOpenUIType.Rush);
        LegionRushBattle.Instance.enterBattle();
    }
    onClose() {
        this.node.getComponent(ViewAnimCtrl).onClose();
        if (this.waveData.id !== 0) {
            BattleWorld.Instance.pause();
            Model.ui.openViewAsync(MapUIPrefabs.LegionSelectPropView, {
                data: {
                    wave: LegionRushBattle.Instance.currWave + 1,
                },
            });
        }
    }
    onEnable() {
        this.refresh();
        Model.ad.hideBanner();
    }
    // @property(cc.Prefab)
    // itemPrefab: cc.Prefab = null;
    // @property(cc.Sprite)
    // heroIcon: cc.Sprite = null;
    // @property(cc.Sprite)
    // heroBg: cc.Sprite = null;
    // @property(cc.Node)
    // heroPropContent: cc.Node = null;
    // @property(S)
    // ringCmp: S = null;
    // @property(cc.Node)
    // ringPropContent: cc.Node = null;
    // @property(I)
    // qualityLabel1: I = null;
    // @property(cc.Node)
    // jiantouNode: cc.Node = null;
    // @property(I)
    // qualityLabel2: I = null;
    // @property(cc.Button)
    // enterBattleBtn: cc.Button = null;
    // @property(cc.Button)
    // closeBtn: cc.Button = null;
    // private waveData: any;
    // private heroNum: number;
    // private upType: number;
    onLoad() {
        this.enterBattleBtn.node.on("click", this.enterBattle, this);
        this.closeBtn.node.on("click", this.onClose, this);
    }
    refresh() {
        this.heroPropContent.removeAllChildren();
        this.ringPropContent.removeAllChildren();
        this.enterBattleBtn.node.active = this.upType == E_LegionUpType.Mushroom;
        this.closeBtn.node.active = this.upType == E_LegionUpType.Ring;
        const t = _HeroConfig.Instance.get(HeroData.Instance.battleId);
        this.heroIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${t.icon}`);
        const n = _LegionHeroConfig.Instance.getTotalAddValue(this.heroNum, E_LegionHeroRingAddType.AddQuality);
        let r = Model.legionRush.getCurRingId() !== -1 ? Model.ring.getRingData(Model.legionRush.getCurRingId()).quality : 2 + n;
        this.ringCmp.init(Model.legionRush.getCurRingId(), n);
        const i = this.waveData.propId == 0 && r < Q_NAME.length;
        this.jiantouNode.active = i;
        this.qualityLabel2.node.active = i;
        if (i) {
            this.qualityLabel1.setGrade(r - 1);
            this.qualityLabel2.setGrade(r);
        }
        else {
            this.qualityLabel1.setGrade(r);
        }
        if (this.waveData.upType == E_LegionUpType.Mushroom) {
            this.addItem(this.heroPropContent, this.waveData.propId, this.waveData.upNumValue, true);
        }
        else {
            this.addItem(this.ringPropContent, this.waveData.propId, this.waveData.upNumValue, true);
        }
        const a = Model.legionRush.getAddationByType(E_LegionUpType.Mushroom);
        _.each(a, (t) => {
            if (t.prop !== this.waveData.propId || parseInt(t.value) !== this.waveData.upNumValue) {
                this.addItem(this.heroPropContent, t.prop, parseInt(t.value));
            }
        });
        const s = Model.legionRush.getAddationByType(E_LegionUpType.Ring);
        _.each(s, (t) => {
            if (t.prop !== this.waveData.propId || parseInt(t.value) !== this.waveData.upNumValue) {
                this.addItem(this.ringPropContent, t.prop, parseInt(t.value));
            }
        });
        this.heroBg.node.stopAllActions();
        cc.tween(this.heroBg.node).to(1, { opacity: 255 }).to(1, { opacity: 150 }).union().repeatForever().start();
    }
    reuse(e: any) {
        this.waveData = e.waveData;
        this.heroNum = e.heroNum;
        this.upType = e.upType;
    }
}
