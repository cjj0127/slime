enum AssetManagerCode {
    ERROR_NO_LOCAL_MANIFEST = 0,
    ERROR_DOWNLOAD_MANIFEST = 1,
    ERROR_PARSE_MANIFEST = 2,
    NEW_VERSION_FOUND = 3,
    ALREADY_UP_TO_DATE = 4,
    UPDATE_PROGRESSION = 5,
    ASSET_UPDATED = 6,
    ERROR_UPDATING = 7,
    UPDATE_FINISHED = 8,
    UPDATE_FAILED = 9,
    ERROR_DECOMPRESS = 10,
    CHECKING = 11
}
enum AssetManagerState {
    UNINITED = 0,
    UNCHECKED = 1,
    PREDOWNLOAD_VERSION = 2,
    DOWNLOADING_VERSION = 3,
    VERSION_LOADED = 4,
    PREDOWNLOAD_MANIFEST = 5,
    DOWNLOADING_MANIFEST = 6,
    MANIFEST_LOADED = 7,
    NEED_UPDATE = 8,
    READY_TO_UPDATE = 9,
    UPDATING = 10,
    UNZIPPING = 11,
    UP_TO_DATE = 12,
    FAIL_TO_UPDATE = 13,
    TRY_DOWNLOAD_FAILED_ASSETS = 14
}
class HotUpdate {
    private _commonHotUpdateUrl: string = "";
    private _manifestRoot: string = "";
    public assetsManagers: object = {};
    public checkCallback: Function | null = null;
    public currentAssetsManager: object | null = null;
    public hotUpdateCallback: Function | null = null;
    private storageFolder: string = "";
    public storagePath: string = "";
    public updating: boolean = false;
    public checkCb(e: any): void {
        // this.currentAssetsManager.code = e.getEventCode();
        // cc.log(`checkCb event code : ${e.getEventCode()} state : ${this.currentAssetsManager.manager.getState()}`);
        // switch (e.getEventCode()) {
        //   case o.ERROR_NO_LOCAL_MANIFEST:
        //     cc.log("No local manifest file found, hot update skipped.");
        //     break;
        //   case o.ERROR_DOWNLOAD_MANIFEST:
        //   case o.ERROR_PARSE_MANIFEST:
        //     cc.log("Fail to download manifest file, hot update skipped.");
        //     break;
        //   case o.ALREADY_UP_TO_DATE:
        //     cc.log("Already up to date with the latest remote version.");
        //     break;
        //   case o.NEW_VERSION_FOUND:
        //     cc.log("New version found, please try to update.");
        //     break;
        //   default:
        //     return;
        // }
        // this.currentAssetsManager.manager.setEventCallback(null);
        // this.updating = !1;
        // const t = this.currentAssetsManager.manager.getState();
        // this.checkCallback &&
        //   t != jsb.AssetsManager.State.DOWNLOADING_VERSION &&
        //   (this.checkCallback(e.getEventCode(), t), (this.checkCallback = null));
    }
    public checkUpdate(e: any): void {
        // cc.log("--checkUpdate--");
        // if (this.updating) {
        //   cc.log("Checking or updating...");
        //   return void e(o.CHECKING, r.PREDOWNLOAD_VERSION);
        // }
        // if (!this.currentAssetsManager.manager.getLocalManifest() || !this.currentAssetsManager.manager.getLocalManifest().isLoaded()) {
        //   cc.log("Failed to load local manifest ...");
        //   return void e(o.ERROR_DOWNLOAD_MANIFEST, r.FAIL_TO_UPDATE);
        // }
        // if (this.isTryDownloadFailedAssets()) {
        //   cc.log("之前下载资源未完全下载完成，请尝试重新下载");
        //   e(o.UPDATE_FAILED, r.TRY_DOWNLOAD_FAILED_ASSETS);
        // } else {
        //   this.updating = !0;
        //   this.checkCallback = e;
        //   this.currentAssetsManager.manager.setEventCallback(this.checkCb.bind(this));
        //   this.currentAssetsManager.manager.checkUpdate();
        // }
    }
    public destroyAssetsManager(e: string): void {
        if (this.assetsManagers[e]) {
            this.assetsManagers[e].manager && this.assetsManagers[e].manager.setEventCallback(null);
            this.currentAssetsManager = null;
            delete this.assetsManagers[e];
        }
    }
    public downloadFailedAssets(): void {
        // this.currentAssetsManager && this.currentAssetsManager.manager.downloadFailedAssets();
    }
    public getAssetsManager(e: string): any {
        return this.assetsManagers[e], this.assetsManagers[e];
    }
    public getHotUpdateUrl(): string {
        return this.commonHotUpdateUrl;
    }
    // private currentAssetsManager: any;
    // private checkCallback: any;
    // private hotUpdateCallback: any;
    // private updating: boolean;
    // private assetsManagers: any;
    // private projectManifestUrl: string;
    // private storagePath: string;
    // private manifestRoot: string;
    // private commonHotUpdateUrl: string;
    // constructor() { }
    public getManifestWithName(e: string): string {
        return `${e}_project.manifest`;
    }
    public hotUpdate(e: any): void {
        // if (this.currentAssetsManager) {
        //   cc.log(`即将热更新模块为:${this.currentAssetsManager.name} , updating : ${this.updating}`);
        //   if (!this.updating) {
        //     this.hotUpdateCallback = e;
        //     cc.log(`执行更新 ${this.currentAssetsManager.name} `);
        //     this.currentAssetsManager.manager.setEventCallback(this.updateCb.bind(this));
        //     this.currentAssetsManager.manager.update();
        //   }
        // } else {
        //   cc.error("热更新管理器未初始化");
        // }
    }
    public isTryDownloadFailedAssets(): boolean {
        // return (
        //   !(
        //     !this.currentAssetsManager ||
        //     this.currentAssetsManager.manager.getState() != jsb.AssetsManager.State.FAIL_TO_UPDATE &&
        //     this.currentAssetsManager.code != AssetManagerCode.ERROR_NO_LOCAL_MANIFEST &&
        //     this.currentAssetsManager.code != AssetManagerCode.ERROR_DOWNLOAD_MANIFEST &&
        //     this.currentAssetsManager.code != AssetManagerCode.ERROR_PARSE_MANIFEST
        //   )
        // );
        return false;
    }
    public start(e: string, t: any): void {
        // let n = this.projectManifestUrl;
        // jsb.fileUtils.isFileExist(n) || (n = `assets/${this.projectManifestUrl}`);
        // this.currentAssetsManager = this.getAssetsManager(e);
        // this.currentAssetsManager.manager.loadLocalManifest(n);
        // this.checkUpdate(t);
    }
    public startWithAssetName(e: string, t: any): void {
        // this.currentAssetsManager = this.getAssetsManager(e);
        // const n = this.getManifestWithName(e);
        // if (jsb.fileUtils.isFileExist(n)) {
        //   const o = jsb.fileUtils.getStringFromFile(n),
        //     r = new jsb.Manifest(o, this.storagePath, this.getHotUpdateUrl(e));
        //   cc.log("--存在本地版本控制文件checkUpdate--");
        //   cc.log(`mainifestUrl : ${n}`);
        //   this.currentAssetsManager.manager.loadLocalManifest(r, "");
        //   this.checkUpdate(t);
        // } else {
        //   let i = this.getHotUpdateUrl(e);
        //   i.endsWith("/") || (i += "/");
        //   const a = {
        //     version: "0.0.0",
        //     packageUrl: i,
        //     remoteManifestUrl: `${i}${this.manifestRoot}/project.manifest`,
        //     remoteVersionUrl: `${i}${this.manifestRoot}/version.manifest`,
        //     assets: {},
        //     searchPaths: [],
        //   },
        //     s = JSON.stringify(a),
        //     r = new jsb.Manifest(s, this.storagePath, this.getHotUpdateUrl(e));
        //   cc.log("--checkUpdate--");
        //   cc.log(`mainifest content : ${s}`);
        //   this.currentAssetsManager.manager.loadLocalManifest(r, "");
        //   this.checkUpdate(t);
        // }
    }
    public updateCb(e: any): void {
        // let t = !1,
        //   n = !1;
        // cc.log(`--update cb code : ${e.getEventCode()} state : ${this.currentAssetsManager.manager.getState()}`);
        // this.currentAssetsManager.code = e.getEventCode();
        // switch (e.getEventCode()) {
        //   case o.ERROR_NO_LOCAL_MANIFEST:
        //     cc.log("No local manifest file found, hot update skipped.");
        //     n = !0;
        //     break;
        //   case o.UPDATE_PROGRESSION:
        //     cc.log(`${e.getDownloadedBytes()} / ${e.getTotalBytes()}`);
        //     cc.log(`${e.getDownloadedFiles()} / ${e.getTotalFiles()}`);
        //     cc.log(`percent : ${e.getPercent()}`);
        //     cc.log(`percent by file : ${e.getPercentByFile()}`);
        //     const r = e.getMessage();
        //     r && cc.log(`Updated file: ${r}`);
        //     break;
        //   case o.ERROR_DOWNLOAD_MANIFEST:
        //   case o.ERROR_PARSE_MANIFEST:
        //     cc.log("Fail to download manifest file, hot update skipped.");
        //     n = !0;
        //     break;
        //   case o.ALREADY_UP_TO_DATE:
        //     cc.log("Already up to date with the latest remote version.");
        //     n = !0;
        //     break;
        //   case o.UPDATE_FINISHED:
        //     cc.log(`Update finished. ${e.getMessage()}`);
        //     t = !0;
        //     break;
        //   case o.UPDATE_FAILED:
        //     cc.log(`Update failed. ${e.getMessage()}`);
        //     this.updating = !0;
        //     break;
        //   case o.ERROR_UPDATING:
        //     cc.log(`Asset update error: ${e.getAssetId()} , ${e.getMessage()}`);
        //     break;
        //   case o.ERROR_DECOMPRESS:
        //     cc.log(`${e.getMessage()}`);
        // }
        // n && (this.currentAssetsManager.manager.setEventCallback(null), (this.updating = !1));
        // const i = this.currentAssetsManager.manager.getState(),
        //   a = {
        //     downloadedBytes: e.getDownloadedBytes(),
        //     totalBytes: e.getTotalBytes(),
        //     downloadedFiles: e.getDownloadedFiles(),
        //     totalFiles: e.getTotalFiles(),
        //     percent: e.getPercent(),
        //     percentByFile: e.getPercentByFile(),
        //     code: e.getEventCode(),
        //     state: i,
        //     needRestart: t,
        //   };
        // cc.log(`update cb  failed : ${n}  , need restart : ${t} , updating : ${this.updating} code: ${a.code}`);
        // this.hotUpdateCallback(a);
        // t && (this.currentAssetsManager.manager.setEventCallback(null), this.destroyAssetsManager(this.currentAssetsManager.name));
    }
    set commonHotUpdateUrl(value: string) {
        this._commonHotUpdateUrl = value;
    }
    get commonHotUpdateUrl(): string {
        return this._commonHotUpdateUrl;
    }
    get isBrowser() {
        return cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.isBrowser;
    }
    set manifestRoot(value: string) {
        this._manifestRoot = value;
    }
    get manifestRoot(): string {
        return this._manifestRoot;
    }
    get projectManifestUrl(): string {
        return "project.manifest";
    }
    constructor(storageFolder: string) {
        this.storageFolder = storageFolder;
    }
}
