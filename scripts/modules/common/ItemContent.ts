import { MapUIPrefabs, IMAGE_ICON_PATH_ } from "./Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import AssetPool from "../asset/AssetPool";
export class ItemInfo {
    count: number;
    id: number;
    isGray = false;
    constructor(id: number, count: number) {
        this.isGray = false;
        this.id = id;
        this.count = count;
    }
}
export class ItemContentInfo {
    ItemInfos: ItemInfo[] = [];
}
export default class ItemContent {
    public count: number;
    public id: number;
    public isGray: boolean = false;
    public static Init(info: ItemContentInfo, content: cc.Node): void {
        const node: cc.Node = AssetPool.Instance.createObject(MapUIPrefabs.ItemContent.path);
        const item: cc.Node = node.getChildByName('Item');
        if (content !== null) {
            node.parent = content;
            const list: ItemInfo[] = info.ItemInfos;
            for (let i = 0; i < list.length; i++) {
                const p: ItemInfo = list[i];
                let f: cc.Node = null;
                if (i == 0) {
                    f = item;
                }
                else {
                    f = cc.instantiate(item);
                    node.addChild(f);
                }
                const d = _AssetConfig.Instance.get(p.id);
                const h: string = IMAGE_ICON_PATH_ + '/' + d.icon;
                f.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, h);
                f.getChildByName('num').getComponent(cc.Label).string = 'x' + p.count.toString();
                if (p.isGray) {
                    f.getChildByName('icon').color = cc.Color.GRAY;
                }
                const g: cc.Sprite = f.getChildByName('bg').getComponent(cc.Sprite);
                if (_AssetConfig.Instance.getAssetQuality(p.id) == -1) {
                    g.node.active = false;
                }
                else {
                    g.spriteFrame = _AssetConfig.Instance.getQualitySpriteFrame(p.id);
                }
            }
        }
        else {
            cc.error('parent is null');
        }
    }
    constructor(id: number, count: number) {
        this.id = id;
        this.count = count;
    }
}
