import { GlobalEventName } from "../common/Events";
import { EUNLOCKSYS_ID, E_UNLOCK_STATE, MapUIPrefabs } from "../common/Const";
import Model from "../../ccstudio/data/Model";
import MyTools from "../../ccstudio/utils/MyTools";
import UnlockData from "../unlock/UnlockData";
import Utils_ from "../../ccstudio/utils/Utils";
import ChestDataBattle from "./ChestDataBattle";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ChestBattle extends cc.Component {
    @property(cc.Button)
    diamondChest: cc.Button = null;
    @property(cc.Button)
    goldChestBtn: cc.Button = null;
    private isFlying: boolean = false;
    private isRight: boolean = false;
    private isUp: boolean = false;
    @property(cc.Node)
    parent: cc.Node = null;
    @property(cc.Button)
    qipao: cc.Button = null;
    private roundTimes: number = 0;
    fixedUpdate(): void {
        if (Model.unlock.getData(EUNLOCKSYS_ID.FlyChest).state != E_UNLOCK_STATE.Locked) {
            let e = ChestDataBattle.Instance.getData();
            if (Model.ChestBattle.getCdTime(ChestDataBattle.Instance.getData().timePoint) <= 0 && 0 == e.state) {
                ChestDataBattle.Instance.getData().state = 1;
                ChestDataBattle.Instance.save();
                this.showChest(ChestDataBattle.Instance.getData());
            }
        }
    }
    getMaxY(): number {
        return Utils_.getRandomRange(-100, 0);
    }
    getMinY(): number {
        return Utils_.getRandomRange(-240, -140);
    }
    getShowPos(): cc.Vec3 {
        let e = Utils_.getRandomRange(-cc.winSize.width / 2 + 170, 0);
        let t = Utils_.getRandomRange(-240, 0);
        return cc.v3(e, t, 0);
    }
    obtainReward(): void {
        this.diamondChest.node.stopAllActions();
        let e = ChestDataBattle.Instance.getData();
        let t = ChestDataBattle.Instance.createData(e.type, e.state, e.timePoint);
        Model.ui.openViewAsync(MapUIPrefabs.UIBattleChest, {
            data: t
        });
        this.switchChest();
        this.parent.active = !1;
        this.stopFly();
    }
    onDestroy(): void {
        cc.director.targetOff(this);
        this.unschedule(this.fixedUpdate);
    }
    // goldChestBtn: cc.Button = null;
    // diamondChest: cc.Button = null;
    // qipao: cc.Button = null;
    // parent: cc.Node = null;
    onEnable(): void {
        this.qipao.node.on("click", this.obtainReward, this);
        cc.director.on(GlobalEventName.ShowBattleChest, this.showChest, this);
        cc.director.on(GlobalEventName.UnlockFlyChest, this.unlock, this);
        this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
        this.showChest(ChestDataBattle.Instance.getData());
    }
    playAni(): void { }
    playFlyAni(): void {
        this.node.stopAllActions();
        this.roundTimes = 0;
        this.isFlying = !0;
        this.isRight = !0;
        this.isUp = !0;
    }
    showChest(e: any): void {
        if (Model.unlock.getData(EUNLOCKSYS_ID.FlyChest).state == E_UNLOCK_STATE.Locked) {
            this.goldChestBtn.node.active = !1;
            this.diamondChest.node.active = !1;
            return;
        }
        let t = Model.ChestBattle.getCdTime(ChestDataBattle.Instance.getData().timePoint);
        this.parent.active = t <= 0;
        this.goldChestBtn.node.active = 0 == e.type && 1 == e.state && t <= 0;
        this.diamondChest.node.active = 1 == e.type && 1 == e.state && t <= 0;
        if (t <= 0) {
            this.node.position = this.getShowPos();
            this.playFlyAni();
        }
    }
    stopFly(): void {
        this.isFlying = !1;
        this.isRight = !1;
        this.isUp = !1;
    }
    switchChest(): void {
        let e = ChestDataBattle.Instance.getData();
        e.state = 0;
        e.type = 0 == e.type ? 1 : 0;
        e.timePoint = MyTools.GetTimeNow();
        ChestDataBattle.Instance.save();
    }
    unlock(): void {
        let e = ChestDataBattle.Instance.getData();
        e.timePoint = MyTools.GetTimeNow();
        ChestDataBattle.Instance.save();
        this.showChest(e);
    }
    update(): void {
        if (this.isFlying) {
            let e = 0;
            let t = 0;
            if (this.isRight) {
                e = this.node.position.x < cc.winSize.width / 2 - 170 ? 1 : 0;
                this.isRight = !1;
            }
            else {
                e = -1;
            }
            if (this.isUp) {
                t = this.node.position.y < this.getMaxY() ? 1 : 0;
                this.isUp = !1;
            }
            else {
                if (this.node.position.y > this.getMinY()) {
                    t = -1;
                }
                else {
                    this.isUp = !0;
                }
            }
            this.node.position = cc.v3(this.node.position.x + e, this.node.position.y + t);
            if (this.node.position.x < -cc.winSize.width / 2 + 170) {
                this.isRight = !0;
                this.roundTimes++;
                if (this.roundTimes >= 2) {
                    cc.tween(this.node).by(1, { position: cc.v3(-550, 0, 0) }).start();
                    this.isFlying = !1;
                    this.switchChest();
                }
            }
        }
    }
}
