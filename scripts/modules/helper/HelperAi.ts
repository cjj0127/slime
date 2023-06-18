import AiBase from "../battle/AiBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HelperAi extends AiBase {
    delayTime = 0;
    fireCount = 0;
}
