// module.exports = {
//     name: {
//         type: 'string',
//         unique: 'true'
//     }
// }

export const type = class Type {
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