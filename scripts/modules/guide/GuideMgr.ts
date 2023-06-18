import { GuideEvent, SpecialGuideEnum } from "./GuideEnums";
import { GlobalEventTarget } from "../common/GlobalEventTarget";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, E_MenuToggleType } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import BattleWorld from "../battle/BattleWorld";
import GuideTask from "./GuideTask";
import GuideTaskMgr from "./GuideTaskMgr";
import _GuideTextConfig from "../../ccstudio/config/_GuideTextConfig";
import GuideUI from "./GuideUI";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import Model from "../../ccstudio/data/Model";
import Utils_ from "../../ccstudio/utils/Utils";

const _: any = window["_"];
export default class GuideMgr {
    private _config: any = {};
    private _curSpecialId: number = -1;
    private _curTask: GuideTask = null;
    private _extraGuideTypes: number[] = [1];
    private _guideData: any = {};
    private _guideTextNode: cc.Node | null = null;
    private _guideUI: GuideUI = null;
    private static _instance: GuideMgr = null;
    private _isEnd: boolean;
    private _isInGuide: boolean = false;
    private _mainGuideTypes: number[] = [0];
    private _maskNode: cc.Node | null = null;

    private _saveHandler: any;
    private _taskMgr: GuideTaskMgr = new GuideTaskMgr();
    private checkSpecialId: number = -1;
    private lastGuideIdKey: string = "lastGuideId2";
    private preconditionGuide: number[] = [];
    public skipGuide: boolean = false;
    private specialGuideDataKey: string = "specialGuideData";
    private touchNodePool: any = [];
    addGuideNode(id: number, guildnode: cc.Node) {
        for (let n = 0; n < this.touchNodePool.length; n++) {
            if (this.touchNodePool[n].id == id) {
                this.touchNodePool[n].guideNode = guildnode;
                return;
            }
        }
        this.touchNodePool.push({
            id: id,
            guideNode: guildnode
        });
    }
    addSpecialGuide(e: number) {
        let t = [];
        const n = LocalStorageTool.getItemLocal(this.specialGuideDataKey);
        if (n) {
            t = JSON.parse(n);
        }
        else {
            LocalStorageTool.setItemLocal(this.specialGuideDataKey, JSON.stringify(t));
        }
        if (t.indexOf(e) == -1) {
            t.push(e);
            LocalStorageTool.setItemLocal(this.specialGuideDataKey, JSON.stringify(t));
        }
    }
    public check(t: boolean = false): void {
        if (!this.skipGuide && !this.isEnd()) {
            const task = this.getNewTask();
            if (!t && task) {
                const o = this.getNormalConfig(task.id).precondition;
                if (o.type == 1 && Number(o.args[0]) !== -1) {
                    Model.ui.closeAll();
                    BattleWorld.Instance.pause();
                    this._isInGuide = true;
                    const r = _GuideTextConfig.Instance.get(Number(o.args[0]));
                    return cc.director.emit(GlobalEventName.GuideTextShow, true, 0, r);
                }
            }
            if (this._curTask && this._curTask !== task) {
                GlobalEventTarget.emit(GuideEvent.TASK_DEACTIVE, this._curTask);
                this._isInGuide = false;
                this.recoverStep();
            }
            this._curTask = task;
            if (this._curTask && this._curTask.isTrigger()) {
                this.startGuide();
                GlobalEventTarget.emit(GuideEvent.TASK_ACTIVE, this._curTask);
                this._isInGuide = true;
                Model.ui.closeAll();
            }
        }
    }
    checkEnd() {
        let e = true;
        const t = this._config[0];
        if (this._guideData[0].stage < t.length) {
            e = false;
        }
        if (!this._isEnd && e) {
            GlobalEventTarget.emit(GuideEvent.END);
        }
        this._isEnd = e;
    }
    checkLastSpecial() {
        var e = LocalStorageTool.getItemLocal(this.lastGuideIdKey);
        if (!(null == e || this.isLastSpecial(e) && this.isCompleteSpecialGuide(e))) {
            for (var t = this._config[1], n = 0, o = 0; o < t.length; o++)
                if (t[o][0].id == e) {
                    n = this.isCompleteSpecialGuide(e) ? t[o][0].recoverStep : t[o][0].id % 100 == 1 ? t[o][0].recoverStep : t[o - 1][0].recoverStep;
                    var r = this.getSpecialConfig(n);
                    if (null != r) {
                        var i = r.precondition;
                        if (0 == i.type && "-1" != i.args[0])
                            for (var a = 0; a < i.args.length; a++)
                                this.preconditionGuide.push(Number(i.args[a]));
                    }
                    break;
                }
            0 != n && (this.recoverSpecialData(n), this.checkSpecialId = n);
        }
    }
    checkNormalGuide() { }
    public checkPreCondition(t: number): void {
        if (!this.skipGuide) {
            const n = this.getPreconditionConfig(t);
            if (n !== null) {
                this._curTask = this._taskMgr.getTask(2, n.stage, n.step);
                if (this._curTask) {
                    GlobalEventTarget.emit(GuideEvent.TASK_ACTIVE, this._curTask);
                    this._isInGuide = true;
                    this.startGuide();
                }
            }
        }
    }
    public checkSpecial(t: number, n: boolean = false): void {
        if (!this.skipGuide) {
            var o = this.getSpecialConfig(t);
            if (!n) {
                if (this.isCompleteSpecialGuide(t)) {
                    return;
                }
                if (this.isLockSpecialGuide(t)) {
                    return;
                }
                if (o == null) {
                    return;
                }
                if (o.type == 1) {
                    LocalStorageTool.setItemLocal(this.lastGuideIdKey, t);
                }
                const r = o.precondition;
                if (r.type == 1 && Number(r.args[0]) !== -1) {
                    this._isInGuide = true;
                    const i = _GuideTextConfig.Instance.get(Number(r.args[0]));
                    cc.director.emit(GlobalEventName.GuideTextShow, true, 1, i);
                    this._curSpecialId = t;
                    return;
                }
            }
            if (t == -1) {
                t = this._curSpecialId;
                o = this.getSpecialConfig(t);
            }
            this._curTask = this._taskMgr.getTask(1, o.stage, o.step);
            if (this._curTask) {
                this.startSpecialGuide(this._curTask.id);
                GlobalEventTarget.emit(GuideEvent.TASK_ACTIVE, this._curTask);
                this._isInGuide = true;
                this.startGuide();
                cc.director.emit(GlobalEventName.ShowMask, false);
            }
        }
    }
    completePreSpecialGuide(e) {
        for (var t = Math.floor(e / 100), n = this._config[1], o = 0; o < n.length; o++) {
            var r = n[o][0].id;
            Math.floor(r / 100) == t && r < e && this.completeSpecialGuide(r);
        }
    }
    completeSpecialGuide(e) {
        this.addSpecialGuide(e);
    }
    createTasks() {
        for (const e in this._config) {
            const t = this._config[e];
            for (let n = 0; n < t.length; n++) {
                for (let o = 0; o < t[n].length; o++) {
                    this._taskMgr.addTask(parseInt(e), n, o, t[n][o]);
                }
            }
        }
    }
    public getCurTask(): GuideTask {
        return this._curTask;
    }
    getGuideNode(id: number) {
        for (var t = 0; t < this.touchNodePool.length; t++)
            if (this.touchNodePool[t].id == id)
                return this.touchNodePool[t].guideNode;
        cc.error("node is null:" + id);
        return null;
    }
    public getNewTask(): GuideTask {
        let types = this._mainGuideTypes;
        for (let t = 0; t < types.length; t++) {
            const _type = types[t];
            let data = this._guideData[_type];
            let stage = data.stage;
            let step = data.step;
            const task = this._taskMgr.getTask(_type, stage, step);
            if (task && task.isTrigger()) {
                return task;
            }
        }
    }
    public getNormalConfig(e: number): any {
        const t = this._config[0];
        for (let n = 0; n < t.length; n++) {
            for (let o = 0; o < t[n].length; o++) {
                if (t[n][o].id == e) {
                    return t[n][o];
                }
            }
        }
    }
    public getPreconditionConfig(e: number): any {
        const t = this._config[2];
        for (let n = 0; n < t.length; n++) {
            for (let o = 0; o < t[n].length; o++) {
                if (t[n][o].id == e) {
                    return t[n][o];
                }
            }
        }
    }
    public getSpecialConfig(e: number): any {
        const t = this._config[1];
        for (let n = 0; n < t.length; n++) {
            for (let o = 0; o < t[n].length; o++) {
                if (t[n][o].id == e) {
                    return t[n][o];
                }
            }
        }
    }
    public getSpecialGuideEnum(e: number, t: number): SpecialGuideEnum {
        let n = SpecialGuideEnum.None;
        const o = this._config[1];
        for (let r = 0; r < o.length; r++) {
            for (let i = 0; i < o[r].length; i++) {
                const a = o[r][i].conditions[0];
                if (a.type == e && parseInt(a.args[0]) == t) {
                    return o[r][i].id;
                }
            }
        }
        return n;
    }
    public getTaskMgr(): GuideTaskMgr {
        return this._taskMgr;
    }
    async init(e) {
        this._saveHandler = e.saveHandler;
        this._guideData = e.guideData;
        this.readConfig(e.config);
        this.initGuideData();
        this.checkEnd();
        this.updateGuideData();
        this.createTasks();
        this.checkEnd();
        const t = cc.find("App");
        if (this._guideUI == null) {
            const node = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.GuideUI.path);
            this._guideUI = node.getComponent(GuideUI);
            t.addChild(this._guideUI.node);
            this._guideUI.node.active = false;
        }
        if (this._maskNode == null) {
            const o = this;
            const m = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.MaskUI.path);
            o._maskNode = m;
            t.addChild(this._maskNode);
            this._maskNode.active = false;
        }
        if (this._guideTextNode == null) {
            const s = this;
            const r = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.GuideTextUI.path);
            s._guideTextNode = r;
            t.addChild(this._guideTextNode);
            this._guideTextNode.active = false;
        }
        this.checkLastSpecial();
        cc.director.on(GlobalEventName.ShowMask, this.onShowMask, this);
    }
    initGuideData() {
        this._guideData = this._guideData || {};
        for (const e in this._config) {
            this._guideData[e] = this._guideData[e] || {
                stage: 0,
                step: 0
            };
        }
    }
    isCompleteGuide(e) {
        return this._guideData[0].stage > e;
    }
    public isCompleteSpecialGuide(t: number): boolean {
        if (this.skipGuide) {
            return true;
        }
        let n = [];
        const o = LocalStorageTool.getItemLocal(this.specialGuideDataKey);
        if (o !== null) {
            n = JSON.parse(o);
        }
        else {
            LocalStorageTool.setItemLocal(this.specialGuideDataKey, JSON.stringify(n));
        }
        return n.indexOf(t) !== -1;
    }
    public isEnd(): boolean {
        return this._isEnd;
    }
    public isInGuide(): boolean {
        return this._isInGuide;
    }
    isLastSpecial(e) {
        const t = Math.floor(e / 100);
        const n = this._config[1];
        for (let o = 0; o < n.length; o++) {
            const r = n[o][0].id;
            if (Math.floor(r / 100) == t && r > e)
                return false;
        }
        return true;
    }
    public isLockSpecialGuide(e: number): boolean {
        const t = this._config[1];
        for (let n = 0; n < t.length; n++) {
            for (let o = 0; o < t[n].length; o++) {
                if (t[n][o].id == e) {
                    return t[n][o].lockId !== 0 && !this.isCompleteSpecialGuide(t[n][o].lockId);
                }
            }
        }
        return false;
    }
    public isMainGuideEnd(): boolean {
        for (let i = 0; i < this._mainGuideTypes.length; i++) {
            let type = this._mainGuideTypes[i];
            if (this._guideData[type].stage < this._taskMgr.getStageLength(type)) {
                return false;
            }
        }
        return true;
    }
    async nextStep(e = false) {
        if (this._curTask?.type == 2) {
            this._isInGuide = false;
            if (this.preconditionGuide.length > 0) {
                await Utils_.waits(0.03);
            }
            else {
                await this.startCheckLastSpecial();
            }
        }
        else if (this._curTask?.type !== 1) {
            this.stopGuide();
            const t = this.getNormalConfig(this._curTask.id).postCondition;
            if (!e && t.type == 1 && Number(t.args[0]) !== -1) {
                this._isInGuide = true;
                const n = _GuideTextConfig.Instance.get(Number(t.args[0]));
                cc.director.emit(GlobalEventName.GuideTextShow, false, 0, n);
                GlobalEventTarget.emit(GuideEvent.TASK_DEACTIVE, this._curTask);
                return;
            }
            this.reportGuideFinish(this._curTask.id);
            this._guideData[this._curTask.type].step += 1;
            if (this._guideData[this._curTask.type].step >= this._taskMgr.getStepLength(this._curTask.type, this._curTask.stage)) {
                this._guideData[this._curTask.type].stage += 1;
                this._guideData[this._curTask.type].step = 0;
            }
            this.save();
            this.checkEnd();
            if (this.isEnd()) {
                GlobalEventTarget.emit(GuideEvent.COMPLETE_NORMAL_GUIDE);
            }
            GlobalEventTarget.emit(GuideEvent.STEP_SUCCESS, { Type: this._curTask.type, Stage: this._curTask.stage, Step: this._curTask.step });
            this._isInGuide = false;
            this._curTask = null;
            this.check();
        }
        else {
            this.addSpecialGuide(this._curTask.id);
            GlobalEventTarget.emit(GuideEvent.TASK_DEACTIVE, this._curTask);
            this._isInGuide = false;
            const t = this.getSpecialConfig(this._curTask.id).postCondition;
            if (!e && t.type == 1 && Number(t.args[0]) !== -1) {
                this._isInGuide = true;
                const n = _GuideTextConfig.Instance.get(Number(t.args[0]));
                cc.director.emit(GlobalEventName.GuideTextShow, false, 1, n);
                GlobalEventTarget.emit(GuideEvent.TASK_DEACTIVE, this._curTask);
                return;
            }
            if (this.isLastSpecial(this._curTask.id)) {
                cc.director.emit(GuideEvent.COMPLETE_SPECIAL_GUIDE);
                if (this._curTask.id == 413) {
                    setTimeout(() => {
                        Model.ui.closeAll();
                    }, 0.1);
                }
                this.stopGuide();
                cc.director.emit(GlobalEventName.ShowMask, false);
            }
            else {
                cc.director.emit(GlobalEventName.ShowMask, true);
            }
        }
    }
    onShowMask(b: boolean) {
        this._maskNode.active = b;
    }
    readConfig(e: any[]) {
        const t = this;
        _.each(e, (e: any) => {
            t._config[e.type] = t._config[e.type] || [];
            t._config[e.type][e.stage] = t._config[e.type][e.stage] || [];
            t._config[e.type][e.stage][e.step] = e;
        });
    }
    recoverSpecialData(e) {
        var t = Math.floor(e / 100), n = [], o = LocalStorageTool.getItemLocal(this.specialGuideDataKey);
        null != o && (n = JSON.parse(o));
        for (var r = this._config[1], i = 0; i < r.length; i++) {
            var a = r[i][0].id;
            Math.floor(a / 100) == t && (a >= e ? -1 != n.indexOf(a) && n.splice(n.indexOf(a), 1) : -1 == n.indexOf(a) && n.push(a));
        }
        LocalStorageTool.setItemLocal(this.specialGuideDataKey, JSON.stringify(n));
    }
    recoverStep() {
        for (const e in this._guideData) {
            const t = this._config[e];
            const n = this._guideData[e];
            if (n.stage < t.length) {
                if (t[n.stage][n.step].recoverStep == -1) {
                    n.stage += 1;
                    n.step = 0;
                }
                else {
                    n.step = 0;
                }
            }
        }
    }
    removeGuideNode(e: any) { }
    removeSpecialGuide() {
        GlobalEventTarget.emit(GuideEvent.TASK_DEACTIVE, this._curTask);
        cc.director.emit(GlobalEventName.ShowMask, false);
    }
    reportGuideFinish(e) {
        var t = { Guide_ID: e };
    }
    private save(): void {
        this._saveHandler && this._saveHandler(this._guideData);
    }
    public setGuideData(type: number, stage: number, step: number): void {
        this._guideData[type].stage = stage;
        this._guideData[type].step = step;
        this.save();
        this.checkEnd();
        this.check();
    }
    public skipAll(): void {
        let types = this._mainGuideTypes.concat(this._extraGuideTypes);
        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            this._guideData[type].stage = this._taskMgr.getStageLength(type);
            this._guideData[type].step = 0;
        }
        this.checkEnd();
        this.save();
    }
    async startCheckLastSpecial() {
        if (this.checkSpecialId !== -1) {
            if (this.preconditionGuide.length > 0) {
                this.checkPreCondition(this.preconditionGuide[0]);
                this.preconditionGuide.splice(0, 1);
            }
            else {
                await this.checkSpecial(this.checkSpecialId);
            }
        }
    }
    public startGuide(): void {
        if (this._curTask.id == 1) {
            BattleWorld.Instance.pause();
        }
        else if (this._curTask.id == 2) {
            cc.director.emit(GlobalEventName.GuideScrollToFirst);
            BattleWorld.Instance.pause();
        }
        if (this._curTask.type == 1 || this._curTask.type == 2) {
            BattleWorld.Instance.pause();
        }
    }
    public startSpecialGuide(e: number): void {
        if (e == SpecialGuideEnum.TouchBattleButton) {
            cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Battle);
        }
        else if (e == SpecialGuideEnum.TouchSnowButton) {
            cc.director.emit(GlobalEventName.GuideScrollToLast, 350);
        }
        else if (e == SpecialGuideEnum.TouchSearchButton) {
            cc.director.emit(GlobalEventName.CloseMineView);
        }
        else if (e == SpecialGuideEnum.TouchHeroButton3) {
            cc.director.emit(GlobalEventName.CloseAllMineView);
        }
        else if (e == SpecialGuideEnum.TouchCaveRushButton) {
            cc.director.emit(GlobalEventName.GuideScrollToLast, 600);
        }
        else if (e == SpecialGuideEnum.TouchLegionRushButton) {
            cc.director.emit(GlobalEventName.GuideScrollToLast, 850);
        }
    }
    public stopGuide(): void {
        null != this._curTask ? (1 == this._curTask.id ? BattleWorld.Instance.resume() : 2 == this._curTask.id && BattleWorld.Instance.resume(), 1 != this._curTask.type && 2 != this._curTask.type || BattleWorld.Instance.resume()) : BattleWorld.Instance.resume();
    }
    stopSpecialGuide() {
        GlobalEventTarget.emit(GuideEvent.TASK_DEACTIVE, this._curTask);
        this._isInGuide = false;
        cc.director.emit(GuideEvent.COMPLETE_SPECIAL_GUIDE);
        this.stopGuide();
        cc.director.emit(GlobalEventName.ShowMask, false);
        LocalStorageTool.setItemLocal(this.lastGuideIdKey, -1);
    }
    updateGuideData() {
        if (!this._isEnd) {
            for (const e in this._config) {
                const t = this._config[e];
                const n = this._guideData[e];
                if (n.stage >= t.length) {
                    n.stage = t.length;
                    n.step = 0;
                }
                else if (n.step >= t[n.stage].length) {
                    n.stage += 1;
                    n.step = 0;
                }
            }
            this.recoverStep();
        }
    }

    static get instance() {
        if (!GuideMgr._instance)
            GuideMgr._instance = new GuideMgr();
        return GuideMgr._instance;
    }
}
