const { ccclass, property } = cc._decorator;
@ccclass
export default class UIBase extends cc.Component {
    offGlobalEvents() {
        cc.director.targetOff(this);
    }
}
