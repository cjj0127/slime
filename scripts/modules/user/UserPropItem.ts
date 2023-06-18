import { GlobalEventName } from "../common/Events";
import { ENUM_PROP_TYPE, EUNLOCKSYS_ID, E_UnlockSysType, E_ASSET_TYPE, IMAGE_ICON_PATH_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
import BattleWorld from "../battle/BattleWorld";
import LanMgr from "../common/Language";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PropConfig from "../../ccstudio/config/_PropConfig";
import _SysUnlockConfig from "../../ccstudio/config/_SysUnlockConfig";
import MsgHint from "../common/MsgHint";
import UnlockCtrl from "../unlock/UnlockCtrl";
import UnlockData from "../unlock/UnlockData";
import UserData from "./UserData";
import UserProp from "./UserProp";
const _: any = window["_"];
const PROP_TYPE_MAP = {
    [ENUM_PROP_TYPE.ATK]: ENUM_PROP_TYPE.ATK,
    [ENUM_PROP_TYPE.BaseAtk]: ENUM_PROP_TYPE.ATK,
    [ENUM_PROP_TYPE.BlessAtk]: ENUM_PROP_TYPE.ATK,
    [ENUM_PROP_TYPE.HP]: ENUM_PROP_TYPE.HP,
    [ENUM_PROP_TYPE.BaseHP]: ENUM_PROP_TYPE.HP,
    [ENUM_PROP_TYPE.HPRecovery]: ENUM_PROP_TYPE.HPRecovery,
    [ENUM_PROP_TYPE.HPRecoveryRate]: ENUM_PROP_TYPE.HPRecovery,
    [ENUM_PROP_TYPE.CriticalHitChance]: ENUM_PROP_TYPE.CriticalHitChance,
    [ENUM_PROP_TYPE.CriticalHitDamage]: ENUM_PROP_TYPE.CriticalHitDamage,
    [ENUM_PROP_TYPE.ASPD]: ENUM_PROP_TYPE.ASPD,
    [ENUM_PROP_TYPE.BuffAspd]: ENUM_PROP_TYPE.ASPD,
    [ENUM_PROP_TYPE.DoubleShot]: ENUM_PROP_TYPE.DoubleShot,
    [ENUM_PROP_TYPE.TripleShot]: ENUM_PROP_TYPE.TripleShot,
};
const { ccclass, property } = cc._decorator;
@ccclass
export default class UserPropItem extends cc.Component {
    _levelInterval = 1;
    _touchInterval = 0.1;
    _touchStartInterval = 0.5;
    _touchTime = 0;
    _touched = false;
    @property(cc.Button)
    btnLevelUp = null;
    @property(cc.Label)
    coinsLabel = null;
    costCoins = [];
    @property(cc.Sprite)
    iconSprite = null;
    @property(cc.Label)
    levelLabel = null;
    @property(cc.Label)
    nameLabel = null;
    propId = ENUM_PROP_TYPE.NONE;
    @property(cc.Label)
    valueLabel = null;
    async init(e: number) {
        this.propId = e;
        let t = _PropConfig.Instance.get(this.propId);
        this.nameLabel.string = LanMgr.Instance.getLangByID(t.name);
        let n = cc.Color.WHITE;
        cc.Color.fromHEX(n, t.color);
        this.nameLabel.node.color = n;
        let o = this.iconSprite;
        o.spriteFrame = await AssetManager.Instance.loadSpriteFrame(NAMES_BUNDLE.Game, IMAGE_ICON_PATH_ + "/" + t.icon);
        this.refreshUi();
        this.refreshBtnStatus();
        this.refreshUnlockState(EUNLOCKSYS_ID.DoubleShotAtribute);
        this.refreshUnlockState(EUNLOCKSYS_ID.TripleShotAtribute);
    }
    lateUpdate(e: number) {
        if (this._touched) {
            this._touchTime -= e;
            if (this._touchTime <= 0) {
                this.tryLvup();
                this._touchTime += this._touchInterval;
                if (this._touchInterval > 0.05) {
                    this._touchInterval *= 0.9;
                }
                else {
                    this._levelInterval += 0.03;
                }
            }
        }
    }
    lvupEnd() {
        if (this._touched) {
            this._touched = false;
            // AnalyticsManager.getInstance().setUserProperty({
            //     Prop: UserProp.Instance.getCurEquipString()
            // });
            this.reportGoldUse();
            this.reportProp();
            if (this.propId == ENUM_PROP_TYPE.ATK) {
                // AnalyticsManager.getInstance().setUserProperty({
                //     UserAtk: Model.user.getHeroAtk()
                // });
            }
            else if (this.propId == ENUM_PROP_TYPE.HP) {
                // AnalyticsManager.getInstance().setUserProperty({
                //     UserHp: Model.user.getHeroHp()
                // });
            }
        }
    }
    lvupStart() {
        this.costCoins.length = 0;
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Coin, this.onUserCoinsChangeEvent, this);
        cc.director.on(GlobalEventName.UnlockDoubleShotAtribute, this.refreshUnlockState, this);
        cc.director.on(GlobalEventName.UnlockTripleShotAtribute, this.refreshUnlockState, this);
        cc.director.on(GlobalEventName.PropValueChange, this.onPropValueChange, this);
    }
    onLoad() {
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelHandler, this);
        this.btnLevelUp.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        this.btnLevelUp.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.btnLevelUp.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancelHandler, this);
        this.btnLevelUp.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelHandler, this);
    }
    onPropValueChange(id: number) {
        // if (this.propId != id && this.propId != PROP_TYPE_MAP[id]) {
        this.refreshUi();
        this.refreshBtnStatus();
        // }
    }
    onTouchCancelHandler() {
        this.lvupEnd();
    }
    onTouchMoveHandler(e: cc.Event.EventTouch) {
        if (!this.btnLevelUp.node['_hitTest'](e.getLocation())) {
            this.lvupEnd();
        }
    }
    onTouchStartHandler() {
        this._touched = true;
        this._touchTime = this._touchStartInterval;
        this._touchInterval = 0.1;
        this._levelInterval = 1;
        this.lvupStart();
        this.tryLvup();
    }
    public onUserCoinsChangeEvent(): void {
        this.refreshBtnStatus();
    }
    public refreshBtnStatus(): void {
        const isLevelUpEnable: boolean = UserProp.Instance.levelUpEnable(this.propId);
        const sprite: cc.Sprite = this.btnLevelUp.target.getComponent(cc.Sprite);
        const labelArr: cc.Label[] = this.btnLevelUp.target.getComponentsInChildren(cc.Label);
        if (isLevelUpEnable) {
            sprite.setState(cc.Sprite.State.NORMAL);
            _.each(labelArr, (label: cc.Label) => {
                label.node.color = cc.Color.WHITE;
            });
        }
        else {
            sprite.setState(cc.Sprite.State.GRAY);
            _.each(labelArr, (label: cc.Label) => {
                label.node.color = cc.Color.RED;
            });
        }
    }
    public refreshUi(): void {
        const data: any = UserProp.Instance.getData(this.propId);
        this.setLevel(data.level);
        this.setNeedCoins(data.needCoins);
        let t: any = null;
        switch (this.propId) {
            case ENUM_PROP_TYPE.ATK:
                t = Model.user.getHeroAtk();
                break;
            case ENUM_PROP_TYPE.HP:
                t = Model.user.getHeroHp();
                break;
            case ENUM_PROP_TYPE.ASPD:
                t = Model.user.getHeroAspd();
                break;
            case ENUM_PROP_TYPE.HPRecovery:
                t = Model.user.getHpRecovery();
                break;
            case ENUM_PROP_TYPE.CriticalHitChance:
                t = Model.user.getCriticalChance();
                break;
            case ENUM_PROP_TYPE.CriticalHitDamage:
                t = Model.user.getCriticalDamage();
                break;
            default:
                t = Model.user.calcProp(this.propId);
                break;
        }
        this.setValue(t);
        this.coinsLabel.string = NumberPlus.format(data.needCoins);
    }
    public refreshUnlockState(e: number): void {
        if (this.propId == ENUM_PROP_TYPE.DoubleShot && e == EUNLOCKSYS_ID.DoubleShotAtribute || this.propId == ENUM_PROP_TYPE.TripleShot && e == EUNLOCKSYS_ID.TripleShotAtribute) {
            const isUnlock: boolean = UnlockCtrl.Instance.isUnlock(e);
            UnlockCtrl.Instance.refreshUnlockNodeState(isUnlock, this.node);
            const n: cc.Label = this.node.getChildByName("lock").getChildByName("tip").getComponent(cc.Label);
            const o: UnlockData = _SysUnlockConfig.Instance.getUnlockDataBySysType(e);
            let r: string = LanMgr.Instance.getLangByID("DoubleShotUnlockTip");
            if (this.propId == ENUM_PROP_TYPE.TripleShot) {
                r = LanMgr.Instance.getLangByID("TripleShotUnlockTip");
            }
            // n.string = r.replace("{s}, "" + o.unlockValue);
            //@ts-ignore
            n.string = r.replace("{s}", "" + o.unlockValue);
        }
    }
    reportGoldUse() {
        UserProp.Instance.getData(this.propId);
        let e = "0";
        _.each(this.costCoins, function (t) {
            e = NumberPlus.add(e, t);
        });
        let t = {
            CostGoldNum: e,
            Prop_Type: ENUM_PROP_TYPE[this.propId]
        };
    }
    reportProp() {
        let e = UserProp.Instance.getData(this.propId);
        if (!(e.level < 100)) {
            let t = {
                Prop_Cost: e.totalCost,
                Prop_Level: e.level,
                Prop_Type: ENUM_PROP_TYPE[this.propId]
            };
        }
    }
    private setLevel(e: number): void {
        this.levelLabel.string = `Lv ${e}`;
        const isMaxLevel: boolean = UserProp.Instance.isMaxLevel(this.propId, e);
        if (this.btnLevelUp.interactable !== !isMaxLevel) {
            this.btnLevelUp.interactable = !isMaxLevel;
        }
        this.btnLevelUp.node.getChildByName("max").active = isMaxLevel;
    }
    private setNeedCoins(e: number): void {
        this.coinsLabel.string = NumberPlus.format(e);
    }
    private setValue(e: number): void {
        switch (this.propId) {
            case ENUM_PROP_TYPE.ATK:
            case ENUM_PROP_TYPE.HP:
            case ENUM_PROP_TYPE.HPRecovery:
                this.valueLabel.string = NumberPlus.format(e);
                break;
            case ENUM_PROP_TYPE.CriticalHitDamage:
                this.valueLabel.string = `${NumberPlus.format(e)}%`;
                break;
            case ENUM_PROP_TYPE.DoubleShot:
            case ENUM_PROP_TYPE.TripleShot:
            case ENUM_PROP_TYPE.CriticalHitChance:
                this.valueLabel.string = `${Number(e).toFixed(2)}%`;
                break;
            case ENUM_PROP_TYPE.ASPD:
                this.valueLabel.string = `${Number(e).toFixed(2)}`;
                break;
        }
    }
    tryLvup() {
        const value = Math.min(11, Math.floor(this._levelInterval));
        console.log("升级", this.propId, value);
        const obj = UserProp.Instance.levelUp(this.propId, value);
        const changeLevel = obj.changeLevel;
        const costCoins = obj.costCoins;
        if (changeLevel > 0) {
            this.costCoins.push(...costCoins);
            const info = UserProp.Instance.getData(this.propId);
            const level = info.level;
            UserProp.Instance.saveUserPropLevel(this.propId, level, info.totalCost);
            cc.director.emit(GlobalEventName.PropChange, this.propId);
            const s = UserProp.Instance.getQuestActiveId(this.propId);
            cc.director.emit(GlobalEventName.QuestBatchCommit, s, changeLevel, level);
            if (this.propId == ENUM_PROP_TYPE.ASPD) {
                cc.director.emit(GlobalEventName.UnlockValueChange, E_UnlockSysType.DoubleShot, level);
            }
            else if (this.propId == ENUM_PROP_TYPE.DoubleShot) {
                cc.director.emit(GlobalEventName.UnlockValueChange, E_UnlockSysType.TripleShot, level);
            }
            if (!UserData.Instance.modeLow) {
                BattleWorld.Instance.hero.view.playLvup();
            }
            SoundPlayerComp.Instance.playEffect("Audios/levelup_prop");
        }
        else {
            this.lvupEnd();
            MsgHint.tip(LanMgr.Instance.getLangByID("Not enough Coins!"));
        }
    }
}
