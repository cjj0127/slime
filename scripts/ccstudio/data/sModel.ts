// const p: any = window["_"]
// export default class Mgrs extends cc.Component {
//     private static _instance: Mgrs = null;
//     onLoad(): void {
//         Mgrs._instance = this
//         cc.director.on(GlobalEvent.Restart, this.onRestart, this)
//     }
//     static get Instance(): Mgrs {
//         return Mgrs._instance
//     }
//     _mgrs = {}
//     initialize() {
//         p.each(this._mgrs,
//             function (e) {
//                 e.initLoadData()
//             })
//     }
//     mgr(e) {
//         return this._mgrs[e.name]
//     }
//     onRestart() { }
//     onDestroy() {
//         cc.director.targetOff(this)
//         p.each(this._mgrs,
//             function (e) {
//                 e.destroy()
//             }),
//             this._mgrs = null
//     }
//     async load() {
//         for (let i = 0; i < this.list.length; i++) {
//             await this.list[i].loadData()
//         }
//         // for (const mgrName of Object.keys(this._mgrs)) {
//         //     await this._mgrs[mgrName].loadData();
//         // }
//         //test
//         await Config.load()
//         return true;
//     }
//     list = []
//     addMgr(e) {
//         var t = this.node.addComponent(e);
//         t.name = e
//         this._mgrs[e] = t;
//         this.list.push(t);
//     }
//     loadMgrs() {
//         this.addMgr(UiModel);
//         this.addMgr(CfgModel);
//         this.addMgr(GuideModel);
//         this.addMgr(UserModel);
//         this.addMgr(QuestModel);
//         this.addMgr(GearModel);
//         this.addMgr(ShopModel);
//         this.addMgr(LevelModel);
//         this.addMgr(MineResearchModel);
//         this.addMgr(MineModel);
//         this.addMgr(MasteryModel);
//         this.addMgr(SkillModel);
//         this.addMgr(SummonModel);
//         this.addMgr(RouletteModel);
//         this.addMgr(PassModel);
//         this.addMgr(MgrCollection);
//         this.addMgr(ObtainModel);
//         this.addMgr(RedModel);
//         this.addMgr(BlessModel);
//         this.addMgr(TraitModel);
//         this.addMgr(MgrUnlock);
//         this.addMgr(BattleChestModel);
//         this.addMgr(SevenChallengeModel);
//         this.addMgr(MgrExtralData);
//         this.addMgr(RelicModel);
//         this.addMgr(TeasureModel);
//         this.addMgr(RingModel);
//         this.addMgr(LegionRushModel);
//         this.addMgr(HeroModel);
//         this.addMgr(PartnerModel);
//         this.addMgr(RobModel);
//         this.addMgr(AdsModel);
//     }
// }
