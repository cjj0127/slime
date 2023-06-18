import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { EUNLOCKSYS_ID, E_GAME_LEVEL_TYPE, E_MenuPageId, E_ToggleHeroType, E_UNLOCK_STATE } from "../common/Const";
import BattleWorld from "../battle/BattleWorld";
import Model from "../../ccstudio/data/Model";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import _SysUnlockConfig from "../../ccstudio/config/_SysUnlockConfig";
import SkillBattleSlotUI from "./SkillBattleSlotUI";
import UnlockCtrl from "../unlock/UnlockCtrl";
import nlockData from "../unlock/UnlockData";
const b: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillBattleSlotsUI extends cc.Component {
    @property(cc.Node)
    public autoNode: cc.Node = null;
    @property(cc.Label)
    public autoStatus: cc.Label = null;
    @property(cc.Button)
    public btnAuto: cc.Button = null;
    @property(SkillBattleSlotUI)
    public slots: SkillBattleSlotUI[] = [];
    checkUnlockSkillSlot(e) {
        const t = this.slots[Model.skill.convertSkillSysIdToSlotIndex(e)];
        if (t) {
            const n = Model.unlock.getData(e);
            if (n.state == E_UNLOCK_STATE.WaitUnlock) {
                Model.unlock.unlock(e);
                Model.ui.closeAll();
                t.playUnlockAni();
            }
            else if (n.state == E_UNLOCK_STATE.Unlocked) {
                t.hideLock();
            }
            else if (n.state == E_UNLOCK_STATE.Locked) {
                t.showLock(e);
            }
        }
        this.showLock(EUNLOCKSYS_ID.Skill);
    }
    clear() {
        b.each(this.slots, (e) => {
            e.clear();
        });
    }
    clearState(e) {
        const t = this.slots[e];
        t && t.showEmpty();
    }
    onClickAuto() {
        Model.skill.auto = !Model.skill.auto;
        this.refreshAutoStatus();
    }
    onClickSlot(e) {
        const t = e.getComponent(SkillBattleSlotUI).slotIndex;
        const n = Model.skill.getEquipedId(t);
        if (n >= 0) {
            BattleWorld.Instance.skillCtrl.manualReleaseSkill(n);
        }
        else if (BattleWorld.Instance.currGameModeType == E_GAME_LEVEL_TYPE.Normal) {
            cc.director.emit(GlobalEventName.ChangeMenu, E_MenuPageId.Hero, E_ToggleHeroType.Skill);
        }
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        const t = Model.skill.equippedIds;
        b.each(t, (t, n) => {
            this.setSkill(n, t);
        });
        this.refreshAutoStatus();
        cc.director.on(GlobalEventName.SkillEquipedChange, this.onSlotEquipChange, this);
        cc.director.on(GlobalEventName.UnlockSkill, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol2, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol3, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol4, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol5, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol6, this.checkUnlockSkillSlot, this);
    }
    onLoad() {
        if (this.slots.length == 0) {
            this.slots = this.getComponentsInChildren(SkillBattleSlotUI);
        }
        b.each(this.slots, (t, n) => {
            t.slotIndex = n,
                t.node.on("click", this.onClickSlot, this);
            const o = EUNLOCKSYS_ID.Skill + n;
            this.checkUnlockSkillSlot(o);
        });
        this.btnAuto.node.on("click", this.onClickAuto, this);
    }
    onSlotEquipChange(e) {
        const t = Model.skill.getEquipedId(e);
        this.setSkill(e, t);
    }
    refreshAutoStatus() {
        const e = Model.skill.auto;
        this.autoNode.active = e;
        this.autoStatus.string = e ? LanMgr.Instance.getLangByID("AUTO ON").replace(" ", "") : LanMgr.Instance.getLangByID("AUTO OFF").replace(" ", "");
    }
    setSkill(e, t) {
        const n = this.slots[e];
        if (n) {
            n.skillId = t;
            if (t >= 0) {
                const o = _SkillConfig.Instance.get(t);
                n.showItem(o.icon, "" + t);
            }
            else {
                n.showEmpty();
            }
        }
    }
    showLock(e) {
        if (e == EUNLOCKSYS_ID.Skill) {
            const t = Model.unlock.getData(e);
            const n = this.btnAuto.node.getChildByName("lock");
            n.active = t.state == E_UNLOCK_STATE.Locked;
            n.getComponent(cc.Button) || n.addComponent(cc.Button);
            n.getComponent(cc.Button).node.on("click", () => {
                const t = _SysUnlockConfig.Instance.getUnlockDataBySysType(e);
                UnlockCtrl.Instance.showUnclockTips(t);
            }, this);
        }
    }
    updateCdProgress(e, t, n) {
        const o = Model.skill.getEquipedIdx(e);
        if (o !== -1) {
            const r = this.slots[o];
            r && r.setCdProgress(t, n);
        }
    }
    updateDurationProgress(e, t, n) {
        const o = Model.skill.getEquipedIdx(e);
        if (o !== -1) {
            const r = this.slots[o];
            r && r.setDurtionProgress(t, n);
        }
    }
    updateState(e, t) {
        const n = Model.skill.getEquipedIdx(e);
        if (n !== -1) {
            const o = this.slots[n];
            o && o.setStatus(t);
        }
    }
}
