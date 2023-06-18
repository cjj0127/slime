import GlobalNotifyView from "./GlobalNotifyView";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GlobalNotify extends cc.Component {
    private static _instance: GlobalNotify;
    @property(cc.NodePool)
    pool = null;
    @property(cc.Prefab)
    prefab = null;
    private __get(): cc.Node {
        return this.pool.size() > 0 ? this.pool.get() : this.prefab ? cc.instantiate(this.prefab) : null;
    }
    private __put(e: cc.Node): void {
        if (e instanceof cc.Component) {
            e = e.node;
        }
        this.pool.put(e);
    }
    private _open(e: any): void {
        let t = this;
        let n = this.__get();
        if (n) {
            n.parent = Model.ui.root(0);
            n.once("remove", function (e: any): void {
                if (e instanceof cc.Component) {
                    e = e.node;
                }
                t.__put(e);
            });
            n.getComponent(GlobalNotifyView).play(e);
        }
    }
    public load(e: Function): void {
        cc.resources.load("GlobalNotify", cc.Prefab, function (n: Error, o: cc.Prefab): void {
            if (n) {
                cc.error("load loading error", n.message);
                e && e();
                return;
            }
            this.prefab = o;
            e && e();
        });
    }
    public onDestroy(): void {
        if (this.prefab) {
            cc.resources.release("loading");
            this.prefab = null;
        }
        GlobalNotify._instance = null;
        this.pool.clear();
        this.pool = null;
    }
    // private prefab: cc.Prefab;
    // private pool: cc.NodePool;
    public onLoad(): void {
        GlobalNotify._instance = this;
        this.pool = new cc.NodePool();
    }
    public static open(e: any): void {
        if (GlobalNotify._instance) {
            GlobalNotify._instance._open(e);
        }
    }
    static get Instance() {
        return this._instance;
    }
}
