import { ManagerBundle } from "./BundleMgr";
import AssetManager from "../asset/AssetManager";
import CacheInfo from "../asset/AssetRes";
export enum eCacheStatus {
    UNKNOWN = "UNKNOWN"
}
export class Cache {
    private _caches: Map<string, CacheInfo> = new Map();
    public name: string = eCacheStatus.UNKNOWN;
    get(key: string, checkValid: boolean): CacheInfo | null {
        if (this._caches.has(key)) {
            const cache = this._caches.get(key);
            if (checkValid && cache && cache.isInValid) {
                this.remove(key);
                return null;
            }
            return cache;
        }
        return null;
    }
    print() {
        this._caches.forEach(() => { });
    }
    remove(key: string): boolean {
        return this._caches.delete(key);
    }
    removeUnuseCaches() {
        this._caches.forEach((cache, key) => {
            if (Array.isArray(cache.assets)) {
                let shouldRemove = true;
                for (let i = 0; i < cache.assets.length; i++) {
                    if (cache.assets[i] && cache.assets[i].refCount > 0) {
                        shouldRemove = false;
                        break;
                    }
                }
                if (shouldRemove) {
                    this._caches.delete(key);
                }
            }
            else if (cache.assets && cache.assets.refCount <= 0) {
                this._caches.delete(key);
            }
        });
    }
    set(key: string, value: CacheInfo) {
        this._caches.set(key, value);
    }
    constructor(name: string) {
        this.name = name;
    }
    get size(): number {
        return this._caches.size;
    }
}
export class AssetCache {
    private _caches: Map<string, CacheInfo> = new Map();
    private _resMap: Map<string, CacheInfo> = new Map();
    private _spriteFrameCaches: Map<string, CacheInfo> = new Map();
    public get(e: string): CacheInfo | null {
        return this._caches.has(e) ? this._caches.get(e) : null;
    }
    public getCacheInfo(e: string): CacheInfo {
        if (!this._resMap.has(e)) {
            const cacheInfo = new CacheInfo();
            cacheInfo.setResInfo(e);
            this._resMap.set(e, cacheInfo);
        }
        return this._resMap.get(e) as CacheInfo;
    }
    public getSpriteFrame(e: string): CacheInfo | null {
        if (this._spriteFrameCaches.has(e)) {
            const cache = this._spriteFrameCaches.get(e);
            return this.get(e) ? cache : (this.remove(e), null);
        }
        return null;
    }
    public print(): void {
        this._spriteFrameCaches.forEach(() => { });
        this._caches.forEach(() => { });
        this._resMap.forEach(() => { });
    }
    public releaseAsset(e: string): void {
        const cache = this._caches.has(e) ? this._caches.get(e) : null;
        if (cache && cache.assets) {
            if (cache.retain) {
                return;
            }
            cache.assets.decRef();
            if (cache.assets.refCount <= 0) {
                this.remove(cache.resInfo.path);
            }
        }
    }
    public remove(e: string): boolean {
        this._resMap.delete(e);
        if (this._spriteFrameCaches.has(e)) {
            const cache = this._spriteFrameCaches.get(e);
            cache.assets.decRef();
            this._spriteFrameCaches.delete(e);
        }
        const cache = this._caches.has(e) ? this._caches.get(e) : null;
        if (cache && cache.assets instanceof cc.Asset) {
            cache.assets.decRef();
            cc.assetManager.releaseAsset(cache.assets);
        }
        const deleted = this._caches.delete(e);
        return deleted;
    }
    public retainAsset(e: string): void {
        const cacheInfo = this.getCacheInfo(e);
        if (cacheInfo && cacheInfo.assets) {
            cacheInfo.retain = true;
            cacheInfo.assets.addRef();
        }
    }
    public set(e: string, t: CacheInfo): void {
        t.resInfo.path = e;
        this._caches.set(e, t);
    }
    public setSpriteFrame(e: string, t: cc.Texture2D): cc.SpriteFrame | null {
        if (t instanceof cc.Texture2D) {
            const cache = this.getSpriteFrame(e);
            if (cache) {
                return cache.assets as cc.SpriteFrame;
            }
            const cacheInfo = new CacheInfo();
            cacheInfo.assets = new cc.SpriteFrame(t);
            cacheInfo.isLoaded = true;
            cacheInfo.setResInfo(e, cc.SpriteFrame);
            this._spriteFrameCaches.set(e, cacheInfo);
            return cacheInfo.assets as cc.SpriteFrame;
        }
        return null;
    }
}
export default class CacheMgr {
    private _bundles: Map<string, Cache> = new Map();
    private static _instance: CacheMgr = null;
    private _remoteCaches: AssetCache = new AssetCache();
    private _removeUnuseCaches(): void {
        this._bundles.forEach(function (e) {
            e && e.removeUnuseCaches();
        });
    }
    //     e.prototype.get = function(e, t, n) {
    //         void 0 == n && (n = !0);
    //         var o = s.BundleMgr.Instance.getBundleName(e);
    //         return o && this._bundles.has(o) ? this._bundles.get(o).get(t, n) : null
    //     },
    //     e.prototype.set = function(e, t, n) {
    //         var o = s.BundleMgr.Instance.getBundleName(e);
    //         if (o) if (this._bundles.has(o)) this._bundles.get(o).set(t, n);
    //         else {
    //             var r = new l(o);
    //             r.set(t, n),
    //             this._bundles.set(o, r)
    //         }
    //     },
    public get(e: string, t: any, n: boolean = true): CacheInfo {
        const o = ManagerBundle.Instance.getBName(e);
        return o && this._bundles.has(o) ? this._bundles.get(o).get(t, n) : null;
    }
    public getCacheAsset(path: string, type: any, bundleName: string) {
        return new Promise((resolve) => {
            const cache = this.get(bundleName, path);
            cache.isLoaded
                ? cache.assets instanceof type
                    ? resolve(cache.assets)
                    : resolve(null)
                : cache.handlers.push(resolve);
        });
    }
    public getCacheAssetByAsync(path: string, type: any, bundleName: string) {
        return new Promise((resolve) => {
            (async () => {
                const cache = await this.getCacheAsset(path, type, bundleName);
                if (cache && cache instanceof type) {
                    resolve(cache);
                }
                else {
                    AssetManager.Instance.load(bundleName, path, type, null, (asset) => {
                        if (asset && asset.assets && asset.assets instanceof type) {
                            resolve(asset.assets);
                        }
                        else {
                            cc.error(`加载 ${path} 失败`);
                            resolve(null);
                        }
                    });
                }
            })();
        });
    }
    public async getSpriteFrameByAsync(path: string, bundleName: string) {
        return new Promise((resolve) => {
            (async () => {
                const spriteFrame = await this.getCacheAssetByAsync(path, cc.SpriteFrame, bundleName) as cc.SpriteFrame;
                if (spriteFrame && cc.isValid(spriteFrame)) {
                    resolve({ path, spriteFrame });
                }
                else {
                    const cacheInfo = new CacheInfo();
                    cacheInfo.setResInfo(path, cc.SpriteFrame, bundleName);
                    cacheInfo.assets = spriteFrame;
                    AssetManager.Instance.releaseCache(cacheInfo);
                    resolve({ path, spriteFrame: null, isTryReload: true });
                }
            })();
        });
    }
    public print(): void {
        this._bundles.forEach(function (e) {
            e.print();
        });
        this.remoteCachs.print();
    }
    public remove(e: string, t: any): boolean {
        const n = ManagerBundle.Instance.getBName(e);
        return !(!n || !this._bundles.has(n)) && this._bundles.get(n).remove(t);
    }
    public removeBundle(e: string): void {
        const t = ManagerBundle.Instance.getBName(e);
        if (t && this._bundles.has(t)) {
            this._bundles.delete(t);
        }
    }
    public removeWithResInfo(e: CacheInfo): boolean {
        if (!e || !e.assets) {
            return false;
        }
        if (Array.isArray(e.assets)) {
            let isAllZeroRefCount = true;
            for (let i = 0; i < e.assets.length; i++) {
                e.assets[i].decRef(false);
                if (e.assets[i].refCount > 0) {
                    isAllZeroRefCount = false;
                    break;
                }
            }
            if (isAllZeroRefCount) {
                this.remove(e.resInfo.bundle, e.resInfo.path);
                return true;
            }
        }
        else if (e.assets.decRef(false), e.assets.refCount == 0) {
            this.remove(e.resInfo.bundle, e.resInfo.path);
            return true;
        }
        return false;
    }
    public set(e: string, t: any, n: any): void {
        const o = ManagerBundle.Instance.getBName(e);
        if (o) {
            if (this._bundles.has(o)) {
                this._bundles.get(o).set(t, n);
            }
            else {
                const r = new Cache(o);
                r.set(t, n);
                this._bundles.set(o, r);
            }
        }
    }
    public static get Instance(): CacheMgr {
        return this._instance || (this._instance = new CacheMgr());
    }
    public get remoteCachs(): AssetCache {
        return this._remoteCaches;
    }
}
