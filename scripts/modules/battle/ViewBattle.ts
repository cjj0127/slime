import BattleWorld from "./BattleWorld";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
const { ccclass, property } = cc._decorator;
const _ = window["_"];
@ccclass
export default class ViewBattle extends cc.Component {
    @property([cc.Node])
    normalNodes: cc.Node[] = [];
    onChangeGameMode() {
        _.each(this.normalNodes, (node: cc.Node) => {
            if (node && node.getChildByName("btnRecord") && node.getChildByName("btnRecord").active) {
                node.active = true;
                node.children.forEach((child) => {
                    if (child.name == "btnRecord") {
                        child.active = true;
                    }
                    else {
                        child.active = BattleWorld.Instance.currGameModeType == E_GAME_LEVEL_TYPE.Normal;
                    }
                });
            }
            else {
                node.active = BattleWorld.Instance.currGameModeType == E_GAME_LEVEL_TYPE.Normal;
            }
        });
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.ChangeGameMode, this.onChangeGameMode, this);
    }
}
