import { redis_client } from '../../database.js'
import { Schema, Entity } from 'redis-om'
class User extends Entity {}

export const userSchema = new Schema(User, {
    name:           { type: 'string' },
    last_name:      { type: 'string' },
    email:          { type: 'string' },
    password:       { type: 'string' },
    user_id:        { type: 'string' }          // neo4j id
})

export const userRepository = redis_client.fetchRepository(userSchema)
await userRepository.createIndex()