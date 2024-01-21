import express from "express";
const router = express.Router()

import { createProduct, getAllProductsByType, getProductFromAllStores, getAllProductsByBrand, getProductsFilter, fetchLatestDiscounts } from "../Controllers/product.js";

// Get
router.get('/fetchLatestDiscounts', fetchLatestDiscounts)


// Post
router.post('/getProductFromAllStores', getProductFromAllStores)
router.post('/create', createProduct)
router.post('/getAllProductsByType', getAllProductsByType)
router.post('/getAllProductsByBrand', getAllProductsByBrand)
router.post('/getProductsFilter', getProductsFilter)



// Update
// router.put('/setProductDiscount', setProductDiscount)

// Delete

export default router