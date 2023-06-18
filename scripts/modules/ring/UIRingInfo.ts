import { GlobalEventName } from "../common/Events";
import { Q_COLOR, ENUM_PROP_TYPE, E_ASSET_TYPE } from "../common/Const";
import MsgBox from "../common/MsgBox";
import LanMgr from "../common/Language";
import RingModel from "../../ccstudio/data/RingModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import AssetInfoUI from "../asset/AssetInfoUI";
import GradeLabelUI from "../battle/GradeLabelUI";
import UIRingEquipInfo from "./UIRingEquipInfo";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("UI/Common/UIRingInfo")
export default class UIRingInfo extends cc.Component {
    @property(cc.Label)
    atkUpLabel: cc.Label = null;
    @property(cc.Button)
    breakButton: cc.Button = null;
    @property(cc.Label)
    breakLabel: cc.Label = null;
    @property(cc.Button)
    equipButton: cc.Button = null;
    @property(cc.Label)
    hpUpLabel: cc.Label = null;
    @property(cc.Button)
    lvUpButton: cc.Button = null;
    @property(cc.Label)
    lvUpLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Node)
    propItem: cc.Node = null;
    @property(cc.Node)
    propParent: cc.Node = null;
    @property(GradeLabelUI)
    qualityLabel: GradeLabelUI = null;
    @property(cc.Label)
    ringChipLabel: cc.Label = null;
    @property(cc.Label)
    ringCountLabel: cc.Label = null;
    @property(cc.Node)
    ringIconNode: cc.Node = null;
    @property(UIRingEquipInfo)
    uiEquipInfo: UIRingEquipInfo = null;
    @property(cc.Button)
    unEquipButton: cc.Button = null;
    freshButton() {
        let e = Model.ring.getEquipRingId(), t = Model.ring.getSelectId(), n = -1 != t && e != t;
        this.breakButton.interactable = n;
        this.breakButton.node.active = -1 != t;
        let o = -1 != t && Model.ring.getCostCount(t) <= parseInt(Model.ring.getRingChipCount());
        this.lvUpButton.interactable = o;
        let r = -1 != t && Model.ring.canStrengthen(t);
        this.lvUpButton.node.active = r;
        let i = -1 != t && e != t;
        this.equipButton.interactable = i;
        let a = -1 != t && e != t;
        this.equipButton.node.active = a;
        let s = -1 != t && e == t;
        this.unEquipButton.interactable = s;
        let c = -1 != t && e == t;
        this.unEquipButton.node.active = c;
        -1 == t ?
            (this.breakLabel.string = "+0",
                this.lvUpLabel.string = "0") :
            (this.breakLabel.string = "+" + NumberPlus.format(Model.ring.getBreakCount(t)),
                this.lvUpLabel.string = NumberPlus.format(Model.ring.getCostCount(t)));
    }
    freshCount() {
        this.ringCountLabel.string = Model.ring.getRingCount() + "/" + Model.ring.getMaxRingCount();
        this.ringChipLabel.string = NumberPlus.format(Model.ring.getRingChipCount());
    }
    freshInfoView() {
        let e = Model.ring.getSelectId();
        if (-1 == e) {
            this.nameLabel.string = "";
            this.nameLabel.node.color = cc.color().fromHEX(Q_COLOR[1]);
            this.ringIconNode.color = cc.color().fromHEX(Q_COLOR[1]);
            this.qualityLabel.setEmpty();
            this.atkUpLabel.string = "";
            this.hpUpLabel.string = "";
        }
        else {
            let t = Model.ring.getRingCfg(e), n = Model.ring.getRingData(e);
            this.nameLabel.string = LanMgr.Instance.getLangByID(t.name);
            this.atkUpLabel.string = NumberPlus.format(Model.ring.getAtkUp(e)) + "%";
            this.hpUpLabel.string = NumberPlus.format(Model.ring.getHpUp(e)) + "%";
            this.qualityLabel.setGrade(n.quality);
            this.nameLabel.node.color = cc.color().fromHEX(Q_COLOR[n.quality - 1]);
            this.ringIconNode.color = cc.color().fromHEX(Q_COLOR[n.quality - 1]);
        }
    }
    freshProp() {
        let e = Model.ring.getSelectId();
        if (this.propParent.removeAllChildren(), -1 != e) {
            let t = Model.ring.getRingCfg(e), n = Model.ring.getRingData(e), o = n.propData, r = cc.instantiate(this.propItem), i = 22101 == t.skillID ? LanMgr.Instance.getLangByID("Skill Effect") : LanMgr.Instance.getLangByID("Skill Damage");
            i = LanMgr.Instance.getLangByID(_SkillConfig.Instance.get(t.skillID).name) + i;
            r.getChildByName("desc").getComponent(cc.Label).string = i;
            r.getChildByName("add").getComponent(cc.Label).string = NumberPlus.format(t.skillUP + n.ringLevel * t.skillUPLevel) + "%";
            r.active = !0;
            r.getChildByName("desc").color = cc.Color.GREEN;
            r.getChildByName("add").color = cc.Color.GREEN;
            r.parent = this.propParent;
            for (let s = 0; s < o.length; s++) {
                let u = cc.instantiate(this.propItem), d = _PropConfig.Instance.get(o[s].propId);
                u.getChildByName("desc").getComponent(cc.Label).string = LanMgr.Instance.getLangByID(d.name);
                u.getChildByName("add").getComponent(cc.Label).string = o[s].propId == ENUM_PROP_TYPE.SkillCd ? "-" + NumberPlus.format(o[s].value) + "%" : NumberPlus.format(o[s].value) + "%";
                u.getChildByName("desc").color = cc.Color.WHITE;
                u.getChildByName("add").color = cc.Color.WHITE;
                u.parent = this.propParent;
                u.active = !0;
            }
        }
    }
    freshSelect() {
        this.freshView();
    }
    freshView() {
        let e = Model.ring.getSelectId();
        this.uiEquipInfo.freshView(e);
        this.freshInfoView();
        this.freshProp();
        this.freshButton();
        this.freshCount();
    }
    onBreakClick() {
        let e = this;
        var t = MsgBox.open(LanMgr.Instance.getLangByID("Ring_BreaktTips_02"), LanMgr.Instance.getLangByID("Ring_BreaktTips_01"));
        t.confirm(function () {
            let t = Model.ring.getSelectId();
            Model.ring.breakDownRing(t),
                e.freshButton();
        });
        t.cancel();
    }
    onDestroy() { }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.FreshRingInfoView, this.freshView, this);
    }
    onEquipClick() {
        let e = Model.ring.getSelectId();
        Model.ring.equipRing(e),
            this.freshButton();
    }
    onLoad() {
        this.breakButton.node.on("click", this.onBreakClick, this);
        this.lvUpButton.node.on("click", this.onLvUpClick, this);
        this.equipButton.node.on("click", this.onEquipClick, this);
        this.unEquipButton.node.on("click", this.onUnEquipClick, this);
        this.ringChipLabel.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchIcon, this);
    }
    onLvUpClick() {
        let e = Model.ring.getSelectId();
        Model.ring.strengthenRing(e);
        this.freshButton();
    }
    onTouchIcon() {
        AssetInfoUI.addPopItem(E_ASSET_TYPE.RingChip, this.ringChipLabel.node.parent);
    }
    onUnEquipClick() {
        Model.ring.unEquipRing(),
            this.freshButton();
    }
}
