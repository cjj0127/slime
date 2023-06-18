import { NAMES_BUNDLE } from "./AssetRes";
import AssetManager from "./AssetManager";
import { GlobalEventName } from "../common/Events";
import { IMAGE_ICON_PATH_ } from "../common/Const";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import Model from "../../ccstudio/data/Model";
import PoolUI from "../common/UIPool";
import Utils_ from "../../ccstudio/utils/Utils";
const { ccclass, property } = cc._decorator;
// import { UIPool } from 'UIPool';
const y: any = window["_"];
@ccclass
export class AssetFlyViewUI extends PoolUI {
    static _instance: AssetFlyViewUI = null;
    receiveNodes = {};
    addAsset(e, t, n) {
        const o = n.callback;
        if (y.isNil(n.priority))
            n.priority = 2;
        const r = this.receiveNodes[e];
        if (y.isNil(r)) {
            cc.error("获得物品飞行节点不存在");
            if (o)
                o();
            return;
        }
        this.playFly(e, t, n, r);
    }
    addOtherAsset(e, t, n) {
        const o = n.callback;
        if (y.isNil(n.priority))
            n.priority = 2;
        if (e < 1e4) {
            if (o)
                o();
            return;
        }
        else {
            const r = _AssetConfig.Instance.get(e);
            if (r == null) {
                cc.error("获得物品飞行节点不存在");
                if (o)
                    o();
                return;
            }
            const i = 1e4 + r.type;
            const a = this.receiveNodes[i];
            if (y.isNil(a)) {
                cc.error("获得物品飞行节点不存在");
                if (o)
                    o();
                return;
            }
            this.playFly(e, t, n, a);
        }
    }
    onLoad() {
        AssetFlyViewUI._instance = this;
    }
    playFly(e, t, n, o) {
        const r = this;
        let i = n.sourcePos;
        const d = n.priority;
        const h = n.callback;
        const g = o.label;
        const v = o.worldPosition;
        if (y.isNil(i)) {
            cc.error("sourcePos is nil !!请传入飞奖励的起点坐标");
            i = cc.find("Canvas").convertToWorldSpaceAR(cc.Vec3.ZERO);
        }
        const _ = _AssetConfig.Instance.get(e);
        const m = IMAGE_ICON_PATH_ + "/" + _.icon;
        const b = y.isNil(n.flyCnt) ? Math.min(y.toNumber(t), 10) : n.flyCnt;
        const I = this.node.convertToNodeSpaceAR(i);
        const C = this.node.convertToNodeSpaceAR(v);
        var P = (e) => {
            const t = this.get();
            t.parent = Model.ui.root(d);
            t.getComponent(cc.Sprite).spriteFrame =
                AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, m);
            t.stopAllActions();
            t.scale = 0;
            t.position = I;
            const n = I.x + Utils_.getRandomRange(-80, 80);
            const o = I.y + Utils_.getRandomRange(-80, 80);
            cc.tween(t).delay(0.02 * e).to(0.2, { scale: 1, position: cc.v3(n, o, 0), })
                .delay(0.02)
                .to(0.4, { position: C, }, { easing: cc.easing.quadIn, })
                .call(() => {
                r.put(t);
            })
                .start();
        };
        for (let A = 0; A < b; A++) {
            P(A);
        }
        this.scheduleOnce(() => {
            if (g && cc.isValid(g)) {
                g.playBy(t, 0.15, () => {
                    if (h)
                        h();
                    cc.director.emit(GlobalEventName.AssetItemChange + e);
                });
            }
            else {
                if (h)
                    h();
                cc.director.emit(GlobalEventName.AssetItemChange + e);
            }
        }, 0.62);
    }
    register(e, t, n) {
        const o = this.receiveNodes[e];
        if (o) {
            o.worldPosition = t;
            o.label = n;
        }
        else {
            this.receiveNodes[e] = {
                worldPosition: t,
                label: n,
            };
        }
    }
    unregister(e) {
        const t = this.receiveNodes[e];
        if (t) {
            t.label = null;
        }
    }
    static get Instance() {
        return AssetFlyViewUI._instance;
    }
}
