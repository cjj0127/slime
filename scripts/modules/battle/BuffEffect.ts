import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "./BattleWorld";
// import BattleWorld from "BattleWorld";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BuffEffect extends cc.Component {
    protected _logicQueue: AsyncQueueTool = new AsyncQueueTool();
    private completeCallback: Function;
    public clear(): void {
        this._logicQueue.clear();
        this._logicQueue.complete = null;
        this.onClear();
    }
    public close(): void {
        this.onClose();
    }
    private complete(): void {
        if (this.completeCallback) {
            this.completeCallback();
        }
    }
    public getOwner(): any {
        return BattleWorld.Instance.hero;
    }
    public init(): void {
        this.onInit();
    }
    protected onClear(): void {
        // implementation
    }
    protected onClose(): void {
        // implementation
    }
    protected onInit(): void {
        // implementation
    }
    protected onPlay(): void {
        // implementation
    }
    public play(e: Function): void {
        this.completeCallback = e;
        this._logicQueue.clear();
        this._logicQueue.push(this.onPlay.bind(this));
        this._logicQueue.complete = this.complete.bind(this);
        this._logicQueue.play();
    }
}
