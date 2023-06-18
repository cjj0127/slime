import HelperAi from "./HelperAi";
import StateCustom from "../battle/StateCustom";
import { eEntityDir } from "../battle/EntityViewBase";
import { EAI_STATE } from "../battle/AiBase";
import BattleWorld from "../battle/BattleWorld";
import Utils_ from "../../ccstudio/utils/Utils";
const { ccclass, property } = cc._decorator;
@ccclass
export default class helper23103Ai extends HelperAi {
    public atkFre: number = 0.5;
    // target: any;
    atkRunningTime: number;
    delayTime: number;
    fsm: any; // 这里应该定义一个有状态属性的接口，为了快速转换，这里用any代替
    moveEngine: any;
    //TODO 原游戏没有找到这个方法
    checkRange(target: cc.Node) {
        return true;
    }
    public dodead() {
        this.fsm.setRunning(false);
    }
    onEnterAttack() {
        this.getEntity().view.playIdle();
        this.atkRunningTime = this.atkFre;
    }
    onEnterDelay() {
        this.delayTime = 0.5;
    }
    //     t.prototype.onEnterIdle = function() {
    //         this.moveEngine.setRunning(!1);
    //         var e = this.getEntity();
    //         e.view.playIdle();
    //         var t = e.assistant.node.x;
    //         e.assistant.node.y,
    //         this.node.x = t - 600;
    //         var n = BattleWorld.Instance.spawnNode;
    //         this.node.y = n.y + Utils.randomRange(.3 * -n.height, .3 * n.height);
    //         var o = BattleWorld.Instance.getRandomTarget()[0];
    //         o && o.checkAlive() ? (this.target = o, this.moveEngine.velocity = cc.v2(o.node.position.sub(this.node.position)).normalize()) : this.moveEngine.velocity = cc.Vec2.RIGHT,
    //         e.view.playIdle()
    //     },
    onEnterIdle() {
        this.moveEngine.setRunning(false);
        const entity = this.getEntity();
        entity.view.playIdle();
        const x = entity.assistant.node.x;
        this.node.x = x - 600;
        const instance = BattleWorld.Instance;
        const spawnNode = instance.spawnNode;
        this.node.y =
            spawnNode.y + Utils_.getRandomRange(0.3 * -spawnNode.height, 0.3 * spawnNode.height);
        const [target] = instance.getRandomTarget();
        if (target && target.checkAlive()) {
            this.target = target;
            this.moveEngine.velocity = cc.v2(target.node.position.sub(this.node.position)).normalize();
        }
        else {
            this.moveEngine.velocity = cc.Vec2.RIGHT;
        }
        entity.view.playIdle();
    }
    onEnterMove() {
        this.moveEngine.setRunning(true);
        const entity = this.getEntity();
        const dir = eEntityDir.Right;
        entity.view.setViewDir(dir);
        entity.view.playMove();
    }
    onEnterNone() {
        this.fsm.setRunning(false);
        this.moveEngine.setRunning(false);
    }
    onExitAttack() { }
    onExitIdle() { }
    onExitMove() {
        this.moveEngine.setRunning(false);
    }
    public onLoad() {
        super.onLoad();
        this.fsm.addState(new StateCustom(this, EAI_STATE.Delay, {
            enter: this.onEnterDelay,
            update: this.onUpdateDelay,
        }), "helper23103");
    }
    onUpdateAttack(dt: number) {
        this.atkRunningTime -= dt;
        if (this.atkRunningTime <= 0) {
            const entity = this.getEntity();
            entity.doattack(this.target);
            entity.playHurtSound();
            this.fsm.changeState(EAI_STATE.Delay);
        }
    }
    onUpdateDelay(dt: number) {
        this.delayTime -= dt;
        if (this.delayTime <= 0) {
            this.fsm.changeState(EAI_STATE.None), this.getEntity().kill();
        }
    }
    onUpdateIdle() {
        this.fsm.changeState(EAI_STATE.Move);
    }
    onUpdateMove() {
        this.node.zIndex = -this.node.y;
        const entity = this.getEntity();
        if (this.node.x - entity.assistant.node.x > 1200) {
            entity.kill();
            this.fsm.changeState(EAI_STATE.None);
            return;
        }
        if (this.target && this.target.checkAlive() || !(this.target = BattleWorld.Instance.getNearEnemys(this.node.position))) {
            if (this.target && this.target.node.x > this.node.x && this.checkRange(this.target)) {
                this.fsm.changeState(EAI_STATE.Attack);
            }
            else {
                const instance = BattleWorld.Instance;
                const spawnNode = instance.spawnNode;
                if (this.moveEngine.velocity.y > 0 &&
                    this.node.y > spawnNode.position.y + 0.5 * spawnNode.height) {
                    this.moveEngine.velocity.y *= -1;
                }
                else if (this.moveEngine.velocity.y < 0 &&
                    this.node.y < spawnNode.position.y - 0.5 * spawnNode.height) {
                    this.moveEngine.velocity.y *= -1;
                }
            }
        }
    }
    public revive() {
        this.fsm.setRunning(true);
    }
}
