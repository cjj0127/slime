import Game from "../Game";
// import { Game } from "Game";
const { ccclass, property } = cc._decorator;
export enum CameraState {
    None = 0,
    Idle = 1,
    Move = 2
}
@ccclass
export default class CameraCtrl extends cc.Component {
    private _offsetX: number = null;
    private _target: cc.Node = null;
    @property(cc.Camera)
    camera: cc.Camera = null;
    private state: CameraState = CameraState.Idle;
    private tempV3 = cc.v3();
    // private _offsetX: number = 0;
    // private tempV3: cc.Vec3;
    public initOffset(): void {
        this._offsetX = this.target.x - this.camera.node.x;
        this.tempV3 = this.camera.node.position;
    }
    public lateUpdate(): void {
        if (this.state == CameraState.Move) {
            let e: number = cc.misc.lerp(this.camera.node.x, this.target.x - this._offsetX, 0.08 * Game.Instance.globalSpeed);
            if (Math.abs(this._offsetX + this.camera.node.x - this.target.x) < 2) {
                e = this.target.x - this._offsetX;
                this.stopMove();
            }
            this.tempV3.x = e;
            this.camera.node.position = this.tempV3;
        }
    }
    public onLoad(): void { }
    public onTargetMove(): void {
        if (this.target) {
            this.startMove();
        }
    }
    public registerEvent(): void {
        this.target.on(cc.Node.EventType.POSITION_CHANGED, this.onTargetMove, this);
    }
    public reset(): void {
        const e: number = this.target.x - this._offsetX;
        this.camera.node.x = e;
    }
    public startMove(): void {
        this.state = CameraState.Move;
    }
    public stopMove(): void {
        this.state = CameraState.Idle;
    }
    public unregisterEvent(): void {
        this.target.off(cc.Node.EventType.POSITION_CHANGED, this.onTargetMove, this);
    }
    get target(): cc.Node {
        return this._target;
    }
    set target(value: cc.Node) {
        if (this._target != value) {
            if (this._target) {
                this.unregisterEvent();
            }
            this._target = value;
            this.registerEvent();
        }
    }
}
