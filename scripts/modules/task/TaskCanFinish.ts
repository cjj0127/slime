import GuideCondition from "../guide/GuideCondition";
import QuestChain from "../quest/QuestChain";
import { E_QUEST_STATUS } from "../common/Const";
export default class TaskCanFinish extends GuideCondition {
    private _questChains: Array<string>;
    public isSuccess(): boolean {
        const e = Number(this._questChains[0]), t = QuestChain.Instance.getData(e);
        return null != t && t.status == E_QUEST_STATUS.Complete;
    }
    constructor(questChains: Array<string>) {
        super();
        this._questChains = questChains;
    }
}
