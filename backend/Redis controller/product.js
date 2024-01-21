import { create_session } from '../database.js'

import { productRepository } from '../Models/Redis/product.js'
import { storeRepository } from '../Models/Redis/store.js'
import { redis_client } from '../database.js'

export const cached_product = async (req, res, next) => {
    try {

        const redis_response = await productRepository.search().return.all();
        if(redis_response.length > 0)
            return res.status(200).json(redis_response)

        next();
        
    } catch (err) {
        return res.status(500).json('Error with redis cache!')
    }
}

export const cached_stores = async (req, res, next) => {
    try {

        const redis_response = await storeRepository.search().return.all();
        if(redis_response.length > 0)
            return res.status(200).json(redis_response)

        next();
        
    } catch (err) {
        return res.status(500).json('Error with redis cache!')
    }
}

export const update_cached = async(req, res) => {
    try {

    } catch (err) {
        return res.status(500).json('Error with updating redis cache!')
    }
}