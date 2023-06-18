const { ccclass, property } = cc._decorator;
@ccclass
export default class RobBuildItemUI extends cc.Component {
    private addBtn: cc.Button;
    private addNode: cc.Node;
    private buildBtn: cc.Button;
    private buildIcon: cc.Sprite;
    private buildingId: number;
    private circleNode: cc.Node;
    private circleSprite: cc.Sprite;
    private completeNode: cc.Node;
    private curHeroId: number;
    private emptyNode: cc.Node;
    private lockNode: cc.Node;
    private lvBgFrame: cc.SpriteFrame[];
    private lvBgSprite: cc.Sprite;
    private lvLabel: cc.Label;
    private lvNode: cc.Node;
    private maxLvLabelNode: cc.Node;
    private selectedNode: cc.Node;
    private startTime: number;
    private unlockTipLabel: cc.Label;
    ;
}
