import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import HeroData from "./HeroData";
import LanMgr from "../common/Language";
import GradeLabelUI from "../battle/GradeLabelUI";
import IconUI from "../common/IconUI";
// n.default = y
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroListItemUI extends cc.Component {
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Node)
    equipedNode: cc.Node = null;
    @property(GradeLabelUI)
    gradeSprite: GradeLabelUI = null;
    heroId: number = 0;
    @property(IconUI)
    iconSprite: IconUI = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    pos: number = -1;
    public getHeroId(): number {
        return this.heroId;
    }
    public onLoad(): void { }
    public refresh(): void {
        const e = _HeroConfig.Instance.get(this.heroId);
        this.setNameStr(e.name);
        this.setGrade(e.grade);
        this.setIcon(e.icon);
    }
    public refreshStatus(): void {
        const e = HeroData.Instance.getData(this.heroId);
        this.setLevel((e?.level || -1));
    }
    public setEquiped(e: boolean): void {
        this.equipedNode.active = e;
    }
    private async setGrade(e: number): Promise<void> {
        this.gradeSprite.setGrade(e);
    }
    public setHero(e: number): void {
        if (this.heroId !== e) {
            this.heroId = e;
            this.refresh();
        }
        this.refreshStatus();
    }
    private async setIcon(e: any): Promise<void> {
        this.iconSprite.icon = e;
    }
    private setLevel(e: number): void {
        if (e > 0) {
            this.levelLabel.string = `${LanMgr.Instance.getLangByID("LV")} ${e}`;
            this.iconSprite.iconSprite.setState(cc.Sprite.State.NORMAL);
            this.bg.setState(cc.Sprite.State.NORMAL);
        }
        else {
            this.levelLabel.string = LanMgr.Instance.getLangByID("item_unowned");
            this.iconSprite.iconSprite.setState(cc.Sprite.State.GRAY);
            this.bg.setState(cc.Sprite.State.GRAY);
        }
    }
    private setNameStr(e: number): void {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
    public setPos(e: number): void {
        this.pos = e;
    }
}
