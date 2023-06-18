import _AssetConfig from "../config/_AssetConfig";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import _PassConfig from "../config/_PassConfig";
import _PassRewardsConfig from "../config/_PassRewardsConfig";
import QuestPass from "../../modules/quest/QuestPass";
import _ShopConfig from "../config/_ShopConfig";
import MyTools from "../utils/MyTools";
import UserData, { AssetGetType } from "../../modules/user/UserData";
import { EVideoType } from "../../modules/common/ViedioType";
import { GlobalEventName } from "../../modules/common/Events";
import { GameConst, MapUIPrefabs } from "../../modules/common/Const";
import AdsManager from "../../modules/ads/AdsManager";
import RewardPopUI from "../../modules/battle/RewardPopUI";
const moment: any = window["moment"];
const _: any = window["_"];
export default class PassModel extends ModeBase {
    private _dirty: boolean = false;
    private _exp: number = 0;
    private _level: number = 0;
    private _passActive: boolean = false;
    private _passAdTimes: number = 0;
    private _passId: number = 0;
    private _premiumActive: boolean = false;
    private _resetPassTime = null;
    public levelDatas: {
        [key: number]: {
            level: number;
            premiumReceived: boolean;
            normalReceived: boolean;
        };
    } = {};
    _activePremium() {
        this.premiumActive = !0,
            cc.director.emit(GlobalEventName.PassActivePremium);
    }
    activePass() {
        this.resetPass(),
            this.passActive = !0,
            this.resetPassTime = moment(MyTools.GetTimeNow()).subtract(8, "hour").startOf("day").add(30, "day").add(8, "hour");
    }
    addExp(e: any) {
        if (this.exp += e, this.level < GameConst.PASS_MAX_LEVEL) {
            if (this.exp >= GameConst.PASS_MAX_EXP) {
                while (true) {
                    if (this.exp -= GameConst.PASS_MAX_EXP, this.createLevelData(++this.level), this.level == GameConst.PASS_MAX_LEVEL) {
                        cc.director.emit(GlobalEventName.PassExtralExpChange);
                        break;
                    }
                    if (this.exp < GameConst.PASS_MAX_EXP)
                        break;
                }
                cc.director.emit(GlobalEventName.PassLevelChange);
            }
            else
                cc.director.emit(GlobalEventName.PassExpChange);
        }
        else
            cc.director.emit(GlobalEventName.PassExtralExpChange);
    }
    checkPassReset() {
        moment(MyTools.GetTimeNow()).isAfter(this.resetPassTime) && (this.resetPass(), this.passId = _PassConfig.Instance.getNext(this.passId), QuestPass.Instance.genAll(), this.resetPassTime = moment(MyTools.GetTimeNow()).subtract(8, "hour").startOf("day").add(30, "day").add(8, "hour"));
    }
    createLevelData(e: any) {
        return this.levelDatas[e] = {
            level: e,
            premiumReceived: !1,
            normalReceived: !1
        };
    }
    fixedUpdate(dt) {
        this.passActive && this.checkPassReset(),
            this._dirty && (this._dirty = !1, this.save());
    }
    getAdCount() {
        return this._passAdTimes;
    }
    getAllLevelData() {
        return this.levelDatas;
    }
    getExtralReceiveCount() {
        return this.passActive ? (this.level < GameConst.PASS_MAX_LEVEL ? 0 : this.exp < GameConst.PASS_MAX_EXP ? 0 : Math.floor(this.exp / GameConst.PASS_MAX_EXP)) : 0;
    }
    getLevelData(e: any) {
        return this.levelDatas[e];
    }
    getTotalCount() {
        return _ShopConfig.Instance.get(GameConst.PASS_SHOPID).price;
    }
    initLoadData() {
        const e = this;
        if (this.passActive) {
            let t = Math.min(this.level, GameConst.PASS_MAX_LEVEL);
            for (let n = 1; n <= t; n++) {
                const o = this.getLevelData(n);
                _.isNil(o) && this.createLevelData(n);
            }
            t == GameConst.PASS_MAX_LEVEL && this.exp >= GameConst.PASS_MAX_EXP && (this.level++, this.exp -= GameConst.PASS_MAX_EXP),
                this.checkPassReset();
        }
        else
            this.activePass();
        // this.schedule(this.fixUpdate, 1, cc.macro.REPEAT_FOREVER),
        //     cc.game.on(cc.game.EVENT_HIDE,
        //         function () {
        //             e.unschedule(e.fixUpdate)
        //         }),
        //     cc.game.on(GlobalEvent.GameResume,
        //         function () {
        //             e.schedule(e.fixUpdate, 1, cc.macro.REPEAT_FOREVER)
        //         })
    }
    load() {
        const e = LocalStorageTool.getItemLocal("cc_user-pass-datas", {});
        this._passId = _.get(e, "passId", _PassConfig.Instance.getFirstId()),
            this._passActive = _.get(e, "active", !1),
            this.levelDatas = _.get(e, "data", {}),
            this._level = _.get(e, "level", 0),
            this._exp = _.get(e, "exp", 0),
            this._premiumActive = _.get(e, "premium", !1);
        const t = _.get(e, "resetTime");
        if (this._resetPassTime = t ? moment(t) : null, this._passAdTimes = LocalStorageTool.getItemLocal("cc_passAdTimes", 0), this._resetPassTime) {
            const n = moment(MyTools.GetTimeNow()), o = moment(n).subtract(8, "hour").startOf("day").add(30, "day").add(8, "hour");
            this.resetPassTime.isAfter(o) && (this.resetPassTime = moment(n).subtract(8, "hour").startOf("day").add(30 - Math.ceil(this._level / 1.5), "day").add(8, "hour"));
        }
    }
    receiveExtralRewsrd() {
        if (!this.passActive)
            return false;
        if (this.level >= GameConst.PASS_MAX_LEVEL) {
            if (this.exp < GameConst.PASS_MAX_EXP)
                return false;
            const e = _PassConfig.Instance.get(this.passId).extraRewardId;
            const rewards = Model.user.useItem(e);
            Model.ui.openViewAsync(MapUIPrefabs.PassRewardView, {
                data: rewards
            });
            this.exp -= GameConst.PASS_MAX_EXP;
            this.level++;
            cc.director.emit(GlobalEventName.PassReceivedExtral);
            return true;
        }
        return false;
    }
    receiveNormallReward(e, t) {
        if (!this.passActive) {
            cc.warn("通信证未开通 level" + e);
            return false;
        }
        const o = this.getLevelData(e);
        if (_.isNil(o) || o.normalReceived) {
            cc.warn("没有找到对应的等级领取数据 或已领取 level" + e + " " + o);
            return false;
        }
        o.normalReceived = true;
        this._dirty = true;
        const r = _PassRewardsConfig.Instance.getLevel(this.passId, e);
        const i = r.itemId2;
        const a = r.count2;
        const s = _AssetConfig.Instance.get(i);
        if (_.isEmpty(s.useMethod)) {
            UserData.Instance.addItem(i, a, {
                sourcePos: t,
                type: AssetGetType.Pass
            });
            RewardPopUI.addPopItem(s.icon, a, 0, t);
        }
        else {
            const u = Model.user.useItem(i);
            Model.ui.openViewAsync(MapUIPrefabs.PassRewardView, {
                data: u
            });
        }
        cc.director.emit(GlobalEventName.PassReceivedNormal);
        return true;
    }
    receivePremiumReward(e, t) {
        if (!this.passActive) {
            cc.warn("通信证未开通 level" + e);
            return false;
        }
        if (!this.premiumActive) {
            cc.warn("高级通行证未开通 level" + e);
            return false;
        }
        const o = this.getLevelData(e);
        if (_.isNil(o) || o.premiumReceived) {
            cc.warn("没有找到对应的等级领取数据 或已领取 level" + e + " " + o + " ");
            return false;
        }
        o.premiumReceived = true;
        this._dirty = true;
        const r = _PassRewardsConfig.Instance.getLevel(this.passId, e);
        const i = r.itemId1;
        const a = r.count1;
        const s = _AssetConfig.Instance.get(i);
        if (_.isEmpty(s.useMethod)) {
            UserData.Instance.addItem(i, a, {
                sourcePos: t,
                type: AssetGetType.Pass
            });
            RewardPopUI.addPopItem(s.icon, a, 0, t);
        }
        else {
            const u = Model.user.useItem(i);
            Model.ui.openViewAsync(MapUIPrefabs.PassRewardView, {
                data: u
            });
        }
        cc.director.emit(GlobalEventName.PassReceivedPremium);
        return true;
    }
    async requestActivePremium() {
        let e;
        const onSucceed = () => {
            this._passAdTimes++;
            LocalStorageTool.setItemLocal("cc_passAdTimes", this._passAdTimes);
            _ShopConfig.Instance.get(GameConst.PASS_SHOPID).price <= this._passAdTimes && this._activePremium();
        };
        const t = {
            AdsType: EVideoType.AdPass,
            OpenUi: EVideoType.AdPass,
            onSucceed
        };
        await AdsManager.getInstance().showRewardedVideo(t);
    }
    resetPass() {
        this.level = 0,
            this.exp = 0,
            this.premiumActive = !1,
            this.levelDatas = {},
            this._dirty = !0,
            this._passAdTimes = 0,
            LocalStorageTool.setItemLocal("cc_passAdTimes", 0);
    }
    save() {
        const data = {
            active: this.passActive,
            data: {},
            exp: this.exp,
            level: this.level,
            passId: this.passId,
            premium: this.premiumActive,
            resetTime: this.resetPassTime?.format(),
        };
        _.values(this.levelDatas).forEach((val) => {
            data.data[val.level] = {
                level: val.level,
                premiumReceived: val.premiumReceived,
                normalReceived: val.normalReceived,
            };
        });
        // Object.values(this.levelDatas).forEach((val) => {
        //     data.data[val.level] = {
        //         level: val.level,
        //         premiumReceived: val.premiumReceived,
        //         normalReceived: val.normalReceived,
        //     };
        // });
        LocalStorageTool.setItemLocal("cc_user-pass-datas", data);
    }
    ;
    public set exp(val: number) {
        this._exp = val;
        this._dirty = true;
    }
    public get exp(): number {
        return this._exp;
    }
    public set level(val: number) {
        this._level = val;
        this._dirty = true;
    }
    public get level(): number {
        return this._level;
    }
    public set passActive(val: boolean) {
        this._passActive = val;
        this._dirty = true;
    }
    public get passActive(): boolean {
        return this._passActive;
    }
    public set passId(val: number) {
        this._passId = val;
        this._dirty = true;
    }
    public get passId(): number {
        return this._passId;
    }
    public set premiumActive(val: boolean) {
        this._premiumActive = val;
        this._dirty = true;
    }
    public get premiumActive(): boolean {
        return this._premiumActive;
    }
    public set resetPassTime(val) {
        this._resetPassTime = val;
        this._dirty = true;
    }
    public get resetPassTime() {
        return this._resetPassTime;
    }
}
