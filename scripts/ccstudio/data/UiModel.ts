import AsyncQueueTool from "../utils/AsyncQueueTool";
import GuideUI from "../../modules/guide/GuideUI";
import ModeBase from "./ModelBase";
import UIBase from "../../modules/common/UIBase";
import { GlobalEventName } from "../../modules/common/Events";
import { MapUIPrefabs } from "../../modules/common/Const";
import { NAMES_BUNDLE } from "../../modules/asset/AssetRes";
import AssetPool from "../../modules/asset/AssetPool";
export const BUNDLE_RESOURCES = "resources";
const _: any = window["_"];
export default class UiModel extends ModeBase {
    beChangeQueue = false;
    hasQueueView = false;
    onBeforeSceneLoading = async function (): Promise<void> {
        this.viewList.length = 0;
        AssetPool.Instance.clear();
        AssetPool.Instance.clearPrefabs();
        const e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.GuideUI.path);
        if (e) {
            this._guideUI = e.getComponent(GuideUI);
            this.node.addChild(this._guideUI.node);
            this._guideUI.node.active = false;
        }
    };
    viewList = [];
    viewQueus = new AsyncQueueTool();
    _addView(e, t, n?, o?): any {
        t.parent = n || this.root(o);
        t.active = true;
        t.__url__ = e;
        const r = t.getComponentsInChildren(UIBase);
        _.each(r, function (e) {
            e.onGlobalEvent();
        });
        this.viewList.push(t);
        t.once("remove", (e) => {
            if (e) {
                e instanceof cc.Component && (e = e.node);
                const t = _.findIndex(this.viewList, e);
                if (t >= 0) {
                    _.pullAt(this.viewList, [t]);
                }
                this._removeView(e);
            }
            else {
                cc.error("remove target is null");
            }
        });
        return t;
    }
    _removeView(e): void {
        e.emit("removed", e);
        e.targetOff(this);
        const t = e.getComponentsInChildren(UIBase);
        _.each(t, function (e) {
            e.offGlobalEvents();
        });
        AssetPool.Instance.put(e);
    }
    addViewAsyncQueue(e, t = null): void {
        this.viewQueus.push((o) => {
            const reqView = async () => {
                let n;
                this.hasQueueView = true;
                if (e.preload) {
                    n = this.openView(e, t);
                }
                else {
                    n = await this.openViewAsync(e, t);
                }
                if (t && t.callback) {
                    t.callback(n);
                }
                n.once("removed", () => {
                    this.hasQueueView = false;
                    o();
                });
            };
            reqView();
        });
        this.beChangeQueue = true;
    }
    closeAll(): void {
        const e = this;
        _.each(this.viewList, function (t) {
            e._removeView(t);
        });
        this.viewList.length = 0;
        cc.director.emit(GlobalEventName.CloseAllView);
    }
    public closeView(e: string | cc.Component): void {
        if (typeof e == 'string') {
            const n = [];
            _.each(this.viewList, (o, r) => {
                if (o.__url__ == e) {
                    this._removeView(o);
                    n.push(r);
                }
            });
            _.pullAt(this.viewList, n);
        }
        else {
            let o: any = e;
            if (o instanceof cc.Component) {
                o = o.node;
            }
            o.emit('remove', o);
            const r = _.findIndex(this.viewList, o);
            if (r >= 0) {
                _.pullAt(this.viewList, [r]);
            }
        }
    }
    public getOpenView(e: string): any {
        let t = false;
        let n = null;
        _.each(this.viewList, function (o) {
            if (o.__url__ == e) {
                t = true;
                n = o;
            }
        });
        return t ? n : null;
    }
    getView(e): any {
        return _.find(this.viewList, function (t) {
            return t.__url__ == e;
        });
    }
    initLoadData(): void {
        cc.director.on(GlobalEventName.LaunchSceneBefore, this.onBeforeSceneLoading, this);
    }
    public lateUpdate(): void {
        if (this.beChangeQueue && !this.hasQueueView) {
            this.startQueus();
        }
    }
    onDestroy(): void {
        cc.director.targetOff(this);
    }
    public openView(e: {
        path: string;
        viewComp?: string;
        preload?: boolean;
    }, data?: any): cc.Node {
        console.log("打开UI", e);
        const path = e.path;
        const viewComp = e.viewComp || (data?.viewComp);
        const r = data?.data;
        const root = data?.root;
        const priority = data?.priority;
        const type = data?.type;
        const callback = data?.callback;
        const pool = AssetPool.Instance.getPool(path);
        if (!pool) {
            AssetPool.Instance.createPool(path, viewComp);
        }
        let u = AssetPool.Instance.get(path, r);
        if (!u) {
            u = AssetPool.Instance.createObject(path);
            if (!u) {
                cc.error(`无法创建资源。资源未提前加载：${path}`);
                return;
            }
            const p = pool.poolHandlerComp;
            if (p) {
                const f = u.getComponent(p);
                if (f && f.reuse) {
                    f.reuse(r);
                }
                if (f && f.setType) {
                    f.setType(type);
                }
            }
        }
        this._addView(path, u, root, priority);
        if (callback) {
            callback(u);
        }
        return u;
    }
    public async openViewAsync(e: any, t?: any): Promise<any> {
        console.log("打开UI", e);
        const n = e.path;
        const o = e.viewComp || (t?.viewComp);
        const r = t?.data;
        const i = t?.root;
        const c = t?.priority;
        const l = t?.type;
        const u = t?.callback;
        const p = (t?.bundle) || NAMES_BUNDLE.Game;
        const result: any = await new Promise(async (resolve) => {
            let view = AssetPool.Instance.get(n, r, o) as any;
            if (!view) {
                view = await AssetPool.Instance.createObjAsync(p, n, o);
            }
            if (o) {
                const component = view.getComponent(o) as any;
                if (component && component.reuse) {
                    component.reuse(r);
                }
                if (component && component.setType) {
                    component.setType(l);
                }
            }
            this._addView(n, view, i, c);
            if (u) {
                u(view);
            }
            resolve(view);
        });
        return result;
    }
    root(e: number = 2): cc.Node {
        let t = cc.find(`Canvas/game/priority${e}`);
        if (_.isNil(t)) {
            t = cc.find("Canvas");
        }
        return t;
    }
    public setViewAsyncComplete(callback: Function): void {
        if (this.viewQueus.size > 0) {
            this.viewQueus.complete = callback;
        }
        else if (callback) {
            callback();
        }
    }
    // private beChangeQueue: boolean;
    // private viewQueus: any;
    // private viewList: any[];
    public startQueus(): void {
        this.viewQueus.play();
        this.beChangeQueue = false;
    }
}
