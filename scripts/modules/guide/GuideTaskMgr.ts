import GuideTask from "./GuideTask";
export default class TaskManager {
    private _tasks: {
        [key: number]: any;
    } = {};
    public addTask(_type: number, stage: number, step: number, r: any): void {
        this._tasks[_type] = this._tasks[_type] || [];
        this._tasks[_type][stage] = this._tasks[_type][stage] || [];
        this._tasks[_type][stage][step] = new GuideTask(r);
    }
    public getStage(_type: number, stage: number): GuideTask[] | undefined {
        return this._tasks[_type] && this._tasks[_type][stage];
    }
    public getStageLength(_type: number): number {
        return this._tasks[_type].length;
    }
    public getStepLength(_type: number, stage: number): number {
        return this._tasks[_type][stage].length;
    }
    public getTask(_type: number, stage: number, step: number): GuideTask {
        return this.getStageLength(_type) <= stage ? null : this._tasks[_type][stage][step];
    }
}
