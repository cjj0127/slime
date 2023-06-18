import { GlobalEventName } from "./Events";
import Model from "../../ccstudio/data/Model";
export const PROP_EVENT = {
    Add: "prop_add",
    Change: "prop_value_change",
    Remove: "prop_remove"
};
const { ccclass, property } = cc._decorator;
@ccclass
export default class PropAddationEventTarget extends cc.EventTarget {
    private _prop: any = null;
    private _value: any = null;
    public isActive: boolean = false;
    public active() {
        if (!this._prop) {
            cc.error("未设置属性");
            return this;
        }
        if (this.isActive)
            return this;
        this.isActive = true;
        Model.user.addPropAddation(this);
        return this;
    }
    private changeEvent() {
        if (!this._prop)
            return;
        if (this.isActive)
            cc.director.emit(GlobalEventName.PropChange, this.prop);
    }
    public disable() {
        if (!this._prop) {
            cc.error("未设置属性");
            return this;
        }
        this.isActive = false;
        Model.user.removePorpAddation(this);
        return this;
    }
    public setProp(prop: any) {
        this._prop = prop;
        return this;
    }
    public get prop() {
        return this._prop;
    }
    public get value() {
        return this._value;
    }
    public set value(val: any) {
        if (this._value != val) {
            this._value = val;
            this.changeEvent();
        }
    }
}
