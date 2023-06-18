import _ExtralRewardConfig from "../config/_ExtralRewardConfig";
import ExtralRewardData from "../../modules/common/ExtralRewardData";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import QuestSevenChallenge from "../../modules/quest/QuestSevenChallenge";
import MyTools from "../utils/MyTools";
import UnlockCtrl from "../../modules/unlock/UnlockCtrl";
import { GameConst, EUNLOCKSYS_ID } from "../../modules/common/Const";
const m: any = window["moment"];
export default class SevenChallengeModel extends ModeBase {
    getSevenChallengeDay() {
        const e = this.getSevenChallengeOpenTime();
        if (e == -1) {
            return 1;
        }
        const t = Date.parse(e);
        return m(MyTools.GetDateNow()).diff(t, "day") + 1;
    }
    getSevenChallengeOpenTime() {
        return LocalStorageTool.getItemLocal("cc_user-seven-chanllenge-open-time", -1);
    }
    getToggleIndex() {
        let sevenChallengeDay = this.getSevenChallengeDay();
        if (sevenChallengeDay > 7) {
            sevenChallengeDay = 7;
        }
        return sevenChallengeDay - 1;
    }
    initLoadData() { }
    isOpen() {
        const sevenChallengeDay = this.getSevenChallengeDay();
        return sevenChallengeDay >= 1 && sevenChallengeDay <= GameConst.SEVENCHALLENGE_LAST_TIME && UnlockCtrl.Instance.isUnlock(EUNLOCKSYS_ID.SevenChallenge);
    }
    isShowAllQuestDot() {
        let count = 0;
        const sevenChallengeDay = this.getSevenChallengeDay();
        for (let o = 1; o <= sevenChallengeDay; o++) {
            if (QuestSevenChallenge.Instance.getDayReceiveEnableCount(o) > 0) {
                count++;
            }
        }
        return count > 0;
    }
    isShowAllRedDot() {
        let finishedQuestNum = QuestSevenChallenge.Instance.getFinishedQuestNum();
        let count = 0;
        const sevenChallengeDay = this.getSevenChallengeDay();
        for (let r = 0; r <= sevenChallengeDay; r++) {
            if (QuestSevenChallenge.Instance.getDayReceiveEnableCount(r) > 0) {
                count++;
            }
        }
        for (let r = 0; r <= 7; r++) {
            const data = ExtralRewardData.Instance.getData(r);
            const status = data.status;
            const a = _ExtralRewardConfig.Instance.get(r);
            if (a != null && finishedQuestNum >= a.number && status == 0) {
                count++;
            }
        }
        return count > 0;
    }
    isShowDayRedDot(e: number) {
        return e <= this.getSevenChallengeDay() && QuestSevenChallenge.Instance.getDayReceiveEnableCount(e) > 0;
    }
    load() {
        QuestSevenChallenge.Instance.load();
    }
    onDestroy() {
        cc.director.targetOff(this);
    }
    saveSevenChallengeOpenTime() {
        const currentDate = MyTools.GetDateNow();
        const e = currentDate.toDateString();
        LocalStorageTool.setItemLocal("cc_user-seven-chanllenge-open-time", e);
    }
}
