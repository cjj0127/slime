const { ccclass, property } = cc._decorator;
@ccclass
export default class ListViewAdapter extends cc.Component {
    dataSet: any[] = [];
    _getView(view, index) {
        this.updateView(view, index, this.dataSet[index]);
        return view;
    }
    getCount() {
        return this.dataSet ? this.dataSet.length : 0;
    }
    getItem(index) {
        return this.dataSet[index];
    }
    setDataSet(dataSets) {
        this.dataSet = dataSets || [];
    }
    updateView(node: cc.Node, index: number, data: any) {
    }
}
