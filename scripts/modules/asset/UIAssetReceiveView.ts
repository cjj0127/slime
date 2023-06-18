import { MapUIPrefabs } from "../common/Const";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import UIAssetReceiveItem from "./UIAssetReceiveItem";
import UIPool from "../common/UIPool";
import UserData from "../user/UserData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIAssetReceiveView extends UIPool {
    private _touchCloseEnable: boolean = false;
    @property(cc.Node)
    closeTip: cc.Node = null;
    itemDatas: any = null;
    itemType: string = "";
    @property(cc.Layout)
    layout: cc.Layout = null;
    @property()
    layoutOriginHeight: number = 0;
    @property()
    layoutOriginWidth: number = 0;
    @property(cc.Node)
    skinNode: cc.Node = null;
    onDisable(): void {
        this.clear();
    }
    onEnable(): void {
        this.playSkinAnim();
        this.touchCloseEnable = false;
        if (this.itemDatas.length < 5) {
            this.layout.type = cc.Layout.Type.HORIZONTAL;
            this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        else {
            this.layout.type = cc.Layout.Type.GRID;
            this.layout.node.width = this.layoutOriginWidth;
        }
        this.itemDatas.forEach((t) => {
            const n = this.get();
            this.layout.node.addChild(n);
            n.getComponent(UIAssetReceiveItem).setItemData(t.id, t.count, t.name);
        });
        this.node.stopAllActions();
        this.closeTip.stopAllActions();
        cc.tween(this.node)
            .delay(0.6)
            .call(() => {
            cc.tween(this.closeTip)
                .to(0.12, { opacity: 155, scale: 1 })
                .call(() => {
                this.touchCloseEnable = true;
            })
                .start();
        })
            .start();
    }
    onLoad(): void {
        const background = this.node.getChildByName("background");
        background.on(cc.Node.EventType.TOUCH_START, this.onTouchBackgroundStart, this);
        //@ts-ignore
        background._touchListener.swallowTouches = false;
        this.layoutOriginWidth = this.layout.node.width;
        this.layoutOriginHeight = this.layout.node.height;
    }
    private onTouchBackgroundStart(): void {
        if (this.touchCloseEnable) {
            this.itemDatas.forEach((t, n) => {
                const o = this._nodes[n].convertToWorldSpaceAR(cc.v3(0, 0, 0));
                UserData.Instance.flyAddItem(t.id, t.count, { sourcePos: o, type: this.itemType });
            });
            this.node.emit("Close");
        }
    }
    static async open(e: any[], t: string): Promise<any> {
        return (await Model.ui.openViewAsync(MapUIPrefabs.AssetReceiveView, { data: e })).getComponent(UIAssetReceiveView).setType(t);
    }
    public playSkinAnim(): void {
        this.skinNode.stopAllActions();
        cc.tween(this.skinNode)
            .by(5, { angle: 360 })
            .repeatForever()
            .start();
    }
    // private itemDatas: any[];
    // private itemType: string;
    // private layout: cc.Layout;
    // private closeTip: cc.Node;
    // private skinNode: cc.Node;
    // private layoutOriginWidth: number;
    // private layoutOriginHeight: number;
    // private touchCloseEnable: boolean;
    public reuse(e: any[]): void {
        this.itemDatas = e;
    }
    public setType(e: string): void {
        this.itemType = e;
    }
    get touchCloseEnable(): boolean {
        return this._touchCloseEnable;
    }
    set touchCloseEnable(value: boolean) {
        this._touchCloseEnable = value;
        this.closeTip.active = value;
    }
}
// __decorate([g(cc.Layout)], t.prototype, "layout", void 0);
// __decorate([g(cc.Node)], t.prototype, "closeTip", void 0);
// __decorate([g(cc.Node)], t.prototype, "skinNode", void 0);
// t = __decorate([h], t);
// export default t;
