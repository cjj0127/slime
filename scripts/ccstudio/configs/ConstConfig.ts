import { ConstConfigAuto } from "./ConfigAuto";
import { GameConst } from "../../modules/common/Const";
export default class ConstConfig extends ConstConfigAuto {
    onLoad(): void {
        for (const data of this.values) {
            if (data.valueType == 'I')
                GameConst[data.key] = data.value[0];
            else if (data.valueType == 'IV')
                GameConst[data.key] = data.value;
        }
    }
}
