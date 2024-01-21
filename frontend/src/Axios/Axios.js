import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/' });

//user
export const registerIN = (formData) => API.post(`/user/create`, formData);
export const logIN=(formData)=> API.post(`/user/loginUser`, formData);
export const user_products = (user) => API.post(`/user/getAllInterestedInProducts`, user)
export const follow_product = (data) => API.put(`/user/intrestedInProduct`, data).catch((error) => { console.log("Nismo dodali proizvod u listu!") })
export const notIntrestedInProduct = (data) => API.put(`/user/notIntrestedInProduct`, data).catch((error) => console.log(error))
export const user_stores = (user) => API.post(`/user/getAllInterestedInStores`, user).catch(() => { return [] })
export const user_brands = (user) => API.post(`/user/getAllInterestedInBrand`, user).catch(() => { return [] })
export const user_messages = (user) => API.post(`/user/getUserMessages`, user).catch((error) => { return [] })
export const read_message = (message) => API.post(`/user/readMessage`, message)


//product
export const fetchLatestDiscounts = () => API.get(`/product/fetchLatestDiscounts`).catch((error) => { return [] })
export const getByTypeProduct = (type) => API.post(`/product/getAllProductsByType`, type);
export const getProductFromAllStores = (product_id) => API.post(`/product/getProductFromAllStores`, product_id)
export const getByBrandProducts = (brand_name) => API.post(`/product/getAllProductsByBrand`, brand_name).catch((error) => { return [] })
export const getProductsOnDiscount = (stores) => API.post(`/product/getProductsFilter`, stores).catch((error) => { return [] })
export const createProduct = (data) => API.post(`/product/create`, data)

//store
export const getAllStores = () => API.get(`/store/getAllStores`);
export const getAllStoresByLocation = (location) => API.post(`/store/getAllStoresByLocation`, location).catch((error) => {return []})
export const getProductsFromStore = (store) => API.post(`/store/getProductsFromStore`, store).catch((error) => {return []})
export const createStore = (store) => API.post(`/store/create`, store)
export const addStoreToLocation = (data) => API.put(`/store/addLocationToStore`, data)
export const addProductToStore = (data) => API.put(`/store/addProduct`, data)
export const addProductToDiscount = (data) => API.put(`/store/addProductToDiscount`, data)
export const removeFromDiscount = (data) => API.put(`/store/removeDiscount`, data)

//locations
export const getAllLocations = () => API.get(`/location/getAllLocations`).catch((error) => { return [] })

//brand
export const getAllBrands = () => API.get(`/brand/getAllBrands`).catch((error) => { return [] })

//type
export const getAllTypes = () => API.get(`/type/getAllTypes`).catch((error) => { return [] })
