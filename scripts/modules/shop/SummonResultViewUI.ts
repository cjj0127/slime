import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GameConst, E_SUMMON_TYPE, E_ASSET_TYPE, MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BtnShare from "../common/BtnShare";
import ChannelManager, { eChannelType } from "../common/ChannelManager";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import GuideMgr from "../guide/GuideMgr";
import ISummonResultView from "./ISummonResultView";
import SummonModel from "../../ccstudio/data/SummonModel";
import Model from "../../ccstudio/data/Model";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import ShakeComp from "../common/ShakeComp";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import UserData from "../user/UserData";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SummonResultUIView extends ISummonResultView {
    @property(cc.Button)
    btnSummon11: cc.Button = null;
    @property(cc.Button)
    btnSummon35: cc.Button = null;
    @property(cc.Node)
    optionsNode = null;
    @property(cc.Label)
    price11Label = null;
    @property(cc.Label)
    price35Label = null;
    // type: number;
    results: any[];
    @property({ type: ShakeComp })
    ShakeComp = null;
    type: number = 0;
    async checkShowShareBtn() {
        if (ChannelManager.getChannelType() !== eChannelType.WECHAT && ChannelManager.getChannelType() !== eChannelType.BYTEDANCE || GuideMgr.instance.isInGuide()) {
            return;
        }
        const e: cc.Node = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.ShareBtn.path);
        const t = { failCallback: function () { }, palceName: "SummonShare", successCallback: function () { } };
        e.getComponent(BtnShare).showShare("reward", t);
        this.btnSummon11.node.getParent().addChild(e);
        this.btnSummon11.node.setPosition(-170, this.btnSummon11.node.y);
        this.btnSummon35.node.setPosition(70, this.btnSummon35.node.y);
    }
    createItem(e: any) {
        const t = this.getCfg(this.type, e.id);
        return this.addItem(t.quality, t.icon, t.name, e.id, this.type);
    }
    onClickBtnSummon11() {
        const e = this;
        this.node.once("removed", function () {
            Model.summon.DiamondSummon(e.type, GameConst.SUMMON_PRICE_NORMAL);
        });
        this.node.emit("Close", this);
    }
    onClickBtnSummon35() {
        const e = this;
        this.node.once("removed", function () {
            Model.summon.DiamondSummon(e.type, GameConst.SUMMON_PRICE_FULL);
        });
        this.node.emit("Close", this);
    }
    onClose() {
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchHeroButton);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchHeroButton2);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchUpgradePartnerButton);
        this.node.getComponent(ViewAnimCtrl).onClose();
    }
    onEnable() {
        super.onEnable();
        this.refreshBtnStatus();
    }
    playResults() {
        const e = this;
        this.layout.type = cc.Layout.Type.HORIZONTAL;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.layout.node.height = this.layoutOriginHeight;
        this.optionsNode.active = false;
        this.resultAsync = new AsyncQueueTool();
        for (let t = 0; t < this.results.length; t++) {
            const n = t;
            const a = this.results[t];
            this.resultAsync.push(function (r) {
                const i = e.createItem(a);
                e.items.push(i);
                let s = 0;
                if (n < 5) {
                    i.node.y = 0;
                }
                else if (n == 5) {
                    e.layout.node.width = e.layoutOriginWidth;
                    e.layout.type = cc.Layout.Type.GRID;
                }
                else if (n == 25) {
                    e.scrollView.enabled = true;
                }
                e.layout.enabled = true;
                e.layout.updateLayout();
                e.layout.enabled = false;
                e.scrollView.content.height = Math.max(e.layoutOriginHeight, e.layout.node.height);
                const f = Math.floor(n / 5);
                if (f !== s) {
                    s = f;
                    e.scrollView.scrollToBottom(0);
                }
                let d = false;
                let h = 0;
                switch (e.type) {
                    case E_SUMMON_TYPE.Gear:
                    case E_SUMMON_TYPE.Weapon:
                    case E_SUMMON_TYPE.Armor:
                        const g = _GearConfig.Instance.get(a.id);
                        if (g.quality >= 4 && a.isNew) {
                            d = true;
                            s += .6;
                        }
                        h = g.quality;
                        break;
                    case E_SUMMON_TYPE.Skill:
                        const p = _SkillConfig.Instance.get(a.id);
                        if (p.quality >= 4 && a.isNew) {
                            d = true;
                            s += .6;
                        }
                        h = p.quality;
                        break;
                    case E_SUMMON_TYPE.Partner:
                        const u = _PartnerConfig.Instance.get(a.id);
                        if (u.quality >= 4 && a.isNew) {
                            d = true;
                            s += .6;
                        }
                        h = u.quality;
                        break;
                }
                i.node.stopAllActions();
                if (d) {
                    i.node.scale = 1.8;
                    i.node.opacity = 0;
                    cc.tween(i.node).delay(.2).call(() => {
                        e.ShakeComp.play(.2, 15, 15);
                    }).to(.2, { scale: 1, opacity: 255 }, { easing: cc.easing.sineIn }).start();
                }
                else {
                    i.node.scale = 1.2;
                    cc.tween(i.node).to(.2, { scale: 1 }).start();
                }
                i.playGlow(h);
                e.scheduleOnce(r, .018);
            });
        }
        this.resultAsync.push(function (t) {
            e.scheduleOnce(t, .2);
        });
        this.resultAsync.push(function (t) {
            e.optionsNode.active = true;
            e.scheduleOnce(function () {
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.CloseSkillView);
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.CloseGearView);
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.ClosePartnerView);
                t();
            }, .1);
        });
        this.resultAsync.play();
    }
    refreshBtnStatus(): void {
        const e: number = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Diamond));
        this.price11Label.node.color = e >= GameConst.SUMMON_PRICE_NORMAL ? cc.Color.WHITE : cc.Color.RED;
        this.price35Label.node.color = e >= GameConst.SUMMON_PRICE_FULL ? cc.Color.WHITE : cc.Color.RED;
        this.btnSummon11.target.getComponent(cc.Sprite).setState(e >= GameConst.SUMMON_PRICE_NORMAL ? cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY);
        this.btnSummon35.target.getComponent(cc.Sprite).setState(e >= GameConst.SUMMON_PRICE_FULL ? cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY);
    }
    // private btnSummon11: cc.Button;
    // private btnSummon35: cc.Button;
    // private layout: cc.Layout;
    // private layoutOriginHeight: number;
    // private layoutOriginWidth: number;
    // private optionsNode: cc.Node;
    // private scrollView: cc.ScrollView;
    // private ShakeComp: any;
    // private items: any[];
    reuse(e: any) {
        this.type = e.type;
        this.results = e.results;
    }
    start() {
        this.btnSummon11.node.on("click", this.onClickBtnSummon11, this);
        this.btnSummon35.node.on("click", this.onClickBtnSummon35, this);
        this.checkShowShareBtn();
    }
}
// n.default = R;
