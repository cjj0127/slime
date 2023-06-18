import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { ROB_IMAGE_URL_, ROB_BUILDTYPE_, IMAGE_ICON_PATH_, ROB_BUILDTYPE_COLOR_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _BuildingConfig from "../../ccstudio/config/_BuildingConfig";
import GuideMgr from "../guide/GuideMgr";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import HeroData from "../hero/HeroData";
import LanMgr from "../common/Language";
import RobModel from "../../ccstudio/data/RobModel";
import Model from "../../ccstudio/data/Model";
import RobHeroListItemUI from "./RobHeroListItemUI";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
// n.default = P
;
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class RobAddHeroViewUI extends cc.Component {
    @property(cc.Button)
    addHeroBtn = null;
    @property(cc.Sprite)
    buildIcon = null;
    buildingId = -1;
    @property(cc.Button)
    closeBtn = null;
    curHeroItem = null;
    curSelectHeroId = -1;
    enterType = 0;
    @property(cc.Label)
    heroAddRateLabel = null;
    @property(cc.Sprite)
    heroBuff = null;
    @property(cc.Sprite)
    heroEmpty = null;
    @property(cc.Label)
    heroFitLabel = null;
    @property(cc.Sprite)
    heroIcon = null;
    @property(cc.Layout)
    heroListContent = null;
    @property(cc.Prefab)
    itemPrafeb = null;
    @property([cc.SpriteFrame])
    lvBgFrame = [];
    @property(cc.Sprite)
    lvBgSprite: cc.Sprite = null;
    @property(cc.Label)
    lvLabel = null;
    @property(cc.Node)
    maxLvLabelNode = null;
    @property(cc.Button)
    removeHeroBtn = null;
    @property(cc.Label)
    titleLabel = null;
    @property(cc.Sprite)
    typeIcon = null;
    @property(cc.Label)
    typeName = null;
    initBuild() {
        const e = Model.rob.getBuildingCfg(this.buildingId);
        if (e) {
            this.buildIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, ROB_IMAGE_URL_ + "/" + e.icon);
            this.heroFitLabel.string = LanMgr.Instance.getLangByID("fit_level").replace("%{value}", "" + e.goodLevel);
        }
        const t = Model.rob.getBuildInfo(this.buildingId);
        this.lvLabel.string = t.level.toString();
        this.titleLabel.string = LanMgr.Instance.getLangByID(e.name);
        const n = Model.rob.getBuildMaxLevel(this.buildingId);
        this.maxLvLabelNode.active = t.level >= n;
        this.lvBgSprite.spriteFrame = t.level >= n ? this.lvBgFrame[1] : this.lvBgFrame[0];
        const o = ROB_BUILDTYPE_[e.buildingType];
        this.typeName.string = LanMgr.Instance.getLangByID(o);
        this.typeIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, IMAGE_ICON_PATH_ + "/" + o);
        this.typeIcon.node.color = cc.color().fromHEX(ROB_BUILDTYPE_COLOR_[e.buildingType]);
    }
    initHeroList() {
        const e = this;
        const t = _BuildingConfig.Instance.get(this.buildingId);
        this.heroListContent.node.removeAllChildren();
        const n = _HeroConfig.Instance.getAll();
        let o = 0;
        _.each(n, function (n) {
            const r = HeroData.Instance.getData(n.id);
            o++;
            const i = cc.instantiate(e.itemPrafeb);
            i.parent = e.heroListContent.node;
            const a = i.getComponent(RobHeroListItemUI);
            a.setHero(n.id);
            a.initUI(t.buildingType);
            a.node.on("toggle", e.onToggle, e);
            a.refreshStatus();
            a.setEquiped(false);
            a.getComponent(cc.Toggle).isChecked = n.id == e.curSelectHeroId;
            a.setEquiped(Model.rob.isHeroEquiped(n.id));
            if (-1 == e.curSelectHeroId) {
                if (1 == o) {
                    a.getComponent(cc.Toggle).isChecked = true;
                    e.curSelectHeroId = a.getHeroId();
                    e.curHeroItem = a.node;
                }
            }
            else {
                if (n.id == e.curSelectHeroId) {
                    e.curHeroItem = a.node;
                }
            }
            a.getComponent(cc.Toggle).interactable = n.id != e.curSelectHeroId && r && r.level > 0;
        });
    }
    onClose() {
        this.node.getComponent(ViewAnimCtrl).onClose();
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchCloseLevelUpView);
    }
    onDisable() { }
    onDownHero() {
        var e = Model.rob.getBuildInfo(this.buildingId);
        Model.rob.unEquipHero(e.heroId);
        this.refreshEquipUi();
        cc.director.emit(GlobalEventName.RemoveRobHero, e.heroId, this.buildingId);
    }
    onEnable() {
        this.initBuild();
        this.initHeroList();
        this.refreshEquipUi();
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRobButton);
    }
    onLoad() {
        this.closeBtn.node.on("click", this.onClose, this);
        this.addHeroBtn.node.on("click", this.onUpHero, this);
        this.removeHeroBtn.node.on("click", this.onDownHero, this);
    }
    onToggle(e) {
        this.curHeroItem = e.node;
        const t = e.getComponent(RobHeroListItemUI);
        if (e.isChecked) {
            const n = t.getHeroId();
            this.curSelectHeroId = n;
        }
        else {
            this.curSelectHeroId = -1;
        }
        this.refreshEquipUi();
        this.refrehHeroList();
    }
    onUpHero() {
        Model.rob.changeBuildHero(this.buildingId, this.curSelectHeroId);
        this.refreshEquipUi();
        this.refrehHeroList();
        cc.director.emit(GlobalEventName.AddRobHero, this.curSelectHeroId, this.buildingId);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchClosePutView);
    }
    refrehHeroList() {
        const e = this;
        const t = this.heroListContent.node.children;
        _.each(t, function (t) {
            const n = t.getComponent(RobHeroListItemUI);
            n.setEquiped(Model.rob.isHeroEquiped(n.getHeroId()));
            const o = HeroData.Instance.getData(n.getHeroId());
            t.getComponent(cc.Toggle).interactable = e.curHeroItem != t && o && o.level > 0;
        });
    }
    refreshEquipUi() {
        const e = Model.rob.getBuildInfo(this.buildingId);
        let t = "";
        if (-1 == e.heroId) {
            t = "fudong";
        }
        else {
            const n = _HeroConfig.Instance.get(e.heroId);
            if (n) {
                t = n.icon;
            }
        }
        this.heroIcon.node.active = -1 != e.heroId;
        this.heroEmpty.node.active = -1 == e.heroId;
        this.heroIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, IMAGE_ICON_PATH_ + "/" + t);
        const o = Model.rob.getHeroAddRate(this.buildingId);
        this.heroBuff.node.active = o >= 1;
        this.heroAddRateLabel.node.active = o < 1 && -1 != e.heroId;
        this.heroAddRateLabel.string = LanMgr.Instance.getLangByID("rob_hero_reward").replace("%{value}", (100 * (1 - o)).toFixed(1).toString() + "%");
        const r = -1 == e.heroId || (-1 != e.heroId && this.curSelectHeroId != e.heroId);
        this.addHeroBtn.node.active = r;
        this.removeHeroBtn.node.active = !r;
    }
    reuse(e) {
        this.enterType = e.enterType;
        this.buildingId = e.buildingId;
        this.curSelectHeroId = e.heroId;
    }
    ;
}
