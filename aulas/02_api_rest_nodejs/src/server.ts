import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE
app.register(transactionsRoutes, {
  prefix: 'transactions'
})


app
  .listen({
    port: env.PORT
  })
  .then(() => {
    console.log(`Server running! Port: ${env.PORT}`)
  })
