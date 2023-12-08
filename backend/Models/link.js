// module.exports = {
//     store: {
//         type: 'relationship'
//     },
//     product: {
//         type: 'relationship'
//     },
//     brand: {
//         type: 'relationship'
//     },
//     discount: {
//         type: 'number'
//     }
// }

export const link = class Link {
    constructor(store, product, brand, discount) {
        this.id = null;
        this.store = store;
        this.product = product;
        this.brand = brand;
        this.discount = discount;
    }
}