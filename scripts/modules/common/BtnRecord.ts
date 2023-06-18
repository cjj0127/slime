import { GlobalEventTarget } from "./GlobalEventTarget";
import { GameConst, MapUIPrefabs } from "./Const";
import GuideMgr from "../guide/GuideMgr";
import { GuideEvent } from "../guide/GuideEnums";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
// import { TtAdManager } from "TtAdManager";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BtnRecord extends cc.Component {
    @property(cc.Node)
    recordingItem: cc.Node = null;
    @property(cc.ProgressBar)
    roundProgress: cc.ProgressBar = null;
    @property(cc.Node)
    roundProgressNode: cc.Node = null;
    _bindEvent() {
        GlobalEventTarget.on(GuideEvent.COMPLETE_NORMAL_GUIDE, this.waitShowShareView, this);
        cc.director.on(GuideEvent.COMPLETE_SPECIAL_GUIDE, () => {
            this.scheduleOnce(() => {
                this.waitShowShareView();
            }, 0.5);
        }, this);
    }
    onLoad() {
        this.stopRecord();
        this._bindEvent();
    }
    showShareViewNow() {
        Model.ui.openViewAsync(MapUIPrefabs.ShareRecordView);
    }
    startRecord() {
        const t = GameConst.SHARE_VIDEO_DURATION;
        this.roundProgress.progress = 0;
        this.recordingItem.active = true;
        this.roundProgressNode.active = true;
        cc.tween(this.roundProgress).by(1, { progress: 1 / t })
            .call(() => {
            this.recordingItem.active = !this.recordingItem.active;
        })
            .union().repeat(t)
            .call(() => {
            this.stopRecord();
            if (!GuideMgr.instance.isInGuide()) {
                this.showShareViewNow();
            }
        }).start();
    }
    stopRecord() {
        // TtAdManager.recordStop(() => { });
        this.recordingItem.active = false;
        cc.Tween.stopAllByTarget(this.roundProgress);
        this.roundProgressNode.active = false;
        this.roundProgress.progress = 0;
    }
    waitShowShareView() {
        // if (TtAdManager.getVideoState() == RECORD_STATE.END && TtAdManager.getVideoPath() !== null) {
        //     this.showShareViewNow();
        // }
    }
}
