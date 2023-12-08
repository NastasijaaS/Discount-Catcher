import express from "express";
const router = express.Router()

import { createUser, getUser,loginUser, intrestedInProduct, intrestedInStore, intrestedInBrand, 
         notIntrestedInBrand, notIntrestedInProduct, notIntrestedInStore, getAllInterestedInProducts, 
         getAllInterestedInStores, getAllInterestedInBrand } from "../Controllers/user.js";

// Get
router.get('/get/:id', getUser)


// Post
router.post('/create', createUser)
router.post('/intrestedInStore', intrestedInStore)
router.post('/intrestedInBrand', intrestedInBrand)
router.post('/loginUser', loginUser)
router.post('/getAllInterestedInProducts', getAllInterestedInProducts)
router.post('/getAllInterestedInStores', getAllInterestedInStores)
router.post('/getAllInterestedInBrand', getAllInterestedInBrand)


// Update
router.put('/intrestedInProduct', intrestedInProduct)


// Delete
router.delete('/notIntrestedInBrand', notIntrestedInBrand)
router.put('/notIntrestedInProduct', notIntrestedInProduct)
router.delete('/notIntrestedInStore', notIntrestedInStore)

export default router