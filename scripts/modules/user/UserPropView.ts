import GuideTouch from "../guide/GuideTouch";
import TaskWeakGuide from "../task/TaskWeakGuide";
import UserProp from "./UserProp";
import UserPropItem from "./UserPropItem";
import { GlobalEventName } from "../common/Events";
import { ENUM_PROP_TYPE } from "../common/Const";
// import { Events, Const } from './IdleViewUI';
const { ccclass, property } = cc._decorator;
@ccclass
export default class UserPropView extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemTemplate: cc.Prefab = null;
    private propDatas: {
        propType: number;
        order: number;
    }[] = [];
    getOrderIndex(propType: number) {
        let data = UserProp.Instance.getData(propType);
        return UserProp.Instance.isMaxLevel(propType, data?.level ?? 0) ? propType + 10000 : propType;
    }
    onEnable() {
        this.refreshList();
        cc.director.on(GlobalEventName.PropValueChange, this.onPropValueChange, this);
        cc.director.on(GlobalEventName.GuideScrollToFirst, this.onGuideScrollToFirst, this);
    }
    onGuideScrollToFirst() {
        this.content.y = 0;
    }
    onPropValueChange(e: number) {
        let t = UserProp.Instance.getData(e);
        if (t && UserProp.Instance.isMaxLevel(e, t.level)) {
            this.refreshList();
        }
    }
    refreshList() {
        this.content.removeAllChildren();
        this.propDatas = [];
        for (let propType = ENUM_PROP_TYPE.ATK; propType < ENUM_PROP_TYPE.TripleShot + 1; propType++) {
            let order = this.getOrderIndex(propType);
            this.propDatas.push({ propType, order });
        }
        this.propDatas.sort((a, b) => a.order - b.order);
        this.propDatas.forEach(data => {
            let node = cc.instantiate(this.itemTemplate);
            node.active = true;
            node.parent = this.content;
            node.getComponent(UserPropItem).init(data.propType);
            let button = node.getChildByName("Button");
            if (!button.getComponent(TaskWeakGuide)) {
                button.addComponent(TaskWeakGuide).setTaskType(data.propType + 10);
            }
            if (data.propType == 1) {
                button.addComponent(GuideTouch).setId(1);
            }
        });
    }
    protected update(dt: number): void {
        this.node.active = true;
    }
}
