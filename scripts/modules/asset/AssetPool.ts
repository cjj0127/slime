import { NAMES_BUNDLE } from "./AssetRes";
import AssetManager from "./AssetManager";
export default class AssetPool {
    // pools: Map<any, any>;
    // prefabs: Map<any, any>;
    // constructor() {
    //     this.pools = new Map();
    //     this.prefabs = new Map();
    // }
    private static instance: AssetPool;
    private pools: Map<string, cc.NodePool> = new Map();
    private prefabs: Map<string, cc.Prefab> = new Map();
    public addPrefab(prefab: cc.Prefab, name: string, num?: number) {
        prefab.addRef();
        this.pools.has(name) || this.createPool(name, num);
        this.getPool(name).put(cc.instantiate(prefab));
        this.prefabs.set(name, prefab);
    }
    public clear(name?: string) {
        if (name == undefined) {
            this.pools.forEach((pool, name) => {
                pool.clear();
                const bundleName = NAMES_BUNDLE.Game;
                AssetManager.Instance.releaseBundleRes(bundleName, name);
            });
        }
        else {
            const pool = this.getPool(name);
            if (pool) {
                pool.clear();
            }
        }
    }
    public clearPrefabs() {
        this.prefabs.forEach((prefab, name) => {
            prefab.decRef();
            const pool = this.pools.get(name);
            if (pool) {
                pool.clear();
                this.pools.delete(name);
            }
        });
        this.prefabs.clear();
    }
    public async createObjAsync(url: string, name: string, num?: number): Promise<cc.Node> {
        let prefab = this.getPrefab(name);
        if (!prefab) {
            prefab = await AssetManager.Instance.loadPrefabAsync(url, name) as cc.Prefab;
            this.addPrefab(prefab, name, num);
        }
        return this.createObjWithPrefab(prefab, name);
    }
    public createObjWithPrefab(prefab: cc.Prefab, name: string): cc.Node {
        const node = cc.instantiate(prefab);
        node['__pool__'] = name;
        return node;
    }
    // public createObject(name: any): cc.Node | null {
    //     const pool = this.getPool(name);
    //     if (pool.size() > 0) {
    //         const node = pool.get();
    //         node['__pool__'] = name;
    //         return node;
    //     }
    //     const prefab = this.getPrefab(name);
    //     if (prefab) {
    //         cc.warn(" createObject pool is empty, createObjWithPrefab", name);
    //         return this.createObjWithPrefab(prefab, name);
    //     } else {
    //         cc.warn("Can't createObject prefab is null", name);
    //         return null;
    //     }
    // }
    createObject(name: string) {
        const t = this.get(name);
        if (t)
            return t;
        const n = this.getPrefab(name);
        if (n) {
            cc.warn(" createObject pool is empty, createObjWithPrefab", name);
            return this.createObjWithPrefab(n, name);
        }
        else {
            cc.warn("Can't createObject prefab is null", name);
            return null;
        }
    }
    createPool(name: string, num: number = 0) {
        console.log("创建对象池", name);
        const nodePool = new cc.NodePool();
        this.pools.set(name, nodePool);
        return nodePool;
    }
    get(url: string, t = null, num = null) {
        var o = this.getPool(url, num), r = null;
        return o.size() > 0 && ((r = o.get(t))['__pool__'] = url), r;
    }
    public getPool(name: string, num?: number): cc.NodePool {
        let nodePool = this.pools.get(name);
        if (!nodePool) {
            nodePool = this.createPool(name, num);
        }
        return nodePool;
    }
    public getPrefab(name: string): cc.Prefab | undefined {
        return this.prefabs.get(name);
    }
    public put(node: cc.Node | cc.Component) {
        if (node instanceof cc.Component) {
            node = node.node;
        }
        const poolName = node['__pool__'];
        if (poolName) {
            const pool = this.getPool(poolName);
            if (pool) {
                pool.put(node);
            }
        }
    }
    public removePool(name: string) {
        if (this.pools.has(name)) {
            this.pools.delete(name);
        }
    }
    // public removePrefab(name: string) {
    //     const prefab = this.prefabs.get(name);
    //     if (prefab) {
    //         prefab.decRef();
    //         this.prefabs.delete(name);
    //     }
    //     const pool = this.pools.get(name);
    //     if (pool) {
    //         pool.clear();
    //         this.pools.delete(name);
    //     }
    // }
    static get Instance() {
        if (!this.instance) {
            this.instance = new AssetPool();
        }
        return this.instance;
    }
    ;
}
