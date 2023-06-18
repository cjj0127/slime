import { GuideEnums } from "./GuideEnums";
import IsExistActiveProductId from "../common/IsExistActiveProductId";
import IsExistBlankCoordinate from "../common/IsExistBlankCoordinate";
import IsExistOneActiveProduct from "../common/IsExistOneActiveProduct";
import IsFirstDead from "../common/IsFirstDead";
import IsPlayerCanLevelUp from "../common/IsPlayerCanLevelUp";
import NodeVisibleGuide from "../common/NodeVisibleGuide";
import TaskCanFinish from "../task/TaskCanFinish";
import UnlockCustoms from "../unlock/UnlockCustoms";
import UnlockSystem from "../unlock/UnlockSystem";
import isExsitOneActiveCreator from "../common/isExsitOneActiveCreator";
export default class GuideConditionFactroy {
    static create(type: GuideEnums, params?: any): any {
        switch (type) {
            case GuideEnums.NODE_VISIBLE:
                return new NodeVisibleGuide(params);
            case GuideEnums.Task_CAN_FINISH:
                return new TaskCanFinish(params);
            case GuideEnums.FIRST_DEAD:
                return new IsFirstDead();
            case GuideEnums.UNLOCK_SYSTEM:
                return new UnlockSystem(parseInt(params[0]));
            case GuideEnums.UNLOCK_CUSTOMS:
                return new UnlockCustoms();
            case GuideEnums.IS_EXIST_ONE_ACTIVE_PRODUCT:
                return new IsExistOneActiveProduct();
            case GuideEnums.IS_EXIST_ACTIVE_PRODUCT:
                return new IsExistActiveProductId(parseInt(params[0]));
            case GuideEnums.IS_EXIST_BLANK_COORDINATE:
                return new IsExistBlankCoordinate();
            case GuideEnums.IS_EXIST_ONE_ACTIVE_CREATOR_COORDINATE:
                return new isExsitOneActiveCreator();
            case GuideEnums.IS_PLAYER_CAN_LEVEL_UP:
                return new IsPlayerCanLevelUp();
            default:
                return undefined;
        }
    }
}
