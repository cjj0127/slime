import ToastView from "./ToastView";
import UIPool from "./UIPool";
// import ToastView from 'ToastView';
const { ccclass, property } = cc._decorator;
@ccclass
export default class MsgHint extends UIPool {
    private static _instance: MsgHint;
    static lastMessage = "";
    prefab: cc.Prefab;
    private _close(e: cc.Node) {
        MsgHint.lastMessage = "";
        e.emit("removed");
        this.put(e);
    }
    private _open() {
        const node = this.get();
        if (node) {
            node.parent = this.node;
            node.once("remove", (t) => {
                if (t && cc.isValid(t.node)) {
                    this._close(t.node);
                }
            });
            return node.getComponent(ToastView);
        }
        else {
            return null;
        }
        // return t ? (
        //     t.parent = this.node,
        //     t.once("remove", (t) => {
        //         if (t && cc.isValid(t.node)) {
        //             this._close(t.node);
        //         }
        //     }),
        //     t.getComponent(MsgHint)
        // ) : null;
    }
    static close(e: cc.Node) {
        MsgHint._instance._close(e);
    }
    static closeAll() {
        MsgHint._instance.node.getComponentsInChildren(MsgHint).forEach(e => MsgHint.close(e.node));
    }
    static error(e: string) {
        if (MsgHint.lastMessage != e) {
            MsgHint.lastMessage = e;
            const t = MsgHint._instance._open();
            t.error(e);
            return t;
        }
    }
    load(e: Function) {
        cc.resources.load("ToastView", cc.Prefab, (n, o) => {
            if (n) {
                cc.error("load ToastView error", n.message);
                if (e)
                    e();
            }
            else {
                this.prefab = o;
                if (e)
                    e();
            }
        });
    }
    onDestroy() {
        MsgHint._instance = null;
        if (this.prefab) {
            cc.resources.release("ToastView");
            this.prefab = null;
        }
        super.onDestroy();
    }
    onLoad() {
        MsgHint._instance = this;
    }
    static tip(msg: string) {
        if (MsgHint.lastMessage != msg) {
            MsgHint.lastMessage = msg;
            const t = MsgHint._instance._open();
            t.tip(msg);
            return t;
        }
    }
    static warn(e: string) {
        if (MsgHint.lastMessage != e) {
            MsgHint.lastMessage = e;
            const t = MsgHint._instance._open();
            t.warn(e);
            return t;
        }
    }
    static get Instance() {
        return MsgHint._instance;
    }
}
