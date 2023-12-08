import express from "express";
const router = express.Router()

import { createLocation, getAllLocations } from "../Controllers/location.js";

// Get
router.get('/getAllLocations', getAllLocations)

// Post
router.post('/create', createLocation)


// Update


// Delete

export default router