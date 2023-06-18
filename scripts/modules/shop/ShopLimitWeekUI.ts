import IUIShopListView from "./IUIShopListView";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_SHOP_TYPE, DAY_SECONDS } from "../common/Const";
import ShopModel from "../../ccstudio/data/ShopModel";
import Model from "../../ccstudio/data/Model";
import _ShopConfig from "../../ccstudio/config/_ShopConfig";
import MyTools from "../../ccstudio/utils/MyTools";
const moment: any = window["moment"];
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopLimitWeekUI extends IUIShopListView {
    @property(cc.Label)
    cdLabel = null;
    fixedUpdate() {
        this.refresh();
    }
    getShopCfgs() {
        return _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Weekly);
    }
    onDisable() {
        cc.director.targetOff(this);
        this.unscheduleAllCallbacks();
    }
    onEnable() {
        this.refresh();
        cc.director.on(GlobalEventName.ShopWeekRefresh, this.onRrefresh, this);
        this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
    onRrefresh() {
        _.each(this.items, (item) => {
            item.refresh();
        });
    }
    refresh() {
        const weekOpenMoment = Model.shop.weekOpenMoment;
        const weekCloseMoment = moment(weekOpenMoment).add(7, 'days');
        const nowTime = MyTools.GetTimeNow();
        const secondsLeft = weekCloseMoment.diff(nowTime, 'seconds');
        if (secondsLeft > DAY_SECONDS) {
            this.cdLabel.string = `${Math.floor(secondsLeft / DAY_SECONDS)}${LanMgr.Instance.getLangByID('days')}`;
        }
        else {
            this.cdLabel.string = moment.utc(1000 * secondsLeft).format('HH:mm:ss');
        }
    }
}
