import CacheMgr from "./CacheMgr";
export class ManagerBundle {
    private static _instance: ManagerBundle = null;
    public getBundle(e?: string | cc.AssetManager.Bundle): cc.AssetManager.Bundle | null {
        return e ?
            typeof e == "string" ? cc.assetManager.getBundle(e) : e :
            null;
    }
    public getBName(e: string | cc.AssetManager.Bundle): string {
        return e ? typeof e == "string" ? e : e.name : (cc.error("参数错误:" + e), "");
    }
    public isEngine(e: any): boolean {
        return (e == cc.AssetManager.BuiltinBundleName.INTERNAL ||
            e == cc.AssetManager.BuiltinBundleName.MAIN ||
            e == cc.AssetManager.BuiltinBundleName.RESOURCES ||
            e == cc.AssetManager.BuiltinBundleName.START_SCENE);
    }
    public loadBundle_(e: string, t?: (bundle: cc.AssetManager.Bundle) => void): void {
        const n = this.getBundle(e);
        n ?
            t && t(n) :
            cc.assetManager.loadBundle(e, {
                onFileProgress: () => { },
            }, function (e, n) {
                t && t(n);
            });
    }
    public loadBundleAsync(e: string): Promise<cc.AssetManager.Bundle> {
        return new Promise((resolve) => {
            const o = this.getBundle(e);
            o ? resolve(o) :
                cc.assetManager.loadBundle(e, function (e, t) {
                    resolve(t);
                });
        });
    }
    public removeBundle_(e: any): void {
        CacheMgr.Instance.removeBundle(e);
        const t = this.getBundle(e);
        t && t.releaseAll();
    }
    public removeLoadedBundle(e: Array<string> = []): void {
        const n: Array<string> = [];
        cc.assetManager.bundles.forEach((e, o) => {
            this.isEngine(o) || n.push(o);
        });
        for (let o = n.length; o--;) {
            const r = n[o];
            if (e.indexOf(r) == -1) {
                const i = this.getBundle(r);
                i && (this.removeBundle_(i), cc.assetManager.removeBundle(i));
            }
        }
    }
    public static get Instance(): ManagerBundle {
        return this._instance || (this._instance = new ManagerBundle());
    }
}
