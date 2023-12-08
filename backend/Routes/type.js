import express from "express";
const router = express.Router()

import { createType } from "../Controllers/type.js";

// Get


// Post
router.post('/create', createType)


// Update


// Delete

export default router