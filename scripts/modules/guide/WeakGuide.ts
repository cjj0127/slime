import { MapUIPrefabs } from "../common/Const";
import AssetPool from "../asset/AssetPool";
const { ccclass, property } = cc._decorator;
export enum WeakGuideType {
    ChildActive,
    Task,
    TaskComplete,
    Boss,
    LegionEnter,
    LegionReward,
    LegionSelect
}
@ccclass
export default class WeakGuide extends cc.Component {
    guideNode: cc.Node = null;
    private isShow: boolean = false;
    public GetIsShow(): boolean {
        return this.isShow;
    }
    protected doAction() { }
    public hide() {
        if (this.guideNode) {
            this.guideNode.destroy();
            this.guideNode = null;
        }
        this.isShow = false;
    }
    public hideFinger() {
        if (this.guideNode) {
            this.guideNode.getChildByName("finger").active = false;
        }
    }
    public setFinger(pos: cc.Vec3, angle: number) {
        if (this.guideNode) {
            this.guideNode.getChildByName("finger").angle = angle;
            this.guideNode.getChildByName("finger").position = pos;
        }
    }
    public show() {
        if (null == this.guideNode) {
            const prefab: cc.Prefab = AssetPool.Instance.getPrefab(MapUIPrefabs.FingerGuide.path);
            this.guideNode = cc.instantiate(prefab);
            this.guideNode.parent = this.node;
            this.guideNode.position = cc.Vec3.ZERO;
            this.doAction();
        }
        this.guideNode.active = true;
        this.isShow = true;
    }
    public showTxt(str: string) {
        if (this.guideNode) {
            this.guideNode.getChildByName("textDilalog").active = true;
            this.guideNode.getChildByName("textDilalog").getComponentInChildren(cc.Label).string = str;
        }
    }
    public showTxt2(str: string, pos: cc.Vec3 = null) {
        if (this.guideNode) {
            this.guideNode.getChildByName("textDilalog2").active = true;
            this.guideNode.getChildByName("textDilalog2").getComponentInChildren(cc.Label).string = str;
            if (pos) {
                this.guideNode.getChildByName("textDilalog2").position = pos;
            }
        }
    }
}
