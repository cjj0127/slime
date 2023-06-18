import { COLOR_WHITE } from "../common/Const";
const { ccclass, property } = cc._decorator;
export enum eEntityDir {
    Left = -1,
    Right = 1
}
@ccclass
export default class EntityViewBase extends cc.Component {
    private _originScaleX: number | null = null;
    private _originScaleY: number | null = null;
    dir: eEntityDir = eEntityDir.Right;
    viewScale: number = 1;
    onEnable() {
        this.node.stopAllActions();
        this.node.color = COLOR_WHITE;
        this.node.opacity = 255;
    }
    onLoad() {
        this._originScaleX = this.node.scaleX;
        this._originScaleY = this.node.scaleY;
    }
    playDisapearAction(): number {
        cc.tween(this.node).blink(.3, 3, {
            easing: cc.easing.smooth
        }).start();
        return .3;
    }
    setViewDir(dir: eEntityDir) {
        this.dir = dir;
        this.node.scaleX = this.viewScale * this.originScaleX * dir;
        this.node.scaleY = this.viewScale * this.originScaleY;
    }
    setViewScale(scale: number) {
        this.viewScale = scale;
        this.node.scaleX = this.viewScale * this.originScaleX * this.dir;
        this.node.scaleY = this.viewScale * this.originScaleY;
    }
    get originScaleX() {
        if (this._originScaleX == null) {
            this._originScaleX = this.node.scaleX;
        }
        return this._originScaleX;
    }
    get originScaleY() {
        if (this._originScaleY == null) {
            this._originScaleY = this.node.scaleY;
        }
        return this._originScaleY;
    }

    playDead() {
        return 0;
    }

    playAttack(t) {

    }

    playMove() {

    }

    pause() {

    }

    resume() {

    }

    playLvup(){
        
    }
}
