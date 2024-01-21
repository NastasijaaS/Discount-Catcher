
export const store = class Store {
    constructor(name, locations, brands, products, discounts, address) {
        this.id = null;
        this.name = name;
        this.locations = locations;
        this.brands = brands;
        this.products = products;
        this.discounts = discounts;
        this.address = address; //ovo da izbacimo mozda
    }

    toJson() {
        return `{
            name: '${this.name}',
            address: '${this.address}'
        }`
    }
}