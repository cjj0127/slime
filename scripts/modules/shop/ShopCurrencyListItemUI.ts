import IUIShopListItem from "./IUIShopListItem";
import LanMgr from "../common/Language";
import Model from "../../ccstudio/data/Model";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopCurrencyListItemUI extends IUIShopListItem {
    public refresh(): void {
        const shopCfg = _QuestConfig.Instance.get(this.shopId);
        const cyclePayCount = Model.shop.getCyclePayCount(this.shopId);
        this.setPrice(shopCfg.currency, shopCfg.price, 1);
        this.setNameStr(LanMgr.Instance.getLangByID(shopCfg.name));
        const goodsList = shopCfg.goods;
        const symbolsList = this.shopSymbols;
        symbolsList.forEach((symbol, index) => {
            const goods = goodsList[index];
            const count = goods.count;
            if (cyclePayCount == 0) {
                symbol.setPreCount(count);
                symbol.setCount(count * 2);
            }
            else {
                symbol.setPreCount(0);
                symbol.setCount(count);
            }
        });
    }
    constructor() {
        super();
    }
}
