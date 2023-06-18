import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE, MapUIPrefabs } from "../common/Const";
import BattleWorld from "../battle/BattleWorld";
import UiModel from "../../ccstudio/data/UiModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import ToastAtkView from "../common/ToastAtkView";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UserBattleValue extends cc.Component {
    // totalAtk: cc.Label;
    // totalAtkValue: number;
    _drity: boolean;
    _drityTime: number;
    private _preBattleValue: number = null;
    @property(cc.Label)
    totalAtk: cc.Label = null;
    // @property(cc.Integer)
    totalAtkValue: number = 0;
    changeBattle() {
        if (!this._drity) {
            this._preBattleValue = this.totalAtkValue;
        }
        this._drity = true;
        this._drityTime = 0;
    }
    lateUpdate(e: number) {
        if (this._drity) {
            this._drityTime += e;
            if (this._drityTime > .2) {
                this._drity = false;
                this.popBattleValueChange();
            }
        }
    }
    // _preBattleValue: number;
    onEnable() {
        this.setAtk(Model.user.calcTotalAtk());
        cc.director.on(GlobalEventName.PropChange, this.onPropChange, this);
    }
    onPropChange() {
        if (BattleWorld.Instance.currGameModeType != E_GAME_LEVEL_TYPE.LegionRush) {
            this.setAtk(Model.user.calcTotalAtk());
        }
    }
    // async popBattleValueChange() {
    //     let e = "";
    //     let o = false;
    //     if (NumberPlus.compare(this.totalAtkValue, this._preBattleValue)) {
    //         if ("0" !== (e = NumberPlus.sub(this.totalAtkValue, this._preBattleValue))) {
    //             const t = NumberPlus.format(this.totalAtkValue);
    //             const n = "" + NumberPlus.format(e);
    //             o = true;
    //         }
    //     } else {
    //         const r = NumberPlus.sub(this._preBattleValue, this.totalAtkValue);
    //         const t = NumberPlus.format(this.totalAtkValue);
    //         const n = "" + NumberPlus.format(r);
    //         o = false;
    //     }
    //     if ("0" == e) {
    //         // ignore the missing code
    //     } else {
    //         const view = await Model.ui.openViewAsync(UIPrefabs.ToastAtk);
    //         view.getComponent(ToastAtkView).tip(t, n, o)
    //     }
    // }
    async popBattleValueChange() {
        let up = false;
        var atk = "";
        var atkadd = "";
        if (NumberPlus.compare(this.totalAtkValue, this._preBattleValue)) {
            const diff = NumberPlus.sub(this.totalAtkValue, this._preBattleValue);
            if ("0" !== diff) {
                atk = NumberPlus.format(this.totalAtkValue);
                atkadd = NumberPlus.format(diff);
            }
            ;
            up = true;
            let view: cc.Node = await Model.ui.openViewAsync(MapUIPrefabs.ToastAtk);
            view.getComponent(ToastAtkView).tip(atk, atkadd, up);
        }
        else {
            const r = NumberPlus.sub(this._preBattleValue, this.totalAtkValue);
            atk = NumberPlus.format(this.totalAtkValue);
            atkadd = NumberPlus.format(r);
        }
        ;
        up = false;
        let view: cc.Node = await Model.ui.openViewAsync(MapUIPrefabs.ToastAtk);
        view.getComponent(ToastAtkView).tip(atk, atkadd, up);
    }
    setAtk(e: number) {
        if (this.totalAtkValue) {
            this.changeBattle();
        }
        this.totalAtkValue = e;
        this.totalAtk.string = NumberPlus.format(e);
    }
}
