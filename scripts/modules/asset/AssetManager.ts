import CacheInfo, { ECacheStatus, EResourceType } from "./AssetRes";
import CacheMgr from "../common/CacheMgr";
import { ManagerBundle } from "../common/BundleMgr";
export default class AssetManager {
    private static _instance: AssetManager = null;
    // _loadRemoteRes = function (e, t) {
    //     return new Promise(function (resolve) {
    //         let o = CacheMgr.Instance.remoteCachs.get(e);
    //         if (o) {
    //             if (o.isLoaded) {
    //                 resolve(o.assets);
    //             }
    //             else {
    //                 o.handlers.push(resolve);
    //             }
    //         }
    //         else {
    //             o = new CacheInfo();
    //             o.resInfo.resourceType = EResourceType.Remote;
    //             o.resInfo.type = t;
    //             CacheMgr.Instance.remoteCachs.set(e, o);
    //             o.status = ECacheStatus.Loading;
    //             cc.assetManager.loadRemote(e, function (e, t) {
    //                 if (t) {
    //                     t.addRef();
    //                     o.isLoaded = true;
    //                     o.status = ECacheStatus.Loaded;
    //                     o.assets = t;
    //                 }
    //                 o.doHanlder();
    //                 resolve(o.assets);
    //             });
    //         }
    //     });
    // };
    _onLoadComplete = (c: CacheInfo, t: any, n: any, o: any) => {
        if (n) {
            cc.error(`加载资源失败: ${c.resInfo.path} reason: ${n.message ? n.message : 'unknow'}`);
            c.assets = null;
            CacheMgr.Instance.remove(c.resInfo.bundle, c.resInfo.path);
            if (t) {
                t(c);
            }
        }
        else {
            c.assets = o;
            if (t) {
                t(c);
            }
        }
        c.doHanlder();
        if (c.status == ECacheStatus.WAITTING_FOR_RELEASE) {
            c.status = ECacheStatus.NONE;
            if (c.assets) {
                this.releaseCache(c);
            }
        }
        else {
            c.status = ECacheStatus.Loaded;
            c.isLoaded = true;
        }
    };
    // addPersistAsset = (e, t) => {
    //     const n = CacheMgr.Instance.get(t, e);
    //     if (n) {
    //         n.retain = true;
    //         if (Array.isArray(n.assets)) {
    //             for (let o = 0; o < n.assets.length; o++) {
    //                 const r = n.assets[o];
    //                 r && r.addRef();
    //             }
    //         }
    //         else {
    //             n.assets.addRef();
    //         }
    //     }
    //     else {
    //         cc.error("addPersistAsset cache is null");
    //     }
    // };
    // getDirAssetAsync = async function (t, n, o, r) {
    //     return new Promise(async (c, l) => {
    //         const u = n + "/_dir_" + o;
    //         let p = CacheMgr.Instance.get(t, u);
    //         if (p) {
    //             c(p.assets);
    //         }
    //         else {
    //             await this.loadDir(t, n, r, null, (o: CacheInfo) => {
    //                 if (o && o.assets) {
    //                     this.retainAsset(n, t);
    //                     if (Array.isArray(o.assets)) {
    //                         o.assets.forEach((o) => {
    //                             let a = CacheMgr.Instance.get(t, n + "/_dir_" + o.name);
    //                             if (a) {
    //                                 a.assets = o;
    //                                 a.status == ECacheStatus.WAITTING_FOR_RELEASE
    //                                     ? ((a.status = ECacheStatus.NONE), a.assets && this.releaseCache(a))
    //                                     : ((a.status = ECacheStatus.Loaded), (a.isLoaded = true));
    //                             }
    //                             else {
    //                                 a = new CacheInfo();
    //                                 a.assets = o;
    //                                 a.isLoaded = true;
    //                                 a.setResInfo(u, r, t);
    //                                 CacheMgr.Instance.set(t, u, a);
    //                             }
    //                         });
    //                         const a = CacheMgr.Instance.get(t, u);
    //                         if (!a.assets) {
    //                             cc.error("can't find asset:", u);
    //                         }
    //                         c(a.assets);
    //                     }
    //                     else {
    //                         c(o.assets);
    //                     }
    //                 }
    //                 else {
    //                     l(`加载prefab : ${n} 失败`);
    //                 }
    //             });
    //         }
    //     });
    // };
    getSkeleton = function (e, t, n) {
        const o = t + "/" + n;
        const r = CacheMgr.Instance.get(e, o);
        return r && r.isLoaded ? r.assets : null;
    };
    getSpriteFrame = function (e, t) {
        const n = CacheMgr.Instance.get(e, t);
        if (n && n.isLoaded) {
            return n.assets;
        }
        else {
            cc.error(`Can t find spriteFrame. bundle: ${e} path:${t} `);
            return null;
        }
    };
    // loadAssetAsync = function (e: CacheInfo, t, n, o) {
    //     return new Promise((resolve, reject) => {
    //         this.load(e, t, n, o, (e) => {
    //             if (e && e.assets && e.assets instanceof n) {
    //                 resolve(e.assets);
    //             }
    //             else {
    //                 reject(`加载资源失败 : ${t} 失败`);
    //             }
    //         });
    //     });
    // };
    loadDir = (e: any, t: any, n: any, o: any, r?: any) => {
        let c = CacheMgr.Instance.get(e, t);
        if (c) {
            if (c.isLoaded) {
                if (c.status == ECacheStatus.WAITTING_FOR_RELEASE) {
                    c.status = ECacheStatus.Loaded;
                }
                if (r) {
                    r(c);
                }
            }
            else {
                c.status = ECacheStatus.Loading;
                if (r) {
                    c.handlers.push(r);
                }
            }
        }
        else {
            c = new CacheInfo();
            c.setResInfo(t, n, e);
            CacheMgr.Instance.set(e, t, c);
            const l = ManagerBundle.Instance.getBundle(e);
            if (!l) {
                const u = new Error(`loadDir ${e} 未加载,请先加载`);
                this._onLoadComplete(c, r, u, null);
                return;
            }
            const p = l.get(t, n);
            if (p) {
                this._onLoadComplete(c, r, null, p);
            }
            else {
                if (o) {
                    l.loadDir(t, n, o, this._onLoadComplete.bind(this, c, r));
                }
                else {
                    l.loadDir(t, n, this._onLoadComplete.bind(this, c, r));
                }
            }
        }
    };
    loadPrefabAsync = function (e, t, n = null) {
        return new Promise(function (resolve, reject) {
            this.load(e, t, cc.Prefab, n, function (e) {
                if (e && e.assets && e.assets instanceof cc.Prefab) {
                    resolve(e.assets);
                }
                else {
                    reject("加载prefab : " + t + " 失败");
                }
            });
        }.bind(this));
    };
    loadRemoteImage = async function (e, t) {
        if (!e || e.length <= 0) {
            return Promise.resolve(null);
        }
        if (t) {
            const cachedSpriteFrame = CacheMgr.Instance.remoteCachs.getSpriteFrame(e);
            if (cachedSpriteFrame && cachedSpriteFrame.assets) {
                return Promise.resolve(cachedSpriteFrame.assets);
            }
            CacheMgr.Instance.remoteCachs.remove(e);
        }
        const remoteTexture = await this._loadRemoteRes(e, cc.Texture2D);
        const remoteAsset = CacheMgr.Instance.remoteCachs.get(e);
        if (remoteTexture && remoteAsset) {
            const spriteFrame = CacheMgr.Instance.remoteCachs.setSpriteFrame(e, remoteTexture);
            return Promise.resolve(spriteFrame);
        }
        else {
            return Promise.resolve(null);
        }
    };
    loadSpriteFrame = async function (e, t, n = null) {
        return new Promise((r, i) => {
            this.load(e, t, cc.SpriteFrame, n, (e) => {
                if (e && e.assets && e.assets instanceof cc.SpriteFrame) {
                    r(e.assets);
                }
                else {
                    i(`加载spriteframe : ${t} 失败`);
                }
            });
        });
    };
    releaseAsset = (e) => {
        const t = ManagerBundle.Instance.getBundle(e.resInfo.bundle);
        if (t) {
            if (Array.isArray(e.assets)) {
                for (let n = 0; n < e.assets.length; n++) {
                    const o = e.assets[n];
                    const r = e.resInfo.path + "/" + o.name;
                    t.release(r, e.resInfo.type);
                }
            }
            else {
                t.release(e.resInfo.path, e.resInfo.type);
            }
        }
    };
    releaseCache = (e) => {
        if (e && e.resInfo.bundle) {
            if (!e)
                return;
            if (e.isInValid)
                return;
            if (e.isLoaded) {
                if (e.retain)
                    return;
                if (CacheMgr.Instance.removeWithResInfo(e)) {
                    this.releaseAsset(e);
                }
                else if (Array.isArray(e.assets)) {
                    for (let t = 0; t < e.assets.length; t++) {
                        e.assets[t].refCount;
                    }
                }
            }
            else {
                e.status = ECacheStatus.WAITTING_FOR_RELEASE;
            }
        }
    };
    load(bundleName: string, path: string, type: any, o: any, r: any) {
        let c = CacheMgr.Instance.get(bundleName, path);
        if (c) {
            if (c.isLoaded) {
                if (c.status == ECacheStatus.WAITTING_FOR_RELEASE) {
                    c.status = ECacheStatus.Loaded;
                }
                r(c);
            }
            else {
                c.status = ECacheStatus.Loading;
                c.handlers.push(r);
            }
        }
        else {
            c = new CacheInfo();
            c.setResInfo(path, type, bundleName);
            CacheMgr.Instance.set(bundleName, path, c);
            const l = ManagerBundle.Instance.getBundle(bundleName);
            if (!l) {
                const u = new Error(`${bundleName} 未加载,请先加载`);
                this._onLoadComplete(c, r, u, null);
                return;
            }
            const p = l.get(path, type);
            if (p) {
                this._onLoadComplete(c, r, null, p);
            }
            else {
                if (o) {
                    l.load(path, type, o, this._onLoadComplete.bind(this, c, r));
                }
                else {
                    l.load(path, type, this._onLoadComplete.bind(this, c, r));
                }
            }
        }
    }
    loadAsync(bundlename: string, path: string, _type: any): Promise<any> {
        return new Promise((resolve) => {
            const asset = CacheMgr.Instance.get(bundlename, path);
            if (asset) {
                if (asset.isLoaded) {
                    if (asset.status == ECacheStatus.WAITTING_FOR_RELEASE) {
                        asset.status = ECacheStatus.Loaded;
                    }
                    resolve(asset);
                }
                else {
                    asset.status = ECacheStatus.Loading;
                    asset.handlers.push(resolve);
                }
            }
            else {
                const newAsset = new CacheInfo();
                newAsset.setResInfo(path, _type, bundlename);
                CacheMgr.Instance.set(bundlename, path, newAsset);
                const bundle = ManagerBundle.Instance.getBundle(bundlename);
                if (!bundle) {
                    const error = new Error(`${bundlename} 未加载,请先加载`);
                    this._onLoadComplete(newAsset, resolve, error, null);
                }
                else {
                    const loaded = bundle.get(path, _type);
                    if (loaded) {
                        this._onLoadComplete(newAsset, resolve, null, loaded);
                    }
                    else {
                        bundle.load(path, _type, this._onLoadComplete.bind(this, newAsset, resolve));
                    }
                }
            }
        });
    }
    // async loadRemoteSkeleton(e: any, t: any) {
    //     // The original function is empty, so we'll leave this empty as well.
    // }
    async loadSkeleton(bundle: string, path: string, ani: string) {
        try {
            let o, i;
            if (path && ani) {
                o = path + "/" + ani;
                i = await this.loadAsync(bundle, o, sp.SkeletonData);
            }
            if (i && i.assets && i.assets instanceof sp.SkeletonData) {
                return i.assets;
            }
            else {
                throw new Error(`加载动画data: ${o} 失败`);
            }
        }
        catch (error) {
            return null;
        }
    }
    releaseBundleAllRes(e) {
        ManagerBundle.Instance.removeBundle_(e);
    }
    releaseBundleRes(e, t) {
        const n = CacheMgr.Instance.get(e, t);
        this.releaseCache(n);
    }
    // retainAsset(e, t) {
    //     const n = CacheMgr.Instance.get(t, e);
    //     if (n) {
    //         if (Array.isArray(n.assets)) {
    //             for (let o = 0; o < n.assets.length; o++) {
    //                 const r = n.assets[o];
    //                 r && r.addRef();
    //             }
    //         }
    //         else {
    //             n.assets.addRef();
    //         }
    //     }
    //     else {
    //         cc.error("retainAsset cache is null");
    //     }
    // }
    static get Instance(): AssetManager {
        if (!this._instance) {
            this._instance = new AssetManager();
        }
        return this._instance;
    }
}
