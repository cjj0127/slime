import { EVideoType } from "../../modules/common/ViedioType";
import LanMgr from "../../modules/common/Language";
import LocalStorageTool from "../utils/LocalStorage";
import _MineResearchConfig from "../config/_MineResearchConfig";
import ModeBase from "./ModelBase";
import Model from "./Model";
import NumberPlus from "../utils/NumberPlus";
import PropAddationEventTarget from "../../modules/common/PropAddation";
import MsgHint from "../../modules/common/MsgHint";
import MyTools from "../utils/MyTools";
import UserData, { AssetUseType } from "../../modules/user/UserData";
import { GlobalEventName } from "../../modules/common/Events";
import { E_ASSET_TYPE, GameConst, ENUM_PROP_TYPE, E_QUEST_ACTIVE_ID } from "../../modules/common/Const";
import AdsManager from "../../modules/ads/AdsManager";
export enum E_MINE_RESEARCH_STATUS {
    EClose,
    EOpen,
    EUpgrading,
    EComplete,
    EMaxLevel
}
const _: any = window['_'];
const moment: any = window["moment"];
export default class MineResearchModel extends ModeBase {
    private _currUpgradingId: number = 1;
    lastAdTime: any = null;
    props: any = {};
    researchDatas: any = {};
    researchTotalCnt: number = 0;
    
    
    activeProps() {
        _.each(this.props, (e) => {
            e.active();
        });
    }
    
    async adSkip(e) {
        if (this.currUpgradingId != e)
            return;
        const t = () => {
            const obj = this.getData(e);
            obj.adCnt++;
            this.lastAdTime = moment(MyTools.GetTimeNow());
            this.saveLastAdTime();
            this.save();
        };
        const n = {
            AdsType: EVideoType.AdMineResearch,
            OpenUi: EVideoType.AdMineResearch,
            onSucceed: t,
        };
        await AdsManager.getInstance().showRewardedVideo(n);
    }
    // save() { }
    // saveLastAdTime() { }
    // saveCount() { }
    
    complete() {
        if (!(this.currUpgradingId < 0)) {
            const data = this.getData(this.currUpgradingId);
            const instance = _MineResearchConfig.Instance.get(this.currUpgradingId);
            if (instance) {
                data.level == instance.maxLevel ? data.status = E_MINE_RESEARCH_STATUS.EMaxLevel : data.status = E_MINE_RESEARCH_STATUS.EOpen;
                const n = this.currUpgradingId;
                this.currUpgradingId = -1;
                cc.director.emit(GlobalEventName.MineResearchComplete, n);
                this.save();
            }
        }
    }
    
    createProp(e, t) {
        return _.toString(_MineResearchConfig.Instance.getIncreaseValue(e, t));
    }
    
    fastSkip(e) {
        if (this.currUpgradingId == e) {
            const t = this.getLvupLastTime(e);
            const n = _MineResearchConfig.Instance.getCompleteNeedDiams(e, t);
            if (parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Diamond)) < n) {
                MsgHint.warn(LanMgr.Instance.getLangByID("Not enough Gem!"));
            }
            else {
                UserData.Instance.subItem(E_ASSET_TYPE.Diamond, n, { type: AssetUseType.Mine });
                this.onUpgradDone();
            }
        }
    }
    
    fixedUpdate(dt) {
        if (this.currUpgradingId > 0 && this.getData(this.currUpgradingId).status == E_MINE_RESEARCH_STATUS.EUpgrading && this.getLvupLastTime(this.currUpgradingId) <= 0)
            this.onUpgradDone();
    }
    
    getAdCd() {
        if (this.lastAdTime) {
            const e = moment(MyTools.GetTimeNow()).diff(this.lastAdTime, "seconds");
            return e >= GameConst.MINE_RESEARCH_AD_CD ? 0 : GameConst.MINE_RESEARCH_AD_CD - e;
        }
        return 0;
    }
    
    getData(e) {
        return this.researchDatas[e] || {
            id: e,
            level: 0,
            adCnt: 0,
            status: E_MINE_RESEARCH_STATUS.EClose,
            start: null,
            prop: null,
        };
    }
    
    getLvupEnableDatas() {
        const e = [];
        const t = Model.mine.cubeCount;
        _.each(this.researchDatas, (n) => {
            if (n.status == E_MINE_RESEARCH_STATUS.EOpen) {
                const o = _MineResearchConfig.Instance.getExpend(n.id, n.level);
                if (t >= o)
                    e.push(n);
            }
        });
        return e;
    }
    
    getLvupLastTime(e) {
        const t = this.getData(e);
        const n = t.start;
        const o = moment(MyTools.GetTimeNow()).diff(n, "s");
        return this.getUpgradingNeedTime(e, t.level) - o - 1800 * t.adCnt;
    }
    
    
    getPropObj(e: string): PropAddationEventTarget {
        let prop = this.props[e];
        if (_.isNil(prop)) {
            prop = new PropAddationEventTarget();
            prop.setProp(e);
            prop.value = "0";
            this.props[e] = prop;
        }
        return prop;
    }
    
    getUpgradingNeedTime(e, t) {
        return _MineResearchConfig.Instance.getLevelUpDuration(e, t) * (100 / (100 + parseInt(Model.user.calcPropAddation(ENUM_PROP_TYPE.ResearchSpeedAdd))));
    }
    
    initLoadData() {
        if (this.currUpgradingId > 0) {
            const currResearchData = this.getData(this.currUpgradingId);
            if (currResearchData.status == E_MINE_RESEARCH_STATUS.EUpgrading && this.getLvupLastTime(this.currUpgradingId) <= 0) {
                this.onUpgradDone();
            }
        }
        this.reCalcProps();
        this.activeProps();
        // this.schedule(this.fixUpdate, .1, cc.macro.REPEAT_FOREVER);
        // cc.game.on(cc.game.EVENT_HIDE, () => {
        //     this.unschedule(this.fixUpdate);
        // });
        // cc.game.on(GlobalEvent.GameResume, () => {
        //     this.schedule(this.fixUpdate, .1, cc.macro.REPEAT_FOREVER, Math.random());
        // });
    }
    
    load() {
        this.currUpgradingId = -1;
        this.researchTotalCnt = LocalStorageTool.getItemLocal("cc_mine-research-total-count", 0);
        const lastAdTimeString = LocalStorageTool.getItemLocal("cc_mine-research-last-ad-time");
        this.lastAdTime = lastAdTimeString ? moment(lastAdTimeString) : null;
        const nowTime = moment(MyTools.GetTimeNow());
        if (this.lastAdTime && this.lastAdTime.isAfter(nowTime)) {
            this.lastAdTime = nowTime;
            this.saveLastAdTime();
        }
        let hasInvalidData = false;
        const researchLevelData = LocalStorageTool.getItemLocal("cc_mine-research-level-data", {});
        if (_.keys(researchLevelData).length == 0) {
            researchLevelData[1] = {
                id: 1,
                level: 0,
                adCnt: 0,
                status: E_MINE_RESEARCH_STATUS.EOpen,
                start: null,
                prop: this.createProp(1, 0)
            };
        }
        else {
            _.each(researchLevelData, (data) => {
                if (!_.isNil(data.start)) {
                    data.start = moment(data.start);
                    if (data.start.isAfter(nowTime)) {
                        data.start = nowTime;
                        hasInvalidData = true;
                    }
                }
                if (data.status == E_MINE_RESEARCH_STATUS.EUpgrading || data.status == E_MINE_RESEARCH_STATUS.EComplete) {
                    this.currUpgradingId = data.id;
                }
                data.prop = this.createProp(data.id, data.level);
            });
        }
        this.researchDatas = researchLevelData;
        if (hasInvalidData) {
            this.save();
        }
    }
    
    lvup(e) {
        if (this.currUpgradingId > 0)
            return !1;
        const t = this.getData(e);
        if (t.status != E_MINE_RESEARCH_STATUS.EOpen)
            return !1;
        const n = Model.mine.cubeCount;
        const o = _MineResearchConfig.Instance.getExpend(e, t.level);
        if (n < o)
            return !1;
        UserData.Instance.subItem(E_ASSET_TYPE.MineCube, o);
        t.status = E_MINE_RESEARCH_STATUS.EUpgrading;
        t.start = moment(MyTools.GetTimeNow());
        t.adCnt = 0;
        this.currUpgradingId = e;
        this.save();
        cc.director.emit(GlobalEventName.MineResearchStartUpgrading);
        return !0;
    }
    
    lvupEnable(e) {
        const t = this.getData(e);
        return t.status == E_MINE_RESEARCH_STATUS.EOpen && !(Model.mine.cubeCount < _MineResearchConfig.Instance.getExpend(e, t.level));
    }
    
    onUpgradDone() {
        const t = this.getData(this.currUpgradingId);
        t.level = t.level + 1;
        const n = _MineResearchConfig.Instance.get(this.currUpgradingId);
        t.status = E_MINE_RESEARCH_STATUS.EComplete;
        t.prop = _.toString(_MineResearchConfig.Instance.getIncreaseValue(t.id, t.level));
        this.reCalcPropType(n.propType);
        if (t.level == n.maxLevel) {
            const o = _MineResearchConfig.Instance.getUnlockSkills(this.currUpgradingId);
            o.forEach(e => {
                const t = _MineResearchConfig.Instance.get(e);
                const n = t.pre;
                if (n.every(e => this.getData(e).level == _MineResearchConfig.Instance.get(e).maxLevel)) {
                    const o = this.getData(e);
                    o.status = E_MINE_RESEARCH_STATUS.EOpen;
                    o.prop = this.createProp(e, o.level);
                    this.reCalcPropType(t.propType);
                    this.researchDatas[e] = o;
                    cc.director.emit(GlobalEventName.MineResearchUnlock, e);
                }
            });
        }
        this.save();
        cc.director.emit(GlobalEventName.MineResearchDone, this.currUpgradingId);
        this.researchTotalCnt++;
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.MineResearch, this.researchTotalCnt);
        this.saveCount();
    }
    //  researchDatas = [];
    //  currUpgradingId = 0;
    //  lastAdTime = null;
    //  researchTotalCnt = 0;
    
    reCalcPropType(e) {
        const t = this.getPropObj(e);
        t.value = "0";
        _.each(this.researchDatas, (n) => {
            if (_MineResearchConfig.Instance.get(n.id).propType == e) {
                const o = n.prop;
                t.value = NumberPlus.add(t.value, o);
            }
        });
        t.active();
    }
    
    reCalcProps() {
        _.each(this.props, (prop) => {
            prop.value = "0";
        });
        _.each(this.researchDatas, (researchData) => {
            const techData = _MineResearchConfig.Instance.get(researchData.id);
            const prop = researchData.prop;
            const propObj = this.getPropObj(techData.propType);
            propObj.value = NumberPlus.add(propObj.value, prop);
        });
    }
    
    save() {
        const data = {};
        _.each(this.researchDatas, (researchData) => {
            if (researchData.status !== E_MINE_RESEARCH_STATUS.EClose) {
                const d: any = {
                    id: researchData.id,
                    level: researchData.level,
                    status: researchData.status
                };
                if (this.currUpgradingId == researchData.id) {
                    d.start = researchData.start.format();
                    d.adCnt = researchData.adCnt;
                }
                data[researchData.id] = d;
            }
        });
        LocalStorageTool.setItemLocal("cc_mine-research-level-data", data);
    }
    
    saveCount() {
        LocalStorageTool.setItemLocal("cc_mine-research-total-count", this.researchTotalCnt);
    }
    
    saveLastAdTime() {
        if (this.lastAdTime) {
            LocalStorageTool.setItemLocal("cc_mine-research-last-ad-time", this.lastAdTime.format());
        }
    }
    set currUpgradingId(value: number) {
        this._currUpgradingId = value;
    }
    get currUpgradingId() {
        return this._currUpgradingId;
    }
}
