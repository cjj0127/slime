import IUIShopListView from "./IUIShopListView";
import ToggleToPage from "../common/ToggleToPage";
import { E_SHOP_TYPE } from "../common/Const";
import _ShopConfig from "../../ccstudio/config/_ShopConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopPackagePageUI extends IUIShopListView {
    getShopCfgs() {
        return _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Package);
    }
    onLoad() {
        this.node.on(ToggleToPage.PAGE_EVENTS.PageEnter, this.onPageEnter, this);
    }
    onPageEnter() {
        this.createItems();
    }
}
