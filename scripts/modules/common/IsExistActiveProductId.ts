import GuideCondition from "../guide/GuideCondition";
export default class IsExistActiveProductId extends GuideCondition {
    _productId;
    isSuccess() {
        return true;
    }
    constructor(productId) {
        super();
        this._productId = productId;
    }
}
