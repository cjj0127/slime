import { GuideVerifactionType } from "./GuideEnums";
import ClickInRegion from "./ClickInRegion";
import DragInRegion from "./DragInRegion";
import NetRequestSucc from "../common/NetRequestSucc";
import PopViewOpen from "../common/PopViewOpen";
export default class GuideVerificationFactory {
    public static create(verificationType: GuideVerifactionType, args: any[]) {
        if (verificationType == GuideVerifactionType.CLICK_IN_REGIN) {
            return new ClickInRegion(args[0]);
        }
        else if (verificationType == GuideVerifactionType.DRAG_IN_REGIN) {
            return new DragInRegion(args);
        }
        else if (verificationType == GuideVerifactionType.POP_VIEW_OPEN) {
            return new PopViewOpen(args[0]);
        }
        else if (verificationType == GuideVerifactionType.NET_REQUEST_SUCCESS) {
            return new NetRequestSucc(args[0]);
        }
        else {
            return undefined;
        }
    }
}
