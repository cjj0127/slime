const { ccclass, property } = cc._decorator;
@ccclass()
export default class UIPool extends cc.Component {
    protected _nodes: cc.Node[] = [];
    protected _pool: cc.NodePool = new cc.NodePool();
    @property({ type: cc.Prefab })
    prefab: cc.Prefab = null;
    clear() {
        this._nodes.forEach(node => {
            this._pool.put(node);
        });
        this._nodes.length = 0;
    }
    get(): cc.Node {
        let node: cc.Node;
        if (this._pool.size() > 0) {
            node = this._pool.get();
        }
        else {
            node = cc.instantiate(this.prefab);
        }
        this._nodes.push(node);
        return node;
    }
    onDestroy() {
        this._pool.clear();
        this._pool = null;
        this._nodes.length = 0;
    }
    put(node: cc.Node | cc.Component) {
        if (node instanceof cc.Component) {
            node = node.node;
        }
        const index = this._nodes.indexOf(node);
        if (index >= 0) {
            this._nodes.splice(index, 1);
        }
        this._pool.put(node);
    }
    reuse(e) {
    }
}
