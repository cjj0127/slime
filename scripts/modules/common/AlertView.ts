import LanMgr from "./Language";
import { GlobalEventName } from "./Events";
// n.default = p
const { ccclass, property } = cc._decorator;
@ccclass
export default class AlertView extends cc.Component {
    private _onAdHandler = null;
    private _onCancelHandler = null;
    private _onCloseHandler = null;
    private _onOkHandler = null;
    private _showAd = false;
    private _showCancel = false;
    private _showClose = false;
    private _showOk = false;
    @property(cc.Button)
    btnAd: cc.Button = null;
    @property(cc.Label)
    btnAdStr: cc.Label = null;
    @property(cc.Button)
    btnCancel: cc.Button = null;
    @property(cc.Label)
    btnCancelStr: cc.Label = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnOk: cc.Button = null;
    @property(cc.Label)
    btnOkStr: cc.Label = null;
    @property(cc.Label)
    message: cc.Label = null;
    @property(cc.Label)
    title: cc.Label = null;
    cancel(e: Function = null, t = null) {
        this._showCancel = true;
        this._onCancelHandler = e;
        this.btnCancelStr.string = t || LanMgr.Instance.getLangByID("common_prompt_cancal");
    }
    close(e: Function) {
        this._showClose = true;
        this._onCloseHandler = e;
    }
    confirm(e: Function, t = null) {
        this._showOk = true;
        this._onOkHandler = e;
        this.btnOkStr.string = t || LanMgr.Instance.getLangByID("common_prompt_ok");
    }
    confirmAd(e: Function, t = null) {
        this._showAd = true;
        this._onAdHandler = e;
        this.btnAdStr.string = t || LanMgr.Instance.getLangByID("common_prompt_ok");
    }
    onClickAd() {
        const e = this;
        this.node.emit("Close");
        this.node.once("removed", () => {
            if (e._onAdHandler) {
                const t = e._onAdHandler;
                e._onAdHandler = null;
                t && t();
            }
        });
    }
    onClickCancel() {
        const e = this;
        this.node.emit("Close");
        this.node.once("removed", () => {
            if (e._onCancelHandler) {
                const t = e._onCancelHandler;
                e._onCancelHandler = null;
                t && t();
            }
        });
    }
    onClickClose() {
        const e = this;
        this.node.emit("Close");
        this.node.once("removed", () => {
            if (e._onCloseHandler) {
                const t = e._onCloseHandler;
                e._onCloseHandler = null;
                t && t();
            }
        });
    }
    onClickOk() {
        const e = this;
        this.node.emit("Close");
        this.node.once("removed", () => {
            if (e._onOkHandler) {
                const t = e._onOkHandler;
                e._onOkHandler = null;
                t && t();
            }
        });
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.once(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.onSceneLaunch, this);
        cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this.refreshAfterScene_, this);
        cc.director.once(GlobalEventName.Restart, this.onRestart, this);
    }
    onLoad() {
        this.btnOk.node.on("click", this.onClickOk, this);
        this.btnAd.node.on("click", this.onClickAd, this);
        this.btnCancel.node.on("click", this.onClickCancel, this);
        this.btnClose.node.on("click", this.onClickClose, this);
    }
    onRestart() {
        this.node.emit("remove");
    }
    onSceneLaunch() {
        this.node.emit("remove");
    }
    refreshAfterScene_() {
        this.btnOk.node.active = this._showOk == true;
        this.btnAd.node.active = this._showAd == true;
        this.btnCancel.node.active = this._showCancel == true;
        this.btnClose.node.active = this._showClose == true || (this._showOk !== true && this._showAd !== true && this._showCancel !== true);
    }
    reset() {
        this._showOk = false;
        this._showAd = false;
        this._showCancel = false;
        this._showClose = false;
        this._onOkHandler = null;
        this._onAdHandler = null;
        this._onCancelHandler = null;
        this._onCloseHandler = null;
    }
    setMessage(e) {
        this.message.string = e;
    }
    setTile(e) {
        this.title.string = e || LanMgr.Instance.getLangByID("common_prompt_tooltip");
    }
}
