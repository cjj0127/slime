import MoveBase from "./MoveBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TrackMove extends MoveBase {
    @property
    delegate: any = null;
}
