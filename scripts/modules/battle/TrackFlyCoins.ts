import BattleWorld from "./BattleWorld";
import FSM from "./FSM";
import TrackMove from "./TrackMove";
import StateCustom from "./StateCustom";
var d = cc.misc.degreesToRadians(5);
// import TrackMove from "TrackMove";
const { ccclass, property } = cc._decorator;
export enum eActionType {
    None,
    Fire,
    Stand,
    Follow,
    Track
}
@ccclass
export default class TrackFlyCoins extends TrackMove {
    private __moveFsm: FSM = null;
    public btnTrack: boolean = false;
    public duration: number = .5;
    // public initRotateRange: number 
    public fireHeight: number = 160;
    // @property
    // protected speed: number;
    @property
    protected initRotateRange: number = cc.misc.degreesToRadians(30);
    public owner: any = null;
    public rotateMax: number = 0;
    public rotateSpeed: number = 0;
    public speedAdd: number = 1;
    public trackStartPos: cc.Vec2 = null;
    public trackTime: number = 0;
    public getFighterPos(): any {
        return this.node.position;
    }
    public getIsFacingRight(): boolean {
        return this.node.scaleX > 0;
    }
    // private __moveFsm: s;
    // private velocity: cc.Vec2;
    // private rotateMax: number;
    // private speedAdd: number;
    // private duration: number;
    // private rotateSpeed: number;
    // private trackTime: number;
    // private trackStartPos: cc.Vec2;
    // private btnTrack: boolean;
    // private fireHeight: number;
    // private speed: number;
    public init(): void {
        if (!this.__moveFsm) {
            const fsm = new FSM();
            fsm.init(this);
            fsm.addState(new StateCustom(this, eActionType.None), "BulletCoin CoinNone");
            fsm.addState(new StateCustom(this, eActionType.Fire, {
                enter: this.onFireEnter.bind(this),
                update: this.onUpdateFire.bind(this),
            }), "BulletCoin Fire");
            fsm.addState(new StateCustom(this, eActionType.Stand, {
                enter: this.onStandEnter.bind(this),
                update: this.onUpdateStand.bind(this),
            }), "BulletCoin Stand");
            fsm.addState(new StateCustom(this, eActionType.Follow, {
                enter: this.onFollowEnter.bind(this),
                update: this.onUpdateFollow.bind(this),
            }), "BulletCoin Follow");
            fsm.addState(new StateCustom(this, eActionType.Track, {
                enter: this.onTrackEnter.bind(this),
                update: this.onUpdateTrack.bind(this),
            }), "BulletCoin Track");
            this.__moveFsm = fsm;
        }
        this.velocity = cc.v2(0, 1);
        this.velocity.rotateSelf(2 * (Math.random() - 0.5) * this.initRotateRange);
        this.rotateMax = 0.5 * d + Math.random() * d * 0.5;
        this.__moveFsm.setRunning(true);
        this.__moveFsm.enterState(eActionType.Fire);
        this.setRunning(true);
    }
    public onAttackEnd(): void { }
    public onAttackStart(target: unknown): void { }
    private onFireEnter(): void {
        this.duration = this.fireHeight / this.speed;
        this.rotateSpeed =
            Math.random() > 0.6 ? 0.2 * this.rotateMax : -0.2 * this.rotateMax;
    }
    private onFollowEnter(): void {
        const targetWorldPos = this.owner.node.convertToWorldSpaceAR(cc.Vec3.ZERO)
            .add(cc.v3(0, this.fireHeight, 0));
        const nodeWorldPos = this.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const offset = cc.v2(targetWorldPos.sub(nodeWorldPos));
        this.velocity = offset.normalize();
        this.rotateSpeed = 5 * this.rotateMax;
        this.speedAdd = 2;
    }
    protected onLoad(): void { }
    public onMoveEnd(): void { }
    public onMoveStart(): void { }
    private onStandEnter(): void {
        this.speedAdd = 1;
        this.rotateSpeed = this.velocity.x > 0 ? this.rotateMax : -this.rotateMax;
        this.duration = 0.5 * Math.random();
    }
    public onStep(deltaTime: number): void {
        this.__moveFsm.fixedUpdate(deltaTime);
    }
    private onTrackEnter(): void {
        this.rotateSpeed = 5 * this.rotateMax;
        this.speedAdd = 3;
        this.btnTrack = false;
    }
    private onUpdateFire(deltaTime: number): void {
        this.velocity.rotateSelf(this.rotateSpeed);
        const step: any = this.velocity.mul(deltaTime * this.speed);
        this.node.setPosition(this.node.position.add(step));
        this.duration -= deltaTime;
        if (this.duration < 0) {
            this.__moveFsm.changeState(eActionType.Stand);
        }
    }
    private onUpdateFollow(deltaTime: number): void {
        const targetWorldPos = this.owner.node.convertToWorldSpaceAR(cc.Vec3.ZERO)
            .add(cc.v3(0, this.fireHeight, 0));
        const nodeWorldPos = this.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const offset = cc.v2(targetWorldPos.sub(nodeWorldPos));
        if (Math.abs(offset.x) < 30) {
            const rotateAngle = offset
                .normalize()
                .signAngle(this.velocity.normalize());
            if (rotateAngle > 5 * this.rotateMax) {
                this.rotateSpeed = 5 * -this.rotateMax;
            }
            else if (rotateAngle < 5 * -this.rotateMax) {
                this.rotateSpeed = 5 * this.rotateMax;
            }
            else {
                this.rotateSpeed = rotateAngle;
            }
            this.velocity.rotateSelf(this.rotateSpeed);
            this.speedAdd = this.owner.moveEngine.speed / this.speed;
        }
        else {
            this.velocity = offset.normalize();
        }
        const step: any = this.velocity.mul(deltaTime * this.speedAdd * this.speed);
        this.node.setPosition(this.node.position.add(step));
        this.node.angle = Math.atan2(step.y, step.x) * cc.macro.DEG;
        if (!this.delegate.target || !BattleWorld.Instance.getNearEnemys(this.node.position, 750)) {
            this.__moveFsm.changeState(eActionType.Track);
        }
    }
    public onUpdateMoveFlag(flag: boolean): void { }
    private onUpdateStand(deltaTime: number): void {
        this.duration -= deltaTime;
        if (this.duration <= 0 &&
            (!this.delegate.target ||
                !BattleWorld.Instance.getNearEnemys(this.node.position, 750))) {
            this.__moveFsm.changeState(eActionType.Track);
        }
        else {
            const targetWorldPos = this.owner.node.convertToWorldSpaceAR(cc.Vec3.ZERO)
                .add(cc.v3(0, this.fireHeight, 0));
            const nodeWorldPos = this.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            const offset = cc.v2(targetWorldPos.sub(nodeWorldPos));
            if (Math.abs(offset.x) > 200) {
                this.__moveFsm.changeState(eActionType.Follow);
            }
            else {
                let rotateAngle = this.velocity.angle(offset);
                if (rotateAngle < this.rotateMax) {
                    rotateAngle = offset.normalize().signAngle(this.velocity.normalize());
                    if (rotateAngle > 0) {
                        if (rotateAngle > this.rotateMax) {
                            this.rotateSpeed = this.rotateMax;
                        }
                        else {
                            this.rotateSpeed = rotateAngle;
                        }
                    }
                    else {
                        if (rotateAngle < -this.rotateMax) {
                            this.rotateSpeed = -this.rotateMax;
                        }
                        else {
                            this.rotateSpeed = rotateAngle;
                        }
                    }
                }
                else {
                    this.rotateSpeed = this.rotateMax;
                }
                this.velocity.rotateSelf(this.rotateSpeed);
                const step: any = this.velocity.mul(deltaTime * this.speed);
                this.node.setPosition(this.node.position.add(step));
                this.node.angle = Math.atan2(step.y, step.x) * cc.macro.DEG;
            }
        }
    }
    private onUpdateTrack(deltaTime: number): void {
        const offset = cc.v2(this.delegate.targetPos.sub(this.node.position));
        const isRotateFinish = this.velocity.angle(offset) <= this.rotateSpeed;
        if (this.btnTrack || isRotateFinish) {
            if (!this.btnTrack) {
                this.velocity = offset.normalize();
            }
            this.btnTrack = true;
            this.duration = offset.mag() / (this.speed * this.speedAdd);
            this.trackTime += deltaTime;
            this.node.position = this.trackStartPos.lerp(this.delegate.targetPos, this.trackTime / this.duration) as any;
            if (this.trackTime >= this.duration) {
                this.delegate.bomb();
                this.setRunning(false);
            }
        }
        else {
            this.velocity.rotateSelf(0.9 * this.rotateSpeed);
            const step: any = this.velocity.mul(deltaTime * this.speedAdd * this.speed);
            if (isRotateFinish &&
                step.magSqr() > offset.magSqr()) {
                this.node.setPosition(this.delegate.targetPos);
            }
            else {
                this.node.setPosition(this.node.position.add(step));
            }
            if (this.chackRange(this.delegate.targetPos, this.node.position as any, 10)) {
                this.delegate.bomb();
                this.setRunning(false);
            }
        }
    }
    public playEffect(effectName: string): void { }
    protected start(): void { }
    public stopMove(): void { }
    public track(target: any): void { }
    protected update(dt: number): void { }
}
