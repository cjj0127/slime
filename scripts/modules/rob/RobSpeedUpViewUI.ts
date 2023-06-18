const { ccclass, property } = cc._decorator;
@ccclass
export default class RobSpeedUpViewUI extends cc.Component {
    private bg: cc.Sprite = null;
    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = [];
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Label)
    letftTimeLabel: cc.Label = null;
    @property(cc.Button)
    speedUpBtn: cc.Button = null;
    @property(cc.ProgressBar)
    timeProgress: cc.ProgressBar = null;
    private funcName(): void {
        // Function body goes here
    }
    protected onLoad(): void {
        this.bg = this.getComponent(cc.Sprite);
    }
    constructor() {
        super();
    }
}
