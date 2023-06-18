import GuideMgr from "../guide/GuideMgr";
import GuideTouch from "../guide/GuideTouch";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import ItemUIBase from "../common/ItemUIBase";
import LanMgr from "../common/Language";
import RelicData_ from "./RelicData_";
import RelicDetailToggleUI from "./RelicDetailToggleUI";
import UserData from "../user/UserData";
import { GlobalEventName } from "../common/Events";
import { COLOR_WHITE, COLOR_GRAY, E_ASSET_TYPE, COLOR_RED } from "../common/Const";
import RelicModel from "../../ccstudio/data/RelicModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import _RelicLevelConfig from "../../ccstudio/config/_RelicLevelConfig";
const E: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicDetailViewUI extends ItemUIBase {
    @property(cc.Button)
    btnEnhance: cc.Button = null;
    @property(cc.Button)
    btnEquip: cc.Button = null;
    currRelicId: number = 0;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Label)
    equipStatusLabel: cc.Label = null;
    @property(cc.Label)
    forkCountLabel: cc.Label = null;
    idToToggles: {
        [key: number]: RelicDetailToggleUI;
    } = {};
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    ownedPropLabel: cc.Label = null;
    @property(cc.Label)
    ownedValueLabel: cc.Label = null;
    @property(cc.Label)
    priceLabel: cc.Label = null;
    @property(RelicDetailToggleUI)
    toggles: RelicDetailToggleUI[] = [];
    typeId: number = 0;
    onClickEnhance(): void {
        if (Model.relic.lvupEnable(this.currRelicId) && Model.relic.lvup(this.currRelicId)) {
            const e = RelicData_.Instance.getData(this.currRelicId);
            const t = (e?.level || 0) as number;
            const n = e.propValue;
            this.setOwned(n);
            this.setLevel(t);
            this.refreshDesc();
            this.refreshEnhancePrice(t);
            const o = _RelicConfig.Instance.get(this.currRelicId);
            this.btnEnhance.node.active = t < o.maxLevel;
        }
    }
    onClickEquip(): void {
        const e = RelicData_.Instance.getEquip(this.typeId);
        if (Model.relic.equip(this.currRelicId)) {
            this.btnEquip.interactable = false;
            this.equipStatusLabel.string = LanMgr.Instance.getLangByID('item_equiped');
            let t = this.idToToggles[this.currRelicId];
            t.setEquipStatus(true);
            if (e >= 0) {
                t = this.idToToggles[e];
                t.setEquipStatus(false);
            }
        }
    }
    onDisable(): void {
        cc.director.targetOff(this);
    }
    onEnable(): void {
        this.refreshToggles();
        const t = _RelicConfig.Instance.getTypeIds(this.typeId);
        const n = RelicData_.Instance.getEquip(this.typeId);
        let o = 0;
        if (n > 0) {
            o = n;
        }
        else {
            for (let r = 0; r < t.length; r++) {
                const i = t[r];
                if (RelicData_.Instance.getData(i)) {
                    o = i;
                    break;
                }
            }
        }
        this.currRelicId = o;
        this.refresh();
        this.scheduleOnce(() => {
            const n = t.indexOf(o);
            this.toggles[n].getComponent(cc.Toggle).check();
        });
        this.setForkCount(UserData.Instance.getItem(E_ASSET_TYPE.Fork));
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Fork, this.onForkChnage, this);
    }
    onForkChnage(): void {
        const e = RelicData_.Instance.getData(this.currRelicId);
        const t = (null == e ? void 0 : e.level) || 0;
        this.refreshEnhancePrice(t);
        this.setForkCount(UserData.Instance.getItem(E_ASSET_TYPE.Fork));
    }
    onLoad(): void {
        if (this.toggles.length == 0) {
            this.toggles = this.node.getComponentsInChildren(RelicDetailToggleUI);
        }
        E.each(this.toggles, (t) => {
            t.node.on("toggle", this.onToggle, this);
        });
        this.btnEnhance.node.on("click", this.onClickEnhance, this);
        this.btnEquip.node.on("click", this.onClickEquip, this);
    }
    onToggle(e: any): void {
        const t = e.getComponent(RelicDetailToggleUI);
        this.currRelicId = t.relicId;
        this.refresh();
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRelicEquipButton);
    }
    refresh(): void {
        const e = this.currRelicId;
        const t = _RelicConfig.Instance.get(e);
        this.setIcon(t.icon);
        this.setNameStr(LanMgr.Instance.getLangByID(t.name));
        this.setOwnedProp(t.props);
        this.refreshDesc();
        const n = RelicData_.Instance.getData(e);
        const o = (null == n ? void 0 : n.level) || 0;
        const r = (null == n ? void 0 : n.propValue) || t.owned;
        this.setOwned(r);
        this.setLevel(o);
        this.refreshEnhancePrice(o);
        this.btnEnhance.node.active = o < t.maxLevel;
        const i = RelicData_.Instance.getEquip(this.typeId);
        this.btnEquip.interactable = e !== i;
        this.equipStatusLabel.string = LanMgr.Instance.getLangByID(e == i ? "item_equiped" : "btn_equip");
        n ? this.btnEnhance.interactable = !0 : (this.btnEquip.interactable = !1, this.btnEnhance.interactable = !1);
    }
    refreshDesc(): void {
        const e = _RelicConfig.Instance.get(this.currRelicId);
        const t = RelicData_.Instance.getData(this.currRelicId);
        let n = LanMgr.Instance.getLangByID(e.desc);
        n = n.replace("%{value}", "" + ((null == t ? void 0 : t.effectValue) || e.effectValue));
        this.setDescStr(n);
    }
    refreshEnhancePrice(e: number): void {
        if (e < _RelicConfig.Instance.get(this.currRelicId).maxLevel) {
            const t = _RelicLevelConfig.Instance.getCost(this.typeId, e > 0 ? e : 1);
            this.setEnhancePrice(t);
            const n = UserData.Instance.getItem(E_ASSET_TYPE.Fork);
            NumberPlus.compare(n, t) ? this.priceLabel.node.color = COLOR_WHITE : this.priceLabel.node.color = COLOR_RED;
        }
    }
    refreshToggles(): void {
        const t = _RelicConfig.Instance.getTypeIds(this.typeId);
        const n = RelicData_.Instance.getEquip(this.typeId);
        this.idToToggles = {};
        E.each(this.toggles, (o, r) => {
            const i = t[r];
            const a = _RelicConfig.Instance.get(i);
            o.relicId = i;
            o.setIcon(a.icon);
            o.setEquipStatus(n == i);
            const s = RelicData_.Instance.getData(i);
            o.setOwned(null != s);
            if (null != s) {
                o.getComponent(GuideTouch) || o.addComponent(GuideTouch).setId(SpecialGuideEnum.TouchRelicItem);
            }
            this.idToToggles[i] = o;
        });
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRelicItem);
    }
    // typeId: number;
    // currRelicId: number;
    // toggles: Array<any>;
    reuse(e: number): void {
        this.typeId = e;
    }
    setDescStr(e: string): void {
        this.descLabel.string = e;
    }
    setEnhancePrice(e: number): void {
        this.priceLabel.string = NumberPlus.format(e);
    }
    //   @cc.Label
    //   forkCountLabel: cc.Label;
    //   @cc.Label
    //   levelLabel: cc.Label;
    //   @cc.Label
    //   nameLabel: cc.Label;
    //   @cc.Label
    //   descLabel: cc.Label;
    //   @cc.Label
    //   ownedPropLabel: cc.Label;
    //   @cc.Label
    //   ownedValueLabel: cc.Label;
    //   @cc.Label
    //   priceLabel: cc.Label;
    //   @cc.Button
    //   btnEnhance: cc.Button;
    //   @cc.Button
    //   btnEquip: cc.Button;
    //   @cc.Label
    //   equipStatusLabel: cc.Label;
    //   @cc([RelicDetailToggleUI])
    //   toggles: RelicDetailToggleUI[];
    //   constructor() {
    //     super();
    //   }
    setForkCount(e: number): void {
        this.forkCountLabel.string = NumberPlus.format(e);
    }
    setLevel(e: number): void {
        if (e > 0) {
            this.levelLabel.string = `LV ${e}`;
            this.levelLabel.node.color = COLOR_WHITE;
            this.iconSprite.node.color = COLOR_WHITE;
        }
        else {
            this.levelLabel.string = LanMgr.Instance.getLangByID('item_unowned');
            this.levelLabel.node.color = COLOR_GRAY;
            this.iconSprite.node.color = COLOR_GRAY;
        }
    }
    setNameStr(e: string): void {
        this.nameLabel.string = e;
    }
    setOwned(e: number): void {
        this.ownedValueLabel.string = `+${NumberPlus.format(e)}%`;
    }
    setOwnedProp(e: string[]): void {
        const t: string[] = [];
        E.each(e, (e) => {
            const n = _PropConfig.Instance.get(e);
            t.push(LanMgr.Instance.getLangByID(n.name));
        });
        this.ownedPropLabel.string = t.join('&');
    }
}
