import HeroLevelPropIconUI from "./HeroLevelPropIconUI";
import UIPool from "../common/UIPool";
// import HeroLevelPropIconUI from "HeroLevelPropIconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroLevelPropsUI extends UIPool {
    @property(cc.Layout)
    levelPorpContent: cc.Layout = null;
    private propIconList: HeroLevelPropIconUI[] = [];
    onDestroy() {
        this.propIconList.length = 0;
    }
    public setProps(level: number, props: string[], values: number[], unlocks: number[]) {
        this.clear();
        props.forEach((prop, index) => {
            let icon = this.propIconList[index];
            const value = values[index];
            const unlock = unlocks[index];
            if (!icon) {
                let node = this.get();
                node.parent = this.levelPorpContent.node;
                icon = this.propIconList[unlock] = node.getComponent(HeroLevelPropIconUI);
            }
            icon.setProp(prop, value, unlock);
            icon.setStatus(level >= unlock);
        });
    }
    public unlockProp(index: number) {
        const icon = this.propIconList[index];
        if (icon) {
            icon.setStatus(true);
        }
    }
}
