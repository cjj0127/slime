import ToggleToPage from "../common/ToggleToPage";
import ShopLimitDailyUI from "./ShopLimitDailyUI";
import ShopLimitWeekUI from "./ShopLimitWeekUI";
// import ShopLimitWeekUI from 'ShopLimitWeekUI';
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopLimitPageUI extends cc.Component {
    @property(ShopLimitDailyUI)
    dailyView: ShopLimitDailyUI = null;
    @property(cc.Layout)
    layout: cc.Layout = null;
    @property(ShopLimitWeekUI)
    weekView: ShopLimitWeekUI = null;
    onLoad() {
        this.node.on(ToggleToPage.PAGE_EVENTS.PageEnter, this.onPageEnter, this);
    }
    onPageEnter() {
        this.dailyView.createItems();
        this.weekView.createItems();
    }
}
