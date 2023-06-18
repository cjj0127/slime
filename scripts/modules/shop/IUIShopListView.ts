import IUIShopListItem from "./IUIShopListItem";
import { SHOP_ITEM_PATH_ } from "../common/Const";
import AssetPool from "../asset/AssetPool";
const h: any = window["_"];
// import IUIShopListItem from "IUIShopListItem";
const { ccclass, property } = cc._decorator;
@ccclass
export default class IUIShopListView extends cc.Component {
    created: boolean = false;
    items: IUIShopListItem[] = [];
    @property(cc.Layout)
    layout: cc.Layout = null;
    _onCardClicked(event: cc.Event.EventTouch, customEventData: any) {
    }
    // private created: boolean = false;
    // private items: Array<any> = [];
    // @cc._decorator.type(cc.Layout)
    // layout!: cc.Layout;
    clear() {
        this.created = false;
        for (const item of this.items) {
            AssetPool.Instance.put(item);
        }
        this.items.length = 0;
    }
    createCard(itemData: any) {
    }
    createItem(cfg: any) {
        const path = SHOP_ITEM_PATH_ + "/" + cfg.resPrefab;
        var item = AssetPool.Instance.createObject(path)
        if (!item) {
            debugger
        }
        return item.getComponent(IUIShopListItem);
    }
    async createItems() {
        if (!this.created) {
            this.created = true;
            let shopCfgs = this.getShopCfgs();
            shopCfgs = h.sortBy(shopCfgs, (cfg) => cfg.priority);
            for (const cfg of shopCfgs) {
                await (() => {
                    return new Promise<void>((resolve, reject) => {
                        const item = this.createItem(cfg);
                        item.node.parent = this.layout.node;
                        item.setCfg(cfg.id);
                        this.items.push(item);
                        resolve();
                    });
                })();
            }
        }
    }
    getShopCfgs() {
        return [];
    }
    init(items: any[]) {
    }
    protected onEnable(): void {
    }
}
