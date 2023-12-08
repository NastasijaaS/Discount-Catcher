import express from "express";
const router = express.Router()

import { createBrand, getAllBrands } from "../Controllers/brand.js";

// Get
router.get('/getAllBrands', getAllBrands)

// Post
router.post('/create', createBrand)


// Update


// Delete

export default router