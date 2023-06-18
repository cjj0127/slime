import UIAssetReceiveItem from "./UIAssetReceiveItem";
import UIPool from "../common/UIPool";
import UserData, { AssetGetType } from "../user/UserData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class AssetCompensationUI extends UIPool {
    @property(cc.Button)
    btnReceive: cc.Button = null;
    @property(Array)
    itemDatas: any[] = null;
    @property(cc.Layout)
    layout: cc.Layout = null;
    @property()
    message: string = "";
    @property(cc.Label)
    messageLabel: cc.Label = null;
    received: boolean = false;
    @property()
    title: string = "";
    @property(cc.Label)
    titleLabel: cc.Label = null;
    onClickReceive() {
        if (!this.received) {
            this.receive();
            this.received = true;
        }
        this.node.emit("Close");
    }
    onDisable() {
        if (!this.received) {
            this.receive();
            this.received = true;
        }
    }
    onEnable() {
        this.messageLabel.string = this.message;
        this.titleLabel.string = this.title;
        this.itemDatas.forEach(t => {
            let n = this.get();
            this.layout.node.addChild(n);
            n.getComponent(UIAssetReceiveItem).setItemData(t.id, t.count, t.name);
        });
    }
    onLoad() {
        this.btnReceive.node.on("click", this.onClickReceive.bind(this));
    }
    receive() {
        this.itemDatas.forEach((t, n) => {
            let o = this._nodes[n].convertToWorldSpaceAR(cc.Vec3.ZERO);
            UserData.Instance.addItem(t.id, t.count, {
                sourcePos: o,
                type: AssetGetType.Compensation
            });
        });
    }
    public reuse(e: {
        title: string;
        message: string;
        itemDatas: {
            id: number;
            count: number;
            name: string;
        }[];
    }) {
        this.title = e.title;
        this.message = e.message;
        this.itemDatas = e.itemDatas;
        this.received = false;
    }
    constructor() {
        super();
        this.title = "";
        this.message = "";
        this.itemDatas = [];
        this.received = false;
    }
}
