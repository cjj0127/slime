const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass()
export default class LocalStorageTool extends cc.Component {
    _beFlush;
    static _instance = null;
    _localStorageTable: any = {};
    _storageKey: string = "";
    _version: string = "";
    private _flush() {
        if (this._beFlush) {
            this._beFlush = false;
            this._saveToLocalStorage();
        }
    }
    private _get(e, t) {
        var n = this._localStorageTable[e];
        return null != n && null != n || (n = t),
            n;
    }
    private _loadFromLocalStorage() {
        var e = cc.sys.localStorage.getItem("LocalStorage" + this._storageKey);
        if (e) {
            // var t = XXTEATools.decryptFromBase64(e, "fu03f6ck-bfbd-4d");
            return JSON.parse(e);
        }
        return null;
    }
    private _remove(e) {
        delete this._localStorageTable[e],
            this._beFlush = !0;
    }
    private _saveToLocalStorage() {
        var e = this._localStorageTable, t = JSON.stringify(e)
        // var n = XXTEATools.encryptToBase64(t, "fu03f6ck-bfbd-4d");
        cc.sys.localStorage.setItem("LocalStorage" + this._storageKey, t);
    }
    private _set(e, t) {
        this._localStorageTable[e] !== t && (this._localStorageTable[e] = t, this._beFlush = !0);
    }
    static clearStorage() {
        LocalStorageTool._instance._localStorageTable = {},
            LocalStorageTool._instance._saveToLocalStorage();
    }
    static flush(e = true) {
        e ? LocalStorageTool._instance._flush() : LocalStorageTool._instance._beFlush = !0;
    }
    static getItemLocal(e, t = null) {
        var o = LocalStorageTool._instance._get(e, t);
        return _.isNil(o) ? null : _.cloneDeep(o);
    }
    initialize(e) {
        LocalStorageTool._instance = this;
        this._storageKey = e + this._version;
        this._localStorageTable = this._loadFromLocalStorage();
        this._localStorageTable || (this._localStorageTable = cc.js.createMap());
    }
    lateUpdate() {
        this._flush();
    }
    onDestroy() {
        LocalStorageTool._instance = null;
    }
    static removeItemLocal(e) {
        LocalStorageTool._instance._remove(e);
    }
    static setItemLocal(e, t) {
        t instanceof Object && (t = _.cloneDeep(t)),
            LocalStorageTool._instance._set(e, t);
    }
    static get Instance() {
        return LocalStorageTool._instance || (LocalStorageTool._instance = new LocalStorageTool);
    }
}
