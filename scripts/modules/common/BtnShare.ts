import { SdkBridge } from "../../ccstudio/utils/SdkBridge";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BtnShare extends cc.Component {
    @property(cc.Sprite)
    btnBg: cc.Sprite = null;
    @property({
        type: Object,
        tooltip: '按钮类型和位置等属性',
        visible() {
            return false;
        }
    })
    btnProperty = {
        boss: {
            pos: new cc.Vec3(0, -180, 0),
            size: new cc.Size(178, 76),
            iconSize: new cc.Size(53, 55),
            type: 1
        },
        hero: {
            pos: new cc.Vec3(-275, 139, 0),
            size: new cc.Size(80, 80),
            iconSize: new cc.Size(42.4, 44),
            type: 0
        },
        reward: {
            pos: new cc.Vec3(270, -468, 0),
            size: new cc.Size(120, 76),
            iconSize: new cc.Size(53, 55),
            type: 1
        },
        bossKing: {
            pos: new cc.Vec3(230, -525, 0),
            size: new cc.Size(178, 76),
            iconSize: new cc.Size(53, 55),
            type: 1
        },
        bossRush: {
            pos: new cc.Vec3(230, -525, 0),
            size: new cc.Size(178, 76),
            iconSize: new cc.Size(53, 55),
            type: 1
        }
    };
    @property(cc.SpriteFrame)
    circleSprite: cc.SpriteFrame = null;
    failCall = null;
    placeName = null;
    @property(cc.Button)
    shareBtn: cc.Button = null;
    @property(cc.Sprite)
    shareIcon: cc.Sprite = null;
    @property(cc.SpriteFrame)
    squareSprite: cc.SpriteFrame = null;
    succCall = null;
    onLoad() {
        this.shareBtn.node.on("click", this.onShareBtn, this);
    }
    onShareBtn() {
        SdkBridge.share({
            palceName: this.placeName,
            successCallback: () => {
                this.reportShare();
                if (this.succCall) {
                    this.succCall();
                }
            },
            failCallback: () => {
                if (this.failCall) {
                    this.failCall();
                }
            }
        });
    }
    reportShare() {
        const e = {
            Share_Type: this.placeName
        };
    }
    showShare(e: string, t: {
        palceName: string;
        successCallback: Function;
        failCallback: Function;
    }) {
        if (1 == this.btnProperty[e].type) {
            this.btnBg.spriteFrame = this.squareSprite;
        }
        else {
            this.btnBg.spriteFrame = this.circleSprite;
        }
        this.node.setPosition(this.btnProperty[e].pos);
        this.btnBg.node.setContentSize(this.btnProperty[e].size);
        this.shareIcon.node.setContentSize(this.btnProperty[e].iconSize);
        this.placeName = t.palceName;
        this.succCall = t.successCallback;
        this.failCall = t.failCallback;
    }
}
