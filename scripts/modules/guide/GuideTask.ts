import GuideConditionFactroy from "./GuideConditionFactroy";
// n.default = r
export default class GuideTask {
    private _command: {
        type: any;
        args: any;
    };
    private _conditions: any[];
    private _extraConditions: any[];
    private _findeNodePosDelayTime: number;
    private _id: number;
    private _isStrict: boolean;
    private _parentFullPath: string;
    private _recoverStep: boolean;
    private _stage: any;
    private _step: any;
    private _text: string;
    private _type: number;
    private _verification: {
        type: any;
        args: any;
    };
    public isTrigger(): boolean {
        if (this._conditions.length < 1 && this._extraConditions.length < 1)
            return true;
        const conditions = [];
        for (let t = 0; t < this._conditions.length; t++) {
            const n = this._conditions[t];
            const r: any = GuideConditionFactroy.create(n.type, n.args);
            conditions.push(r);
        }
        for (let t = 0; t < this._extraConditions.length; t++) {
            const n = this._extraConditions[t];
            const r: any = GuideConditionFactroy.create(n.type, n.args);
            conditions.push(r);
        }
        for (let t = 0; t < conditions.length; t++) {
            if (!conditions[t].isSuccess())
                return false;
        }
        return true;
    }
    public setCommand(type: any, args: any): void {
        this._command = { type, args };
    }
    public setExtraConditions(e: any[]): void {
        this._extraConditions = e;
    }
    public setVerification(type: any, args: any): void {
        this._verification = { type, args };
    }
    constructor(e) {
        this._verification = { type: null, args: null };
        this._command = { type: null, args: null };
        this._extraConditions = [];
        this._conditions = [];
        this._id = e.id;
        this._type = e.type;
        this._stage = e.stage;
        this._step = e.step;
        this._isStrict = e.isStrict;
        this._findeNodePosDelayTime = e.findNodePosDelayTime;
        this._recoverStep = e.recoverStep;
        this._text = e.text;
        this._parentFullPath = e.parentFullPath;
        this._command = e.command;
        this._verification = e.verification;
        this._conditions = e.conditions;
        this._extraConditions = [];
    }
    get command() {
        return this._command;
    }
    get conditions() {
        return this._conditions;
    }
    get findeNodePosDelayTime() {
        return this._findeNodePosDelayTime;
    }
    // private _command: any;
    // private _verification: any;
    // private _conditions: any;
    // private _extraConditions: any[];
    get id() {
        return this._id;
    }
    get isStrict() {
        return this._isStrict;
    }
    get parentFullPath() {
        return this._parentFullPath;
    }
    get recoverStep() {
        return this._recoverStep;
    }
    get stage() {
        return this._stage;
    }
    get step() {
        return this._step;
    }
    get text() {
        return this._text;
    }
    get type() {
        return this._type;
    }
    get verification() {
        return this._verification;
    }
}
