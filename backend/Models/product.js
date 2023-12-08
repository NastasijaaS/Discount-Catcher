
export const product = class Product {
    constructor(name, brand, stores, type, image) {
        this.name = name;
        this.brand = brand;
        this.stores = stores;
        this.type = type;
        this.image = image;
    }

    toJson() {
        return `{
            name: '${this.name}',
            type: '${this.type}',
            brand: '${this.brand}',
            image: '${this.image}'
        }`
    }
}