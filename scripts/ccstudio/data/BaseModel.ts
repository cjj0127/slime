const { ccclass, property } = cc._decorator;
@ccclass
export default class BaseModel {

    initLoadData() {
    }

    load() {
    }

    async loadData() {
        await this.load();
    }

    onDestroy() {
        cc.director.targetOff(this);
    }
}
