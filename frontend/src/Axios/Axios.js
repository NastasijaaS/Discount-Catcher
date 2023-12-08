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

//product
export const getByTypeProduct = (type) => API.post(`/product/getAllProductsByType`, type);
export const getProductFromAllStores = (product_id) => API.post(`/product/getProductFromAllStores`, product_id)
export const GetByBrandProduct = API.get(`/product/getAllProductsByBrand`);

//store
export const getAllStores = () => API.get(`/store/getAllStores`);
export const getAllStoresByLocation = (location) => API.post(`/store/getAllStoresByLocation`, location).catch((error) => {return []})
export const getProductsFromStore = (store) => API.post(`/store/getProductsFromStore`, store).catch((error) => {return []})

//locations
export const getAllLocations = () => API.get(`/location/getAllLocations`)