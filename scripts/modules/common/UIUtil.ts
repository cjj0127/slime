export default class UIUtil {
    public static convertToNodeSpaceAR(node: cc.Node, spacePos: cc.Vec2, targetNode: cc.Node): cc.Vec2 {
        const worldPos = node.convertToWorldSpaceAR(spacePos);
        return targetNode.convertToNodeSpaceAR(worldPos);
    }
    public static exchangeNodeParent(node1: cc.Node, node2: cc.Node): void {
        const parent1 = node1.parent;
        const pos1 = node1.getPosition();
        node1.parent = node2.parent;
        node1.setPosition(node2.getPosition());
        node2.parent = parent1;
        node2.setPosition(pos1);
    }
    static getBoundingBoxToWorld(targetNode: cc.Node) {
        if (targetNode._parent) {
            targetNode._parent._updateWorldMatrix();
            return (node => {
                const { width: t, height: n } = node._contentSize;
                const o = cc.rect(-node._anchorPoint.x * t, -node._anchorPoint.y * n, t, n);
                node._calculWorldMatrix();
                o.transformMat4(o, node._worldMatrix);
                return o;
            })(targetNode);
        }
        return targetNode.getBoundingBox();
    }
    public static getNodeFullPath(node: cc.Node): string {
        const nameArr = [];
        while (node && node !== cc.director.getScene()) {
            nameArr.push(node.name);
            node = node.parent;
        }
        const fullPath = nameArr.reverse().join('/');
        return fullPath;
    }
    public static getNodesCenterPos(nodes: cc.Node[]): cc.Vec2 {
        const centerPos = cc.v2();
        for (let i = 0; i < nodes.length; i++) {
            centerPos.addSelf(nodes[i].getPosition());
        }
        return centerPos.divSelf(nodes.length);
    }
    public static getScrollViewContentItemCenterOffest(scrollView: cc.ScrollView, itemSize: cc.Size, contentNode: cc.Node, index: number): cc.Vec2 {
        if (scrollView.horizontal) {
            let offset = itemSize.width / 2 + index * itemSize.width - scrollView.node.getContentSize().width / 2;
            offset = Math.min(offset, contentNode.getContentSize().width - scrollView.node.getContentSize().width);
            offset = Math.max(0, offset);
            return cc.v2(offset, 0);
        }
        else {
            let offset = itemSize.height / 2 + index * itemSize.height - scrollView.node.getContentSize().height / 2;
            offset = Math.min(offset, contentNode.getContentSize().height - scrollView.node.getContentSize().height);
            offset = Math.max(0, offset);
            return cc.v2(0, offset);
        }
    }
    public static isTouchInNodeRect(node: cc.Node, touchPos: cc.Vec2): boolean {
        return !!UIUtil.getBoundingBoxToWorld(node).contains(touchPos);
    }
    public static isTwoNodesIntersects(node1: cc.Node, node2: cc.Node): boolean {
        const rect1 = UIUtil.getBoundingBoxToWorld(node1);
        const rect2 = UIUtil.getBoundingBoxToWorld(node2);
        return rect1.intersects(rect2);
    }
    public static updateNodeWidget(node: cc.Node): void {
        while (node && node !== cc.director.getScene()) {
            if (node.getComponent(cc.Widget)) {
                node.getComponent(cc.Widget).updateAlignment();
                cc._widgetManager.remove(node.getComponent(cc.Widget));
                break;
            }
            node = node.parent;
        }
    }
}
