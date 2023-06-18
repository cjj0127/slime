import LangData from "./LangData";
// import { ccclass, property, menu } from "cc._decorator";
const { ccclass, property, menu } = cc._decorator;
@ccclass("LangLabelParamsItem")
export class LangLabelParamsItem {
    @property()
    key: string = "";
    @property()
    value: string = "";
}
const _: any = window["_"];
@ccclass
@menu("Custom/LanLabel")
export default class LanLabel extends cc.Component {
    // @property({
    //     type: [cc.Object],
    //     displayName: "params",
    // })
    // private _params: Array<{ key: string, value: any }> = [];
    // @property({
    //     type: [cc.Object],
    //     displayName: "params",
    // })
    // public params: Array<{ key: string, value: any }> | null = null;
    @property({
        serializable: true,
    })
    private _dataID: string = "";
    private _needUpdate: boolean = false;
    // public dataID: string | null = null;
    @property(LangLabelParamsItem)
    _params: LangLabelParamsItem[] = [];
    // @property
    // private _dataID: string = "";
    @property
    initFontSize: number = 0;
    public getLabelFont(e: string): string {
        switch (e) {
            case "zh":
            case "tr":
                return "SimHei";
            default:
                return "Helvetica";
        }
    }
    // private _needUpdate: boolean = true;
    // private _params: Array<{ key: string, value: any }> = [];
    // private _dataID: string | undefined;
    public language(): void {
        this._needUpdate = true;
    }
    public onLoad(): void {
        this._needUpdate = true;
        if (this.getComponent(cc.Label) || this.getComponent(cc.RichText)) {
            if (this.getComponent(cc.RichText)) {
                this.initFontSize = this.getComponent(cc.RichText).fontSize;
            }
            if (this.getComponent(cc.Label)) {
                this.initFontSize = this.getComponent(cc.Label).fontSize;
            }
        }
        else {
            cc.error(this.node.name, this._dataID);
        }
    }
    public setVars(e: string, t: any): void {
        let n = false;
        for (let o = 0; o < this._params.length; o++) {
            let r = this._params[o];
            if (r.key == e) {
                r.value = t;
                n = true;
            }
        }
        if (!n) {
            let i = { key: e, value: t };
            this._params.push(i);
        }
        this._needUpdate = true;
    }
    public update(): void {
        if (this._needUpdate) {
            this.updateLabel();
            this._needUpdate = false;
        }
    }
    public updateLabel(): void {
        do {
            if (!this._dataID)
                break;
            let e = this.getComponent(cc.Label) || this.getComponent(cc.RichText);
            if (!e) {
                cc.warn("[LanLabel], 该节点没有cc.Label || cc.RichText组件");
                break;
            }
            e.string = this.string;
        } while (0);
    }
    @property({
        type: cc.String,
        serializable: true,
    })
    get dataID() {
        return this._dataID || "";
    }
    set dataID(value: string) {
        this._dataID = value;
        this._needUpdate = true;
    }
    @property(LangLabelParamsItem)
    get params() {
        return this._params || [];
    }
    set params(value: LangLabelParamsItem[]) {
        this._params = value;
        this._needUpdate = true;
    }
    get string() {
        // let lang = LangData.getLangByID(this._dataID);
        // if (lang && this._params.length > 0) {
        //     this._params.forEach((item) => {
        //         lang = lang.replace(`%{${item.key}}`, item.value);
        //     });
        // } else {
        //     cc.warn("[LanLabel] 未找到语言标识，使用dataID替换");
        //     lang = this._dataID;
        // }
        // return lang;
        let e = LangData.getLangByID(this._dataID);
        if (e && this._params.length > 0) {
            _.each(this._params, (t) => {
                e = e.replace(`%{${t.key}}`, t.value);
            });
        }
        else {
            // cc.warn("[LanLabel] 未找到语言标识，使用dataID替换");
            e = e || this._dataID;
        }
        return e;
    }
}
