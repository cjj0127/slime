import LangData from "./LangData";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("language/LanguageSprite")
export default class LanguageSprite extends cc.Component {
    @property({
        serializable: true
    })
    private _dataID: string = "";
    @property({
        tooltip: "是否设置为图片原始资源大小"
    })
    public isRawSize: boolean = true;
    language(): void {
        this.updateSprite();
    }
    start(): void {
        this.updateSprite();
    }
    private updateSprite(): void {
        const url = `language/texture/${LangData.current}/${this.dataID}/spriteFrame`;
        const spriteFrame = cc.resources.get(url, cc.SpriteFrame);
        if (spriteFrame) {
            const sprite = this.getComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            if (this.isRawSize) {
                // const originalSize = spriteFrame._originalSize;
                // sprite.node.setContentSize(originalSize);
            }
        }
        else {
            console.error(`[LanguageSprite] 资源不存在 ${url}`);
        }
    }
    get dataID(): string {
        return this._dataID || "";
    }
    set dataID(value: string) {
        this._dataID = value;
        this.updateSprite();
    }
}
