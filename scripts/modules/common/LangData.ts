export default class LangData {
    static current = "";
    static data = {};
    static getLangByID(id: string) {
        return LangData.data[id] || id;
    }
}
