import IUIShopListView from "./IUIShopListView";
import ToggleToPage from "../common/ToggleToPage";
import { E_SHOP_TYPE } from "../common/Const";
import _ShopConfig from "../../ccstudio/config/_ShopConfig";
// import IUIShopListView from 'IUIShopListView';
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopCurrencyPageUI extends IUIShopListView {
    getShopCfgs() {
        return _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Currency);
    }
    onLoad() {
        this.node.on(ToggleToPage.PAGE_EVENTS.PageEnter, this.onPageEnter, this);
    }
    onPageEnter() {
        this.createItems();
    }
}
