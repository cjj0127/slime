import BattleWorld from "./BattleWorld";
import GuideMgr from "../guide/GuideMgr";
import { EInsertAdType, EOpenUIType } from "../common/ViedioType";
import LanMgr from "../common/Language";
import { MapUIPrefabs } from "../common/Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
import MyTools from "../../ccstudio/utils/MyTools";
const C: any = window["moment"];
// n.default = P
const { ccclass, property } = cc._decorator;
const I: any = window["_"];
@ccclass
export default class CtrlBaseBattle extends cc.Component {
    delegate: BattleWorld = null;
    paused: boolean;
    state: EBATTLE_STATE;
    init() {
    }
    levelFailed(e: number) {
        switch ((this.state = EBATTLE_STATE.Change, e)) {
            case EBATTLE_FAILED_REASON.HeroDead:
                MsgHint.tip(LanMgr.Instance.getLangByID("You have been defeated by the enemy."));
                break;
            case EBATTLE_FAILED_REASON.TimeOut:
                Model.ad.showInterstitial(EInsertAdType.RushAd, EOpenUIType.LevelFailed);
                MsgHint.tip(LanMgr.Instance.getLangByID("Time's up"));
        }
        this.onLevelFailed(e);
    }
    onLevelFailed(e) {
    }
    pause() {
        this.paused = true;
    }
    async popGameLost() {
        const t = LocalStorageTool.getItemLocal('bossWeakGuide');
        if (!GuideMgr.instance.isInGuide() && null != t) {
            if (Model.ui.getView(MapUIPrefabs.GameLost.path))
                return;
            const n = LocalStorageTool.getItemLocal('pop_game_lost_time');
            let o = null;
            if (!I.isNil(n))
                o = C(n);
            if (null == o || C(MyTools.GetTimeNow()).diff(o, 'seconds') > 300) {
                this.scheduleOnce(async () => {
                    await Model.ui.openViewAsync(MapUIPrefabs.GameLost);
                    LocalStorageTool.setItemLocal('pop_game_lost_time', C(MyTools.GetTimeNow()).format());
                }, 0.5);
            }
            else {
                Model.ad.showInterstitial(EInsertAdType.LevelAd, EOpenUIType.LevelFailed);
            }
        }
    }
    resume() {
        this.paused = false;
    }
}
export enum EBATTLE_STATE {
    None,
    Battle,
    Change,
    NextLevel,
    NextWave
}
export enum EBATTLE_FAILED_REASON {
    HeroDead = 1,
    TimeOut = 2
}