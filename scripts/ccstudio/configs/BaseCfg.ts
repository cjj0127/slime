import { NAMES_BUNDLE } from "../../modules/asset/AssetRes";
import AssetManager from "../../modules/asset/AssetManager";
export default class BaseCfg<T, K> {
    private _values: T[] = null;
    protected cfg: any = null;
    protected map: Map<K, T> = new Map<K, T>();
    get(id: K): T {
        return this.map.get(id);
    }
    load(name: string) {
        return new Promise((resolve, reject) => {
            AssetManager.Instance.load(NAMES_BUNDLE.Game, "configs/" + name, cc.JsonAsset, null, (res) => {
                this.cfg = res.assets.json;
                this.setData(this.cfg);
                console.log(name + '------------------------------loaded-------------');
                resolve(null);
                this.onLoad();
            });
        });
    }
    onLoad() {
    }
    setData(value) {
    }
    get values(): T[] {
        return this._values ?? (this._values = Array.from(this.map.values()));
    }
}
