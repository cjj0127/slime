import { GuideCommandType } from "./GuideEnums";
import ClickCommand from "./ClickCommand";
import DragCommand from "./DragCommand";
export default class GuideCommadFactroy {
    static create(type: GuideCommandType, data: any) {
        if (type == GuideCommandType.CLICK) {
            return new ClickCommand(data[0]);
        }
        else if (type == GuideCommandType.DRAG) {
            return new DragCommand(data);
        }
        else {
            return null;
        }
    }
}
