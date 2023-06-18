import LanMgr from "../common/Language";
import ShopLimitListItemUI from "./ShopLimitListItemUI";
// import ShopLimitListItemUI from "ShopLimitListItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopLimitListItemFreeUI extends ShopLimitListItemUI {
    public setPrice(): void {
        this.priceIcon.node.active = false;
        this.priceLabel.string = LanMgr.Instance.getLangByID("btn_free");
    }
}
