
import { GAME_SCENE_PATH_, GAME_SPINE_PATH_, E_SKILL_FIRE_TYPE, GAME_SKILL_PATH_, GamePrefabs_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import AssetPool from "../asset/AssetPool";
import _BulletConfig from "../../ccstudio/config/_BulletConfig";
import _EnemyConfig from "../../ccstudio/config/_EnemyConfig";
import _HelperConfig from "../../ccstudio/config/_HelperConfig";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import { Bullet } from "./Bullet";
import { EntityBase } from "./EntityBase";
// import EntityBase from "./EntityViewBase";
const _: any = window["_"];

export default class Factory {
    static _instance = null;
    bulletRes = [];
    enemyRes = [];
    async createBullet(e) {
        const bullet = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, e);
        return bullet.getComponent(Bullet);
    }
    createEntity(e) {
        var item = AssetPool.Instance.createObject(e);
        var t = item.getComponent(EntityBase);
        t.reset();
        return t;
    }
    // async createEntityAsync(e) {
    //     let t, n;
    //     try {
    //         t = AssetPool.Instance.createObject(e);
    //     }
    //     catch {
    //         t = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, e);
    //     }
    //     n = t.getComponent(EntityBase);
    //     n.reset();
    //     return n;
    // }
    private async loadBullet(e: any) {
        if (typeof e == "number")
            e = [e];
        const t: any[] = [];
        const n = _.union(e);
        for (const o of n) {
            const i = _BulletConfig.Instance.get(o);
            if (_.isNil(i))
                cc.error("没有对应的子弹配置:" + o);
            else {
                const p = i.viewUrl;
                this.bulletRes.push(p);
                let f = AssetPool.Instance.getPrefab(p);
                if (_.isNil(f)) {
                    t.push((async () => {
                        f = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, p) as any;
                        AssetPool.Instance.addPrefab(f, p);
                        AssetPool.Instance.put(AssetPool.Instance.createObjWithPrefab(f, p));
                    })());
                }
            }
        }
        if (t.length > 0)
            await Promise.all(t);
    }
    async loadEnemys(e: any) {
        const t: any[] = [];
        const n = _.union(e);
        for (const o of n) {
            const i = _EnemyConfig.Instance.get(o), p = i.viewUrl;
            this.enemyRes.push(p);
            let f = AssetPool.Instance.getPrefab(p);
            if (_.isNil(f)) {
                t.push((async () => {
                    f = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, p) as any;
                    AssetPool.Instance.addPrefab(f, p);
                    AssetPool.Instance.put(AssetPool.Instance.createObjWithPrefab(f, p));
                })());
            }
            const g = i.bulletId;
            if (g > 0)
                t.push(this.loadBullet(g));
        }
        if (t.length > 0)
            await Promise.all(t);
    }
    loadHero(id: number) {
        return new Promise((resolve) => {
            let list = [], cfg, viewUrl, item, bulletId, skillId;
            cfg = _HeroConfig.Instance.get(id);
            viewUrl = cfg.viewUrl;
            item = AssetPool.Instance.getPrefab(viewUrl);
            if (_.isNil(item)) {
                list.push(new Promise((resolve) => {
                    AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, viewUrl).then((_r) => {
                        item = _r;
                        AssetPool.Instance.addPrefab(item, viewUrl);
                        resolve(null);
                    });
                }));
            }
            list.push(new Promise((_resolve) => {
                let path, o;
                path = GAME_SPINE_PATH_ + "/mushroom";
                o = _HeroConfig.Instance.get(id);
                AssetManager.Instance.loadSkeleton(NAMES_BUNDLE.Game, path, o.uiAnim).then(() => {
                    _resolve(null);
                });
            }));
            bulletId = cfg.bulletId;
            skillId = cfg.skillId;
            if (bulletId > 0) {
                list.push(this.loadBullet(bulletId));
            }
            if (skillId > 0) {
                list.push(this.loadSkills(skillId));
            }
            if (list.length > 0) {
                Promise.all(list).then(() => {
                    resolve(null);
                });
            }
            else {
                resolve(null);
            }
        });
    }
    async loadHpBar() {
        let e = [];
        let t = AssetPool.Instance.getPrefab(GamePrefabs_.HpBar.path);
        if (_.isNil(t)) {
            e.push(new Promise(async (resolve) => {
                t = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, GamePrefabs_.HpBar.path) as cc.Prefab;
                AssetPool.Instance.addPrefab(t, GamePrefabs_.HpBar.path);
                for (let n = 0; n < 6; n++) {
                    AssetPool.Instance.put(AssetPool.Instance.createObjWithPrefab(t, GamePrefabs_.HpBar.path));
                }
                resolve(null);
            }));
        }
        let n = AssetPool.Instance.getPrefab(GamePrefabs_.HpBarBoss.path);
        if (_.isNil(n)) {
            e.push(new Promise(async (resolve) => {
                n = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, GamePrefabs_.HpBar.path) as cc.Prefab;
                ;
                AssetPool.Instance.addPrefab(n, GamePrefabs_.HpBar.path);
                resolve(null);
            }));
        }
        if (e.length > 0) {
            await Promise.all(e);
        }
    }
    async loadHpDamage() {
        let e: any;
        let t: number;
        e = AssetPool.Instance.getPrefab(GamePrefabs_.HpDamage.path);
        if (_.isNil(e)) {
            e = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, GamePrefabs_.HpDamage.path);
            AssetPool.Instance.addPrefab(e, GamePrefabs_.HpDamage.path);
        }
        for (t = 0; t < 6; t++) {
            AssetPool.Instance.put(AssetPool.Instance.createObjWithPrefab(e, GamePrefabs_.HpDamage.path));
        }
    }
    async loadHurtEffect() {
        let e = AssetPool.Instance.getPrefab(GamePrefabs_.Hurt.path);
        if (_.isNil(e)) {
            e = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, GamePrefabs_.Hurt.path) as cc.Prefab;
            ;
            AssetPool.Instance.addPrefab(e, GamePrefabs_.Hurt.path);
        }
        for (let t = 0; t < 6; t++) {
            AssetPool.Instance.put(AssetPool.Instance.createObjWithPrefab(e, GamePrefabs_.Hurt.path));
        }
    }
    loadMember(e, t) {
        return new Promise((resolve) => {
            const resolveLoop = (index) => {
                if (index < t.length) {
                    i = t[index];
                    this.loadHero(i).then(() => {
                        resolveLoop(index + 1);
                    });
                }
                else {
                    resolve(null);
                }
            };
            let n, o, r, i;
            n = AssetPool.Instance.getPrefab(e);
            if (_.isNil(n)) {
                AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, e).then((_o) => {
                    o = _o;
                    AssetPool.Instance.addPrefab(o, e);
                    resolveLoop(0);
                });
            }
            else {
                resolveLoop(0);
            }
        });
    }
    async loadPartners(e: any) {
        if (typeof e == "number")
            e = [e];
        const t: any[] = [];
        for (const n of e) {
            const r = n;
            if (r > 0) {
                let l = _PartnerConfig.Instance.get(r), p = l.viewUrl, f = AssetPool.Instance.getPrefab(p);
                if (_.isNil(f)) {
                    t.push((async () => {
                        f = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, p) as any;
                        AssetPool.Instance.addPrefab(f, p);
                    })());
                }
                const h = l.bulletId;
                if (h > 0)
                    t.push(this.loadBullet(h));
            }
        }
        if (t.length > 0)
            await Promise.all(t);
    }
    loadScene(name: string) {
        return new Promise((resolve) => {
            let t, n;
            t = GAME_SCENE_PATH_ + "/" + name;
            n = AssetPool.Instance.getPrefab(t);
            if (_.isNil(n)) {
                AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, t).then((_n) => {
                    n = _n;
                    AssetPool.Instance.addPrefab(n, t);
                    resolve(null);
                });
            }
            else {
                resolve(null);
            }
        });
    }
    loadSkills(e: number | number[]) {
        return (async () => {
            let t: any[] = [];
            let n = _.union(e);
            let o = (e: number) => {
                let o = n[e];
                if (o > 0) {
                    let i = _SkillConfig.Instance.get(o);
                    switch (i.bulletType) {
                        case E_SKILL_FIRE_TYPE.Buff:
                        case E_SKILL_FIRE_TYPE.Script:
                            let p = GAME_SKILL_PATH_ + "/" + i.skilPrefab;
                            let f = AssetPool.Instance.getPrefab(p);
                            if (_.isNil(f)) {
                                t.push((async () => {
                                    f = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, p) as any;
                                    AssetPool.Instance.addPrefab(f, p);
                                    AssetPool.Instance.put(AssetPool.Instance.createObjWithPrefab(f, p));
                                })());
                            }
                            break;
                        case E_SKILL_FIRE_TYPE.Summon:
                            let h = _HelperConfig.Instance.get(o).viewUrl;
                            let g = AssetPool.Instance.getPrefab(h);
                            if (_.isNil(g)) {
                                t.push((async () => {
                                    g = await AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, h) as any;
                                    AssetPool.Instance.addPrefab(g, h);
                                    for (let t = 0; t < i.tiggerCnt; t++) {
                                        AssetPool.Instance.put(AssetPool.Instance.createObjWithPrefab(g, h));
                                    }
                                })());
                            }
                            break;
                        case E_SKILL_FIRE_TYPE.Bullet:
                            t.push(this.loadBullet([i.fireId]));
                    }
                }
            };
            for (let i = 0; i < n.length; i++) {
                o(i);
            }
            if (t.length > 0) {
                await Promise.all(t);
            }
        })();
    }

    recycle(e) {
        if (e instanceof cc.Component) {
            e = e.node;
        }
        AssetPool.Instance.put(e);
    }
    static get Instance(): Factory {
        if (!Factory._instance)
            Factory._instance = new Factory();
        return Factory._instance;
    }
}
