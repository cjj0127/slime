import AnimViewBase from "./ViewAnimBase";
const { ccclass, property, disallowMultiple, menu } = cc._decorator;
@ccclass
@disallowMultiple
@menu("自定义组件/ViewAnim/ViewAnimMove")
export default class ViewAnimMove extends AnimViewBase {
    @property({
        displayName: "延迟时间",
    })
    delayTime: number = 0;
    @property({
        displayName: "移动距离",
    })
    distance: number = 0;
    @property({
        displayName: "动画间隔",
    })
    interval: number = 0;
    @property({
        type: cc.Node,
        // visible: function (this: ClassName) {
        //     return 0 == this.nodes.length;
        // },
    })
    nodeRoot: cc.Node = null;
    @property({
        type: [cc.Node],
        // visible: function (this: ClassName) {
        //     return null == this.nodeRoot;
        // },
    })
    nodes: cc.Node[] = [];
    private originPositions: cc.Vec3[] = [];
    @property()
    reverseLoop: boolean = false;
    private _createNodeAction(e: cc.Node, t: cc.Vec3, n: number, o: number): void {
        e.stopAllActions();
        e.opacity = 0;
        e.position = t.sub(cc.v3(this.distance, 0, 0));
        cc.tween(e)
            .delay(this.delayTime + (o + 1) * this.interval)
            .parallel(cc.tween().by(n, { position: cc.v2(this.distance, 0) }, { easing: cc.easing.sineOut }), cc.tween()
            .set({ opacity: 0 })
            .to(n, { opacity: 255 }, { easing: cc.easing.sineOut }))
            .start();
    }
    public initialize(): void {
        this.originPositions = new Array(this.nodes.length);
        if (this.nodeRoot) {
            this.nodes = this.nodeRoot.children;
        }
        for (let e = 0; e < this.nodes.length; e++) {
            const t = this.nodes[e];
            this.originPositions[e] = t.position;
        }
    }
    onLoad() {
        this.originPositions = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const pos = this.nodes[i].position.clone();
            this.originPositions.push(pos);
        }
        this.playAnim();
    }
    playAnim() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].stopAllActions();
            this.nodes[i].position = this.originPositions[i];
        }
        let nodeArr = this.reverseLoop ? [...this.nodes].reverse() : this.nodes;
        let delayTime = this.delayTime;
        for (let i = 0; i < nodeArr.length; i++) {
            let moveByAction = cc.moveBy(this.interval, cc.v2(0, -this.distance));
            let delayTimeAction = cc.delayTime(delayTime);
            let spawn = cc.spawn(moveByAction, delayTimeAction);
            let sequence;
            if (i == nodeArr.length - 1) {
                let callBack = cc.callFunc(() => {
                    this.playAnim();
                });
                sequence = cc.sequence(spawn, callBack);
            }
            else {
                sequence = cc.sequence(spawn);
            }
            nodeArr[i].runAction(sequence);
            delayTime += this.interval;
        }
    }
    public resetInit(): void {
        this.initialize();
    }
    public runInAction_(e: number): void {
        let t: number;
        if (this.reverseLoop) {
            let n = this.nodes.length - 1;
            for (t = 0; n >= 0; n--) {
                const o = this.nodes[n];
                const r = this.originPositions[n];
                this._createNodeAction(o, r, e, t);
                t++;
            }
        }
        else {
            for (t = 0; t < this.nodes.length; t++) {
                const o = this.nodes[t];
                const r = this.originPositions[t];
                this._createNodeAction(o, r, e, t);
            }
        }
        cc.tween(this.node).to(0.1, { opacity: this._originOpacity }).start();
    }
    public runOutAction_(e: number): void {
        for (let t = 0; t < this.nodes.length; t++) {
            const n = this.nodes[t];
            n.stopAllActions();
            n.opacity = 255;
            n.position = this.originPositions[t];
            cc.tween(n).set({ opacity: 255 }).to(e, { opacity: 0 }, { easing: cc.easing.sineOut }).start();
        }
    }
}
