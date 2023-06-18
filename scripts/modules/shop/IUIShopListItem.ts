import { E_ASSET_TYPE } from "../common/Const";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import ShopModel from "../../ccstudio/data/ShopModel";
import SubscribeModel from "../../ccstudio/data/SubscribeModel";
import Model from "../../ccstudio/data/Model";
import _ShopConfig from "../../ccstudio/config/_ShopConfig";
import UIPool from "../common/UIPool";
import ShopSymbolItemUI from "./ShopSymbolItemUI";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class IUIShopListItem extends UIPool {
    @property(cc.Button)
    btnPay = null;
    @property(cc.Label)
    nameLabel = null;
    @property(cc.Sprite)
    priceIcon = null;
    priceIconOriSize = null;
    @property(cc.Label)
    priceLabel = null;
    shopId = 0;
    shopSymbols = [];
    @property(cc.Layout)
    symbolLayout = null;
    createSymbols(e: Array<any>) {
        _.each(e, (e: any) => {
            const n = this.get();
            n.parent = this.symbolLayout.node;
            const o = n.getComponent(ShopSymbolItemUI);
            o.setItemInfo(e);
            this.shopSymbols.push(o);
        });
    }
    onChageShopId() {
        this.clear();
        const e = _ShopConfig.Instance.get(this.shopId);
        this.createSymbols(e.goods);
        this.refresh();
    }
    async onClickPay(e: any) {
        const t = e.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const n = await Model.shop.requestBuy(this.shopId, t);
        if (n && !_.isEmpty(n)) {
            this.refresh();
        }
        else {
            const o = _ShopConfig.Instance.get(this.shopId);
            const r = o.currency;
            o.price;
            if (r == E_ASSET_TYPE.Ad) {
                this.refresh();
            }
        }
    }
    onLoad() {
        this.btnPay.node.on("click", this.onClickPay, this);
        this.btnPay.node.on(cc.Node.EventType.TOUCH_END, async () => {
            if (2001 !== this.shopId) {
                await SubscribeModel.Instance.checkShopSubscribe();
            }
        }, this);
        this.priceIconOriSize = this.priceIcon.node.getContentSize();
    }
    refresh() {
    }
    setCfg(e: any) {
        if (this.shopId !== e) {
            this.shopId = e;
            this.onChageShopId();
        }
    }
    setNameStr(e: string) {
        this.nameLabel.string = e;
    }
    // e: string, t: number, n: number = 0
    setPrice(e: E_ASSET_TYPE, t: number, n: number = 0) {
        if (e == E_ASSET_TYPE.Cash) {
            this.priceLabel.string = "$" + t.toFixed(2);
            this.priceIcon.node.active = false;
        }
        else if (e == E_ASSET_TYPE.Ad) {
            this.priceIcon.node.active = true;
            this.setPriceIcon(e);
            this.priceLabel.string = "(" + n + "/" + t + ")";
        }
        else {
            this.priceIcon.node.active = true;
            this.setPriceIcon(e);
        }
    }
    async setPriceIcon(e: E_ASSET_TYPE) {
        this.priceIcon.spriteFrame = _AssetConfig.Instance.getAssetSpriteFrame(e);
        this.priceIcon.trim = false;
        this.priceIcon.sizeMode = cc.Sprite.SizeMode.RAW;
        const t = this.priceIconOriSize;
        const n = this.priceIcon.node.getContentSize();
        if (n.width > n.height) {
            this.priceIcon.node.scale = t.width / this.priceIcon.node.width;
        }
        else {
            this.priceIcon.node.scale = t.height / this.priceIcon.node.height;
        }
    }
}
// interface SymbolType {
//     parent: cc.Node,
//     getComponent: Function,
//     setItemInfo: Function
// }
