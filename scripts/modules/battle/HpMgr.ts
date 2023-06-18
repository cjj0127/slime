import HpDamage from "./HpDamage";
import HpDisplay from "./HpDisplay";
import { GamePrefabs_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
// import HpDisplay from 'HpDisplay';
const { ccclass, property } = cc._decorator;
const y: any = window["_"];
@ccclass
export default class HpMgr extends cc.Component {
    public static Instance: HpMgr = null;
    @property(cc.Node)
    content: cc.Node = null;
    task = [];
    async addHpBar(e, t = false) {
        let o = null;
        if (t) {
            o = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.HpBarBoss.path);
        }
        else {
            o = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.HpBar.path);
        }
        o.getComponent(HpDisplay).entity = e;
        o.parent = this.content;
        o.zIndex = 0;
    }
    public static addHpDamage(e: cc.Node, t: number, o: boolean) {
        this.Instance.task.push({
            target: e,
            hp: t,
            critical: o
        });
    }
    public static clear() {
        HpMgr.Instance.task.length = 0;
    }
    async executeTask(e) {
        const t = e.target;
        const n = e.hp;
        const o = e.critical;
        const r = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.HpDamage.path);
        r.parent = this.content;
        r.zIndex = 1;
        const i = this.content.convertToNodeSpaceAR(t.convertToWorldSpaceAR(cc.Vec3.ZERO));
        i.y += t.height * (1 - t.anchorY);
        r.position = i;
        const a = r.getComponent(HpDamage);
        a.delegate = this;
        a.setDamage(n, o);
    }
    private fixUpdate() {
        if (this.task.length > 0) {
            const e = this.task.shift();
            if (!y.isNil(e)) {
                this.executeTask(e);
            }
        }
    }
    onEnable() {
        this.schedule(this.fixUpdate.bind(this), 0.03, cc.macro.REPEAT_FOREVER);
    }
    onLoad() {
        HpMgr.Instance = this;
    }
    playComplete(e: cc.Node) {
        AssetPool.Instance.put(e);
    }
}
