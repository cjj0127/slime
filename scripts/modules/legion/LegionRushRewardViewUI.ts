import { SpecialGuideEnum } from "../guide/GuideEnums";
import { E_GAME_LEVEL_TYPE, MapUIPrefabs, E_ITEM_TYPE } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetPool from "../asset/AssetPool";
import BtnShare from "../common/BtnShare";
import ChannelManager, { eChannelType } from "../common/ChannelManager";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import GuideMgr from "../guide/GuideMgr";
import _LegionRushConfig from "../../ccstudio/config/_LegionRushConfig";
import LevelModel from "../../ccstudio/data/LevelModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import MyTools from "../../ccstudio/utils/MyTools";
import DwarvenKingRewardItemUI from "../dwarvenKing/DwarvenKingRewardItemUI";
const { ccclass, property } = cc._decorator;
const R: any = window["_"];
@ccclass
export default class LegionRushRewardViewUI extends cc.Component {
    private items: any[] = [];
    @property(cc.Layout)
    layout: cc.Layout = null;
    private layoutOriginHeight: number;
    private layoutOriginWidth: number;
    @property(cc.Node)
    panelContent: cc.Node = null;
    // results = [];
    // items = [];
    // layoutOriginWidth = 0;
    // layoutOriginHeight = 0;
    private results: any[] = [];
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    //    @cc.layout
    //    private layout: cc.Layout = null;
    //    @cc.scrollView
    //    private scrollView: cc.ScrollView = null;
    //    @cc.node
    //    private panelContent: cc.Node = null;
    async addItem(e: number, t: cc.SpriteFrame, n: string, o: number, r: number) {
        const i = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.DwarvenKingRewardItem.path);
        i.parent = this.layout.node;
        i.stopAllActions();
        const a = i.getComponent(DwarvenKingRewardItemUI);
        a.setQualityValue(e);
        a.setIcon(t);
        a.setNameStr(n);
        a.setType(o);
        a.setNum(r);
        return a;
    }
    async checkShowShareBtn(): Promise<void> {
        if (ChannelManager.getChannelType() == eChannelType.WECHAT || ChannelManager.getChannelType() == eChannelType.BYTEDANCE && !GuideMgr.instance.isInGuide()) {
            const e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.ShareBtn.path);
            const t = {
                failCallback: function () { },
                palceName: "RushShare",
                successCallback: function () { },
            };
            e.getComponent(BtnShare).showShare("bossRush", t);
            this.panelContent.addChild(e);
        }
    }
    //    private scrollView: cc.ScrollView
    //    private layout: cc.Layout
    public clear() {
        this.results.length = 0;
        R.each(this.items, (e) => {
            AssetPool.Instance.put(e);
        });
        this.items.length = 0;
    }
    public async createItem(e: any) {
        const t = this.getCfg(e.id, e.type);
        if (t) {
            return await this.addItem(t.quality, t.icon, t.name, e.id, e.num);
        }
        else {
            return null;
        }
    }
    getCfg(e: number, t: number): any {
        return this.getCfgInfo(e, t);
    }
    getCfgInfo(e: number, a): {
        quality: number;
        icon: cc.SpriteFrame;
        name: string;
        gearType: number;
    } {
        let t = null;
        switch (_AssetConfig.Instance.get(e).type) {
            case E_ITEM_TYPE.Gear:
                t = _GearConfig.Instance.get(e);
                break;
            case E_ITEM_TYPE.Partner:
                t = _PartnerConfig.Instance.get(e);
                break;
            case E_ITEM_TYPE.Skill:
                t = _SkillConfig.Instance.get(e);
                break;
        }
        return t ? {
            quality: t.quality,
            icon: t.icon,
            name: t.name,
            gearType: t.type,
        } : null;
    }
    public getResults() {
        const t = Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.LegionRush);
        const n = _LegionRushConfig.Instance.get(t);
        this.results = [];
        for (let o = 0; o < n.qualities.length; o++) {
            const r = n.qualities[o];
            const i = n.nums[o];
            let a = _GearConfig.Instance.getQualityGears(r);
            let s = _PartnerConfig.Instance.getQualityPartners(r);
            a = R.concat(a, s);
            let l = _SkillConfig.Instance.getQualitySkills(r);
            a = R.concat(a, l);
            a = R.shuffle(a);
            const e = this.results;
            e.push.apply(e, a.slice(0, i));
        }
    }
    public onDisable() {
        this.unscheduleAllCallbacks();
        this.clear();
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchHeroButton5);
    }
    public onEnable() {
        this.getResults();
        this.playResults();
    }
    public onLoad() {
        this.layoutOriginWidth = this.layout.node.width;
        this.layoutOriginHeight = this.layout.node.height;
        this.checkShowShareBtn();
    }
    public async playResults() {
        this.layout.type = cc.Layout.Type.HORIZONTAL;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.layout.node.height = this.layoutOriginHeight;
        const e = {};
        for (let r = 0; r < this.results.length; r++) {
            const i = this.results[r];
            Model.user.addAsset(i.id, 1);
            let t = e[i.id];
            if (R.isEmpty(t)) {
                t = e[i.id] = {
                    id: i.id,
                    type: i.type,
                    quality: i.quality,
                    icon: i.icon,
                    name: i.name,
                    num: 1
                };
            }
            else {
                t.num++;
            }
        }
        let n = 0;
        const o = R.keys(e);
        for (let r = 0; r < o.length; r++) {
            const i = e[o[r]];
            const a = await this.createItem(i);
            this.items.push(a);
            a.node.scale = 1.2;
            cc.tween(a.node).to(.1, {
                scale: 1
            }).start();
            if (r < 5) {
                a.node.y = .5 * -a.node.height - this.layout.paddingTop;
            }
            else if (r == 5) {
                this.layout.node.width = this.layoutOriginWidth;
                this.layout.type = cc.Layout.Type.GRID;
            }
            else if (r == 25) {
                this.scrollView.enabled = !0;
            }
            this.layout.enabled = !0;
            this.layout.updateLayout();
            this.layout.enabled = !1;
            this.scrollView.content.height = Math.max(this.layoutOriginHeight, this.layout.node.height);
            const c = Math.floor(r / 5);
            if (c != n) {
                n = c;
                this.scrollView.scrollToBottom(0);
            }
            await MyTools.sleep(.015);
        }
    }
    reportDungeon() { }
}
