import QuestPass from "../quest/QuestPass";
import UIPassQuestItem from "./UIPassQuestItem";
import { PAGE_EVENTS } from "../common/ToggleToPage";
import { GlobalEventName } from "../common/Events";
import { E_QUEST_STATUS } from "../common/Const";
// import UIPassQuestItem from "UIPassQuestItem";
const { ccclass, property } = cc._decorator;
const h: any = window["_"];
@ccclass
export default class UIPassQuestView extends cc.Component {
    @property(cc.Layout)
    contentLayout: cc.Layout = null;
    private created: boolean = false;
    private questItems: UIPassQuestItem[] = [];
    @property(cc.Prefab)
    questPrefab: cc.Prefab = null;
    // private created: boolean = false;
    // private questItems: Array<UIPassQuestItem> = [];
    // @d(cc.Prefab)
    // private questPrefab: cc.Prefab = null;
    // @d(cc.Layout)
    // private contentLayout: cc.Layout = null;
    public createItems(): void {
        if (!this.created) {
            for (let e: number = 0; e < 5; e++) {
                const t: cc.Node = cc.instantiate(this.questPrefab);
                t.parent = this.contentLayout.node;
                const n: UIPassQuestItem = t.getComponent(UIPassQuestItem);
                this.questItems.push(n);
            }
            this.contentLayout.enabled = true;
            this.contentLayout.updateLayout();
            this.created = true;
        }
    }
    public onActivePremium(): void {
        this.refreshList();
    }
    public onLoad(): void {
        this.node.on(PAGE_EVENTS.PageEnter, this.onPageEnter, this);
        this.node.on(PAGE_EVENTS.PageExit, this.onPageExit, this);
    }
    public onPageEnter(): void {
        this.createItems();
        this.refreshList();
        cc.director.on(GlobalEventName.PassQuestComplete, this.onQuestComplete, this);
        cc.director.on(GlobalEventName.PassActivePremium, this.onActivePremium, this);
        cc.director.on(GlobalEventName.PassQuestReceived, this.onQuestReceived, this);
        cc.director.on(GlobalEventName.PassQuestReset, this.onQuestReset, this);
    }
    public onPageExit(): void {
        cc.director.targetOff(this);
    }
    public onQuestComplete(): void {
        this.refreshList();
    }
    public onQuestReceived(): void {
        this.refreshList();
    }
    public onQuestReset(): void {
        this.refreshList();
    }
    public refreshList(): void {
        const t: any[] = QuestPass.Instance.getAllQuest();
        const n: any[] = h.sortBy(t, function (e: any) {
            const t: number = e.id;
            const n: any = QuestPass.Instance.getData(t);
            return n.status == E_QUEST_STATUS.Finish ? t + n.status : 10000 * -n.status + t;
        });
        h.each(n, (t: any, n: number) => {
            this.questItems[n].refresh(t);
        });
    }
}
