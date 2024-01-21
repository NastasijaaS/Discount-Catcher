import { redis_client } from '../../database.js'
import { Schema, Entity } from 'redis-om'
class Product extends Entity {}

export const productSchema = new Schema(Product, {
    name:              { type: 'string' },
    price:             { type: 'number' },
    brand:             { type: 'string' },
    type:              { type: 'string' },
    product_id:        { type: 'number' },          // neo4j id
    image:             { type: 'string' }
})

export const productRepository = redis_client.fetchRepository(productSchema)
await productRepository.createIndex()