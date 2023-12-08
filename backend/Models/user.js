// module.exports = {
//     name: {
//         type: 'string',
//         required: true
//     },
//     last_name: {
//         type: 'string',
//         required: true
//     },
//     email: {
//         type: 'string',
//         unique: 'true',
//         required: true
//     },
//     password: {
//         type: 'string',
//         required: true
//     },
//     intrested_in_products: {
//         type: 'relationships'
//     },
//     intrested_in_brands: {
//         type: 'relationships'
//     },
//     intrested_in_stores: {
//         type: 'relationships'
//     }
// }

export const user = class User {
    constructor(name, last_name, email, password, intrested_in_products, intrested_in_brands, intrested_in_stores) {
        this.id = null;
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.intrested_in_products = intrested_in_products;
        this.intrested_in_brands = intrested_in_brands;
        this.intrested_in_stores = intrested_in_stores;
        // lokacija?
    }

    toJson() {
        return `{
            name: '${this.name}',
            last_name : '${this.last_name}',
            email: '${this.email}',
            password: '${this.password}'
        }`
    }

}