export function save(target: any, keyName: string) {
    let arr = ModeBase.classMap.get(target.constructor);
    if (arr === undefined) {
        arr = [];
        ModeBase.classMap.set(target.constructor, arr);
    }
    arr.push(keyName);
}
export default class ModeBase {
    public static classMap: Map<Function, any[]> = new Map();
    fixedUpdate(dt: number) {
    }
    initLoadData() {
    }
    load() {
    }
    async loadData() {
        await this.load();
    }
    public loadModelData(): any {
        let data = {};
        let savepars = ModeBase.classMap.get(this.constructor);
        for (let i = 0; i < savepars.length; ++i) {
            data[savepars[i]] = this[savepars[i]];
        }
        return data;
    }
    onDestroy() {
        cc.director.targetOff(this);
    }
    public setModelData(data: any) {
        //初始化下数据       
        if (!data)
            return;
        let savepars = ModeBase.classMap.get(this.constructor);
        for (let i = 0; i < savepars.length; ++i) {
            const element = data[savepars[i]];
            if (element != null || element != undefined) {
                if (Object.prototype.toString.call(element) == "[object Object]") {
                    for (const key in element) {
                        this[savepars[i]][key] = element[key];
                    }
                }
                else
                    this[savepars[i]] = element;
            }
        }
    }
}
