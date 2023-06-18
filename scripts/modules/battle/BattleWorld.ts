import { EntityBase, EEntityEvent } from "./EntityBase";
import { Bullet, EBullet_Event } from "./Bullet";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE, EUNLOCKSYS_ID, MapUIPrefabs, E_MenuToggleType, GAME_SCENE_PATH_, E_ENEMY_TYPE, E_ENTITY_GROUP, ENUM_PROP_TYPE, GameConst, MEMBER_PREFAB_URL_, E_QUEST_ACTIVE_ID } from "../common/Const";
import AssetPool from "../asset/AssetPool";

import PropBattle from "./PropBattle";
import BuffCtrl from "./BuffCtrl";
import _BulletConfig from "../../ccstudio/config/_BulletConfig";
import CameraCtrl from "./CameraCtrl";
import _EnemyConfig from "../../ccstudio/config/_EnemyConfig";
import Factory from "./Factory";
import Game from "../Game";
import HelperAi from "../helper/HelperAi";
import _HelperConfig from "../../ccstudio/config/_HelperConfig";
import Hero from "../hero/Hero";
import HeroAi from "../hero/HeroAi";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import HeroData from "../hero/HeroData";
import HeroMemberAi from "../hero/HeroMemberAi";
import HpMgr from "./HpMgr";
import AiBase from "./AiBase";
import MineResearchModel from "../../ccstudio/data/MineResearchModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import PartnerAi from "../partner/PartnerAi";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import SceneLayers from "./SceneLayers";
import SkillCtrl from "./SkillCtrl";
import MyTools from "../../ccstudio/utils/MyTools";
import Utils_ from "../../ccstudio/utils/Utils";
import BossRushBattle from "./BossRushBattle";
import DwarvenKingBattle from "./DwarvenKingBattle";
import GoldRushBattle from "./GoldRushBattle";
import LegionRushBattle from "./LegionRushBattle";
import NormalBattle from "./NormalBattle";
import CtrlBaseBattle, { EBATTLE_STATE, EBATTLE_FAILED_REASON } from "./CtrlBaseBattle";

const { ccclass, property } = cc._decorator;
export enum EBATTLE_STATUS {
    None = 0,
    Load = 1,
    Battle = 2,
    Failed = 3
}
;
const _ = window["_"];
@ccclass
export default class BattleWorld extends cc.Component {
    private _currGameModeType: number = E_GAME_LEVEL_TYPE.Normal;
    private static _instance: BattleWorld;
    private _paused: boolean = false;
    battleCtrls: {
        [key: number]: CtrlBaseBattle;
    } = {};
    battleLayers: cc.Node[] = [];
    @property(PropBattle)
    PropBattle: PropBattle = null;
    battleStatus: EBATTLE_STATUS = EBATTLE_STATUS.None;
    @property(cc.Node)
    blackNode: cc.Node = null;
    @property()
    bornId: number = 1;
    @property(BuffCtrl)
    buffCtrl: BuffCtrl = null;
    @property([Bullet])
    bullets: Bullet[] = [];
    @property()
    changeWaveDistance: number = 500;
    public createBullet = async (e: any, t: any) => {
        const n = _BulletConfig.Instance.get(e);
        if (_.isNil(n)) {
            cc.error("createBullet cfg is nil: " + e);
        }
        const o = await Factory.Instance.createBullet(n.viewUrl);
        o.node.parent = this.ground;
        o.node.zIndex = e + 1000;
        o.node.position = this.ground.convertToNodeSpaceAR(t);
        o.range = n.range;
        o.bombView = n.bomb;
        o.trackType = n.track;
        o.speed = n.speed;
        o.uid = ++this.bornId;
        this.bullets.push(o);
        o.node.on(EBullet_Event.EBomb, this.onBulletBomb, this);
        o.node.on(EBullet_Event.ERemove, this.onBulletRemove, this);
        return o;
    };
    public createEnemy(e: any, t: any, n: any) {
        const o = _EnemyConfig.Instance.get(e);
        const r = Factory.Instance.createEntity(o.viewUrl);
        r.node.parent = this.ground;
        r.groupId = E_ENTITY_GROUP.Enemy;
        r.uid = ++this.bornId;
        r.cfgId = e;
        r.enemyType = o.type;
        r.setViewScale(o.multi);
        const i = cc.v3(t, n, 0);
        this.currBattleCtrl.bornEnemy(r, i, o.bulletId);
        let a = o.speed;
        a = Model.relic.applyEnemySpeed(a);
        r.moveEngine.speed = a;
        const s = r.getComponent(AiBase);
        s.target = this.hero;
        s.atkFre = GameConst.ATK_FRE / o.fre;
        s.atkRange = o.range;
        r.node.on(EEntityEvent.Dead, this.onEnemyDead, this);
        r.node.on(EEntityEvent.Remove, this.onEnemyRemove, this);
        HpMgr.Instance.addHpBar(r, r.isBoss);
        return r;
    };
    private currBattleCtrl: any;
    @property([Hero])
    enemys: EntityBase[] = [];
    @property(cc.Node)
    ground: cc.Node = null;
    @property([HelperAi])
    helpers: HelperAi[] = [];
    @property(EntityBase)
    hero: Hero = null;
    @property(cc.Node)
    heroBornPace: cc.Node = null;
    heroBornPosition: cc.Vec3 = null;
    @property([cc.Vec2])
    memberPosOffset: cc.Vec2[] = [];
    @property([cc.Node])
    memberSlots: cc.Node[] = [];
    @property([EntityBase])
    members: EntityBase[] = [];
    public onBulletBomb = () => { };
    public onBulletRemove = (e: any) => {
        e.emitEvent(EBullet_Event.EDisapear);
        Factory.Instance.recycle(e);
        const t = _.findIndex(this.bullets, (t) => t.uid == e.uid);
        if (t >= 0) {
            _.pullAt(this.bullets, [t]);
        }
    };
    onChangeHero = async function (): Promise<void> {
        await this.openBlack();
        this.clear();
        this.pause();
        await Factory.Instance.loadHero(HeroData.Instance.battleId);
        this.changeHero(HeroData.Instance.battleId);
        _.each(this.partnerSlots, (t, n) => {
            const o = this.partners[n];
            if (o) {
                const r = this.partnerPosOffset[n];
                const i = this.hero.node.position.add(r);
                o.node.position = i;
                const a = o.getComponent(MineResearchModel);
                a.follow = this.hero;
                a.followOffset = r;
            }
        });
        this.reset();
        this.resume();
        this.hero.reborn();
        this.createEnemys();
        await MyTools.sleep(0.1);
        await this.closeBlack();
    };
    public onEnemyDead = (e: any) => {
        if (this.battleStatus == EBATTLE_STATUS.Battle) {
            this.checkWave();
            this.currBattleCtrl.onEnemyDead(e);
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.DefeatEnemy);
        }
    };
    public onEnemyRemove = (e: any) => {
        const t = e.uid;
        const n = _.findIndex(this.enemys, (e) => e.uid == t);
        if (n >= 0) {
            _.pullAt(this.enemys, [n]);
        }
        Factory.Instance.recycle(e);
    };
    @property([cc.Vec2])
    partnerPosOffset: cc.Vec2[] = [];
    @property([cc.Node])
    partnerSlots: cc.Node[] = [];
    @property([EntityBase])
    partners: EntityBase[] = [];
    @property(SceneLayers)
    scene: SceneLayers = null;
    @property(SkillCtrl)
    skillCtrl: SkillCtrl = null;
    @property(cc.Node)
    spawnNode: cc.Node = null;
    @property(cc.Camera)
    uiCamera: cc.Camera = null;
    @property(CameraCtrl)
    worldCamera: CameraCtrl = null;

    public async changeHero(e: number, t: number = null): Promise<void> {
        this.removeHero();
        this.hero = this.createHero(e, t);
        this.worldCamera.target = this.hero.node;
        this.hero.reborn();
    }
    changeMemberToLeader(e: number): void {
        const t = this;
        this.battleStatus = EBATTLE_STATUS.Battle,
            this.removeMember(e),
            this.pause();
        const n: any = this.hero.node.position, o = HeroData.Instance.battleMembers, r = this.hero;
        this.changeHero(o[e], n),
            HeroData.Instance.changeHeroSkill(o[e]),
            _.each(this.members, (e) => {
                if (e) {
                    e.getComponent(HeroMemberAi).follow = t.hero;
                }
            }),
            _.each(this.enemys, function (e) {
                const n = e.getComponent(HeroMemberAi);
                n.target = t.hero,
                    n.startup();
            }),
            cc.director.emit(GlobalEventName.ChangeMemberToLeader, r),
            this.resume();
    }
    async changePartner(e: number, t: number): Promise<void> {
        this.removePartner(e);
        if (t >= 0) {
            await Factory.Instance.loadPartners(t);
        }
        this.createPartner(t, e);
    }
    checkWave() {
        if (this.enemys.findIndex(e => e.checkAlive()) < 0) {
            this.currBattleCtrl.waveComplete();
        }
    }
    clear(): void {
        this.clearEmemys();
        this.clearBullets();
        this.clearHelper();
        HpMgr.clear();
        this.skillCtrl.clear();
        this.buffCtrl.clear();
    }
    clearBullets(): void {
        this.bullets.forEach((e) => {
            e.emitEvent(EBullet_Event.EDisapear);
            Factory.Instance.recycle(e);
        });
        this.bullets.length = 0;
    }
    clearEmemys(): void {
        this.enemys.forEach((t) => {
            t.node.targetOff(this);
            t.emitEntityEvent(EEntityEvent.Remove);
            Factory.Instance.recycle(t);
        });
        this.enemys.length = 0;
    }
    clearHelper(): void {
        this.helpers.forEach((e) => {
            Factory.Instance.recycle(e);
        });
        this.helpers.length = 0;
    }
    clearLevel(): void {
        this.clear();
        this.reset();
        this.hero.reborn();
    }
    clearMembers(): void {
        this.members.forEach((t, n) => {
            if (_.isNil(t)) {
                Factory.Instance.recycle(t);
                this.members[n] = null;
            }
        });
        this.members.length = 0;
    }
    clearPartners(): void {
        this.partners.forEach((t, n) => {
            if (_.isNil(t)) {
                Factory.Instance.recycle(t);
                this.partners[n] = null;
            }
        });
        this.partners.length = 0;
    }
    async closeBlack(): Promise<void> {
        return new Promise<void>((resolve) => {
            cc.tween(this.blackNode)
                .to(0.2, { opacity: 0 })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }
    createBattleCtrl(type: E_GAME_LEVEL_TYPE) {
        let comp: CtrlBaseBattle = null;
        switch (type) {
            case E_GAME_LEVEL_TYPE.Normal:
                comp = this.addComponent(NormalBattle);
                break;
            case E_GAME_LEVEL_TYPE.BossRush:
                comp = this.addComponent(BossRushBattle);
                break;
            case E_GAME_LEVEL_TYPE.GoldRush:
                comp = this.addComponent(GoldRushBattle);
                break;
            case E_GAME_LEVEL_TYPE.DwarvenKing:
                comp = this.addComponent(DwarvenKingBattle);
                break;
            case E_GAME_LEVEL_TYPE.CaveRush:
                comp = this.addComponent(LegionRushBattle);
                break;
            case E_GAME_LEVEL_TYPE.LegionRush:
                comp = this.addComponent(LegionRushBattle);
        }
        if (_.isNil(comp)) {
            cc.error("[BattleWorld] createBattleCtrl error, gamelevelType type:" + type);
            debugger;
        }
        comp.delegate = this;
        comp.init();
        return comp;
    }
    createEnemys(): void {
        const enemyIds = this.currBattleCtrl.loadEnemyIds();
        let startY = this.spawnNode.y + .5 * this.spawnNode.height;
        if (this.currGameModeType == E_GAME_LEVEL_TYPE.CaveRush) {
            startY = this.heroBornPosition.y + 20;
        }
        let x = this.hero.node.x + 900;
        for (let i = 0; i < enemyIds.length; i++) {
            const enemyId = enemyIds[i];
            const enemyCfg = _EnemyConfig.Instance.get(enemyId);
            if (enemyCfg.type == E_ENEMY_TYPE.House) {
                x += 50;
            }
            else {
                x += 60 + Utils_.getRandomRange(-30, 50);
            }
            const y = enemyCfg.type == E_ENEMY_TYPE.House ? this.heroBornPosition.y + 20 :
                enemyCfg.type == E_ENEMY_TYPE.Boss ? this.heroBornPosition.y : this.spawnNode.y + Utils_.getRandomRange(.5 * -this.spawnNode.height, .5 * this.spawnNode.height);
            const enemy = this.createEnemy(enemyId, x, Math.min(startY, y));
            if (enemy) {
                const enemyComponent = enemy.getComponent(AiBase);
                if (enemyComponent) {
                    enemyComponent.startup();
                    if (this._paused) {
                        enemy.pause();
                    }
                    else {
                        enemy.resume();
                    }
                }
                this.enemys.push(enemy);
            }
        }
    }
    public async createGame(e: number): Promise<Hero> {
        const hero = this.createHero(e);
        this.hero = hero;
        await this.currBattleCtrl.loadRes();
        this.createGameScene();
        this.createEnemys();
        this.createPartners();
        return hero;
    }
    private createGameScene(): void {
        if (this.scene) {
            AssetPool.Instance.put(this.scene);
        }
        const sceneInfo = this.currBattleCtrl.getSceneInfo();
        const gameScenePath = GAME_SCENE_PATH_ + "/" + sceneInfo;
        const newScene = AssetPool.Instance.createObject(gameScenePath);
        newScene.parent = this.getLayer(0);
        newScene.setSiblingIndex(0);
        this.scene = newScene.getComponent(SceneLayers) || newScene.addComponent(SceneLayers);
        this.scene.setCamera(this.worldCamera.camera);
        this.scene.reset();
    }
    createHelper(e: string, t: number) {
        const n = _HelperConfig.Instance.get(e);
        if (!_.isNil(n)) {
            const entity = Factory.Instance.createEntity(n.viewUrl);
            entity.node.parent = this.ground;
            const r = this.hero.node.position;
            r.x -= 500;
            entity.groupId = E_ENTITY_GROUP.Helper;
            entity.uid = ++this.bornId;
            entity.cfgId = e;
            entity.assistant = this.hero;
            let i = this.hero.damage;
            i = NumberPlus.mul(i, t),
                i = NumberPlus.div(i, 100),
                i = Model.user.calcSkillDamage(i),
                entity.doborn(r, "100", i, n.bulletId),
                entity.criticalChange = this.hero.criticalChange,
                entity.criticalDamge = this.hero.criticalDamge,
                entity.moveEngine.speed = n.speed;
            const a = entity.getComponent(HelperAi);
            if (n.fireCount > 0) {
                if (!a) {
                    debugger;
                }
                a.atkFre = n.duration / n.fireCount;
            }
            a.atkRange = n.range;
            a.fireCount = n.fireCount;
            a.startup();
            entity.node.on(EEntityEvent.Remove, this.onHelperRemove, this);
            this._paused ? entity.pause() : entity.resume();
            this.helpers.push(entity);
            return entity;
        }
        cc.error("helperId cfg is nil:", e);
    }
    createHero(e: any, t: any = null) {
        const n = _HeroConfig.Instance.get(e);
        const o = Factory.Instance.createEntity(n.viewUrl) as any;
        o.node.parent = this.ground;
        //@ts-ignore
        t = t || this.heroBornPosition;
        o.groupId = E_ENTITY_GROUP.HERO;
        o.uid = ++this.bornId;
        o.cfgId = e;
        const r = Model.user.calcProp(ENUM_PROP_TYPE.ATK);
        const i = Model.user.calcProp(ENUM_PROP_TYPE.HP);
        o.doborn(t, i, r, n.bulletId);
        o.criticalChange = _.toNumber(Model.user.calcProp(ENUM_PROP_TYPE.CriticalHitChance));
        o.criticalDamge = Model.user.calcProp(ENUM_PROP_TYPE.CriticalHitDamage);
        o.hpRecovery = Model.user.calcProp(ENUM_PROP_TYPE.HPRecovery);
        o.hpRecoveryRage = Model.user.calcProp(ENUM_PROP_TYPE.HPRecoveryRate);
        o.moveEngine.speed = n.speed;
        const a = o.getComponent(HeroAi);
        a.atkFre = GameConst.ATK_FRE / _.toNumber(Model.user.getHeroAspd());
        a.atkRange = n.range;
        a.doubleShot = _.toNumber(Model.user.calcProp(ENUM_PROP_TYPE.DoubleShot));
        a.tripleShot = _.toNumber(Model.user.calcProp(ENUM_PROP_TYPE.TripleShot));
        this._paused ? o.pause() : o.resume();
        this.hero = o;
        o.node.on(EEntityEvent.Dead, this.onHeroDead, this);
        o.node.on(EEntityEvent.Disapear, this.onHeroDisapear, this);
        HpMgr.Instance.addHpBar(o);
        return o;
    }
    createMember(e: any, t: number = null): EntityBase {
        const n = _HeroConfig.Instance.get(e);
        const o = Factory.Instance.createEntity(MEMBER_PREFAB_URL_);
        o.node.parent = this.ground;
        const r = o.view;
        r.createView(n.uiAnim),
            r.setViewScale(.8);
        const i: any = this.memberPosOffset[t];
        const a = this.hero.node.position.add(i);
        const s = Model.user.calcMemberAtk(e);
        const c = Model.user.calcMemberAspd(e);
        o.doborn(a, "100", s, n.bulletId),
            o.cfgId = e,
            o.groupId = E_ENTITY_GROUP.Partner,
            o.uid = ++this.bornId;
        const u = o.getComponent(HeroMemberAi);
        u.atkFre = GameConst.ATK_FRE / c,
            u.follow = this.hero,
            u.followOffset = i,
            this._paused ? o.pause() : o.resume(),
            u.startup();
        return o;
    }
    createMembers(): void {
        const battleMembers = HeroData.Instance.battleMembers;
        battleMembers.forEach((member, index) => {
            const newMember = this.createMember(member, index);
            this.members[index] = newMember;
        });
    }
    createPartner(e: any, t: number): EntityBase {
        const n = _PartnerConfig.Instance.get(e);
        const o = Factory.Instance.createEntity(n.viewUrl) as any;
        o.node.parent = this.ground;
        const r: any = this.partnerPosOffset[t];
        const i = this.hero.node.position.add(r);
        const a = Model.user.calcPartnerAtk(e);
        const s = Model.user.calcPartnerAspd(e);
        o.doborn(i, "100", a, n.bulletId),
            o.cfgId = e,
            o.groupId = E_ENTITY_GROUP.Partner,
            o.uid = ++this.bornId;
        const c = Model.partner.getPartnerViewScale(e);
        o.setViewScale(c);
        const u = o.getComponent(PartnerAi);
        u.atkFre = GameConst.ATK_FRE / s;
        u.follow = this.hero;
        u.followOffset = r;
        u.startup();
        this._paused ? o.pause() : o.resume();
        this.partners[t] = o;
        return o;
    }
    private createPartners(): void {
        this.partnerSlots.forEach((slot, index) => {
            const equipedId = Model.partner.getEquipedId(index);
            if (equipedId >= 0) {
                this.createPartner(equipedId, index);
            }
        });
    }
    private async enterBossLevel(e: number) {
        await Model.ui.openViewAsync(MapUIPrefabs.BossLevelMask);
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Battle);
        this.battleStatus = EBATTLE_STATUS.Load;
        await this.openBlack();
        this.clear();
        this.reset();
        this.currBattleCtrl.exit();
        this.currBattleCtrl = this.getBattleCtrl(e);
        this.currBattleCtrl.enter();
        this.hero.reborn();
        await this.currBattleCtrl.loadRes();
        this.createGameScene();
        this.createEnemys();
        cc.director.emit(GlobalEventName.SwitchGameMode);
        this.battleStatus = EBATTLE_STATUS.Battle;
        await MyTools.sleep(0.1);
        await this.closeBlack();
    }
    async exitBossLevel(): Promise<void> {
        if (this.currGameModeType == E_GAME_LEVEL_TYPE.Normal) {
            return;
        }
        else {
            this.battleStatus = EBATTLE_STATUS.Load;
            await this.openBlack();
            this.currGameModeType = E_GAME_LEVEL_TYPE.Normal;
            this.clear();
            this.reset();
            this.currBattleCtrl.exit();
            this.currBattleCtrl = this.getBattleCtrl(E_GAME_LEVEL_TYPE.Normal);
            this.currBattleCtrl.enter();
            if (this._paused) {
                this.currBattleCtrl.pause();
            }
            else {
                this.currBattleCtrl.resume();
            }
            this.hero.reborn();
            await this.currBattleCtrl.loadRes();
            this.createGameScene();
            this.createEnemys();
            cc.director.emit(GlobalEventName.SwitchGameMode);
            this.battleStatus = EBATTLE_STATUS.Battle;
            await MyTools.sleep(0.1);
            await this.closeBlack();
        }
    }
    exitBossLevelEnable(): boolean {
        return this.currGameModeType != E_GAME_LEVEL_TYPE.Normal && this.currBattleCtrl.state == EBATTLE_STATE.Battle;
    }
    getAllEnemyRang() {
        let minX = null;
        let maxX = null;
        const n = this.getScreenTargets(E_ENTITY_GROUP.Enemy);
        n.forEach((n) => {
            const o = n.node.x;
            minX = minX ? Math.min(minX, o) : o;
            maxX = maxX ? Math.max(maxX, o) : o;
        });
        return {
            minX: minX,
            maxX: maxX
        };
    }
    getBattleCtrl(e: number): any {
        let t = this.battleCtrls[e];
        if (!t) {
            this.battleCtrls[e] = t = this.createBattleCtrl(e);
        }
        return t;
    }
    getEnemy(e: any): any {
        const index = this.enemys.findIndex((t) => t.uid == e);
        return this.enemys[index];
    }
    getEnemyCount(): number {
        return this.enemys.length;
    }
    getEquipTagPartners(e: string): EntityBase[] {
        const t: EntityBase[] = [];
        _.each(this.partners, (n) => {
            if (n && _PartnerConfig.Instance.get(n.cfgId).flg.indexOf(e) >= 0) {
                t.push(n);
            }
        });
        return t;
    }
    getLayer(e: number): cc.Node {
        let t = this.battleLayers[e];
        if (_.isNil(t)) {
            t = _.last(this.battleLayers);
        }
        return t;
    }
    public getMembers(): {
        index: number;
        member: any;
    }[] {
        const result = [];
        this.members.forEach((member, index) => {
            if (!_.isNil(member)) {
                result.push({ index, member });
            }
        });
        return result;
    }
    getNearEnemys(e: any, t = 0): any {
        const n = this.getRangTragets(e, t, E_ENTITY_GROUP.Enemy);
        const sorted = _.sortBy(n, (e) => e.node.x);
        return sorted[0];
    }
    getRandomTarget(e: number = 1) {
        let t = this.getScreenTargets(E_ENTITY_GROUP.Enemy);
        t = _.shuffle(t);
        return t.slice(0, e);
    }
    getRangTragets(e: any, t: number, n: E_ENTITY_GROUP) {
        if (n == E_ENTITY_GROUP.HERO)
            return [this.hero];
        const o = this.getScreenTargets(n);
        return o.reduce((targets: EntityBase[], r: any) => {
            const i = r.body;
            const a = t + .5 * i.node.width;
            const s = r.node.position.add(i.node.position);
            if (r.groupId == n && r.checkAlive() && (t <= 0 || e.sub(s).magSqr() <= a * a)) {
                targets.push(r);
            }
            return targets;
        }, []);
    }
    getScreenTargets(e: any): any {
        if (e == E_ENTITY_GROUP.HERO) {
            return [this.hero];
        }
        const t = this.worldCamera.camera.node.x - .5 * this.worldCamera.camera.node.width;
        const n = this.worldCamera.camera.node.x + .5 * this.worldCamera.camera.node.width;
        return this.enemys.reduce((o, r) => {
            const i = r.node.x - .5 * r.node.width;
            if (r.checkAlive() && r.groupId == e && i >= t && i <= n) {
                o.push(r);
            }
            return o;
        }, []);
    }
    getXRangTragets(e: cc.Vec2, t: number, n: E_ENTITY_GROUP) {
        if (n == E_ENTITY_GROUP.HERO)
            return [this.hero];
        const o = this.getScreenTargets(n);
        return o.reduce((targets: EntityBase[], r: any) => {
            const i = r.body;
            const a = t + .5 * i.node.width;
            const s = r.node.position.add(i.node.position);
            if (r.groupId == n && r.checkAlive() && (t <= 0 || Math.abs(e.x - s.x) <= a)) {
                targets.push(r);
            }
            return targets;
        }, []);
    }
    hideGame() { }
    public lateUpdate(e: number): void {
        if (!this._paused && this.currBattleCtrl) {
            e *= Game.Instance.globalSpeed;
            this.currBattleCtrl.fixUpdate(e);
        }
    }
    async loadRes(): Promise<void> {
        await Factory.Instance.loadHero(HeroData.Instance.battleId);
        const e = [];
        _.each(this.partnerSlots, function (t, n) {
            const o = Model.partner.getEquipedId(n);
            o >= 0 && e.push(o);
        });
        await Factory.Instance.loadPartners(e);
    }
    async onEnable(): Promise<void> {
        this.blackNode.opacity = 255;
        this.battleStatus = EBATTLE_STATUS.Load;
        await this.loadRes();
        const t = await this.createGame(HeroData.Instance.battleId);
        this.hero = t;
        this.worldCamera.target = t.node;
        this.worldCamera.initOffset();
        this.buffCtrl.setRunning(true);
        this.skillCtrl.initSkills();
        this.skillCtrl.setRunning(true);
        Model.relic.activeRelics();
        Model.teasure.activeTreasures();
        this.currBattleCtrl.enter();
        this.hero.getComponent(AiBase).startup();
        this.battleStatus = EBATTLE_STATUS.Battle;
        this.closeBlack();
        cc.director.emit(GlobalEventName.WorldInitComplete);
        if (this._paused) {
            this.hero?.pause();
            _.each(this.helpers, function (e) {
                e.pause();
            });
            _.each(this.enemys, function (e) {
                e.pause();
            });
            _.each(this.partners, function (e) {
                e && e.pause();
            });
            _.each(this.members, function (e) {
                e && e.pause();
            });
            _.each(this.bullets, function (e) {
                e.pause();
            });
            this.buffCtrl.pause();
            this.skillCtrl.pause();
            this.currBattleCtrl.pause();
        }
    }
    onGamePause() {
        this.pause();
    }
    onGameResume() {
        this.resume();
        cc.director.emit(GlobalEventName.UnlockBless, EUNLOCKSYS_ID.Bless);
    }
    onHelperRemove(e: any) {
        const t = _.findIndex(this.helpers, h => h.uid == e.uid);
        if (t >= 0) {
            _.pullAt(this.helpers, [t]);
        }
        Factory.Instance.recycle(e);
    }
    onHeroDead() {
        if (this.currGameModeType != E_GAME_LEVEL_TYPE.LegionRush) {
            this.battleStatus = EBATTLE_STATUS.Failed;
        }
    }
    onHeroDisapear() {
        this.currBattleCtrl.levelFailed(EBATTLE_FAILED_REASON.HeroDead);
    }
  
    onLoad() {
        const e = this;
        BattleWorld._instance = this;
        this.uiCamera = cc.find("Canvas/Main Camera").getComponent(cc.Camera);
        this.buffCtrl = this.node.addComponent(BuffCtrl);
        this.PropBattle = this.node.addComponent(PropBattle);
        this.partnerPosOffset = [];
        const t = this.heroBornPosition = this.heroBornPace.position;
        this.partnerSlots.forEach((n, o) => {
            const r = n.position;
            //@ts-ignore
            e.partnerPosOffset[o] = r.sub(t);
        });
        this.memberPosOffset = [];
        this.memberSlots.forEach((n, o) => {
            const r = n.position;
            //@ts-ignore
            e.memberPosOffset[o] = r.sub(t);
        });
        this.currBattleCtrl = this.getBattleCtrl(E_GAME_LEVEL_TYPE.Normal);
        this.buffCtrl.setRunning(false);
        this.PropBattle.init();
        this.skillCtrl.setRunning(false);
        this.battleLayers = this.node.children;
        cc.director.on(GlobalEventName.PartnerEquipedChange, this.onPartnerChange, this);
        cc.director.on(GlobalEventName.ChangeBattleHero, this.onChangeHero, this);
        cc.game.on(GlobalEventName.GamePause, this.onGamePause, this);
        cc.game.on(GlobalEventName.GameResume, this.onGameResume, this);
        cc.game.on(cc.game.EVENT_HIDE, this.hideGame, this);
    }
    onPartnerChange(e): void {
        const t = Model.partner.getEquipedId(e);
        this.changePartner(e, t);
    }
    async openBlack(): Promise<void> {
        return new Promise<void>((resolve) => {
            cc.tween(this.blackNode)
                .to(0.2, { opacity: 255 })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }
    public pause() {
        if (this.hero !== null) {
            this.hero.pause();
        }
        _.each(this.helpers, (e) => {
            e.pause();
        });
        _.each(this.enemys, (e) => {
            e.pause();
        });
        _.each(this.partners, (e) => {
            if (e) {
                e.pause();
            }
        });
        _.each(this.members, (e) => {
            if (e) {
                e.pause();
            }
        });
        _.each(this.bullets, (e) => {
            e.pause();
        });
        this.buffCtrl.pause();
        this.skillCtrl.pause();
        this.currBattleCtrl.pause();
        this._paused = true;
    }
    removeHero(): void {
        this.hero.emitEntityEvent(EEntityEvent.Remove);
        this.hero.node.targetOff(this);
        Factory.Instance.recycle(this.hero);
        this.hero = null;
    }
    removeMember(e: number): void {
        const t = this.members[e];
        t && (Factory.Instance.recycle(t), this.members[e] = null);
    }
    removePartner(e: number): void {
        const t = this.partners[e];
        t && (Factory.Instance.recycle(t), this.partners[e] = null);
    }
    reset(): void {
        this.worldCamera.stopMove();
        this.worldCamera.unregisterEvent();
        this.scene.clear();
        this.hero.node.x = 0;
        this.hero.reset();
        this.worldCamera.reset();
        this.worldCamera.registerEvent();
        this.scene.setCamera(this.worldCamera.camera);
        this.scene.reset();
    }
    resetCamera(): void {
        this.worldCamera.reset();
    }
    public resetToBattleHero(): void {
        this.pause();
        this.changeHero(HeroData.Instance.battleId);
        HeroData.Instance.changeHeroSkill(HeroData.Instance.battleId);
        this.partnerSlots.forEach((slot, index) => {
            const partner = this.partners[index];
            if (partner) {
                const posOffset = this.partnerPosOffset[index];
                //@ts-ignore
                const position = this.hero!.node.position.add(posOffset);
                partner.node.position = position;
                const followComponent = partner.getComponent(PartnerAi) || partner.addComponent(PartnerAi);
                //@ts-ignore
                followComponent.follow = this.hero!;
                followComponent.followOffset = posOffset;
            }
        });
        this.reset();
        this.resume();
    }
    async restartLevel(): Promise<void> {
        this.battleStatus = EBATTLE_STATUS.Load;
        await this.openBlack();
        await this.currBattleCtrl.loadRes();
        this.clear();
        this.reset();
        this.hero.reborn();
        this.createEnemys();
        this.battleStatus = EBATTLE_STATUS.Battle;
        await MyTools.sleep(0.1);
        this.closeBlack();
    }
    public resume(): void {
        this.hero?.resume();
        this.helpers.forEach((helper) => helper.resume());
        this.enemys.forEach((enemy) => enemy.resume());
        this.partners.forEach((partner) => partner && partner.resume());
        this.members.forEach((member) => member && member.resume());
        this.bullets.forEach((bullet) => bullet.resume());
        this.buffCtrl.resume();
        this.skillCtrl.resume();
        this.currBattleCtrl.resume();
        this._paused = false;
    }
    startCamera(): void {
        this.worldCamera.registerEvent();
    }
    stopCamera(): void {
        this.worldCamera.stopMove();
        this.worldCamera.unregisterEvent();
    }
    async switchGameMode(e: number) {
        if (this.currGameModeType == E_GAME_LEVEL_TYPE.Normal) {
            if (this.currGameModeType !== e) {
                this.currGameModeType = e;
                await this.enterBossLevel(e);
            }
        }
        else {
            return Promise.resolve();
        }
    }
    static get Instance(): BattleWorld {
        return BattleWorld._instance;
    }
    get PauseStatus(): boolean {
        return this._paused;
    }
    get currGameModeType(): number {
        return this._currGameModeType;
    }
    set currGameModeType(value: number) {
        this._currGameModeType = value;
        cc.director.emit(GlobalEventName.ChangeGameMode);
    }
}
