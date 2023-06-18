import { GamePrefabs_, MapUIPrefabs, IMAGE_PATHS_, SPINE_DATAS_, SPINE_DATA_PATH_ } from "./Const";
import AppConstDefine from "./AppConst";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import AssetPool from "../asset/AssetPool";
import Config from "../../ccstudio/configs/Config";
import Factory from "../battle/Factory";
import HeroData from "../hero/HeroData";
import _LevelConfig from "../../ccstudio/config/_LevelConfig";
import Model from "../../ccstudio/data/Model";
const _: any = window["_"];
export default class Launder extends cc.Component {
    private static _instance: Launder = null;
    async checkMiniGameUpdate(e: Function) {
        // const t = (e: any, t: Function) => {
        //     this.remoteBuildId = parseInt(e.baseVersion);
        //     t(false)
        // }
        // try {
        //     const n = await this.requestVersions(DEFAULT_PACKAGE_URL + "versions.json", t).catch((e) => {
        //         MsgBox.open(e + ",请稍后再试").confirm(() => {
        //             cc.director.emit("restart")
        //         })
        //         return null
        //     })
        //     if (n !== null) {
        //         e(n)
        //     }
        // } catch (o) {
        //     MsgBox.open(o).confirm(() => {
        //         cc.director.emit("restart")
        //     })
        // }
    }
    async checkNativeUpdate(e: Function) {
        // try {
        //     const t = await this.requestVersions(DEFAULT_PACKAGE_URL + "versions.json", this.initVersions.bind(this)).catch((e) => {
        //         MsgBox.open(e + ",请稍后再试").confirm(() => {
        //             cc.director.emit("restart")
        //         })
        //         return null
        //     })
        //     if (t !== null) {
        //         if (t) {
        //             h.default.loadMainScene("Update", {
        //                 needLoading: false,
        //                 callback: () => { }
        //             });
        //             e(true)
        //         } else {
        //             e(false)
        //         }
        //     }
        // } catch (n) {
        //     MsgBox.open(n).confirm(() => {
        //         cc.director.emit("restart")
        //     })
        // }
    }
    async checkUpdate() {
        return new Promise((resolve) => {
            if (AppConstDefine.CUNTOM_DEBUG) {
                resolve(false);
            }
            else {
                this.checkMiniGameUpdate(resolve);
            }
        });
    }
    getLoadFuncs() {
        const e = this;
        
        const MapPrefabs = _.merge(GamePrefabs_, MapUIPrefabs);
        let img_path = IMAGE_PATHS_;
        const spine_path = SPINE_DATAS_;
        const list = [];
        list.push(async () => {
            cc.director.emit("transition-message", "正在加载贴图");
            const e = [];
            _.each(img_path, async (o) => {
                e.push(new Promise((resolve) => {
                    AssetManager.Instance.loadDir(NAMES_BUNDLE.Game, o, cc.SpriteFrame, null, (n) => {
                        const r = n.assets;
                        _.each(r, (e) => {
                            AssetManager.Instance.loadSpriteFrame(NAMES_BUNDLE.Game, `${o}/${e.name}`);
                        });
                        resolve(null);
                    });
                }));
            });
            await Promise.all(e);
        });
        list.push(async () => {
            const e = [];
            _.each(spine_path, (t) => {
                e.push(AssetManager.Instance.loadSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, t));
            });
            await Promise.all(e);
        });
        list.push(async () => {
            const funcs = [];
            let o = 0;
            for (const key in MapPrefabs) {
                const it = MapPrefabs[key];
                if (typeof it == "string") {
                    funcs.push(new Promise((resolve) => {
                        AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, it).then((r: any) => {
                            cc.director.emit("transition-message", `正在加载场景资源:${++o}/${funcs}`);
                            AssetPool.Instance.addPrefab(r, it, null);
                            resolve(null);
                        });
                    }));
                }
                else if (Array.isArray(it)) {
                    _.each(it, (n) => {
                        const i = n;
                        funcs.push(new Promise((resolve) => {
                            AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, i.path).then((r: any) => {
                                cc.director.emit("transition-message", `正在加载场景资源:${++o}/${it.length}`);
                                AssetPool.Instance.addPrefab(r, i.path, i.viewComp);
                                resolve(null);
                            });
                        }));
                    });
                }
                else {
                    const u = MapPrefabs[key];
                    let total = Object.keys(u).length;
                    funcs.push(new Promise((resolve) => {
                        AssetManager.Instance.loadPrefabAsync(NAMES_BUNDLE.Game, u.path).then((r: any) => {
                            cc.director.emit("transition-message", `正在加载场景资源:${++o}/${total}`);
                            AssetPool.Instance.addPrefab(r, u.path, u.viewComp);
                            resolve(null);
                        });
                    }));
                }
            }
            await Promise.all(funcs);
        });
        list.push(async () => {
            cc.director.emit("transition-message", "正在加载配置");
            await Model.load();
            cc.director.emit("transition-message", "配置加载完成");
            // await Model.initialize();
            cc.director.emit("transition-message", "正在进入游戏");
            const list = [];
            list.push(Factory.Instance.loadHero(HeroData.Instance.battleId));
            const t = Model.partner.equippedIds;
            list.push(Factory.Instance.loadPartners(t));
            const n = Model.skill.equippedIds;
            const o = _.filter(n, (e) => e > 0);
            const r = Model.skill.heroSkillId;
            if (r >= 0)
                o.push(r);
            list.push(Factory.Instance.loadSkills(o));
            list.push(Factory.Instance.loadHurtEffect());
            list.push(Factory.Instance.loadHpBar());
            list.push(Factory.Instance.loadHpDamage());
            const i = Model.level.currNormalLevel;
            let a = Config.level.get(i);
            let c = "scene001";
            if (!_.isNil(a)) {
                c = a.scene;
            }
            list.push(Factory.Instance.loadScene(c));
            a = Config.level.get(i);
            const l = Config.level.getIdsByLevel(i);
            // _.each(a.Waves, (e) => {
            //     _.each(e, (e) => {
            //         l.push(e.id);
            //     });
            // });
            list.push(Factory.Instance.loadEnemys(l));
            await Promise.all(list);
        });
        return list;
    }
    initVersions(e: any, t: Function) {
        // const n = e.hallVersion;
        // const o = parseInt(e.baseVersion);
        // const r = e.packageUrl;
        // if (r !== DEFAULT_PACKAGE_URL) {
        //     DEFAULT_PACKAGE_URL = r;
        //     p.default.Instance.setPackageUrl(r:any)
        // }
        // p.default.Instance.checkVersion(o, n, l.getVersion(), t)
    }
    requestVersions(e: string, t: (arg0: any, arg1: Function) => void): Promise<any> {
        return new Promise(function (n, o) {
            cc.director.emit("scene-message", "正在获取资源版本信息.");
            const r = new XMLHttpRequest;
            r.timeout = 4e3;
            r.ontimeout = () => {
                o("网络连接超时!!");
            };
            r.onerror = () => {
                r.abort();
            };
            r.onreadystatechange = () => {
                if (r.readyState == 4) {
                    if (r.status >= 200 && r.status < 400) {
                        const e = r.responseText;
                        t(JSON.parse(e), n);
                    }
                    else if (r.status > 400 || r.status == 0) {
                        o("网络异常.");
                    }
                }
            };
            r.open("GET", e, true);
            r.send();
        });
    }
    static get Instance() {
        if (!this._instance) {
            this._instance = new Launder();
        }
        return this._instance;
    }
    ;
}
