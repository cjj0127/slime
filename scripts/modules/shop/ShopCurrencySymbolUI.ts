import ShopSymbolItemUI from "./ShopSymbolItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopCurrencySymbolUI extends ShopSymbolItemUI {
    @property(cc.Label)
    private preCount: cc.Label = null;
    public setPreCount(count: number): void {
        this.preCount.string = count > 0 ? `${count}` : "";
    }
}
