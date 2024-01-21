
export const location = class Location {
    constructor(name) {
        this.id = null;
        this.name = name;
    }

    toJson() {
        return `{
            name: '${this.name}'
        }`
    }
}