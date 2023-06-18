import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { E_ToggleShopType, E_MenuToggleType } from "../common/Const";
import ShopModel from "../../ccstudio/data/ShopModel";
import Model from "../../ccstudio/data/Model";
import ToggleToPage from "../common/ToggleToPage";
// import { MenuToggleType, ToggleShopType } from "./Const";
// import { GlobalEvent } from "./Events";
// import { GuideEnums, SpecialGuideEnum } from "./GuideEnums";
// import GuideMgr from "./GuideMgr";
// import ShopModel from "./ShopModel";
// import ToggleToPage from "./ToggleToPage";
// import ShopModel = require("ShopModel");
const { ccclass, property } = cc._decorator;
@ccclass
export default class ShopViewUI extends cc.Component {
    private _: any = globalThis._;
    @property(cc.Button)
    btnClose: cc.Button = null;
    private defaultToggleId: number = 0;
    private selectType: number = null;
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;
    @property(ToggleToPage)
    toggleToPage: ToggleToPage = null;
    checkGuide() {
        this.scheduleOnce(() => {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchShopSummonSkill);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchShopSummonGear);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchShopSummonPartner);
        }, 0.2);
    }
    onClickClose() {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Shop);
    }
    onEnable() {
        this.toggleToPage.setDefaultCheckedIdx(this.defaultToggleId);
        this.checkGuide();
    }
    onLoad() {
        this.btnClose.node.on("click", this.onClickClose, this);
    }
    onToggle(e) {
        if (this.selectType !== e) {
            this.refresh(e, this.selectType);
            this.selectType = e;
        }
    }
    refresh(a, b) { }
    reuse(e: any) {
        if (this._.isNil(e)) {
            let t = Model.shop.getFreeEnable();
            this.defaultToggleId = t ? E_ToggleShopType.LimitedShop : 0;
        }
        else {
            this.defaultToggleId = e;
        }
    }
}
