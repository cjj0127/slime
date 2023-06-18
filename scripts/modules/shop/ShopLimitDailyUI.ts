import IUIShopListView from "./IUIShopListView";
import { GlobalEventName } from "../common/Events";
import { E_SHOP_TYPE } from "../common/Const";
import Model from "../../ccstudio/data/Model";
import _ShopConfig from "../../ccstudio/config/_ShopConfig";
import MyTools from "../../ccstudio/utils/MyTools";
const { ccclass, property } = cc._decorator;
const moment = window["moment"];
const _ = window["_"];
@ccclass
export default class ShopLimitDailyUI extends IUIShopListView {
    @property(cc.Label)
    cdLabel: cc.Label = null;
    private fixedUpdate(): void {
        this.refresh();
    }
    getShopCfgs(): any[] {
        return _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Daily);
    }
    protected onDisable(): void {
        cc.director.targetOff(this);
        this.unscheduleAllCallbacks();
    }
    protected onEnable(): void {
        super.onEnable();
        this.refresh();
        cc.director.on(GlobalEventName.ShopDailyefresh, this.onRrefresh, this);
        this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
    }
    private onRrefresh(): void {
        _.each(this.items, (item: any) => {
            item.refresh();
        });
    }
    private refresh(): void {
        const shopCfgs = _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Daily);
        const dailyOpenMoment = Model.shop.dailyOpenMoment;
        const timeDiff = moment.utc(moment(dailyOpenMoment).add(24, "hours")
            .diff(moment(MyTools.GetTimeNow()))).format("HH:mm:ss");
        this.cdLabel.string = timeDiff;
    }
}
