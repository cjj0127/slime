import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { E_ASSET_TYPE, E_SUMMON_TYPE } from "../common/Const";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import ISummonResultView from "../shop/ISummonResultView";
import LanMgr from "../common/Language";
import RobModel from "../../ccstudio/data/RobModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import PlunderLevel from "../common/PlunderLevel";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import MyTools from "../../ccstudio/utils/MyTools";
import RobLevelUpRewardItemUI from "./RobLevelUpRewardItemUI";
import UserData, { AssetGetType } from "../user/UserData";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class RobLevelUpViewUI extends ISummonResultView {
    @property(cc.Button)
    closeBtn: cc.Button = null;
    curIndex = -1;
    isSummonBoxType = false;
    @property(cc.RichText)
    lvAddLabel: cc.RichText = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Prefab)
    normalRewardItemPrafab: cc.Prefab = null;
    @property(cc.Node)
    skinNode: cc.Node = null;
    upLevels = [-1];
    createItem(e) {
        const t = this.getCfg(e.type, e.id);
        return this.addItem(t.quality, t.icon, t.name, e.id, e.type);
    }
    onClose() {
        if (this.getComponent(ViewAnimCtrl).onClose(), this.curIndex + 1 < this.upLevels.length && Model.rob.popLevelUpView(this.upLevels, this.curIndex + 1), this.curIndex + 1 == this.upLevels.length) {
            for (var e = this.node.convertToWorldSpaceAR(cc.Vec3.ZERO), t = PlunderLevel.Instance.getLevelsReward(this.upLevels), n = 0; n < t.ids.length; n++) {
                var o = t.ids[n], r = t.nums[n];
                UserData.Instance.flyAddItem(o, r, {
                    sourcePos: e,
                    type: AssetGetType.Plunder
                });
            }
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRobLevelButton);
        }
    }
    onLoad() {
        super.onLoad();
        this.closeBtn.node.on("click", this.onClose, this);
    }
    playReceiveAni() {
        this.skinNode.active && (this.skinNode.stopAllActions(), cc.tween(this.skinNode).by(5, {
            angle: 360
        }).repeatForever().start());
    }
    async playResults() {
        const e = this.upLevels[this.curIndex], t = PlunderLevel.Instance.get(e);
        this.lvAddLabel.string = `<color=#FFFFFF>${LanMgr.Instance.getLangByID("RobLvAdd").replace("%{value}", "</c><color=##FFF900>" + t.plunderAdd + "%</color>")}`;
        this.lvLabel.string = e.toString();
        this.playReceiveAni();
        if (this.isSummonBoxType) {
            await this.showResult();
        }
        else {
            await this.showNormalResult();
        }
    }
    reuse(e) {
        this.upLevels = e.upLevels;
        this.curIndex = e.curIndex;
        const t = e.upLevels[this.curIndex], n = PlunderLevel.Instance.get(t), o = n.ids[0];
        if (this.isSummonBoxType = o == E_ASSET_TYPE.SummonBox || o == E_ASSET_TYPE.SummonBoxBig || o == E_ASSET_TYPE.SummonBoxSuper,
            this.isSummonBoxType) {
            const r = Model.user.useItem(n.ids[0]);
            this.results = r;
        }
        else
            for (let i = 0; i < n.ids.length; i++) {
                const a = n.ids[i], s = n.nums[i];
                this.results.push({
                    id: a,
                    num: s
                });
            }
    }
    async showNormalResult() {
        this.layout.node.removeAllChildren();
        this.layout.node.setAnchorPoint(.5, .5);
        this.layout.type = cc.Layout.Type.HORIZONTAL;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.scheduleOnce(() => {
            _.each(this.results, t => {
                const n = cc.instantiate(this.normalRewardItemPrafab);
                n.parent = this.layout.node;
                this.layout.updateLayout();
                n.getComponent(RobLevelUpRewardItemUI).setItemInfo(t.id, t.num);
            });
        }, .1);
    }
    async showResult() {
        this.layout.node.setAnchorPoint(.5, 1);
        this.layout.type = cc.Layout.Type.HORIZONTAL;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.layout.node.height = this.layoutOriginHeight;
        let e = 0, t = 0;
        while (t < this.results.length) {
            const n = this.results[t], o = this.createItem(n);
            this.items.push(o);
            if (t < 5) {
                o.node.y = 0;
            }
            else if (t == 5) {
                this.layout.node.width = this.layoutOriginWidth;
                this.layout.type = cc.Layout.Type.GRID;
            }
            else if (t == 25) {
                this.scrollView.enabled = true;
            }
            this.layout.enabled = true;
            this.layout.updateLayout();
            this.layout.enabled = false;
            this.scrollView.content.height = Math.max(this.layoutOriginHeight, this.layout.node.height);
            const r = Math.floor(t / 5);
            if (r !== e) {
                e = r;
                this.scrollView.scrollToBottom(0);
            }
            let i = .015, a = false, s = 0;
            switch (n.type) {
                case E_SUMMON_TYPE.Gear:
                case E_SUMMON_TYPE.Weapon:
                case E_SUMMON_TYPE.Armor:
                    const h = _GearConfig.Instance.get(n.id);
                    if (h.quality >= 4 && n.isNew) {
                        i += .6;
                        a = true;
                    }
                    s = h.quality;
                    break;
                case E_SUMMON_TYPE.Skill:
                    const f = _SkillConfig.Instance.get(n.id);
                    if (f.quality >= 4 && n.isNew) {
                        i += .6;
                        a = true;
                    }
                    s = f.quality;
                    break;
                case E_SUMMON_TYPE.Partner:
                    const u = _PartnerConfig.Instance.get(n.id);
                    if (u.quality >= 4 && n.isNew) {
                        i += .6;
                        a = true;
                    }
                    s = u.quality;
                    break;
            }
            o.node.stopAllActions();
            if (a) {
                o.node.scale = 1.8;
                cc.tween(o.node).delay(.1).to(.16, {
                    scale: 1
                }, {
                    easing: cc.easing.sineIn
                }).start();
            }
            else {
                o.node.scale = 1.2;
                cc.tween(o.node).to(.1, {
                    scale: 1
                }).start();
            }
            o.playGlow(s);
            await MyTools.sleep(i);
            ++t;
        }
    }
}
