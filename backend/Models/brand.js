
export const brand = class Brand {
    constructor(name, products, stores) {
        this.id = null;
        this.name = name;
        this.products = products;
        this.stores = stores;
        // this.discount = discount;
    }

    toJson() {
        return `{
            name: '${this.name}'
        }`
    }
}