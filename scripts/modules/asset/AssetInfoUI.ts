import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs } from "../common/Const";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import LanMgr from "../common/Language";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import IconUI from "../common/IconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class AssetInfoUI extends cc.Component {
    assetId: any = null;
    @property(cc.Label)
    descLabeL: cc.Label = null;
    @property(IconUI)
    iconSprite: IconUI = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;

    public static async addPopItem(id: number, parent: cc.Node, o: boolean = true): Promise<void> {
        const size = cc.view.getVisibleSize();
        const view = await Model.ui.openViewAsync(MapUIPrefabs.AssetInfo);
        const pos = parent.convertToWorldSpaceAR(cc.Vec3.ZERO);
        if (o) {
            let l = pos.y + .5 * parent.height;
            if (l + view.height >= size.height) {
                l = pos.y - (.5 * parent.height + view.height);
            }
            pos.y = l;
        }
        else {
            let l = pos.y - (.5 * parent.height + view.height);
            if (l < 0) {
                l = pos.y + .5 * parent.height;
            }
            pos.y = l;
        }
        if (pos.x + .5 * view.width >= size.width) {
            pos.x = size.width - .5 * view.width;
        }
        else if (pos.x - .5 * view.width < 0) {
            pos.x = .5 * view.width;
        }
        const u = view.parent.convertToNodeSpaceAR(pos);
        view.position = u;
        view.getComponent(AssetInfoUI).setAsset(id);
    }

    onDisable(): void {
        cc.director.targetOff(this);
    }

    onEnable(): void {
        cc.director.on(GlobalEventName.TouchScreen, this.onTouchScreen, this);
    }

    public onTouchScreen(): void {
        this.node.emit("remove", this);
    }

    public setAsset(assetId: number): void {
        this.assetId = assetId;
        const t = _AssetConfig.Instance.get(assetId);
        const n = t.name;
        const o = t.desc;
        const r = t.icon;
        this.setNameStr(n);
        this.setDescStr(o);
        this.iconSprite.icon = r;
    }

    public setDescStr(e: string): void {
        this.descLabeL.string = LanMgr.Instance.getLangByID(e);
    }

    public setNameStr(e: string): void {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
}
