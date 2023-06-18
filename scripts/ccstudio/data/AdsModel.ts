import GuideMgr from "../../modules/guide/GuideMgr";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import MyTools from "../utils/MyTools";
import { EInsertAdType } from "../../modules/common/ViedioType";
import { GameConst } from "../../modules/common/Const";
const _: any = window["_"];
const moment: any = window["moment"];
export enum E_AD_TYPE {
    ePickax,
    eDrill,
    eBomb,
    eTailt,
    eExp
}
export default class AdsModel extends ModeBase {
    static Instance = null;
    bannerEnable = true;
    dailyAdDate = _.isNil(LocalStorageTool.getItemLocal("cc_ad_daily_date_key")) ? null : moment(LocalStorageTool.getItemLocal("cc_ad_daily_date_key"));
    dailyAdTimes = LocalStorageTool.getItemLocal("cc_ad_daily_times_key", {});
    interstitialEnable = true;
    addTodayTimes(e) {
        let t = _.get(this.dailyAdTimes, e, 0);
        _.set(this.dailyAdTimes, e, ++t);
        LocalStorageTool.setItemLocal("cc_ad_daily_times_key", this.dailyAdTimes);
    }
    clearAdInfo(e) {
        this.dailyAdTimes = {};
        this.dailyAdDate = e;
        LocalStorageTool.setItemLocal("cc_ad_daily_times_key", {});
        LocalStorageTool.setItemLocal("cc_ad_daily_date_key", e.valueOf());
    }
    fixedUpdate() {
        this.freshDailyAdTimes();
    }
    freshDailyAdTimes() {
        let e = moment(MyTools.GetTimeNow()).subtract(8, "hours").startOf("days").add(8, "hour");
        if (_.isNil(this.dailyAdDate)) {
            this.clearAdInfo(e);
        }
        else if (!e.isSame(moment(this.dailyAdDate), "days")) {
            this.clearAdInfo(e);
        }
    }
    getAdTimes(e) {
        return _.isNil(this.dailyAdTimes) ? 0 : _.get(this.dailyAdTimes, e, 0);
    }
    hideBanner() {
        // AdsManager.getInstance().hideBanner()
    }
    initLoadData() {
        this.freshDailyAdTimes();
        // this.schedule(this.fixUpdate, 1, cc.macro.REPEAT_FOREVER, Math.random());
        // cc.game.on(cc.game.EVENT_HIDE, () => {
        //     this.unschedule(this.fixUpdate);
        // });
        // cc.game.on(GlobalEvent.GameResume, () => {
        //     this.schedule(this.fixUpdate, 1, cc.macro.REPEAT_FOREVER, Math.random());
        // });
    }
    showBanner(e, t = false) {
        if (this.bannerEnable) {
            if (t) {
                let n = cc.director.getWinSizeInPixels();
                if (n.width / n.height >= 750 / 1334) {
                    return;
                }
            }
            let o = {
                OpenUi: e
            };
            // AdsManager.getInstance().showBanner(o)
        }
    }
    showInterstitial(e, t) {
        if (this.interstitialEnable && !GuideMgr.instance.isInGuide()) {
            if (e == EInsertAdType.LevelAd) {
                let n = Model.level.currNormalLevel;
                if (n <= GameConst.INADS_LEVELPART_ID[0])
                    return;
                if (n >= GameConst.INADS_LEVELPART_ID[0] && n < GameConst.INADS_LEVELPART_ID[1]) {
                    if ((n - GameConst.INADS_LEVELPART_ID[0]) % 3 != 0)
                        return;
                }
                else if (n >= GameConst.INADS_LEVELPART_ID[1] && n < GameConst.INADS_LEVELPART_ID[2]) {
                    if ((n - GameConst.INADS_LEVELPART_ID[1]) % 3 != 0)
                        return;
                }
                else if (n >= GameConst.INADS_LEVELPART_ID[2] && (n - GameConst.INADS_LEVELPART_ID[2]) % 2 != 0)
                    return;
            }
            let o = {
                AdsType: e,
                OpenUi: t
            };
            // AdsManager.getInstance().showInterstitialIfCooldown(o);
        }
    }
}
