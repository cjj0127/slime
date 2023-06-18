import IUIShopListItem from "./IUIShopListItem";
import LanMgr from "../common/Language";
import { E_ASSET_TYPE, E_CYCLE_TYPE } from "../common/Const";
import ShopModel from "../../ccstudio/data/ShopModel";
import Model from "../../ccstudio/data/Model";
import _ShopConfig from "../../ccstudio/config/_ShopConfig";
const h = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopLimitListItemUI extends IUIShopListItem {
    @property(cc.Node)
    complete: cc.Node = null;
    lines: any[] = [];
    @property(cc.Node)
    moreAd: cc.Node = null;
    @property(cc.Node)
    onceAd: cc.Node = null;
    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;
    @property(cc.Node)
    progressLine: cc.Node = null;
    @property(cc.Label)
    worthLabel: cc.Label = null;
    onLoad() {
        super.onLoad();
        if (this.progressLine) {
            this.progressLine.active = false;
            this.lines.push(this.progressLine);
        }
    }
    refresh() {
        const e = _ShopConfig.Instance.get(this.shopId);
        const t = Model.shop.getData(this.shopId);
        this.setPrice(e.currency, e.price, t.adCnt);
        this.setWorth(e.worth);
        const n = e.limitCnt;
        const o = e.limitCycle;
        const r = Model.shop.getCyclePayCount(this.shopId);
        const i = this.node.getComponentsInChildren(cc.Sprite);
        if (o == E_CYCLE_TYPE.None) {
            this.setNameStr(LanMgr.Instance.getLangByID(e.name));
            h.each(i, (e) => {
                e.setState(cc.Sprite.State.NORMAL);
            });
            this.btnPay.node.active = true;
            this.complete.active = false;
        }
        else {
            this.setNameStr(`${LanMgr.Instance.getLangByID(e.name)}(${r}/${n})`);
            if (r == n) {
                h.each(i, (e) => {
                    e.setState(cc.Sprite.State.GRAY);
                });
                this.complete.active = true;
                this.btnPay.node.active = false;
            }
            else {
                h.each(i, (e) => {
                    e.setState(cc.Sprite.State.NORMAL);
                });
                this.complete.active = false;
                this.btnPay.node.active = true;
            }
        }
    }
    // e: string, t: number, n: number = 0
    setPrice(e: E_ASSET_TYPE, t: number, n: number) {
        if (e == E_ASSET_TYPE.Cash) {
            this.priceLabel.string = `$${t.toFixed(2)}`;
            this.priceIcon.node.active = false;
        }
        else if (e == E_ASSET_TYPE.Ad) {
            this.priceIcon.node.active = true;
            this.setPriceIcon(e);
            this.setPriceProgress(t, n);
            this.priceLabel.string = LanMgr.Instance.getLangByID("shop_price_desc").replace("%{value}", `${t}`);
            this.moreAd.active = t > 1;
            this.onceAd.active = t == 1;
        }
        else {
            this.priceIcon.node.active = true;
            this.setPriceIcon(e);
        }
    }
    setPriceProgress(e: number, t: number) {
        if (this.progress) {
            this.progress.progress = t / e;
        }
        const n = this.progress.node.width / e;
        for (let o = 0; o < e - 1; o++) {
            let r = this.lines[o];
            if (!r) {
                r = this.lines[o] = cc.instantiate(this.progressLine);
                r.parent = this.progressLine.parent;
            }
            r.active = true;
            r.x = (o + 1) * n - 0.5 * this.progress.node.width;
            r.y = this.progressLine.y;
        }
    }
    setWorth(e: number) {
        if (this.worthLabel) {
            this.worthLabel.node.parent.active = e > 1;
            if (e > 1) {
                this.worthLabel.string = `x${e} value`;
            }
        }
    }
}
