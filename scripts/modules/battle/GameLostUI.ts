import { EOpenUIType, EInsertAdType } from "../common/ViedioType";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { EUNLOCKSYS_ID, E_MenuToggleType, MapUIPrefabs } from "../common/Const";
import AdsModel from "../../ccstudio/data/AdsModel";
import UiModel from "../../ccstudio/data/UiModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GameLostUI extends cc.Component {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnGo: cc.Button = null;
    @property(cc.Button)
    btnGo1: cc.Button = null;
    @property(cc.Button)
    btnGo2: cc.Button = null;
    @property(cc.Button)
    btnGo3: cc.Button = null;
    onClickClose = () => {
        Model.ad.showInterstitial(EInsertAdType.LevelAd, EOpenUIType.LevelFailed);
        this.getComponent(ViewAnimCtrl).onClose();
    };
    onClickEctype = () => {
        this.node.emit("Close");
        this.node.once("removed", () => {
            Model.ui.closeAll();
            if (Model.user.isUnlock(EUNLOCKSYS_ID.BossRush)) {
                cc.director.emit(GlobalEventName.ShowPageView, E_MenuToggleType.Battle);
            }
            else {
                MsgHint.tip(LanMgr.Instance.getLangByID("Jump_Unlock_System"));
            }
        });
    };
    onClickGo = () => {
        this.node.emit("Close");
        this.node.once("removed", () => {
            Model.ui.closeAll();
        });
    };
    onGoBless = () => {
        this.node.emit("Close");
        this.node.once("removed", () => {
            Model.ui.closeAll();
            if (Model.user.isUnlock(EUNLOCKSYS_ID.Bless)) {
                Model.ui.openViewAsync(MapUIPrefabs.BlessPropView);
            }
            else {
                MsgHint.tip(LanMgr.Instance.getLangByID("Jump_Unlock_System"));
            }
        });
    };
    onGoShop = () => {
        this.node.emit("Close");
        this.node.once("removed", () => {
            Model.ui.closeAll();
            if (Model.user.isUnlock(EUNLOCKSYS_ID.Shop)) {
                cc.director.emit(GlobalEventName.ShowPageView, E_MenuToggleType.Shop);
            }
            else {
                MsgHint.tip(LanMgr.Instance.getLangByID("Jump_Unlock_System"));
            }
        });
    };
    onDisable() {
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onEnable() {
        Model.ad.showBanner(EOpenUIType.LevelFailed);
    }
    // private btnGo: cc.Button;
    // private btnGo1: cc.Button;
    // private btnGo2: cc.Button;
    // private btnGo3: cc.Button;
    // private btnClose: cc.Button;
    onLoad() {
        this.btnGo.node.on("click", this.onClickGo, this);
        this.btnGo1.node.on("click", this.onGoShop, this);
        this.btnGo2.node.on("click", this.onGoBless, this);
        this.btnGo3.node.on("click", this.onClickEctype, this);
        this.btnClose.node.on("click", this.onClickClose, this);
    }
}
