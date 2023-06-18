import _CollectionConfig from "../../ccstudio/config/_CollectionConfig";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import PropAddationEventTarget from "../common/PropAddation";
const _: any = window['_'];
export default class CollectionData {
    private static _instance: CollectionData;
    private items: any = {};
    private props: {
        [key: string]: any;
    } = {};
    public activeProps(): void {
        _.each(this.props, (prop) => {
            prop.active();
        });
    }
    public calcAddationValue(e: number, t: number): string {
        return `${t * _CollectionConfig.Instance.get(e).addBaseValue}`;
    }
    public createData(id: number, lv: number, unlockLv?: number): void {
        if (unlockLv == undefined) {
            unlockLv = 1;
        }
        const instance = _CollectionConfig.Instance.get(id);
        const type = instance.type;
        this.items[id] = {
            id,
            lv,
            ids: instance.ids,
            unlockLv,
            prop: instance.prop,
            type,
            propAddation: `${lv * instance.addBaseValue}`,
        };
    }
    public getData(id: number): any {
        return this.items[id];
    }
    public getLvupEnableItems(type: number): any[] {
        const items: any[] = [];
        _.each(this.items, (n) => {
            if (type == n.type && n.lv < n.unlockLv) {
                items.push(n);
            }
        });
        return items;
    }
    public getPropObj(prop: string): any {
        let propObj = this.props[prop];
        if (_.isNil(propObj)) {
            propObj = new PropAddationEventTarget();
            propObj.setProp(prop);
            propObj.value = "0";
            this.props[prop] = propObj;
        }
        return propObj;
    }
    public init(): void {
        const self = this;
        this.props = {};
        _.each(this.items, (t) => {
            const propObj = self.getPropObj(t.prop);
            propObj.value = NumberPlus.add(propObj.value, t.propAddation);
        });
    }
    public load(): void {
        const self = this;
        const data = LocalStorageTool.getItemLocal("cc_user-collection-data", {});
        const items: {
            [key: number]: any;
        } = {};
        if (!_.isEmpty(data)) {
            _.each(data, (t, o) => {
                const id = parseInt(o);
                items[id] = self.createData(id, t, 0);
            });
        }
        this.items = items;
    }
    public lvup(id: number): boolean {
        const data = this.getData(id);
        if (_.isNil(data)) {
            return false;
        }
        if (0 == data.unlockLv || data.lv == data.unlockLv) {
            return false;
        }
        data.lv = data.unlockLv;
        const instance = _CollectionConfig.Instance.get(id);
        data.propAddation = `${data.lv * instance.addBaseValue}`;
        this.reCalcPropType(instance.prop);
        this.save();
        return true;
    }
    public reCalcPropType(type: string): void {
        let t = "0";
        _.each(this.items, (n) => {
            if (n.prop == type) {
                t = NumberPlus.add(t, n.propAddation);
            }
        });
        const propObj = this.getPropObj(type);
        propObj.value = t;
        propObj.active();
    }
    public save(): void {
        const data: {
            [key: number]: number;
        } = {};
        _.each(this.items, (t) => {
            if (t)
                data[t.id] = t.lv;
        });
        LocalStorageTool.setItemLocal("cc_user-collection-data", data);
    }
    public unlock(id: number, unlockLv: number): void {
        const data = this.getData(id);
        if (_.isNil(data)) {
            this.createData(id, 0, unlockLv);
        }
        else {
            data.unlockLv = unlockLv;
        }
        this.save();
    }
    static get Instance() {
        if (!this._instance) {
            this._instance = new CollectionData();
        }
        return this._instance;
    }
}
