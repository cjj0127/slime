import { GamePrefabs_, E_ENTITY_GROUP } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
import BattleWorld from "./BattleWorld";
import HurtView from "./HurtView";
import RelicModel from "../../ccstudio/data/RelicModel";
import TeasureModel from "../../ccstudio/data/TeasureModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
const I = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export class ISkill extends cc.Component {
    _damage: string = "0";
    _logicQueue: AsyncQueueTool = new AsyncQueueTool();
    complete = () => {
        if (this.completeCallback) {
            this.completeCallback();
        }
    };
    // private skillCfg: any;
    private completeCallback: any;
    public skillCfg: any = null;
    // private damage: number;
    // private _logicQueue: any;
    
    public calcDamage(e: number): string {
        let t = BattleWorld.Instance.hero.damage;
        t = NumberPlus.mul(t, e);
        return NumberPlus.div(t, 100);
    }
    
    public calcHurtTragets(e: any, t: number): any {
        if (t > 0) {
            return BattleWorld.Instance.getXRangTragets(e, t, E_ENTITY_GROUP.Enemy);
        }
        if (t < 0) {
            return BattleWorld.Instance.getScreenTargets(E_ENTITY_GROUP.Enemy);
        }
        const n = BattleWorld.Instance.getScreenTargets(E_ENTITY_GROUP.Enemy);
        return I.reduce(n, (n: any, o: any) => {
            const r = o.body, i = t + .5 * r.node.width, a = o.node.position.add(r.node.position);
            if (o.groupId == E_ENTITY_GROUP.Enemy && o.checkAlive() && e.sub(a).magSqr() <= i * i) {
                n.push(o);
            }
            return n;
        }, []);
    }
    
    public clear(): void {
        this.completeCallback = null;
        this._logicQueue.clear();
        this.onClear();
    }
    
    public fireEnable() {
        return true;
    }
    
    public getOwner(): any {
        return BattleWorld.Instance.hero;
    }
    
    public hurt(e: any = null, t: any = null): any {
        const n = this;
        I.isNil(e) && (e = this.node.position);
        const o = this.calcHurtTragets(e, this.skillCfg.range);
        let r = this.getOwner().calcCriticalDamage_(this.damage);
        let i = r.damage;
        const { critical } = r;
        i = Model.user.calcSkillDamage(i);
        let s: any, c: any = Model.relic.applySkill(this.skillCfg.id);
        if (c && (s = I.get(c, "calcHurt"))) {
            i = s(i);
        }
        c = Model.teasure.applySkill(this.skillCfg.id);
        if (c && (s = I.get(c, "calcHurt"))) {
            i = s(i);
        }
        const l = this.skillCfg.HurtEffect;
        return I.each(o, (e: any) => {
            if (e) {
                const o = e.body;
                var r = i;
                if (e.isBoss) {
                    r = Model.user.calcBossDamage(i);
                }
                const s = o.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                e.view.playHit(t);
                e.dodecHp(r, critical);
                n.playEffect(l, s, 60 * Math.random());
            }
        }), o;
    }
    
    public init(e: any): void {
        this.skillCfg = e;
        this.onInit();
    }
    
    onClear() { }
    
    onInit() { }
    
    onPlay(e) { }
    
    public play(e: any): void {
        this.completeCallback = e;
        this.playSound(this.skillCfg.fireSound);
        this._logicQueue.clear();
        this._logicQueue.push(this.onPlay.bind(this));
        this._logicQueue.complete = this.complete;
        this._logicQueue.play();
    }
    
    public async playEffect(e: any, t: any, n: number = 0, o: number = 1): Promise<any> {
        if (I.isEmpty(e)) {
            return;
        }
        const r = BattleWorld.Instance.getLayer(2);
        const i = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.Hurt.path);
        i.parent = r;
        i.angle = n;
        i.scale = o;
        i.position = r.convertToNodeSpaceAR(t);
        i.getComponent(HurtView).play(e, () => {
            AssetPool.Instance.put(i);
        });
        return i;
    }
    
    public playExplode(e: any): void {
        const t = this.skillCfg.expEffect;
        this.playEffect(t, e, 0);
    }
    
    public async playSound(e: any): Promise<void> {
        if (I.isEmpty(e)) {
            return;
        }
        const t = `Audios/${e}`;
        await SoundPlayerComp.Instance.playEffect(t);
    }
    
    public setDamage(e: number): void {
        this.damage = this.calcDamage(e);
    }
    get damage(): string {
        return this._damage;
    }
    set damage(value: string) {
        this._damage = value;
    }
}
