export default class IGuide {
    command; // = JSON.parse(this.replace(n.command));
    conditions; // = [];
    findNodePosDelayTime; // = n.findNodePosDelayTime;
    id; // = n.id;
    isStrict; // = (1 == n.isStrict);
    lockId; // = n.lockId;
    parentFullPath; // = n.parentFullPath;
    postCondition; // = JSON.parse(this.replace(n.postCondition));
    precondition; // = JSON.parse(this.replace(n.precondition));
    recoverStep; // = n.recoverStep;
    stage; // = n.stage;
    step; // = n.step;
    text; // = n.text;
    type; // = n.type;
    verification; // = JSON.parse(this.replace(n.verification));
}
