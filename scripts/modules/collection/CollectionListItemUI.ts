import { E_PROP_PRECENT_T, E_COLLECTION_TYPE } from "../common/Const";
import _CollectionConfig from "../../ccstudio/config/_CollectionConfig";
import CollectionData from "./CollectionData";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import LanMgr from "../common/Language";
import MgrCollection from "../../ccstudio/data/MgrCollection";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import RedDotParam from "../common/RedDotParam";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import CollectionSymbolItemUI from "./CollectionSymbolItemUI";
import UIPool from "../common/UIPool";
const { ccclass, property } = cc._decorator;
const C = window['_'];
@ccclass
export default class CollectionListItemUI extends RedDotParam {
    @property(cc.Button)
    btnEnhance: cc.Button = null;
    collectionId: number = null;
    @property(cc.Node)
    lockedNode: cc.Node = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    pool: UIPool = null;
    @property(cc.Label)
    propLabel: cc.Label = null;
    @property(cc.Label)
    propUpValueLabel: cc.Label = null;
    symbolItems = {};
    @property(cc.Layout)
    symbolLayout: cc.Layout = null;
    getRedDotParam(): number {
        return this.collectionId;
    }
    getSymbolInfo(e: number, t: number): {
        icon: string;
        quality: number;
    } {
        let n: string, o: number;
        let r;
        switch (e) {
            case E_COLLECTION_TYPE.Gear:
                r = _GearConfig.Instance.get(t);
                n = r.icon;
                o = r.quality;
                break;
            case E_COLLECTION_TYPE.Skill:
                r = _SkillConfig.Instance.get(t);
                n = r.icon;
                o = r.quality;
                break;
            case E_COLLECTION_TYPE.Partner:
                r = _PartnerConfig.Instance.get(t);
                n = r.icon;
                o = r.quality;
                break;
        }
        return { icon: n, quality: o };
    }
    onClickEnhance() {
        Model.collection.lvup(this.collectionId) && this.refresh();
    }
    onLoad() {
        this.pool = this.getComponent(UIPool);
        this.btnEnhance.node.on("click", this.onClickEnhance, this);
    }
    refresh() {
        let e = CollectionData.Instance.getData(this.collectionId);
        C.isNil(e) && (e = CollectionData.Instance.createData(this.collectionId, 0));
        const t = e.type, n = e.ids, o = e.unlockLv, r = e.lv;
        this.refreshItems(t, r, o, n);
        const i = _CollectionConfig.Instance.get(this.collectionId);
        this.setNameStr(i.name, e.lv);
        let a = null;
        if (o > r) {
            a = CollectionData.Instance.calcAddationValue(this.collectionId, o);
        }
        this.setPropValue(i.prop, e.propAddation, a);
        this.lockedNode.active = o == 0;
        this.btnEnhance.interactable = o > 0 && r < o;
    }
    refreshItems(e: number, t: number, n: number, o: number[]) {
        cc.log("refreshItems", E_COLLECTION_TYPE[e], t, n);
        this.pool.clear();
        this.symbolItems = {};
        C.each(o, o => {
            let i = this.pool.get();
            i.parent = this.symbolLayout.node;
            const a = this.getSymbolInfo(e, o), s = a.icon, c = a.quality, l = Model.collection.getSymbolLv(e, o), u = i.getComponent(CollectionSymbolItemUI);
            u.setIcon(s);
            u.setQualityValue(c);
            if (n == 0 || t == n) {
                u.setLevel(l, n + 1);
            }
            else {
                u.setLevel(l, n);
            }
            this.symbolItems[o] = u;
        });
    }
    setCollectionId(e: number) {
        this.collectionId = e;
        this.refresh();
    }
    setNameStr(e: number, t: number) {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e) + " " + LanMgr.Instance.getLangByID("LV") + ":" + t;
    }
    setPropValue(e: number, t: number, n: number) {
        let o = "";
        const r = _PropConfig.Instance.get(e);
        if (r.percent == E_PROP_PRECENT_T.Percent) {
            o = "%";
        }
        this.propLabel.string = LanMgr.Instance.getLangByID(r.name) + " +" + NumberPlus.format(t) + o;
        this.propUpValueLabel.string = n ? "+" + NumberPlus.format(NumberPlus.sub(n, t)) + o : "";
    }
}
