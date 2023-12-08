import express from "express";
const router = express.Router()

import { createProduct, getAllProductsByType, getProductFromAllStores, getAllProductsByBrand, setProductDiscount } from "../Controllers/product.js";

// Get


// Post
router.post('/getProductFromAllStores', getProductFromAllStores)
router.post('/create', createProduct)
router.post('/getAllProductsByType', getAllProductsByType)
router.post('/getAllProductsByBrand', getAllProductsByBrand)


// Update
router.put('/setProductDiscount', setProductDiscount)

// Delete

export default router