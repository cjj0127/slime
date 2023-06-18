class HallUpdate {
    private static _ins: HallUpdate = null;
    private hotUpdate: HotUpdate;
    private checkCallback(code: AssetManagerCode, state: AssetManagerState) {
        // if (code == AssetManagerCode.NEW_VERSION_FOUND) {
        //   cc.log("新版本需要更新");
        //   this.hotUpdate.hotUpdate(this.onUpdate.bind(this));
        // } else if (state == AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS) {
        //   this.hotUpdate.downloadFailedAssets();
        // } else if (code == AssetManagerCode.ALREADY_UP_TO_DATE) {
        //   setVersion(VERSION_REMOTE);
        //   cc.director.emit("restart");
        // } else if (
        //   code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST ||
        //   code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ||
        //   code == AssetManagerCode.ERROR_PARSE_MANIFEST
        // ) {
        //   AlerAlert.open("资源下载失败,请检查网络后重试.").confirm(() => cc.director.emit("restart"));
        // }
    }
    public checkVersion(buildID: number, version: string, remoteVersion: string, callback: Function) {
        if (cc.sys.localStorage.getItem("native-build-id") < buildID) {
            callback(false);
            this.gotoDownload();
            return;
        }
        // MyTools.versionCompare(version, remoteVersion);
        callback(false);
    }
    public destroy() {
        cc.director.targetOff(this);
        HallUpdate._ins = null;
    }
    private gotoDownload() {
        // do something
    }
    public initialize() {
        // this.setPackageUrl(DEFAULT_PACKAGE_URL);
        this.hotUpdate.manifestRoot = "assets";
    }
    private onUpdate(event) {
        // if (
        //   event.code == AssetManagerCode.ALREADY_UP_TO_DATE ||
        //   event.code == AssetManagerCode.UPDATE_FINISHED
        // ) {
        //   setVersion(VERSION_REMOTE);
        // } else if (
        //   event.code == AssetManagerCode.UPDATE_FAILED ||
        //   event.code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ||
        //   event.code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST ||
        //   event.code == AssetManagerCode.ERROR_PARSE_MANIFEST ||
        //   event.code == AssetManagerCode.ERROR_UPDATING ||
        //   event.code == AssetManagerCode.ERROR_DECOMPRESS
        // ) {
        //   AlerAlert.open("更新失败").confirm(() => cc.director.emit("restart"));
        //   return;
        // }
        // cc.director.emit("hall-hotupdate-download", event);
    }
    public onUpdateFinished() {
        cc.director.emit("restart");
    }
    public setPackageUrl(url: string) {
        this.hotUpdate.commonHotUpdateUrl = url;
    }
    public start() {
        this.hotUpdate.start("hall", this.checkCallback.bind(this));
    }
    constructor() {
        this.hotUpdate = new HotUpdate("remote-assets");
    }
    public static get Instance(): HallUpdate {
        return this._ins || (this._ins = new this(), this._ins.initialize()), this._ins;
    }
}
