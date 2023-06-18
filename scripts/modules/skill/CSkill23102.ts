import Game from "../Game";
import { ISkill } from "../battle/ISkill";
// import { ISkill } from "ISkill";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill23102 extends ISkill {
    @property(cc.Prefab)
    bulletPrefeb: cc.Prefab = null;
    bullets: Array<cc.Node> = [];
    @property(cc.Vec3)
    curPos: cc.Vec3 = cc.Vec3.ZERO;
    @property()
    isPlaying: boolean = false;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    spOriginScale: number = 1;
    clearAnims(): void {
        for (let e = 0; e < this.bullets.length; e++) {
            this.bullets[e].active = false;
        }
        this.isPlaying = false;
        this.sp.setCompleteListener(null);
        this.sp.node.stopAllActions();
        this.node.stopAllActions();
    }
    creatBullet(): cc.Node {
        const e = cc.instantiate(this.bulletPrefeb);
        e.parent = this.node.parent;
        this.bullets.push(e);
        return e;
    }
    fixedUpdate(): void {
        if (this.isPlaying) {
            this.node.zIndex = -this.node.y;
            for (let e = 0; e < this.bullets.length; e++) {
                const t = this.bullets[e];
                if (t.active) {
                    const n = t.position;
                    if (this.calcHurtTragets(n, this.skillCfg.range + .5 * t.width).length > 0) {
                        this.hurt(t.position);
                        t.active = false;
                    }
                }
            }
        }
    }
    onClear(): void {
        this.clearAnims();
        this.unscheduleAllCallbacks();
    }
    onDisable(): void {
        this.unscheduleAllCallbacks();
    }
    onEnable(): void {
        this.schedule(this.fixedUpdate, .1, cc.macro.REPEAT_FOREVER);
    }
    onInit(): void {
        const e = this.getOwner().node.position;
        e.x -= cc.winSize.width / 2;
        e.y += 20;
        this.node.position = e;
    }
    // private sp: sp.Skeleton = null;
    // private bulletPrefeb: cc.Prefab = null;
    // private spOriginScale: number = 1;
    // private bullets: cc.Node[] = [];
    // private isPlaying: boolean = false;
    // private curPos: cc.Vec3 = cc.Vec3.ZERO;
    onLoad(): void {
        this.spOriginScale = this.sp.node.scale;
    }
    onPlay(callback?: Function): void {
        this.clearAnims();
        this.isPlaying = true;
        const n = this.getOwner().node.position;
        const o = n.x - cc.winSize.width / 2;
        const r = n.y + 20;
        this.node.position = cc.v3(o, r, 0);
        this.sp.node.active = true;
        this.sp.node.stopAllActions();
        this.sp.node.scale = this.spOriginScale;
        this.sp.node.opacity = 255;
        this.sp.enabled = true;
        this.sp.setAnimation(0, "run", true);
        this.sp.timeScale = Game.Instance.globalSpeed;
        cc.tween(this.node)
            .to(.5, {
            position: cc.v3(n.x + 80, r)
        })
            .delay(.5)
            .call(() => {
            for (let e = 0; e < this.skillCfg.tiggerCnt; e++) {
                cc.tween(this.node)
                    .delay(.5 * e)
                    .call(() => {
                    this.sp.setAnimation(0, "play", false);
                    this.sp.timeScale = Game.Instance.globalSpeed;
                    this.sp.setCompleteListener(() => {
                        this.sp.setAnimation(0, "run", true);
                    });
                })
                    .delay(.2)
                    .call(() => {
                    this.shoot();
                })
                    .start();
            }
        })
            .delay(.5 * this.skillCfg.tiggerCnt)
            .call(() => {
            this.sp.setCompleteListener(null);
            cc.tween(this.sp.node)
                .to(.2, {
                scale: 0,
                opacity: 0
            })
                .start();
        })
            .delay(2)
            .call(() => {
            callback && callback();
            this.clearAnims();
        })
            .start();
    }
    playFire(e: number): void {
        const n = this.creatBullet();
        n.position = cc.v3(this.node.position.x + 50, this.node.position.y + 30 * (e - 1) + 30);
        n.active = true;
        this.curPos = cc.v3(n.position.x + 800, n.position.y + 50 * (e - 1));
        const o = this.curPos.sub(n.position);
        n.angle = Math.atan2(o.y, o.x) * cc.macro.DEG;
        cc.tween(n)
            .to(1, {
            position: this.curPos
        })
            .call(() => {
            n.active = false;
            this.hurt(this.curPos);
        })
            .start();
    }
    shoot(): void {
        for (let e = 0; e < 3; e++) {
            this.playFire(e);
        }
    }
}
