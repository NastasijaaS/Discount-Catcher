
export const user = class User {
    constructor(name, last_name, email, password, intrested_in_products, intrested_in_brands, intrested_in_stores, is_admin) {
        this.id = null;
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.intrested_in_products = intrested_in_products;
        this.intrested_in_brands = intrested_in_brands;
        this.intrested_in_stores = intrested_in_stores;
        this.is_admin = is_admin;
        // lokacija?
    }

    toJson() {
        return `{
            name: '${this.name}',
            last_name : '${this.last_name}',
            email: '${this.email}',
            password: '${this.password}',
            is_admin: '${this.is_admin}'
        }`
    }

}