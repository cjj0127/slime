import GuideFinger from "./GuideFinger";
import GuideMask from "./GuideMask";
import { GuideEvent, GuideCommandType } from "./GuideEnums";
import GuideCommadFactroy from "./GuideCommadFactroy";
import GuideTask from "./GuideTask";
import GuideTextDialog from "./GuideTextDialog";
import GuideVerificationFactory from "./GuideVerificationFactory";
import UIUtil from "../common/UIUtil";
import { GlobalEventTarget } from "../common/GlobalEventTarget";
import BaseUI from "../common/BaseUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideUI extends BaseUI {
    private _command: any;
    private _curTask: GuideTask;
    private _verification: any;
    @property(GuideFinger)
    finger: GuideFinger = null;
    @property(GuideMask)
    mask: GuideMask = null;
    onEnd = () => {
        this._curTask = null;
        this.node.active = false;
    };
    onStepSuccess = () => {
        this.resetUI();
        this._curTask = null;
        this.node.active = false;
    };
    onTaskDeActive = () => {
        if (this._curTask)
            this.reportGuideFinish(this._curTask.id);
        this.clearVerification();
        this.resetUI();
        this._curTask = null;
        this.node.active = false;
    };
    @property(GuideTextDialog)
    textDialog: GuideTextDialog = null;
    clearVerification() {
        if (this._verification) {
            this._verification.destroy();
            this._verification = null;
        }
    }
    initCommand() {
        this._command = GuideCommadFactroy.create(this._curTask.command.type, this._curTask.command.args);
    }
    initVerification() {
        this.clearVerification();
        this._verification = GuideVerificationFactory.create(this._curTask.verification.type, this._curTask.verification.args);
    }
    onLoad() {
        super.onLoad();
        UIUtil.updateNodeWidget(this.node);
        this.registerSimpleTouchEvents();
    }
    onTaskActive(e) {
        var t = this;
        this._curTask = e,
            this.resetUI(),
            this.node.active = !0,
            this.node.zIndex = cc.find(this._curTask.parentFullPath).zIndex + 1,
            this._curTask.type !== GuideCommandType.CLICK && this._curTask.type !== GuideCommandType.DRAG ||
                (this.finger.node.active = !0, this.finger.init(this._curTask.command, this._curTask.id)),
            this._curTask.isStrict && (this.mask.node.active = !0, this.mask.init(this._curTask)),
            this._curTask.text && (null != this._curTask.findeNodePosDelayTime ? this.scheduleOnce(function () {
                t.textDialog.init(t._curTask),
                    t.textDialog.node.active = !0;
            }, .5) : (this.textDialog.init(this._curTask), this.textDialog.node.active = !0)),
            this.initCommand(),
            this.initVerification(),
            this._curTask && this.reportGuideStart(this._curTask.id);
    }
    onTouchCancelHandler(e: any) {
        const t = this.node;
        if (this._curTask.isStrict) {
            this._command.onTouchCancelHandler(e);
        }
        else {
            //@ts-ignore
            t._touchListener.setSwallowTouches(false);
        }
    }
    onTouchEndHandler(e: any) {
        const t = this.node;
        if (this._curTask.isStrict) {
            this._command.onTouchEndHandler(e);
        }
        else {
            //@ts-ignore
            t._touchListener.setSwallowTouches(false);
        }
    }
    onTouchMoveHandler(e: any) {
        const t = this.node;
        if (this._curTask.isStrict) {
            this._command.onTouchMoveHandler(e);
        }
        else {
            //@ts-ignore
            t._touchListener.setSwallowTouches(false);
        }
    }
    onTouchStartHandler(e: any) {
        const t = this.node;
        if (this._curTask.isStrict) {
            this._command.onTouchStartHandler(e);
        }
        else {
            //@ts-ignore
            t._touchListener.setSwallowTouches(false);
        }
    }
    registerEvent() {
        GlobalEventTarget.on(GuideEvent.TASK_ACTIVE, this.onTaskActive, this);
        GlobalEventTarget.on(GuideEvent.TASK_DEACTIVE, this.onTaskDeActive, this);
        GlobalEventTarget.on(GuideEvent.STEP_SUCCESS, this.onStepSuccess, this);
        GlobalEventTarget.on(GuideEvent.END, this.onEnd, this);
    }
    reportGuideFinish(e: any) {
        const t = {
            Guide_ID: e
        };
    }
    // onTaskActive = (e: GuideTask) => {
    //     this._curTask = e;
    //     this.resetUI();
    //     this.node.active = true;
    //     this.node.zIndex = cc.find(this._curTask.parentFullPath).zIndex + 1;
    //     if (this._curTask.type !== GuideCommandType.CLICK &&
    //         this._curTask.type !== GuideCommandType.DRAG) {
    //         this.finger.node.active = true;
    //         this.finger.init(this._curTask.command, this._curTask.id);
    //     }
    //     if (this._curTask.isStrict) {
    //         this.mask.node.active = true;
    //         this.mask.init(this._curTask);
    //     }
    //     if (this._curTask.text) {
    //         if (this._curTask.findeNodePosDelayTime !== null) {
    //             this.scheduleOnce(() => {
    //                 this.textDialog.init(this._curTask);
    //                 this.textDialog.node.active = true;
    //             }, .5);
    //         } else {
    //             this.textDialog.init(this._curTask);
    //             this.textDialog.node.active = true;
    //         }
    //     }
    //     this.initCommand();
    //     this.initVerification();
    //     if (this._curTask) this.reportGuideStart(this._curTask.id);
    // };
    reportGuideStart(e: any) {
        const t = {
            Guide_ID: e
        };
    }
    resetUI() {
        this.finger.node.active = false;
        this.mask.node.active = false;
        this.textDialog.node.active = false;
    }
}
