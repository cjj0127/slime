import UnlockCtrl from "./unlock/UnlockCtrl";
import { MapUIPrefabs } from "./common/Const";
import AssetPool from "./asset/AssetPool";
const { ccclass, property } = cc._decorator;
if (CC_EDITOR) {
    // 重写update方法 达到在编辑模式下 自动播放动画的功能
    sp.Skeleton.prototype['update'] = function (dt) {
        if (CC_EDITOR) {
            cc['engine']._animatingInEditMode = 1;
            cc['engine'].animatingInEditMode = 1;
        }
        if (this.paused)
            return;
        dt *= this.timeScale * sp['timeScale'];
        if (this.isAnimationCached()) {
            // Cache mode and has animation queue.
            if (this._isAniComplete) {
                if (this._animationQueue.length === 0 && !this._headAniInfo) {
                    let frameCache = this._frameCache;
                    if (frameCache && frameCache.isInvalid()) {
                        frameCache.updateToFrame();
                        let frames = frameCache.frames;
                        this._curFrame = frames[frames.length - 1];
                    }
                    return;
                }
                if (!this._headAniInfo) {
                    this._headAniInfo = this._animationQueue.shift();
                }
                this._accTime += dt;
                if (this._accTime > this._headAniInfo.delay) {
                    let aniInfo = this._headAniInfo;
                    this._headAniInfo = null;
                    this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
                }
                return;
            }
            this._updateCache(dt);
        }
        else {
            this._updateRealtime(dt);
        }
    };
}
@ccclass
export default class Game extends cc.Component {
    static _instance = null;
    _unlockCtrl = null;
    @property(cc.Node)
    adapter = null;
    gameNode = null;
    gameTime: number = 0;
    globalSpeed = 1;
    createGlobal() {
        this._unlockCtrl = this.node.addComponent(UnlockCtrl);
    }
    onDestroy() {
        Game._instance = null;
    }
    onEnable() {
        this.createGlobal();
        const e = AssetPool.Instance.createObject(MapUIPrefabs.Game.path);
        e.name = "game";
        e.parent = this.node;
        e.position = cc.Vec3.ZERO;
        this.gameNode = e;
    }
    onLoad() {
        cc.game.addPersistRootNode(this.adapter);
        Game._instance = this;
    }
    static get Instance() {
        return Game._instance;
    }
}
