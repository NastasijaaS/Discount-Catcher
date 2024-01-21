import express from "express";
const router = express.Router()

import { createType, getAllTypes } from "../Controllers/type.js";

// Get
router.get('/getAllTypes', getAllTypes)

// Post
router.post('/create', createType)


// Update


// Delete

export default router