import express from "express";
const router = express.Router()

import { createStore, getAllStores, addProductToStore, addProductToDiscount, addLocationToStore, getAllStoresByLocation, getProductsFromStore } from "../Controllers/store.js";

// Get
router.get('/getAllStores', getAllStores)

// Post
router.post('/create', createStore)
router.post('/getAllStoresByLocation', getAllStoresByLocation)
router.post('/getProductsFromStore', getProductsFromStore)

// Update
router.put('/addProduct', addProductToStore)
router.put('/addProductToDiscount', addProductToDiscount)
router.put('/addLocationToStore', addLocationToStore)



// Delete

export default router