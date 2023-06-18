import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, COLOR_WHITE, COLOR_GRAY, _TREASURE_TYPE_NAME } from "../common/Const";
import AddCoinLabel from "../common/AddCoinLabel";
import GuideMgr from "../guide/GuideMgr";
import ItemUIBase from "../common/ItemUIBase";
import LanMgr from "../common/Language";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
import _TeasureCostConfig from "../../ccstudio/config/_TeasureCostConfig";
import TeasureEffectItem from "./TeasureEffectItem";
import _TeasureLevelConfig from "../../ccstudio/config/_TeasureLevelConfig";
import TeasureMaterialItem from "./TeasureMaterialItem";
import MsgHint from "../common/MsgHint";
import CTreasureData from "./CTreasureData";
import TeasureDetailToggleUI from "./TeasureDetailToggleUI";
import UserData from "../user/UserData";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class TeasureDetailViewUI extends ItemUIBase {
    // typeId: number = 0;
    currTreasureId: number = 0;
    effectItems: TeasureEffectItem[] = [];
    @property(cc.Label)
    effectLabel: cc.Label = null;
    @property(cc.Layout)
    effectLayout: cc.Layout = null;
    @property(cc.Prefab)
    effectPrefab: cc.Prefab = null;
    @property(cc.Button)
    enHanceBtn: cc.Button = null;
    @property(cc.Label)
    enHanceLabel: cc.Label = null;
    @property(cc.Button)
    equipBtn: cc.Button = null;
    @property(cc.Label)
    equipStatusLabel: cc.Label = null;
    idToToggles: any = {};
    @property(cc.Label)
    itemName: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    materalItems: TeasureMaterialItem[] = [];
    @property(cc.Label)
    materialLabel: cc.Label = null;
    @property(cc.Layout)
    materialLayout: cc.Layout = null;
    @property(cc.Node)
    materialNode: cc.Node = null;
    @property(cc.Prefab)
    materialPrefab: cc.Prefab = null;
    @property([TeasureDetailToggleUI])
    toggles: TeasureDetailToggleUI[] = [];
    @property([AddCoinLabel])
    tokenLabel: AddCoinLabel[] = [];
    private typeId: number;
    @property(cc.Label)
    typeName: cc.Label = null;
    private checkShowMaterial(e: any): void {
        if (e && Model.teasure.getIsMaxLevel(e)) {
            this.materialLayout.node.removeAllChildren();
            this.materalItems = [];
            this.materialNode.active = false;
        }
        else {
            this.showNeedMateral(this.getNeedMateral(e));
            this.materialNode.active = true;
        }
    }
    public coin1Change(): void {
        this.tokenLabel[0].string = UserData.Instance.getItem(E_ASSET_TYPE.RobCoin1);
    }
    public coin2Change(): void {
        this.tokenLabel[1].string = UserData.Instance.getItem(E_ASSET_TYPE.RobCoin2);
    }
    public coin3Change(): void {
        this.tokenLabel[2].string = UserData.Instance.getItem(E_ASSET_TYPE.RobCoin3);
    }
    private getEffect(e: any): Array<string> {
        const t: Array<string> = [];
        const n = LanMgr.Instance.getLangByID("desc_ATK");
        const o = LanMgr.Instance.getLangByID("desc_HP");
        if (e) {
            t.push(n.replace("%{value}", `|${e.propValueAtk}`));
            t.push(o.replace("%{value}", `|${e.propValueHp}`));
        }
        else {
            const r = _TeasureConfig.Instance.get(this.currTreasureId);
            t.push(n.replace("%{value}", `|${r.ownedAtk}`));
            t.push(o.replace("%{value}", `|${r.ownedHp}`));
        }
        return t;
    }
    private getNeedMateral(e: any): Array<string> {
        let t: any = null;
        if (e) {
            const n = e.id;
            const o = e.level;
            t = _TeasureLevelConfig.Instance.getData(n, o).cost;
        }
        else {
            t = _TeasureCostConfig.Instance.getDataByTeasureId(this.currTreasureId).costNum;
        }
        return t;
    }
    public onDisable(): void {
        this.effectItems = [];
        this.materalItems = [];
        this.effectLayout.node.removeAllChildren();
        this.materialLayout.node.removeAllChildren();
        cc.director.targetOff(this);
    }
    public onEnable(): void {
        this.refreshTokenLabel();
        this.refreshToogles();
        const t = _TeasureConfig.Instance.getTypeIds(this.typeId);
        const n = CTreasureData.Instance.getEquip(this.typeId);
        let o = 0;
        if (n > 0) {
            o = n;
        }
        else {
            for (let r = 0; r < t.length; r++) {
                const i = t[r];
                if (_TeasureConfig.Instance.get(i)) {
                    o = i;
                    break;
                }
            }
        }
        this.currTreasureId = o;
        this.refresh();
        this.scheduleOnce(() => {
            const n = t.indexOf(o);
            this.toggles[n].getComponent(cc.Toggle).check();
        });
    }
    public onEnhanceBtn(): void {
        if (Model.teasure.getIsUnlockTeasure(this.currTreasureId)) {
            if (Model.teasure.lvUpEnable(this.currTreasureId)) {
                const e = CTreasureData.Instance.getData(this.currTreasureId);
                const t = _TeasureLevelConfig.Instance.getData(e.id, e.level).cost;
                if (Model.teasure.lvUp(this.currTreasureId)) {
                    this.reportUpTreasure(t);
                    this.refresh();
                }
            }
            else {
                MsgHint.tip(LanMgr.Instance.getLangByID("material_not_enough"));
            }
        }
        else {
            const n = _TeasureCostConfig.Instance.getDataByTeasureId(this.currTreasureId).costNum;
            if (Model.teasure.buyTreasure(this.currTreasureId)) {
                this.reportBuyTreasure(n);
                this.refresh();
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchTreasureEquip);
                this.refreshToogles();
            }
            else {
                MsgHint.tip(LanMgr.Instance.getLangByID("material_not_enough"));
            }
        }
    }
    public onEquipBtn(): void {
        const e = CTreasureData.Instance.getEquip(this.typeId);
        if (CTreasureData.Instance.getEquip(this.typeId) == this.currTreasureId) {
            if (Model.teasure.unEquip(this.currTreasureId)) {
                this.equipStatusLabel.string = LanMgr.Instance.getLangByID("btn_equip");
                this.idToToggles[this.currTreasureId].setEquipState(false);
            }
        }
        else {
            if (Model.teasure.equip(this.currTreasureId)) {
                this.equipStatusLabel.string = LanMgr.Instance.getLangByID("btn_remove");
                this.idToToggles[this.currTreasureId].setEquipState(true);
                if (e >= 0) {
                    this.idToToggles[e].setEquipState(false);
                }
            }
        }
        cc.director.emit(GlobalEventName.TreasureEquip);
        this.refreshToogles();
    }
    public onLoad(): void {
        _.each(this.tokenLabel, (e) => {
            e.setFormatFunc(NumberPlus.format);
        });
        if (this.toggles.length == 0) {
            this.toggles = this.node.getComponentsInChildren(TeasureDetailToggleUI);
        }
        _.each(this.toggles, (t) => {
            t.node.on("toggle", this.onToggle, this);
        });
        this.equipBtn.node.on("click", this.onEquipBtn, this);
        this.enHanceBtn.node.on("click", this.onEnhanceBtn, this);
    }
    public onToggle(e: any): void {
        const t = e.getComponent(TeasureDetailToggleUI);
        this.currTreasureId = t.treasureId;
        this.refresh();
        if (Model.teasure.getIsHaveTeasure()) {
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchBuyTreasure);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchTreasureEquip);
        }
        else {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchBuyTreasure);
        }
    }
    public refresh(): void {
        this.setTypeName(LanMgr.Instance.getLangByID(_TREASURE_TYPE_NAME[this.typeId] || ""));
        const e = this.currTreasureId;
        const t = _TeasureConfig.Instance.get(e);
        this.setIcon(t.icon);
        this.setItemName(LanMgr.Instance.getLangByID(t.name));
        const n = CTreasureData.Instance.getData(e);
        const o = (n == null ? undefined : n.level) || 0;
        this.setLevel(o);
        this.showOwnEffect(this.getEffect(n));
        this.checkShowMaterial(n);
        this.refreshDesc();
        if (Model.teasure.getIsUnlockTeasure(e)) {
            this.enHanceBtn.node.active = true;
            this.equipBtn.node.active = true;
            this.materialLabel.string = LanMgr.Instance.getLangByID("intensify_material");
            this.enHanceLabel.string = LanMgr.Instance.getLangByID("title_enhance");
        }
        else {
            this.equipBtn.node.active = false;
            this.materialLabel.string = LanMgr.Instance.getLangByID("treasure_material");
            this.enHanceLabel.string = LanMgr.Instance.getLangByID("treasure_buy");
        }
        this.enHanceBtn.node.active = o < t.maxLevel;
        const r = CTreasureData.Instance.getEquip(this.typeId);
        this.equipStatusLabel.string = LanMgr.Instance.getLangByID(e == r ? "btn_remove" : "btn_equip");
    }
    public refreshDesc(): void {
        const e = _TeasureConfig.Instance.get(this.currTreasureId);
        const t = CTreasureData.Instance.getData(this.currTreasureId);
        let n = LanMgr.Instance.getLangByID(e.desc);
        n = n.replace("%{value}", `${(t == null ? undefined : t.effectValue) || e.effectValue}`);
        this.setDescStr(n);
    }
    public refreshTokenLabel(): void {
        this.coin1Change();
        this.coin2Change();
        this.coin3Change();
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin1, this.coin1Change, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin2, this.coin2Change, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin3, this.coin3Change, this);
    }
    public refreshToogles(): void {
        const t = _TeasureConfig.Instance.getTypeIds(this.typeId);
        const n = CTreasureData.Instance.getEquip(this.typeId);
        this.idToToggles = {};
        _.each(this.toggles, (o: any, r: number) => {
            const i = t[r];
            const a = _TeasureConfig.Instance.get(i);
            o.treasureId = i;
            o.setIcon(a.icon);
            o.setEquipState(n == i);
            const s = CTreasureData.Instance.getData(i);
            o.setOwned(s !== null);
            this.idToToggles[i] = o;
        });
    }
    reportBuyTreasure(e): void {
        var t, n;
        const o = {
            PreciousCoin_Cost: ((t = e), (n = []), _.each(t, (e) => {
                const t = e.split("|");
                const o = t[0] + "|" + NumberPlus.decode(t[1]);
                n.push(o);
            }), n.join(",")),
            PreciousCoin_Num: (() => {
                const e = [];
                for (let t = 3001; t <= 3003; t++) {
                    const n = t + "|" + UserData.Instance.getItem(t);
                    e.push(n);
                }
                return e.join(",");
            })(),
            Precious_FInd_Num: CTreasureData.Instance.getTreasureCount(),
            Precious_ID: this.currTreasureId,
            Precious_Type: this.typeId.toString(),
        };
    }
    reportUpTreasure(e): void {
        var t, n;
        const o = CTreasureData.Instance.getData(this.currTreasureId), r = (null == o ? void 0 : o.level) || 0, i = {
            PreciousCoin_Cost: ((t = e), (n = []), _.each(t, (e) => {
                const t = e.split("|");
                const o = t[0] + "|" + NumberPlus.decode(t[1]);
                n.push(o);
            }), n.join(",")),
            PreciousCoin_Num: (() => {
                const e = [];
                for (let t = 3001; t <= 3003; t++) {
                    const n = t + "|" + UserData.Instance.getItem(t);
                    e.push(n);
                }
                return e.join(",");
            })(),
            Precious_ID: this.currTreasureId,
            Precious_Level: r,
            Precious_Type: this.typeId.toString(),
        };
    }
    public reuse(e: number): void {
        this.typeId = e;
    }
    public setDescStr(e: string): void {
        this.effectLabel.string = e;
    }
    public setItemName(e: string): void {
        this.itemName.string = e;
    }
    public setLevel(e: number): void {
        if (e > 0) {
            this.lvLabel.string = `LV ${e}`;
            this.lvLabel.node.color = COLOR_WHITE;
            this.iconSprite.node.color = COLOR_WHITE;
        }
        else {
            this.lvLabel.string = LanMgr.Instance.getLangByID("item_unowned");
            this.lvLabel.node.color = COLOR_GRAY;
            this.iconSprite.node.color = COLOR_GRAY;
        }
    }
    public setTypeName(e: string): void {
        this.typeName.string = e;
    }
    private showNeedMateral(e: Array<string>): void {
        if (this.materalItems.length) {
            _.each(e, (e, n) => {
                const o = e.split("|");
                this.materalItems[n].showItem(o[0], o[1]);
            });
        }
        else {
            _.each(e, (e) => {
                const n = cc.instantiate(this.materialPrefab);
                const o = e.split("|");
                const r = n.getComponent(TeasureMaterialItem);
                this.materalItems.push(r);
                r.showItem(o[0], o[1]);
                n.parent = this.materialLayout.node;
            });
        }
    }
    private showOwnEffect(e: Array<string>): void {
        if (this.effectItems.length) {
            _.each(e, (e, n) => {
                const o = e.split("|");
                this.effectItems[n].showItem(o[0], o[1]);
            });
        }
        else {
            _.each(e, (e) => {
                const n = cc.instantiate(this.effectPrefab);
                const o = e.split("|");
                const r = n.getComponent(TeasureEffectItem);
                this.effectItems.push(r);
                r.showItem(o[0], o[1]);
                n.parent = this.effectLayout.node;
            });
        }
    }
    public start(): void { }
}
