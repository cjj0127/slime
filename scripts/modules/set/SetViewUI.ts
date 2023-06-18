import { EInsertAdType, EOpenUIType } from "../common/ViedioType";
import AppConstDefine from "../common/AppConst";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
import AdsModel from "../../ccstudio/data/AdsModel";
import Model from "../../ccstudio/data/Model";
import UISetSwitch from "./UISetSwitch";
import UserData from "../user/UserData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SetViewUI extends cc.Component {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(UISetSwitch)
    lowBattery: UISetSwitch = null;
    @property(UISetSwitch)
    musicSwitch: UISetSwitch = null;
    @property(UISetSwitch)
    soundSwitch: UISetSwitch = null;
    @property(cc.Label)
    version: cc.Label = null;
    OnCloseClick(): void {
        Model.ad.showInterstitial(EInsertAdType.UICloseAd, EOpenUIType.Setting);
        this.node.emit("Close");
    }
    onClickLowBattery(): void {
        UserData.Instance.modeLow = !UserData.Instance.modeLow;
        this.lowBattery.setSwitch(UserData.Instance.modeLow);
        AppConstDefine.FRAME_RATE = UserData.Instance.modeLow ? 30 : 60;
        AppConstDefine.FRAME_TIME = 1 / AppConstDefine.FRAME_RATE;
        cc.game.setFrameRate(AppConstDefine.FRAME_RATE);
    }
    onClickMusic(): void {
        const e = !SoundPlayerComp.Instance.musicSwitch;
        SoundPlayerComp.Instance.setMusicSwitch(e);
        this.musicSwitch.setSwitch(e);
    }
    onClickSound(): void {
        const e = !SoundPlayerComp.Instance.soundSwitch;
        SoundPlayerComp.Instance.setSoundSwitch(e);
        this.soundSwitch.setSwitch(e);
    }
    onDisable(): void {
        Model.ad.hideBanner();
    }
    onEnable(): void {
        this.version.string = "v:" + AppConstDefine.VERSION;
        this.musicSwitch.setSwitch(SoundPlayerComp.Instance.musicSwitch);
        this.soundSwitch.setSwitch(SoundPlayerComp.Instance.soundSwitch);
        this.lowBattery.setSwitch(UserData.Instance.modeLow);
        Model.ad.showBanner(EOpenUIType.Setting);
    }
    onLoad(): void {
        this.btnClose.node.on("click", this.OnCloseClick, this);
        this.musicSwitch.node.on("click", this.onClickMusic, this);
        this.soundSwitch.node.on("click", this.onClickSound, this);
        this.lowBattery.node.on("click", this.onClickLowBattery, this);
    }
}
