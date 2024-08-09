import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'
import { env } from './env'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE
app.get('/', async () => {
  const transactions = await knex('transactions')
  .select('*')

  return transactions
})

app
  .listen({
    port: env.PORT
  })
  .then(() => {
    console.log(`Server running! Port: ${env.PORT}`)
  })
