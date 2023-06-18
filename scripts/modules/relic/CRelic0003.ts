import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import _EnemyConfig from "../../ccstudio/config/_EnemyConfig";
import RelicBase from "./RelicBase";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import RelicModel from "../../ccstudio/data/RelicModel";
import Model from "../../ccstudio/data/Model";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
const { ccclass } = cc._decorator;
const _ = window['_'];
@ccclass
export default class CRelic0003 extends RelicBase {
    private static _: any = globalThis._;
    private applySpeed(): void {
        const enemys = BattleWorld.Instance.enemys;
        _.each(enemys, function (enemy: any) {
            let speed = _EnemyConfig.Instance.get(enemy.cfgId).speed;
            speed = Model.relic.applyEnemySpeed(speed);
            enemy.moveEngine.speed = speed;
        });
    }
    private isTakeEffect(): boolean {
        const effectParams = _RelicConfig.Instance.get(this.relicId).effectParams;
        const tag = effectParams[0];
        const cnt = effectParams[1];
        return Model.partner.getEquipTagCnt(tag) >= cnt;
    }
    public onActive(): void {
        if (this.isActive) {
            if (this.isTakeEffect()) {
                const RelicData_ = RelicData_.Instance.getData(this.relicId);
                Model.relic.enemySpeedAddation = 1 - _.toNumber(RelicData_.effectValue) / 100;
            }
            else {
                Model.relic.enemySpeedAddation = 1;
            }
            cc.director.on(GlobalEventName.PartnerEquipedChange, this.onChangePartner, this);
        }
        else {
            cc.director.targetOff(this);
            Model.relic.enemySpeedAddation = 1;
        }
        this.applySpeed();
    }
    private onChangePartner(): void {
        if (this.isTakeEffect()) {
            const RelicData_ = RelicData_.Instance.getData(this.relicId);
            Model.relic.enemySpeedAddation = 1 - _.toNumber(RelicData_.effectValue) / 100;
        }
        else {
            Model.relic.enemySpeedAddation = 1;
        }
        this.applySpeed();
    }
    public recalc(): void {
        if (this.isActive) {
            if (this.isTakeEffect()) {
                const RelicData_ = RelicData_.Instance.getData(this.relicId);
                Model.relic.enemySpeedAddation = 1 - _.toNumber(RelicData_.effectValue) / 100;
            }
            this.applySpeed();
        }
    }
}
