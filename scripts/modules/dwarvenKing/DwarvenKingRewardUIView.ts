import { E_ASSET_TYPE, E_ITEM_TYPE, MapUIPrefabs, E_GAME_LEVEL_TYPE } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetPool from "../asset/AssetPool";
import DwarvenKingBattle from "../battle/DwarvenKingBattle";
import BtnShare from "../common/BtnShare";
import ChannelManager, { eChannelType } from "../common/ChannelManager";
import _DwarvenKingConfig from "../../ccstudio/config/_DwarvenKingConfig";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import GuideMgr from "../guide/GuideMgr";
import ItemUIBase from "../common/ItemUIBase";
import Model from "../../ccstudio/data/Model";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import MyTools from "../../ccstudio/utils/MyTools";
import DwarvenKingRewardItemUI from "./DwarvenKingRewardItemUI";
import UserData from "../user/UserData";
import Utils_ from "../../ccstudio/utils/Utils";
const { ccclass, property } = cc._decorator;
const M: any = window['_'];
@ccclass
export default class DwarvenKingRewardUIView extends ItemUIBase {
    @property(cc.Label)
    damageRecordLabel: cc.Label = null;
    items = [];
    @property(cc.Layout)
    layout: cc.Layout = null;
    layoutOriginHeight = 0;
    layoutOriginWidth = 0;
    @property(cc.Node)
    panelContent: cc.Node = null;
    results = [];
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    tailtNum = 0;
    async addItem(e, t, n, o, r) {
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
    async addTailtItem(e, t, n) {
        const o = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.DwarvenKingRewardItem.path);
        o.parent = this.layout.node;
        o.stopAllActions();
        const r = o.getComponent(DwarvenKingRewardItemUI);
        r.setIcon(e);
        r.setNameStr(t);
        r.setNum(n);
        return r;
    }
    async checkShowShareBtn() {
        if (ChannelManager.getChannelType() !== eChannelType.WECHAT && ChannelManager.getChannelType() !== eChannelType.BYTEDANCE || GuideMgr.instance.isInGuide()) {
            return;
        }
        const e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.ShareBtn.path);
        const t = {
            failCallback: function () { },
            palceName: "RushShare",
            successCallback: function () { }
        };
        e.getComponent(BtnShare).showShare("bossKing", t),
            this.panelContent.addChild(e);
    }
    public clear() {
        this.results.length = 0;
        M.each(this.items, (e) => AssetPool.Instance.put(e));
        this.items.length = 0;
    }
    public async createItem(e: {
        id: number;
        type: number;
        num: number;
    }) {
        const t = this.getCfg(e.id, e.type);
        if (t) {
            await this.addItem(t.quality, t.icon, t.name, e.id, e.num);
        }
        else {
            return null;
        }
    }
    public async createTailtItem(e: {
        id: number;
        num: number;
    }) {
        const t = this.getTailtCfg(e.id);
        await this.addTailtItem(t.icon, t.name, e.num);
    }
    getCfg(e, t) {
        return this.getCfgInfo(e, t);
    }
    getCfgInfo(e, t) {
        let n: any = null;
        if (t == E_ITEM_TYPE.Gear) {
            n = _GearConfig.Instance.get(e);
        }
        else if (t == E_ITEM_TYPE.Skill) {
            n = _SkillConfig.Instance.get(e);
        }
        else if (t == E_ITEM_TYPE.Partner) {
            n = _PartnerConfig.Instance.get(e);
        }
        return n ? { quality: n.quality, icon: n.icon, name: n.name, gearType: n.type } : null;
    }
    public getResults() {
        this.damageRecordLabel.string = UserData.Instance.getDwarvenKingDamageRecord();
        const e = DwarvenKingBattle.Instance.curLevel;
        const t = _DwarvenKingConfig.Instance.get(e);
        this.tailtNum = t.tailt;
        for (let r = 0; r < t.qualities.length; r++) {
            const n = t.qualities[r];
            const o = t.nums[r];
            const i = this.results.find((e) => e.quality == n);
            if (i) {
                i.cnt += t.nums[r];
            }
            else {
                const a = { cnt: r, quality: n };
                this.results.push(a);
            }
        }
    }
    getTailtCfg(e) {
        return _AssetConfig.Instance.get(e);
    }
    public onDisable() {
        this.unscheduleAllCallbacks();
        this.clear();
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
        const e = [{ id: E_ASSET_TYPE.Tailt, type: E_ITEM_TYPE.Asset, num: this.tailtNum }];
        this.results.forEach((t) => {
            for (let n = 0; n < t.cnt; n++) {
                const o = [
                    E_ITEM_TYPE.Gear,
                    E_ITEM_TYPE.Skill,
                    E_ITEM_TYPE.Partner
                ];
                const r = Utils_.getRandomRange(0, o.length - 1);
                let i = null;
                if (o[r] == E_ITEM_TYPE.Gear) {
                    i = _GearConfig.Instance.getQualityGears(t.quality);
                }
                else if (o[r] == E_ITEM_TYPE.Skill) {
                    i = _SkillConfig.Instance.getQualitySkills(t.quality);
                }
                else if (o[r] == E_ITEM_TYPE.Partner) {
                    i = _PartnerConfig.Instance.getQualityPartners(t.quality);
                }
                if (i) {
                    const a = i[Utils_.getRandomRange(0, i.length - 1)];
                    const s = e.find((e) => e.id == a.id);
                    if (s) {
                        s.num++;
                    }
                    else {
                        const l = {
                            id: a.id,
                            num: 1,
                            type: o[r]
                        };
                        e.push(l);
                    }
                }
            }
        });
        e.sort((e, t) => (e.id == E_ASSET_TYPE.Tailt ? 1 : e.id - t.id));
        this.reportDungeon(e);
        this.layout.type = cc.Layout.Type.HORIZONTAL;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.layout.node.height = this.layoutOriginHeight;
        for (let n = 0; n < e.length; n++) {
            Model.user.addAsset(e[n].id, e[n].num);
        }
        let t = 0;
        let n = 0;
        while (n < e.length) {
            let o: any = null;
            if (e[n].id != E_ASSET_TYPE.Tailt) {
                o = await this.createItem(e[n]);
            }
            else {
                o = await this.createTailtItem(e[n]);
            }
            this.items.push(o);
            o.node.scale = 1.2;
            cc.tween(o.node).to(0.1, { scale: 1 }).start();
            if (n < 5) {
                o.node.y = -0.5 * o.node.height - this.layout.paddingTop;
            }
            else if (n == 5) {
                this.layout.node.width = this.layoutOriginWidth;
                this.layout.type = cc.Layout.Type.GRID;
            }
            else if (n == 25) {
                this.scrollView.enabled = true;
            }
            this.layout.enabled = true;
            this.layout.updateLayout();
            this.layout.enabled = false;
            this.scrollView.content.height = Math.max(this.layoutOriginHeight, this.layout.node.height);
            const r = Math.floor(n / 5);
            if (r != t) {
                t = r;
                this.scrollView.scrollToBottom(0);
            }
            await MyTools.sleep(0.015);
            n++;
        }
    }
    reportDungeon(e) {
        console.log("itemIds=", e);
        let t = "";
        for (let n = 0; n < e.length; n++) {
            t += e[n].id + "|" + e[n].num + ";";
        }
        const o = Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.DwarvenKing);
        const r = Model.level.getBossLevelCompleteCount(E_GAME_LEVEL_TYPE.DwarvenKing, o);
        const i = r.count;
        const a = r.totalCount;
        const s = {
            Dungeon_Level: DwarvenKingBattle.Instance.curLevel,
            Dungeon_Reward: t,
            Dungeon_Times: i,
            Dungeon_Total: a,
            Dungeon_Type: E_GAME_LEVEL_TYPE[E_GAME_LEVEL_TYPE.DwarvenKing]
        };
    }
}
