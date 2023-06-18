import StateBase from "./StateBase";
const { ccclass, property } = cc._decorator;
export default class StateCustom extends StateBase {
    private __enterFunc: Function | undefined;
    private __exitFunc: Function | undefined;
    private __target: any;
    private __updateFunc: Function | undefined;
    onEnter(e: any) {
        this.clearIntervals();
        this.__enterFunc && this.__enterFunc.call(this.__target, e);
    }
    onExit() {
        this.__exitFunc && this.__exitFunc.call(this.__target);
    }
    onUpdate(e: any) {
        this.invokeIntervals(e);
        this.__updateFunc && this.__updateFunc.call(this.__target, e);
    }
    constructor(target: any, name: any, options?: {
        enter?: Function;
        update?: Function;
        exit?: Function;
    }) {
        super(name);
        this.__target = target;
        this.__enterFunc = options?.enter;
        this.__updateFunc = options?.update;
        this.__exitFunc = options?.exit;
    }
}
