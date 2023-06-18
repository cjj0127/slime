const { ccclass, property } = cc._decorator;
@ccclass
export default class Loading extends cc.Component {
    private static _instance: Loading = null;
    @property(cc.Node)
    _openingLoading: cc.Node = null;
    @property(cc.Prefab)
    loadingPrefab: cc.Prefab = null;
    @property(cc.NodePool)
    pool: cc.NodePool = null;
    __get(): cc.Node {
        return this.pool.size() > 0 ? this.pool.get() : this.loadingPrefab ? cc.instantiate(this.loadingPrefab) : null;
    }
    __put(node: cc.Node): void {
        if (node instanceof cc.Component)
            node = node.node;
        this.pool.put(node);
    }
    _close(): void {
        if (this._openingLoading) {
            this.__put(this._openingLoading);
            this._openingLoading = null;
        }
    }
    _open(): cc.Node {
        if (this._openingLoading)
            return this._openingLoading;
        let node = this.__get();
        if (node) {
            node.parent = this.node;
            this._openingLoading = node;
            return node;
        }
    }
    static close(): void {
        if (Loading._instance)
            Loading._instance._close();
    }
    load(callback: Function): void {
        cc.resources.load("loading", cc.Prefab, (err, prefab) => {
            if (err) {
                cc.error("load loading error", err.message);
                if (callback)
                    callback();
            }
            else {
                this.loadingPrefab = prefab;
                if (callback)
                    callback();
            }
        });
    }
    onDestroy(): void {
        if (this.loadingPrefab) {
            cc.resources.release("loading");
            this.loadingPrefab = null;
        }
        Loading._instance = null;
        this.pool.clear();
        this.pool = null;
    }
    onEnable(): void { }
    // private loadingPrefab: cc.Prefab = null;
    // private pool: cc.NodePool = new cc.NodePool();
    // private _openingLoading: cc.Node = null;
    onLoad(): void {
        Loading._instance = this;
        this.pool = new cc.NodePool();
    }
    static open(): cc.Node {
        if (Loading._instance)
            return Loading._instance._open();
    }
    static get Instance(): Loading {
        return Loading._instance;
    }
}
