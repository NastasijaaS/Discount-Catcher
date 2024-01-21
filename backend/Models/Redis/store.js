import { redis_client } from '../../database.js'
import { Schema, Entity } from 'redis-om'
class Store extends Entity {}

export const storeSchema = new Schema(Store, {
    store_id:        { type: 'number' },          // neo4j id
    name:            { type: 'string' },
    product_list:    { type: 'string[]' },        // neo4j product id
    brand_list:      { type: 'string[]' },
    location:        { type: 'string' }
})

export const storeRepository = redis_client.fetchRepository(storeSchema)
await storeRepository.createIndex()