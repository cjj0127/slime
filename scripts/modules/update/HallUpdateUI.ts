import AppConstDefine from "../common/AppConst";
import MyTools from "../../ccstudio/utils/MyTools";
// f = u.property,
var d = ["bytes", "KB", "MB", "GB"];
const { ccclass, property } = cc._decorator;
const BYTE_UNITS = ["bytes", "KB", "MB", "GB"];
@ccclass
export default class HallUpdateUI extends cc.Component {
    curProgress = 0;
    downloadedBytes = 0;
    nextProgress = 0;
    @property(cc.Label)
    progressLabel: cc.Label = null;
    @property(cc.Sprite)
    progressSprite: cc.Sprite = null;
    @property(cc.Label)
    remoteVersionLabel: cc.Label = null;
    running = true;
    totalBytes = 0;
    updateFinished = false;
    @property(cc.Label)
    versionLabel: cc.Label = null;
    formatBytes(e) {
        let t = 0;
        while (e > 1024) {
            e /= 1024;
            t++;
        }
        return {
            bytes: e,
            f: t
        };
    }
    onDestroy() {
        cc.director.targetOff(this);
    }
    onDownload(e) {
        this.downloadedBytes = e.downloadedBytes;
        this.totalBytes = e.totalBytes;
        if (e.code == AssetManagerCode.UPDATE_PROGRESSION) {
            this.nextProgress = Math.min(1, isNaN(e.percent) ? 0 : e.percent);
        }
        else if (e.code != AssetManagerCode.ALREADY_UP_TO_DATE && e.code != AssetManagerCode.UPDATE_FINISHED) {
            // do nothing
        }
        else {
            this.nextProgress = 1;
            this.updateFinished = true;
        }
    }
    onEnable() {
        this.versionLabel.string = "当前版本:" + AppConstDefine.getVersion();
        this.remoteVersionLabel.string = "最新版本:"; // + AppConst.VERSION_REMOTE;
        this.setProgress(0);
        this.running = true;
        this.curProgress = 0;
        this.nextProgress = 0;
        // HallUpdate.Instance.start();
    }
    onLoad() {
        cc.director.on("hall-hotupdate-download", this.onDownload, this);
    }
    setProgress(e) {
        let t = this.formatBytes(this.totalBytes);
        let n = t.bytes;
        let o = t.f;
        let r = "正在更新资源." + MyTools.formatNumberToFloatStr(this.downloadedBytes / Math.pow(1024, o)) + "/" + MyTools.formatNumberToFloatStr(n) + " " + d[o];
        this.progressLabel.string = r;
        this.progressSprite.fillRange = e;
    }
    update() {
        if (this.running && this.curProgress < this.nextProgress) {
            this.curProgress = cc.misc.lerp(this.curProgress, this.nextProgress, .5);
            if (this.nextProgress - this.curProgress < .02) {
                this.curProgress = this.nextProgress;
            }
            if (this.curProgress > 1) {
                this.curProgress = 1;
            }
            this.setProgress(this.curProgress);
            if (this.updateFinished && this.curProgress >= 1) {
                // HallUpdate.Instance.onUpdateFinished();
                this.running = false;
            }
        }
    }
}
