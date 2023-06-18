import { GlobalEventName } from "./Events";
import { ManagerBundle } from "./BundleMgr";
import Loading from "../loading/Loading";
import LoadingView from "../loading/LoadingView";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
export default class Transition {
    private static _instance: Transition = null;
    _loading = false;
    completedCount = 0;
    launchBundleName = "";
    launchConfig: any = null;
    launchSceneName = "";
    loadCustomTask = async (onTaskCompleted, onAllTasksCompleted) => {
        const tasks = this.launchConfig.customLoadTask;
        if (tasks && tasks.length > 0) {
            let a = tasks.length, s = 0, c = 0, l = 0;
            const p = async () => {
                let task = tasks[c];
                if (task) {
                    await task();
                    this.completedCount++;
                    onTaskCompleted && onTaskCompleted(s + 1, a);
                    cc.director.emit("transition-progress", this.completedCount, this.totalCount);
                    s++;
                    if (s == a) {
                        onAllTasksCompleted();
                    }
                    else {
                        u();
                    }
                }
            };
            const u = () => {
                for (; l <= 5 && c < tasks.length;)
                    p(), c++;
            };
            u();
        }
        else {
            onAllTasksCompleted();
        }
    };
    onLaunched = [];
    onPreloadProgress = (completedCount, totalCount) => {
        this.completedCount = completedCount;
        this.totalCount =
            totalCount +
                ((this.launchConfig?.customLoadTask?.length) || 0);
        cc.director.emit("transition-progress", this.completedCount, this.totalCount);
    };
    onSceneLoaded = (error, scene) => {
        if (error) {
            cc.director.emit("launch-scene-error", `onSceneLoaded error: ${error}`);
        }
        cc.director.runScene(scene, null, () => {
            if (window['wx'] && window['wx'].startTime && this.onLaunched.length > 0) {
                this.onLaunched.forEach((func) => func());
            }
            this.onLaunched.length = 0;
            Loading.close();
            setTimeout(() => {
                cc.sys.garbageCollect();
            }, 2000);
            cc.director.emit("scene-launched");
            this._loading = false;
        });
    };
    preloadTime = null;
    prevBundleName = "";
    totalCount = 0;
    public static enterGame(t: any[], n: Function) {
        Transition.loadScene(NAMES_BUNDLE.Game, "Game", {
            needLoading: false,
            transitionName: "Transition",
            customLoadTask: t,
            callback: n,
        });
    }
    public async enterScene(e: string, t: string, n: any): Promise<void> {
        let o = null == n ? undefined : n.callback;
        if (!this.launchSceneName) {
            this.launchSceneName = cc.find("Canvas").parent.name;
        }
        if (this.launchSceneName == t) {
            if (o) {
                this.loading ? this.onLaunched.push(o) : o();
            }
        }
        else {
            n = n || {
                needLoading: false,
            };
            this.launchConfig = {
                needLoading: n.needLoading == 1,
            };
            this.launchConfig.transitionName = n.transitionName || "Transition";
            this.launchConfig.customLoadTask = n.customLoadTask || [];
            this.launchConfig.isPortrait = n.isPortrait == 1;
            if (n.needLoading) {
                await this.launchTransition();
            }
            else {
                Loading.open().getComponent(LoadingView).registerTransitionProgress();
            }
            this.prevBundleName = this.launchBundleName;
            this.launchBundleName = e;
            this.launchSceneName = t;
            o && this.onLaunched.push(o);
            this.loading = true;
            cc.audioEngine.stopAll();
            cc.audioEngine.uncacheAll();
            this.preloadTime = new Date().getTime();
            this.totalCount = (this.launchConfig?.customLoadTask?.length) || 0;
            ManagerBundle.Instance.loadBundle_(this.launchBundleName, (error) => {
                error && this.onPreLaunched(null);
            });
        }
    }
    // private launchConfig: {
    //     needLoading: boolean;
    //     transitionName: string;
    //     customLoadTask: any[];
    //     isPortrait: boolean;
    // };
    // private launchSceneName: string;
    // private prevBundleName: string;
    // private launchBundleName: string;
    // private totalCount: number;
    // private preloadTime: number;
    // private loading: boolean;
    // private onLaunched: Function[];
    // constructor() {
    //     this.loading = false;
    //     this.onLaunched = [];
    // }
    public launchTransition(): Promise<void> {
        return new Promise<void>((resolve) => {
            cc.director.loadScene(this.launchConfig.transitionName, (error) => {
                if (error) {
                    cc.director.emit("launch-scene-error", `launch transition scene error:${error}`);
                }
                if (this.prevBundleName && this.prevBundleName != this.launchBundleName && !ManagerBundle.Instance.isEngine(this.prevBundleName)) {
                    AssetManager.Instance.releaseBundleAllRes(this.prevBundleName);
                    this.prevBundleName = null;
                }
                resolve();
            });
        });
    }
    public static loadMainScene(t: string, n?: any): boolean {
        if (t !== null && t !== undefined && t !== "") {
            Transition.Instance.enterScene("main", t, n);
            return true;
        }
        return false;
    }
    public static loadScene(t: string, n: string, o?: any): void {
        let r = null == o ? undefined : o.callback;
        if (t !== null && t !== "") {
            if (n !== null && n !== "" && n !== undefined) {
                Transition.Instance.enterScene(t, n, o);
            }
        }
        r && r(false);
    }
    public onPreLaunched(error: Error): void {
        if (error) {
            cc.director.emit("launch-scene-error", `preloadScene error:${error.message}`);
        }
        cc.director.emit(GlobalEventName.LaunchSceneBefore);
        this.loadCustomTask(() => {
            return this.launchConfig.needLoading;
        }, () => {
            if (this.prevBundleName && this.prevBundleName != this.launchBundleName && !ManagerBundle.Instance.isEngine(this.prevBundleName)) {
                AssetManager.Instance.releaseBundleAllRes(this.prevBundleName);
                this.prevBundleName = null;
            }
            cc.sys.garbageCollect();
            cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
                ManagerBundle.Instance.getBundle(this.launchBundleName).loadScene(this.launchSceneName, this.onPreloadProgress, this.onSceneLoaded);
            });
        });
    }
    static get Instance() {
        return Transition._instance || (Transition._instance = new Transition()),
            Transition._instance;
    }
    get loading() {
        return this._loading;
    }
    set loading(e) {
        this._loading = e;
    }
}
