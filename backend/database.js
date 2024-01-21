import neo4j from 'neo4j-driver'
import dotenv from 'dotenv'

import { Client } from 'redis-om'
import { createClient } from 'redis'

// Enable .env use:
dotenv.config()

export const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic(process.env.USER, process.env.PASSWORD))
// export const session = driver.session()
console.log('username: ', process.env.USER, ' \tpassword: ', process.env.PASSWORD)

export const create_session = async () => {
    const session = driver.session()
    return session
}

export const connection = createClient(`redis://localhost:6379`)
connection.on('connect', () => {
    console.log('redis client connected!')
})
await connection.connect()

export const redis_client = await new Client().use(connection)

// export const create_client = async () => {
//     if (!redis_client.isOpen()) {
//         redis_client.open(`redis://localhost:6379`)
//         console.log('Connected to redis server!')
//     }
// }