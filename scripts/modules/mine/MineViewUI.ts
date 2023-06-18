import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, E_MenuToggleType, E_ASSET_TYPE } from "../common/Const";
import RobModel from "../../ccstudio/data/RobModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import UserData from "../user/UserData";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("ui/MinePanel")
export default class MineViewUI extends cc.Component {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnMine: cc.Button = null;
    @property(cc.Button)
    btnResearch: cc.Button = null;
    @property(cc.Button)
    btnRob: cc.Button = null;
    @property(cc.Button)
    btnTeasure: cc.Button = null;
    @property(cc.Label)
    mineCubeCount: cc.Label = null;
    @property(cc.Label)
    pickaxCubeCount: cc.Label = null;
    checkGuide() {
        if (1 == Model.rob.getCurQuestId()) {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchMineRobButton);
        }
        else {
            GuideMgr.instance.completePreSpecialGuide(SpecialGuideEnum.TouchTreasureButton);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchTreasureButton);
        }
    }
    closeMineView() {
        this.getComponent(ViewAnimCtrl).onClose();
    }
    onClickClose() {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Mine);
    }
    onClickMine() {
        Model.ui.openViewAsync(MapUIPrefabs.MineView);
    }
    onClickResearch() {
        Model.ui.openViewAsync(MapUIPrefabs.MineResearchView);
    }
    onClickTeasure() {
        Model.ui.openViewAsync(MapUIPrefabs.TeasureViewUI);
    }
    onCubeChange() {
        var e = UserData.Instance.getItem(E_ASSET_TYPE.MineCube);
        this.setCubeCnt(e);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.setCubeCnt(UserData.Instance.getItem(E_ASSET_TYPE.MineCube));
        this.setPickaxCnt(UserData.Instance.getItem(E_ASSET_TYPE.MinePickax));
        this.showRobRedPoint();
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.MineCube, this.onCubeChange, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.MinePickax, this.onPickaxChange, this);
        cc.director.on(GlobalEventName.RobRedPointRefresh, this.showRobRedPoint, this);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchMine);
        this.checkGuide();
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchTreasureButton);
        cc.director.on(GlobalEventName.CloseAllMineView, this.closeMineView, this);
        this.btnClose.node.on("click", this.onClickClose, this);
    }
    // btnMine: cc.Button = null;
    // btnResearch: cc.Button = null;
    // btnTeasure: cc.Button = null;
    // btnRob: cc.Button = null;
    // mineCubeCount: cc.Label = null;
    // pickaxCubeCount: cc.Label = null;
    // btnClose: cc.Button = null;
    onLoad() {
        this.btnMine.node.on("click", this.onClickMine, this);
        this.btnResearch.node.on("click", this.onClickResearch, this);
        this.btnTeasure.node.on("click", this.onClickTeasure, this);
        this.btnRob.node.on("click", this.onRobClick, this);
        this.btnClose.node.on("click", this.onClickClose, this);
    }
    onPickaxChange() {
        var e = UserData.Instance.getItem(E_ASSET_TYPE.MinePickax);
        this.setPickaxCnt(e);
    }
    onRobClick() {
        Model.ui.openViewAsync(MapUIPrefabs.RobViewUI);
    }
    setCubeCnt(e: number) {
        this.mineCubeCount.string = "x" + e;
    }
    setPickaxCnt(e: number) {
        this.pickaxCubeCount.string = "x" + e;
    }
    showRobRedPoint() {
        this.btnRob.node.getChildByName("redpoint").active = Model.rob.showRedPoint();
    }
}
