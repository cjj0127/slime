import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, EUNLOCKSYS_ID } from "../common/Const";
import RobModel from "../../ccstudio/data/RobModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import PlunderLevel from "../common/PlunderLevel";
import UtilTime from "../../ccstudio/utils/TimeUtil";
import MapCtr_ from "../battle/MapCtr_";
import UIPool from "../common/UIPool";
import UnlockCtrl from "../unlock/UnlockCtrl";
import UserData from "../user/UserData";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class RobViewUI extends UIPool {
    @property(cc.Node)
    buildNode: cc.Node = null;
    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Node)
    firstBuild: cc.Node = null;
    @property(cc.Label)
    letftTimeLabel: cc.Label = null;
    @property(cc.Button)
    onekeyObtain: cc.Button = null;
    @property(cc.Button)
    robLevelBtn: cc.Button = null;
    @property(cc.Label)
    robLevelLabel: cc.Label = null;
    @property(cc.ProgressBar)
    robProgress: cc.ProgressBar = null;
    @property(cc.Label)
    robProgressLabel: cc.Label = null;
    @property(cc.Button)
    speedUpBtn: cc.Button = null;
    ShowLevelUpDlg(e) {
        const t = PlunderLevel.Instance.getLevelsReward(e);
        for (let n = 0; n < t.ids.length; n++) {
            const o = e[n], r = t.ids[n], i = t.nums[n];
            UserData.Instance.addMemItem(r, i);
            const a = {
                Plunder_BuildingNum: Model.rob.getUnlockBuildNum(),
                Plunder_Level: o,
                Plunder_LevelReward: r + "|" + i
            };
        }
        Model.rob.popLevelUpView(e, 0);
    }
    checkGuide() {
        if (!GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchMineButton) &&
            UnlockCtrl.Instance.isUnlock(EUNLOCKSYS_ID.Rob)) {
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchMineButton);
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchMineRobButton);
        }
    }
    onClose() {
        cc.director.emit(GlobalEventName.RobRedPointRefresh);
        Model.ui.closeView(MapUIPrefabs.RobBuildDetailViewUI.path);
        this.getComponent(ViewAnimCtrl).onClose();
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchTreasureButton);
    }
    onDisable() {
        this.unscheduleAllCallbacks();
        cc.director.targetOff(this);
    }
    onEnable() {
        this.showBuildings();
        this.refreshRobLevel();
        this.refreshLeftTime();
        cc.director.on(GlobalEventName.RefreshRobLevel, this.refreshRobLevel, this);
        cc.director.on(GlobalEventName.RobLevelUp, this.ShowLevelUpDlg, this);
        cc.director.on(GlobalEventName.RobSpeedUp, this.refreshSpeedBtn, this);
        this.schedule(() => {
            this.refreshLeftTime();
        }, 1);
        this.checkGuide();
    }
    // private closeBtn: cc.Button;
    // private robLevelBtn: cc.Button;
    // private speedUpBtn: cc.Button;
    // private onekeyObtain: cc.Button;
    // private robLevelLabel: cc.Label;
    // private robProgressLabel: cc.Label;
    // private robProgress: cc.ProgressBar;
    onLoad() {
        this.closeBtn.node.on("click", this.onClose, this);
        this.robLevelBtn.node.on("click", this.onRobLevelClick, this);
        this.speedUpBtn.node.on("click", this.onSpeedUpClick, this);
        this.onekeyObtain.node.on("click", this.onekeyObtainClick, this);
    }
    onRobLevelClick() {
        Model.ui.openViewAsync(MapUIPrefabs.RobExpRewardViewUI);
    }
    onSpeedUpClick() {
        Model.ui.openViewAsync(MapUIPrefabs.RobSpeedUpViewUI);
    }
    onekeyObtainClick() {
        let e = 0, t = [], n = Model.rob.getRobDataInfo().buildInfo;
        _.each(n, (n) => {
            const o = n.id, r = Model.rob.getBuildInfo(o).stockCoin;
            if ("0" != r) {
                const i = Model.rob.receiveOutCoinAndExp(o), a = Model.rob.getRobDataInfo(), c = Model.rob.getBuildingCfg(o);
                cc.director.emit(GlobalEventName.AssetItemChange + c.outId.toString());
                cc.director.emit(GlobalEventName.RefreshRobLevel, o),
                    t.push(i),
                    e += parseInt(r);
                const l = {
                    PlunderExp_Num: parseFloat(i.exp),
                    Plunder_BuildingId: o,
                    Plunder_BuildingLevel: n.level,
                    Plunder_BuildingType: c.buildingType.toString(),
                    Plunder_HeroId: n.heroId,
                    Plunder_Level: a.robLevel,
                    PreciousCoin_Count: i.coin,
                    PreciousCoin_Num: c.outId + "|" + UserData.Instance.getItem(c.outId)
                };
            }
        });
        if (e > 0) {
            Model.ui.openViewAsync(MapUIPrefabs.RobObtainCionViewUI, {
                data: {
                    receiveInfos: t
                }
            });
        }
    }
    refreshLeftTime() {
        Model.rob.getSpeedUpRemainTime() <= 0 ? this.letftTimeLabel.node.active = !1 : (this.letftTimeLabel.node.active = !0, this.letftTimeLabel.string = UtilTime.msToHMS(6e4 * Model.rob.getSpeedUpRemainTime(), ":", !1));
    }
    refreshRobLevel() {
        const e = Model.rob.getRobDataInfo();
        this.robLevelLabel.string = e.robLevel.toString();
        const t = PlunderLevel.Instance.get(e.robLevel), n = PlunderLevel.Instance.getMaxLevel(), o = e.robLevel < n ? t.needExp : PlunderLevel.Instance.get(n - 1).needExp, r = e.robExp;
        this.robProgressLabel.string = r + "/" + o,
            this.robProgress.progress = r / parseInt(o);
    }
    refreshSpeedBtn() { }
    showBuildings() {
        const e = this.node.getComponent(MapCtr_);
        e.setMapScale(.6),
            e.target.node.setPosition(cc.v3(0, 0, 0)),
            Model.rob.setMapCtr(e);
    }
}
