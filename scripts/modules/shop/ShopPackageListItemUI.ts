import IUIShopListItem from "./IUIShopListItem";
import LanMgr from "../common/Language";
import { E_CYCLE_TYPE } from "../common/Const";
import ShopModel from "../../ccstudio/data/ShopModel";
import Model from "../../ccstudio/data/Model";
import _ShopConfig from "../../ccstudio/config/_ShopConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopPackageListItemUI extends IUIShopListItem {
    @property(cc.Node)
    complete: cc.Node = null;
    @property(cc.Label)
    worthLabel: cc.Label = null;
    refresh() {
        const shopCfg = _ShopConfig.Instance.get(this.shopId);
        this.setPrice(shopCfg.currency, shopCfg.price);
        this.setWorth(shopCfg.worth);
        const limitCnt = shopCfg.limitCnt;
        const limitCycle = shopCfg.limitCycle;
        const cyclePayCount = Model.shop.getCyclePayCount(this.shopId);
        const sprites = this.node.getComponentsInChildren(cc.Sprite);
        if (limitCycle == E_CYCLE_TYPE.None) {
            this.setNameStr(LanMgr.Instance.getLangByID(shopCfg.name));
            sprites.forEach((sprite) => {
                sprite.setState(cc.Sprite.State.NORMAL);
            });
            this.btnPay.node.active = true;
            this.complete.active = false;
        }
        else {
            this.setNameStr(`${LanMgr.Instance.getLangByID(shopCfg.name)}(${cyclePayCount}/${limitCnt})`);
            if (cyclePayCount == limitCnt) {
                sprites.forEach((sprite) => {
                    sprite.setState(cc.Sprite.State.GRAY);
                });
                this.complete.active = true;
                this.btnPay.node.active = false;
            }
            else {
                sprites.forEach((sprite) => {
                    sprite.setState(cc.Sprite.State.NORMAL);
                });
                this.complete.active = false;
                this.btnPay.node.active = true;
            }
        }
    }
    setWorth(e: number) {
        if (this.worthLabel) {
            this.worthLabel.node.active = e > 1;
            if (e > 1) {
                this.worthLabel.string = `x${e} value`;
            }
        }
    }
}
