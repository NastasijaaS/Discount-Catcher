import redis from 'redis'
import { createClient } from 'redis'

export const client = await createClient('localhost', 6379)