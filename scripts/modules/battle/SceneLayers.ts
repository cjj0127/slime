import CameraCtrl from "./CameraCtrl";
import SceneLayerCtrl from "./SceneLayerCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SceneLayers extends cc.Component {
    @property(CameraCtrl)
    camera: CameraCtrl = null;
    @property
    cameraPosition: cc.Vec3 = cc.Vec3.ZERO;
    layers: SceneLayers[] = [];
    clear() {
        this.camera?.node?.targetOff(this);
        this.camera = null;
    }
    onLoad() {
        const layerCtrls = this.getComponentsInChildren(SceneLayerCtrl);
        const layers = [];
        layerCtrls.forEach((ctr, index) => {
            ctr.setSortIdx(0);
            ctr.node.zIndex = index;
            layers.push(ctr);
            const node = cc.instantiate(ctr.node);
            node.parent = ctr.node.parent;
            node.zIndex = index;
            node.x = ctr.node.x + ctr.node.width;
            const newLayerCtrl = node.getComponent(SceneLayerCtrl);
            newLayerCtrl.setSortIdx(1);
            layers.push(newLayerCtrl);
        });
        this.layers = layers;
    }
    onMove(e) {
        const newPosition = this.camera.node.position;
        const deltaX = newPosition.x - this.cameraPosition.x;
        this.cameraPosition = newPosition;
        this.layers.forEach((SceneLayerCtrl) => {
            SceneLayerCtrl.onMove(deltaX);
        });
    }
    reset() {
        this.layers.forEach((SceneLayerCtrl) => {
            SceneLayerCtrl.reset();
        });
    }
    setCamera(camera) {
        camera.node.on(cc.Node.EventType.POSITION_CHANGED, this.onMove, this);
        this.cameraPosition = camera.node.position;
        this.camera = camera;
        this.layers.forEach((SceneLayerCtrl) => {
            SceneLayerCtrl.setCamera(camera.node);
        });
    }
}
