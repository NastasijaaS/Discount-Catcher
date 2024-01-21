
export const message = class Message {
    constructor(data) {
        this.data = data
    }

    toJson() {
        return `{
            data: '${this.data}'
        }`
    }
}